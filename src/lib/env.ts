import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_SANITY_PROJECT_ID: z.string().nonempty('NEXT_PUBLIC_SANITY_PROJECT_ID is required'),
  NEXT_PUBLIC_SANITY_DATASET: z.string().nonempty('NEXT_PUBLIC_SANITY_DATASET is required'),
  NEXT_PUBLIC_SANITY_API_VERSION: z.string().default('2024-01-01'),
  NEXT_PUBLIC_SANITY_USE_CDN: z.coerce.boolean().default(true),
  SANITY_API_TOKEN: z.string().optional(),
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  const issues = parsedEnv.error.issues.map(
    (issue) => `- ${issue.path.join('.')}: ${issue.message}`,
  )
  throw new Error(`Invalid environment variables:\n${issues.join('\n')}`)
}

export const env = parsedEnv.data
