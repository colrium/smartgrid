/**
 * next-sitemap configuration - generates public/sitemap.xml + public/robots.txt
 * after every production build (`npm run postbuild`).
 *
 * URL strategy (must stay aligned with src/components/Head.tsx):
 * - The default locale (en) is served UNPREFIXED ("/", "/about", ...).
 * - Non-default locales are prefixed ("/sw", "/sw/about", ...).
 * - Sitemap <loc>, hreflang alternates and x-default therefore mirror the
 *   canonical URLs emitted in <head> one-to-one, giving Google a single,
 *   self-consistent URL scheme per language - a prerequisite for clean
 *   sitelink generation.
 */
/** @type {import('next-sitemap').IConfig} */
const path = require("path");
const fs = require("fs");
const i18nextConfig = require("./next-i18next.config");

const locales = i18nextConfig?.i18n?.locales || ["en"];
const defaultLocale = i18nextConfig?.i18n?.defaultLocale || "en";

// Must mirror the fallback in src/components/Head.tsx (SITE_URL).
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://smartgridsurveying.com").replace(
	/\/+$/,
	""
);

// Route tiers for changefreq/priority.
const HUB_ROUTES = ["/surveying", "/aerial-drones", "/civil"];
const LEGAL_ROUTES = ["/privacy-policy", "/terms-of-use"];

const staticPagesSlugs = getStaticPagesSlugs();
const productPagesSlugs = getProductSlugs();

