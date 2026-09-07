/** @type {import('next-sitemap').IConfig} */
const path = require("path");
const fs = require("fs");
const i18nextConfig = require("./next-i18next.config");
const locales = i18nextConfig?.i18n?.locales || ["en"];
const defaultLocale = i18nextConfig?.i18n?.defaultLocale || "en";
const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://smartgridsurveying.com").replace(
	/\/+$/,
	""
);

const staticPagesSlugs = getStaticPagesSlugs();
const productPagesSlugs = getProductSlugs();
module.exports = {
	siteUrl, // your environment domain, no trailing slash
	generateRobotsTxt: true,
	generateIndexSitemap: false, // only needed for very large sites (many thousands of URLs)
	sitemapSize: 5000,
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
		// additionalSitemaps only needed for extra sitemaps (news/image/video),
		// additionalSitemaps: [`${siteUrl}/sitemap.xml`],
		// the main sitemap.xml is added automatically
	},
	additionalPaths: async (config) => {
		const staticRoutes = ["", ...staticPagesSlugs];
		const productSlugs = productPagesSlugs;
		const productRoutes = productSlugs.map((slug) => `/equipment-sale/${slug}`);
		const allRoutes = [...staticRoutes, ...productRoutes];
		const paths = [];
		for (const route of allRoutes) {
			for (const locale of locales) {
				paths.push(await config.transform(config, `/${locale}${route}`));
			}
		}
		return paths;
	},
	transform: async (config, urlPath) => {
		const segments = urlPath.split("/").filter(Boolean);
		const hasLocalePrefix = locales.includes(segments[0]);
		const routeWithoutLocale = hasLocalePrefix ? "/" + segments.slice(1).join("/") : urlPath; // already locale-less (auto-crawled entry) — leave as-is
		const normalizedRoute = routeWithoutLocale === "" ? "/" : routeWithoutLocale;
		const isProduct = normalizedRoute.startsWith("/equipment-sale/");

		return {
			loc: urlPath,
			changefreq: isProduct ? "weekly" : config.changefreq,
			priority: normalizedRoute === "/" ? 1.0 : isProduct ? 0.8 : config.priority,
			lastmod: new Date().toISOString(),
			alternateRefs: locales.map((l) => ({
				href: `${config.siteUrl}/${l}${normalizedRoute === "/" ? "" : normalizedRoute}`,
				hreflang: l,
				// next-sitemap re-appends the page path (field.loc) to every alternate
				// href unless hrefIsAbsolute is set, which produced doubled urls like
				// /sw/terms-of-use/sw/terms-of-use - mark our fully-qualified hrefs as absolute.
				hrefIsAbsolute: true,
			})),
		};
	},
};
function getStaticPagesSlugs() {
	const filePath = path.join(process.cwd(), "public", "locales", defaultLocale, "meta.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    
    return [...(new Set(Object.entries(data.pages).reduce((acc, [, props]) => {
        const slug = `${props.slug?.startsWith?.("/") ? "" : "/"}${props.slug || ""}`;
        // acc = acc.concat([slug, `/[locale]${slug}`])
        acc = acc.concat([slug]);
        return acc;
    }, [])))];
}
function getProductSlugs() {
	const filePath = path.join(process.cwd(), "public", "locales", defaultLocale, "products.json");
	const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
	return data.items.map((product) => product.slug);
}