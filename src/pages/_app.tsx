import "@/styles/globals.css";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { appWithTranslation } from "next-i18next/pages";
import {  type ReactElement } from "react";
import { useRouter } from 'next/router';
import i18n from 'i18next'
import i18nextConfig from "../../next-i18next.config";
import theme from "@/theme/theme";
import { Manrope, Montserrat } from 'next/font/google';
import type { AppPropsWithLayout } from "@/types/next";
import LandingPageLayout from "@/layouts/LandingPage/Layout";



const manrope = Manrope({
	subsets: ["latin"],
	variable: "--font-manrope",
	weight: ["300", "400", "500"],
});

const montserrat = Montserrat({
	subsets: ['latin'],
	variable: '--font-montserrat',
});





const withLandingPageLayout = (page: ReactElement) => <LandingPageLayout>{page}</LandingPageLayout>;
function App({ Component, pageProps }: AppPropsWithLayout) {
    const router = useRouter();

    const renderPageWithLayout = Component.getLayout ?? withLandingPageLayout;
    const locale = router.locale as string;
    // console.log("App component current route:", router);
    /* console.log("App component current route.locale:", router.locale);
	useEffect(() => {
		if (locale && i18n.language !== locale) {
			// i18n.changeLanguage(locale);
		}
	}, [locale]); */
	return (
		<div className={` ${montserrat.variable} ${manrope.variable}`}>
			<ThemeProvider theme={theme}>
				<CssBaseline />
				{renderPageWithLayout(<Component {...pageProps} />)}
			</ThemeProvider>
		</div>
	);
}

export default appWithTranslation(App, i18nextConfig);
