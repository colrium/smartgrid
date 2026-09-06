import Document, { Html, Head, Main, NextScript } from "next/document";
import i18nextConfig from "../../next-i18next.config";
// Google Analytics is intentionally NOT loaded here: it would set `_ga`
// cookies before consent. It is injected on the client only after the visitor
// grants "analytics" consent (see src/components/CookieConsent.tsx +
// src/lib/consent.ts).

export default function MyDocument(props) {
        const currentLocale = (props.__NEXT_DATA__.query.locale ?? i18nextConfig.i18n.defaultLocale) as string;
		return (
			<Html lang={currentLocale} className="dark">
				<Head>
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
			</Html>
		);
	
}
MyDocument.getInitialProps = async (ctx) => {
    const finalProps = await Document.getInitialProps(ctx);
    return finalProps;
};
