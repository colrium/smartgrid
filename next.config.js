// @ts-check
const { i18n } = require('./next-i18next.config.js')

/** @type {import('next').NextConfig} */
const nextConfig = {
	// Allow redirecting the build output (e.g. CI/verification builds) without
	// disturbing a running dev server that owns the default `.next` folder.
	distDir: process.env.NEXT_DIST_DIR || ".next",
	transpilePackages: [
		"@sanity/sdk-react",
		"@sanity/workbench",
		// add any other @sanity/* package named in the next stack trace
	],
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn.sanity.io",
			},
		],
		// Serve AVIF where supported (noticeably smaller than WebP for the
		// photography-heavy cards), falling back to WebP.
		formats: ["image/avif", "image/webp"],
		// Allow quality 60 for large decorative photos; 75 remains the default.
		qualities: [60, 75],
	},
	i18n,
	reactStrictMode: true,
	typescript: {
		tsconfigPath: process.env.NEXTJS_TSCONFIG_PATH || "./tsconfig.json",
	},
};

module.exports = nextConfig
