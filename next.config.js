// @ts-check
const { i18n } = require('./next-i18next.config.js')

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
        	{
            	protocol: 'https',
            	hostname: 'cdn.sanity.io',
        	},
        ],
	},
	i18n,
	reactStrictMode: true,
	typescript: {
    	tsconfigPath: process.env.NEXTJS_TSCONFIG_PATH || './tsconfig.json',
	},
}

module.exports = nextConfig
