import localFont from "next/font/local";
import { Plus_Jakarta_Sans } from "next/font/google";
export const fontSansSerif = localFont({
	src: [
		{ path: "./GoogleSansFlex/google-sans-flex-latin-100-normal.woff2", weight: "100" },
		{ path: "./GoogleSansFlex/google-sans-flex-latin-200-normal.woff2", weight: "200" },
		{ path: "./GoogleSansFlex/google-sans-flex-latin-300-normal.woff2", weight: "300" },
		{ path: "./GoogleSansFlex/google-sans-flex-latin-400-normal.woff2", weight: "400" },
		{ path: "./GoogleSansFlex/google-sans-flex-latin-500-normal.woff2", weight: "500" },
		{ path: "./GoogleSansFlex/google-sans-flex-latin-600-normal.woff2", weight: "600" },
		{ path: "./GoogleSansFlex/google-sans-flex-latin-700-normal.woff2", weight: "700" },
		{ path: "./GoogleSansFlex/google-sans-flex-latin-800-normal.woff2", weight: "800" },
		{ path: "./GoogleSansFlex/google-sans-flex-latin-900-normal.woff2", weight: "900" },
	],
	variable: "--font-sans-serif", // sans-serif variable for body (no decorative feet)
	display: "swap",
});
export const fontDisplay = localFont({
	src: [
		{ path: "./Brother1816/Brother-1816-Thin.woff2", weight: "100" },
		{ path: "./Brother1816/Brother-1816-Light.woff2", weight: "300" },
		{ path: "./Brother1816/Brother-1816-Regular.woff2", weight: "400" },
		{ path: "./Brother1816/Brother-1816-Medium.woff2", weight: "500" },
		{ path: "./Brother1816/Brother-1816-Bold.woff2", weight: "700" },
		{ path: "./Brother1816/Brother-1816-ExtraBold.woff2", weight: "800" },
		{ path: "./Brother1816/Brother-1816-Black.woff2", weight: "900" },
	],
	variable: "--font-display", // display variable for special purpose
	display: "swap",
});

export const fontSans = Plus_Jakarta_Sans({
	subsets: ["latin"],
	variable: "--font-sans", // sans variable for headers (decorative feet)
	display: "swap",
});