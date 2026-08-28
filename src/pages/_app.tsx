
import "@/styles/globals.css";
import { appWithTranslation } from "next-i18next/pages";
import {  type ReactElement } from "react";
import { useRouter } from 'next/router';
import { AppCacheProvider } from "@mui/material-nextjs/v15-pagesRouter";
import i18n from 'i18next'
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "@/theme/theme";
import i18nextConfig from "../../next-i18next.config";
import type { AppPropsWithLayout } from "@/types/next";
import LandingPageLayout from "@/layouts/LandingPage/Layout";
import PageTransitionLoader from "@/components/PageTransitionLoader";
import { Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";
import { ReactLenis } from "lenis/react";
import type { LenisRef } from "lenis/react";
import { cancelFrame, frame } from "framer-motion";
import { useEffect, useRef } from "react";

const fontSans = Plus_Jakarta_Sans({
	subsets: ["latin"],
	variable: "--font-display", // display variable for special purpose

	display: "swap",
});

const fontSansSerif = localFont({
	src: "../fonts/GoogleSansFlex/google-sans-flex-latin-400-normal.woff2",
	variable: "--font-sans-serif", // sans-serif variable for body (no decorative feet)
	display: "swap",
});
const fontDisplay = localFont({
	src: "../fonts/Brother1816/Brother-1816-Regular.woff2",
	variable: "--font-sans", // sans variable for headers (decorative feet)
	display: "swap",
});


const withLandingPageLayout = (page: ReactElement) => <LandingPageLayout>{page}</LandingPageLayout>;
function App({ Component, pageProps }: AppPropsWithLayout) {
    const router = useRouter();
    const lenisRef = useRef<LenisRef>(null);
    const renderPageWithLayout = Component.getLayout ?? withLandingPageLayout;
    const locale = router.locale as string;
    
	useEffect(() => {
		function update(data: { timestamp: number }) {
			const time = data.timestamp;
			lenisRef.current?.lenis?.raf(time);
		}

		frame.update(update, true);

		return () => cancelFrame(update);
	}, []);

	useEffect(() => {
		// Load the MDI icon-font stylesheet at runtime instead of shipping it in
		// the document <head>: it is ~19 KB gz of purely decorative glyph rules,
		// and keeping it out of the initial document removes it from the
		// render-blocking critical path. The @font-face inside the file uses
		// `font-display: swap`, so glyphs paint without FOIT once the cached
		// stylesheet + font arrive.
		const MDI_STYLES_ID = "mdi-stylesheet";
		if (document.getElementById(MDI_STYLES_ID)) return;
		const link = document.createElement("link");
		link.id = MDI_STYLES_ID;
		link.rel = "stylesheet";
		link.href = "/fonts/materialdesignicons.css";
		document.head.appendChild(link);
	}, []);


    
    
    return (
		<AppCacheProvider {...pageProps}>
			<main
				className={`flex flex-col min-h-screen relative  ${fontSans.variable} ${fontSansSerif.variable} ${fontDisplay.variable} font-sans`}
			>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<PageTransitionLoader />
					{renderPageWithLayout(<Component {...pageProps} />)}
					<ReactLenis root options={{ autoRaf: false }} ref={lenisRef} />
				</ThemeProvider>
			</main>
		</AppCacheProvider>
	);
}

export default appWithTranslation(App, i18nextConfig);
