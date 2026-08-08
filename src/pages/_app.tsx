import "@/styles/globals.css";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { appWithTranslation } from "next-i18next/pages";
import {  type ReactElement } from "react";
import localFont from "next/font/local";
import { useRouter } from 'next/router';
import i18n from 'i18next'
import i18nextConfig from "../../next-i18next.config";
import theme from "@/theme/theme";
import { Plus_Jakarta_Sans } from 'next/font/google';
import type { AppPropsWithLayout } from "@/types/next";
import "@mdi/font/css/materialdesignicons.min.css";
import LandingPageLayout from "@/layouts/LandingPage/Layout";



const plusJakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    variable: '--font-plus-jakarta',
    display: 'swap',
  });

  const googleSansFlex = localFont({
	src: [
		{
			path: "../fonts/google-sans-flex-latin-300-normal.woff2",
			style: "normal",
			weight: "100",
		},
		{
			path: "../fonts/google-sans-flex-latin-300-normal.woff2",
			style: "normal",
			weight: "200",
		},
		{
			path: "../fonts/google-sans-flex-latin-300-normal.woff2",
			style: "normal",
			weight: "300",
		},
		{
			path: "../fonts/google-sans-flex-latin-400-normal.woff2",
			style: "normal",
			weight: "400",
		},
		{
			path: "../fonts/google-sans-flex-latin-500-normal.woff2",
			style: "normal",
			weight: "500",
		},
		{
			path: "../fonts/google-sans-flex-latin-600-normal.woff2",
			style: "normal",
			weight: "600",
		},
		{
			path: "../fonts/google-sans-flex-latin-700-normal.woff2",
			style: "normal",
			weight: "700",
		},
		{
			path: "../fonts/google-sans-flex-latin-800-normal.woff2",
			style: "normal",
			weight: "800",
		},
		{
			path: "../fonts/google-sans-flex-latin-900-normal.woff2",
			style: "normal",
			weight: "900",
		},
	],
	variable: "--font-google-sans-flex", // Define the custom CSS variable
});



const withLandingPageLayout = (page: ReactElement) => <LandingPageLayout>{page}</LandingPageLayout>;
function App({ Component, pageProps }: AppPropsWithLayout) {
    const router = useRouter();

    const renderPageWithLayout = Component.getLayout ?? withLandingPageLayout;
    const locale = router.locale as string;
    
	return (
		<div className={` ${googleSansFlex.variable} ${plusJakarta.variable} font-sans`}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				{renderPageWithLayout(<Component {...pageProps} />)}
			</ThemeProvider>
		</div>
	);
}

export default appWithTranslation(App, i18nextConfig);
