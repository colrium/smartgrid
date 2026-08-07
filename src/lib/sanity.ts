import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'
import { env } from './env'

const sanityConfig = {
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
  useCdn: env.NEXT_PUBLIC_SANITY_USE_CDN,
  token: env.SANITY_API_TOKEN,
}

export const sanityClient = createClient(sanityConfig)
const builder = createImageUrlBuilder(sanityClient)

export function urlFor(source: Parameters<typeof createImageUrlBuilder>[0]) {
	return builder.image(source);
}
