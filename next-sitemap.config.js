/** @type {import('next-sitemap').IConfig} */
const path = require("path");
const fs = require("fs");
const i18nextConfig = require("./next-i18next.config");
const locales = i18nextConfig?.i18n?.locales || ["en"];
const defaultLocale = i18nextConfig?.i18n?.defaultLocale || "en";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://smartgridsurveying.com";

module.exports = {
	siteUrl, // your environment domain, no trailing slash
	generateRobotsTxt: true,
	generateIndexSitemap: false, // only needed for very large sites (many thousands of URLs)
	sitemapSize: 5000,
	exclude: ["/api/*", "/404", "/500", "/[locale]/404", "/[locale]/500", "/[locale]/*"],
	robotsTxtOptions: {
		policies: [{ userAgent: "*", allow: "/" }],
		additionalSitemaps: [`${siteUrl}/sitemap.xml`],
	},
	additionalPaths: async (config) => {
		const staticRoutes = ["", ...getStaticPagesSlugs()];
		const productSlugs = getProductSlugs();
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
	transform: async (config, path) => {
		const locale = path.split("/")[1];
		const routeWithoutLocale = path.replace(`/${locale}`, "") || "/";
		const isProduct = routeWithoutLocale.startsWith("/equipment-sale/");

		return {
			loc: path,
			changefreq: isProduct ? "weekly" : config.changefreq,
			priority: routeWithoutLocale === "/" ? 1.0 : isProduct ? 0.8 : config.priority,
			lastmod: new Date().toISOString(),
			alternateRefs: locales.map((l) => ({
				href: `${config.siteUrl}/${l}${routeWithoutLocale === "/" ? "" : routeWithoutLocale}`,
				hreflang: l,
			})),
		};
	},
};
function getStaticPagesSlugs() {
	const filePath = path.join(process.cwd(), "public", "locales", defaultLocale, "meta.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    
    return [...(new Set(Object.entries(data.pages).reduce((acc, [key, props]) => {
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