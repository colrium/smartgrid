import { GetServerSidePropsContext, GetStaticPropsContext } from "next/types";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import i18nextConfig from "../../next-i18next.config";
import { signMediaDeep } from "./media";
import { mergeSiteLayoutIntoStore, resolveSiteLayout } from "./keystatic/resolveLayout";

export const locales =  i18nextConfig?.i18n?.locales ?? ['en']
export const getI18nPaths = () =>
	locales.map((lng: string) => ({
		params: {
			locale: lng,
		},
	}));

export const getStaticPaths = () => ({
	fallback: false,
	paths: getI18nPaths(),
});


export const makeStaticProps =
	(ns: string[] = ["common"]) =>
	async (ctx: GetServerSidePropsContext | GetStaticPropsContext) => ({
		props: await getI18nProps(ctx, ns),
	});
export function getLocale(params: GetServerSidePropsContext | GetStaticPropsContext) {
	const routeLocale = params.params?.locale;
	const validLocales = i18nextConfig.i18n.locales;

	if (typeof routeLocale === "string" && !validLocales.includes(routeLocale)) {
		return null; // caller can return notFound()
	}

	const locale = typeof routeLocale === "string" ? routeLocale : params.locale;

	return validLocales.includes(locale as string)
		? (locale as string)
		: i18nextConfig.i18n.defaultLocale;
}

export async function getI18nProps(
	params: GetServerSidePropsContext | GetStaticPropsContext,
	namespaces: string[]
) {
	const locale = getLocale(params);
	if (!locale) return null;

	// The shared layout (navbar/footer) always renders contact details and
	// social links from the "contact" namespace, so load it on every page.
	const ns = Array.from(new Set(["contact", ...namespaces]));

	const translations = await serverSideTranslations(locale, ns, i18nextConfig);

	// Site-wide layout override (M9): when the `site` singleton is published
	// and allowlisted, its owned slices (`common:nav/footer/contacts/cookies`,
	// `contact:talkToUs.contacts`, `contact:social.channels`) replace the
	// locale-JSON values in the serialized store — Navbar, Footers and
	// CookieConsent keep reading the same `t()` keys with zero component
	// changes. Any other outcome (disabled/missing/unpublished/error) ships
	// the legacy store byte-identically (resolver warns, never blank).
	try {
		const layout = await resolveSiteLayout(locale === "sw" ? "sw" : "en");
		if (layout.status === "keystatic") {
			const store = (translations as any)?._nextI18Next?.initialI18nStore;
			if (store && typeof store === "object") {
				mergeSiteLayoutIntoStore(store, layout.site.locale, layout.site.layout);
			}
		}
	} catch {
		// Fail safe: an unexpected layout error must never break page props.
	}

	// Display-only media protection: the serialized i18n store travels to the
	// browser, so rewrite every "/media/..." URL it contains into a short-lived
	// signed URL before it leaves the server. Idempotent, zero-cost for values
	// that are not media paths. Runs AFTER the layout merge so Keystatic
	// media references are signed too.
	return signMediaDeep({
		...translations,
	});
}
