import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import languageDetector from './languageDetector'
import i18nextConfig from '../../next-i18next.config'

type LanguageDetector = {
  detect: () => string
  cache: (lng: string) => void
}

const supportedLocales = i18nextConfig?.i18n?.locales ?? []
const defaultLocale = i18nextConfig?.i18n?.defaultLocale ?? 'en'

const stripLocalePrefix = (path: string) => {
  if (!path || path === '/') return ''
  const pathname = path.split(/[?#]/)[0]
  const parts = pathname.split('/').filter(Boolean)
  if (parts.length === 0) return ''

  const firstSegment = parts[0]
  if (supportedLocales.includes(firstSegment)) {
    return '/' + parts.slice(1).join('/')
  }

  return pathname
}

const getLocale = (routerLocale?: string) => {
  const normalizedRouterLocale = routerLocale?.toLowerCase()
  if (normalizedRouterLocale && supportedLocales.includes(normalizedRouterLocale)) {
    return normalizedRouterLocale
  }

  const detectedLng = languageDetector.detect()
  if (detectedLng && supportedLocales.includes(detectedLng)) {
    return detectedLng
  }

  return defaultLocale
}

export const useRedirect = (to?: string) => {
  const router = useRouter()
  const target = to || router.asPath

  useEffect(() => {
    const locale = getLocale(router.locale)
    const pathname = stripLocalePrefix(target)
    const suffix = target.slice((target.split(/[?#]/)[0] || '').length)
    const redirectPath = `/${locale}${pathname}${suffix}`.replace(/\/\/+/, '/')

    if (target === redirectPath || target === `/${locale}` || target.startsWith(`/${locale}/`)) {
      return
    }

    router.replace(redirectPath)

    if (locale && languageDetector?.cache) {
      languageDetector.cache(locale)
      document.documentElement.lang = locale
    }
    // intentionally no deps on router to mimic previous behavior
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}

export const Redirect: React.FC = () => {
  useRedirect()
  return <></>
}

export const getRedirect = (to?: string) => () => {
  useRedirect(to)
  return null
}
