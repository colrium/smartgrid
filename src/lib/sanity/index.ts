import { createClient } from "@sanity/client";
import { env } from "../env";

const sanityConfig = {
	projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
	dataset: env.NEXT_PUBLIC_SANITY_DATASET,
	apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
	useCdn: env.NEXT_PUBLIC_SANITY_USE_CDN,
	token: env.SANITY_API_TOKEN,
};

export const sanityClient = createClient(sanityConfig);
