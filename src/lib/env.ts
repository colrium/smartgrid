import { z } from 'zod'

const envSchema = z.object({
	NEXT_PUBLIC_SITE_URL: z.string().nonempty("NEXT_PUBLIC_SANITY_PROJECT_ID is required"),
	NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().nonempty("NEXT_PUBLIC_SANITY_PROJECT_ID is required"),
	NEXT_PUBLIC_SANITY_DATASET: z.string().nonempty("NEXT_PUBLIC_SANITY_DATASET is required"),
	NEXT_PUBLIC_SANITY_API_VERSION: z.string().default("2024-01-01"),
	NEXT_PUBLIC_SANITY_USE_CDN: z.coerce.boolean().default(true),
	SANITY_API_TOKEN: z.string().optional(),
	NEXT_PUBLIC_WHATSAPP_NUMBER: z.string().optional().default(null),
	NEXT_PUBLIC_TAWK_PROPERTY_ID: z.string().optional().default(null),
	NEXT_PUBLIC_TAWK_WIDGET_ID: z.string().optional().default(null),
	NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional().default(null),
	NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: z.string().optional(),
	// Display-only media protection: HMAC secret for signed /media/* URLs and
	// their lifetime in seconds (30s–7d). Server-side only (never NEXT_PUBLIC_*).
	MEDIA_SIGNING_KEY: z.string().min(16).optional(),
	MEDIA_TTL_SECONDS: z.coerce.number().int().min(30).max(604800).optional(),
	ANALYZE: z.coerce.boolean().default(false),
});

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  const issues = parsedEnv.error.issues.map(
    (issue) => `- ${issue.path.join('.')}: ${issue.message}`,
  )
  throw new Error(`Invalid environment variables:\n${issues.join('\n')}`)
}

export const env = parsedEnv.data

export default env;
