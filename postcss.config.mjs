/**
 * PostCSS configuration — Tailwind CSS v4 + production-only PurgeCSS.
 *
 * Tailwind v4 already tree-shakes unused utilities at build time by scanning
 * source files. PurgeCSS runs AFTER `@tailwindcss/postcss` as a second pass
 * that catches leftover selectors (e.g. from third-party CSS pulled into the
 * bundle). It is disabled in development so HMR stays fast and no styles are
 * stripped while authoring.
 *
 * IMPORTANT — `src/styles/globals.css` is fully preserved:
 * - `variables: false` + `fontFace: false` + `keyframes: false` keep every
 *   `@theme` token / CSS variable, `@font-face`, and `@keyframes` rule.
 * - `safelist` below pins every hand-written selector in `globals.css`
 *   (custom `@utility` classes, scroll-driven `.fade-*` helpers,
 *   `.animate-scroll-line`, base element selectors) so PurgeCSS never drops
 *   them even when no scanned source references the literal class name
 *   (e.g. classes composed at runtime, CMS-driven markup, pseudo-elements).
 */
const isProduction = process.env.NODE_ENV === "production";

const config = {
	plugins: {
		"@tailwindcss/postcss": {},
		...(isProduction
			? {
					"@fullhuman/postcss-purgecss": {
						content: [
							"./src/**/*.{js,jsx,ts,tsx,mdx}",
							"./sanity/**/*.{js,jsx,ts,tsx}",
							"!./src/**/*.test.{js,jsx,ts,tsx}",
							"!./src/**/*.stories.{js,jsx,ts,tsx}",
						],
						skippedContentGlobs: ["node_modules/**"],
						// Capture Tailwind variant syntax (`hover:`, `md:`, `data-[...]:`, `/opacity`, `!`).
						defaultExtractor: (content) => content.match(/[\w-/:!.\[\]()#,=%@$]+(?<!:)/g) || [],
						// Never strip keyframes, @font-face, or CSS variables —
						// this is what retains 100% of `globals.css` theme/animation styles.
						keyframes: false,
						fontFace: false,
						variables: false,
						// Keep attribute-driven selectors used by interactive components.
						dynamicAttributes: [
							"aria-current",
							"aria-expanded",
							"aria-hidden",
							"aria-selected",
							"data-active",
							"data-slot",
							"data-state",
						],
						safelist: {
							// Exact selectors always kept (every custom class in `globals.css`).
							standard: [
								"html",
								"body",
								"site-shell",
								"font-body",
								"font-display",
								// @utility helpers (Tailwind v4 generates these on demand,
								// but keep them even when only referenced dynamically/CMS-side).
								"glass",
								"glass-dark",
								"hairline",
								"hairline-dark",
								"card-shadow",
								"card-shadow-lift",
								"pale-panel",
								"pale-panel-soft",
								"ink-panel",
								// Scroll-driven reveal helpers.
								"fade-up",
								"fade-down",
								"fade-left",
								"fade-right",
								"animate-scroll-line",
							],
							// Keep these selectors plus any children/combinators
							// (covers `hover:glass`, `.glass > *`, base-element rules).
							deep: [
								/glass/,
								/hairline/,
								/card-shadow/,
								/pale-panel/,
								/ink-panel/,
								/fade-(up|down|left|right)/,
								/scroll-line/,
								/site-shell/,
								/font-(body|display)/,
							],
							// Keep any selector containing these fragments
							// (element selectors, pseudo-elements/classes, vendor rules).
							greedy: [
								/^html/,
								/^body/,
								/^img/,
								/^select/,
								/^input/,
								/^option/,
								/^h[1-6]/,
								/::-webkit-scrollbar/,
								/::picker/,
								/:-webkit-autofill/,
								/autofill/,
								/::before/,
								/::selection/,
							],
							// Belt-and-braces: even if `keyframes` is ever flipped
							// to `true`, these animations survive.
							keyframes: [
								"autofill",
								"fade-up",
								"fade-down",
								"fade-left",
								"fade-right",
								"scroll-line",
							],
							// Belt-and-braces: even if `variables` is ever flipped
							// to `true`, the design-token variables survive.
							variables: [
								/^--color-/,
								/^--font-/,
								/^--radius-/,
								/^--shimmer-/,
								/^--surface/,
							],
						},
					},
				}
			: {}),
	},
};

export default config;