module.exports = {
	siteUrl, // environment domain, no trailing slash
	generateRobotsTxt: true,
	generateIndexSitemap: false, // only needed for very large sites (many thousands of URLs)
	sitemapSize: 5000,
	changefreq: "weekly",
	priority: 0.7,
	exclude: [
		"/api/*",
		"/404",
		"/500",
		"/[locale]/*",
		...staticPagesSlugs,
		...staticPagesSlugs.map((s) => `${s}/*`),
		...locales.flatMap((l) => [`/${l}`, `/${l}/*`]), // block ALL auto-crawled locale pages
	],
	robotsTxtOptions: {
		policies: [{ userAgent: "*", allow: "/", disallow: ["/media/"] }],
		// next-sitemap hard-appends a "Host:" directive (a Yandex-only,
		// non-standard line for Google). Strip it; the generated Sitemap:
		// lines are appended after this transform runs.
		transformRobotsTxt: async (_config, text) =>
			text.replace(/^# Host\r?\nHost: [^\r\n]*\r?\n?/im, "").replace(/\n{3,}/g, "\n\n"),
	},
	// The URL set is generated explicitly via additionalPaths; the exclude list
	// above removes everything next-sitemap auto-crawls from the build
	// manifest, so the output stays deterministic - no duplicates, no
	// parameterized or Next.js-internal routes.
	additionalPaths: async (config) => {
		const staticRoutes = [...staticPagesSlugs]; // includes "" (localized home) exactly once
		const productRoutes = productPagesSlugs.map((slug) => `/equipment-sale/${slug}`);
		// Editor-created Keystatic pages served by the catch-all route (M10).
		const keystaticRoutes = getKeystaticSitemapSlugs();
		const allRoutes = [...staticRoutes, ...productRoutes, ...keystaticRoutes];
		const paths = [];
		for (const route of allRoutes) {
			for (const locale of locales) {
				// The default locale is served unprefixed - mirrors the canonical
				// URLs emitted in <head> (see src/components/Head.tsx).
				const urlPath = locale === defaultLocale ? route : `/${locale}${route}`;
				paths.push(await config.transform(config, urlPath));
			}
		}
		return paths;
	},
	transform: async (config, urlPath) => {
		const segments = urlPath.split("/").filter(Boolean);
		const hasLocalePrefix = locales.includes(segments[0]);
		const routeWithoutLocale = hasLocalePrefix ? "/" + segments.slice(1).join("/") : urlPath; // already locale-less (default locale) - leave as-is
		const normalizedRoute = routeWithoutLocale === "" ? "/" : routeWithoutLocale;
		const isHome = normalizedRoute === "/";
		const isCatalogue = normalizedRoute === "/equipment-sale/equipment-catalogue";
		const isProduct = normalizedRoute.startsWith("/equipment-sale/") && !isCatalogue;
		const isHub = HUB_ROUTES.includes(normalizedRoute);
		const isLegal = LEGAL_ROUTES.includes(normalizedRoute);

		// Default-locale URL (unprefixed). The home keeps its trailing slash to
		// match the canonical emitted in <head>.
		const defaultLocaleHref =
			normalizedRoute === "/" ? `${config.siteUrl}/` : `${config.siteUrl}${normalizedRoute}`;

		return {
			// next-sitemap drops any field whose loc is falsy, and its
			// absoluteUrl() strips the trailing slash unless trailingSlash is
			// set. Only the en home arrives as "" -> coerce to "/" plus the root
			// trailing slash so it stays at "<site-url>/" - the exact canonical
			// emitted in <head>. All other pages (incl. /sw) keep their loc and
			// remain slash-less to match Head.tsx.
			loc: urlPath === "" ? "/" : urlPath,
			changefreq: isLegal ? "yearly" : config.changefreq,
			priority: isHome ? 1.0 : isHub || isCatalogue ? 0.9 : isProduct ? 0.8 : config.priority,
			lastmod: new Date().toISOString(),
			trailingSlash: routeWithoutLocale === "",
			alternateRefs: locales
				.map((l) => ({
					href:
						l === defaultLocale
							? defaultLocaleHref
							: `${config.siteUrl}/${l}${normalizedRoute === "/" ? "" : normalizedRoute}`,
					hreflang: l,
					// next-sitemap re-appends the page path (field.loc) to every
					// alternate href unless hrefIsAbsolute is set, which produced
					// doubled urls like /sw/terms-of-use/sw/terms-of-use - mark our
					// fully-qualified hrefs as absolute.
					hrefIsAbsolute: true,
				}))
				.concat({ href: defaultLocaleHref, hreflang: "x-default", hrefIsAbsolute: true }),
		};
	},
};

function getStaticPagesSlugs() {
	const filePath = path.join(process.cwd(), "public", "locales", defaultLocale, "meta.json");
	const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

	// Only entries with an explicit slug are static routes. Product entries
	// carry no slug (they live in products.json) and previously contributed a
	// "" route that duplicated the homepage URL in the sitemap. The home slug
	// "/" is normalized to "" so it maps to the locale root exactly once.
	const slugs = Object.values(data.pages || {}).reduce((acc, props) => {
		const slug = props?.slug;
		if (typeof slug !== "string" || slug.trim() === "") return acc;
		const normalized = slug === "/" ? "" : slug.startsWith("/") ? slug : `/${slug}`;
		acc.push(normalized);
		return acc;
	}, []);

	return [...new Set(slugs)];
}

function getProductSlugs() {
	const filePath = path.join(process.cwd(), "public", "locales", defaultLocale, "products.json");
	const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
	return data.items.map((product) => product.slug);
}

// Editor-created Keystatic pages served by the catch-all route (M10).
//
// A content entry is sitemap-eligible iff ALL hold: single-segment slug,
// `status: "published"`, allowlisted in `KEYSTATIC_PAGES` (a sitemap URL must
// resolve 200, and the catch-all requires the allowlist), and NOT served by
// a dedicated fixed route. Fixed-route detection scans `src/pages` for
// `resolveKeystaticPage("<slug>")` literals (the M7 wiring pattern) plus the
// `home` index route — so wired pages (covered by `meta.json` slugs above)
// are never duplicated, and drafts never leak. `rootDir`/`allowlist`
// overrides exist for the check script (`scripts/check-keystatic-pages.mjs`).
function getWiredKeystaticSlugs(rootDir = process.cwd()) {
	const wired = new Set(["home"]);
	const pagesDir = path.join(rootDir, "src", "pages");
	const walk = (dir) => {
		let entries;
		try {
			entries = fs.readdirSync(dir, { withFileTypes: true });
		} catch {
			return;
		}
		for (const entry of entries) {
			const full = path.join(dir, entry.name);
			if (entry.isDirectory()) {
				walk(full);
				continue;
			}
			if (!/\.tsx$/.test(entry.name)) continue;
			let src;
			try {
				src = fs.readFileSync(full, "utf-8");
			} catch {
				continue;
			}
			for (const match of src.matchAll(/resolveKeystaticPage\(\s*"([^"]+)"/g)) {
				wired.add(match[1]);
			}
		}
	};
	walk(pagesDir);
	return wired;
}

function getKeystaticSitemapSlugs({ rootDir = process.cwd(), allowlist = null } = {}) {
	const allowed =
		allowlist ??
		(process.env.KEYSTATIC_PAGES ?? "")
			.split(",")
			.map((s) => s.trim())
			.filter(Boolean);
	const dir = path.join(rootDir, "content", "pages");
	if (!fs.existsSync(dir)) return [];
	const wired = getWiredKeystaticSlugs(rootDir);
	const out = [];
	for (const file of fs.readdirSync(dir)) {
		if (!file.endsWith(".json")) continue;
		const slug = file.slice(0, -".json".length);
		if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) continue;
		if (wired.has(slug)) continue;
		if (!allowed.includes(slug)) continue;
		try {
			const entry = JSON.parse(fs.readFileSync(path.join(dir, file), "utf-8"));
			if (entry.status === "published") out.push(`/${slug}`);
		} catch {
			// Unreadable entries never reach the sitemap (the route 404s them).
		}
	}
	return out.sort();
}

// Exposed for `scripts/check-keystatic-pages.mjs` (next-sitemap ignores
// unknown config keys and only reads its documented fields).
module.exports.getKeystaticSitemapSlugs = getKeystaticSitemapSlugs;
module.exports.getWiredKeystaticSlugs = getWiredKeystaticSlugs;
