import Document, { Html, Head, Main, NextScript } from "next/document";
import type { DocumentProps } from "next/document";
import i18nextConfig from "../../next-i18next.config";
import { GoogleAnalytics } from "@next/third-parties/google";
import { DocumentHeadTags, documentGetInitialProps } from '@mui/material-nextjs/v15-pagesRouter';
type Props = DocumentProps & {
	// add custom document props
};

export default function MyDocument(props) {
        const currentLocale = (props.__NEXT_DATA__.query.locale ?? i18nextConfig.i18n.defaultLocale) as string;
		return (
			<Html lang={currentLocale} className="dark">
				<Head>
					<DocumentHeadTags {...props} />
					<link rel="icon" href="/favicon.ico" sizes="any" />
					<link rel="shortcut icon" href="/favicon.ico" />
					<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
					<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
					<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
				<GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ""} />
			</Html>
		);
	
}
MyDocument.getInitialProps = async (ctx) => {
    const finalProps = await documentGetInitialProps(ctx);
    return finalProps;
};
