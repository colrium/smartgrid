import { config, fields, collection } from "@keystatic/core";
import { sectionBranchField } from "./src/lib/keystatic/sectionRegistry";

/**
 * Keystatic page-builder collection contract (M1 config, M2 registry).
 *
 * - Keystatic owns structured page composition (an ordered `pageBuilder`
 *   section list); shared React components under
 *   `src/components/sections/shared/` remain the rendering implementation.
 * - Section branches are derived from `sectionRegistry.ts`, the single
 *   source for editor options and renderer mappings. Do not add branches
 *   here — register a section definition instead.
 * - Every translatable field carries both `en` and `sw` values so content
 *   stays structurally aligned across the site locales.
 * - On disk, each page is `content/pages/<slug>.json` (`format.data: "json"`).
 *   The `slug` field itself is stored as the plain page-name string; the
 *   filename provides the slug.
 */

export const SUPPORTED_PAGE_LOCALES = ["en", "sw"] as const;
export type PageLocale = (typeof SUPPORTED_PAGE_LOCALES)[number];

export const PAGE_STATUSES = ["draft", "published"] as const;
export type PageStatus = (typeof PAGE_STATUSES)[number];

/**
 * Storage is environment-driven. Local development always works without
 * credentials: GitHub-backed storage is only used when
 * `KEYSTATIC_GITHUB_REPO="owner/name"` is set (e.g. on a deployed CMS
 * environment). Repository coordinates are never committed here.
 */
function storageConfig() {
	const repo = process.env.KEYSTATIC_GITHUB_REPO?.trim();
	if (!repo) return { kind: "local" } as const;
	const separator = repo.indexOf("/");
	const owner = repo.slice(0, separator).trim();
	const name = repo.slice(separator + 1).trim();
	if (!separator || !owner || !name || name.includes("/")) {
		throw new Error('KEYSTATIC_GITHUB_REPO must have the form "owner/name".');
	}
	return { kind: "github", repo: { owner, name } } as const;
}

export default config({
	storage: storageConfig(),
	collections: {
		pages: collection({
			label: "Pages",
			path: "content/pages/*",
			format: { data: "json" },
			slugField: "slug",
			columns: ["title", "status"],
			schema: {
				slug: fields.slug({
					name: {
						label: "Page name",
						description: "Internal display name; stored in the entry file.",
						validation: { isRequired: true },
					},
					slug: {
						label: "URL slug",
						description:
							"Lowercase letters, numbers and hyphens. Must match the filename under content/pages/.",
						validation: {
							pattern: {
								regex: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
								message: "Use lowercase letters, numbers and hyphens only.",
							},
						},
					},
				}),
				title: fields.text({
					label: "Page title (internal)",
					description: "Admin list title; not rendered on the site by itself.",
					validation: { isRequired: true },
				}),
				status: fields.select({
					label: "Status",
					description: "Only published pages may be served to visitors.",
					options: [
						{ label: "Draft", value: "draft" },
						{ label: "Published", value: "published" },
					],
					defaultValue: "draft",
				}),
				pageBuilder: sectionBranchField(),
			},
		}),
	},
});
