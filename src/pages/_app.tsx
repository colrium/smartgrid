
import "@mdi/font/css/materialdesignicons.min.css";
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


import { Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";

const plusJakarta = Plus_Jakarta_Sans({
	subsets: ["latin"],
	variable: "--font-mono",
	display: "swap",
});

const googleSansFlex = localFont({
	src: "../fonts/google-sans-flex-latin-300-normal.woff2",
	variable: "--font-sans", // Define the custom CSS variable
	display: "swap",
});


const withLandingPageLayout = (page: ReactElement) => <LandingPageLayout>{page}</LandingPageLayout>;
function App({ Component, pageProps }: AppPropsWithLayout) {
    const router = useRouter();

    const renderPageWithLayout = Component.getLayout ?? withLandingPageLayout;
    const locale = router.locale as string;
    
    return (
		<AppCacheProvider {...pageProps}>
			<main
				className={`flex flex-col min-h-screen relative  ${plusJakarta.variable} ${googleSansFlex.variable} font-sans`}
			>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					{renderPageWithLayout(<Component {...pageProps} />)}
				</ThemeProvider>
			</main>
		</AppCacheProvider>
	);
}

export default appWithTranslation(App, i18nextConfig);
