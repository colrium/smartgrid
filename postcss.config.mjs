/**
 * PostCSS pipeline.
 *
 * Order matters: `@tailwindcss/postcss` must run first — it compiles
 * `@import "tailwindcss"`, `@theme` and `@utility` blocks into plain CSS.
 * PurgeCSS then runs over the compiled stylesheet and drops every rule whose
 * selectors never appear in the scanned source files (see `content`).
 *
 * PurgeCSS is enabled for production builds only, so `next dev` HMR stays
 * instant and never purges classes mid-edit. A production build can opt out
 * by setting `PURGE_CSS=off` (useful when debugging a missing-style report).
 */

/**
 * Sources scanned for class-name usage.
 *
 * The default extractor keeps any class token that appears anywhere in these
 * files — including tokens applied at runtime, e.g. `classList.add("opacity-0")`
 * in `ModelViewer` or `mdi-${icon}` names resolved from i18n/CMS content.
 * Keep this list in sync with `tailwind.config.ts`.
 */
const PURGE_CONTENT = [
	"src/**/*.{js,ts,jsx,tsx}",
	"public/locales/**/*.json",
];

/** PurgeCSS options — https://purgecss.com/configuration.html */
const purgeCssOptions = {
	content: PURGE_CONTENT,
	// Drop @keyframes whose animation-name is no longer referenced by any kept
	// rule (e.g. an unused `.fade-*` helper takes its keyframes with it).
	keyframes: true,
	safelist: {
		standard: [
			// next/font generates hashed `__variable_<hash>` / `__className_<hash>`
			// classes at build time; they never appear in the scanned sources.
			/^__variable_/,
			/^__className_/,
		],
	},
};

const purgeCssEnabled =
	process.env.NODE_ENV === "production" && process.env.PURGE_CSS !== "off";

const config = {
	plugins: {
		"@tailwindcss/postcss": {},
		...(purgeCssEnabled
			? { "@fullhuman/postcss-purgecss": purgeCssOptions }
			: {}),
	},
};

export default config;
