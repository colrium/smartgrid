import { GetServerSidePropsContext, GetStaticPropsContext } from "next/types";
import { serverSideTranslations } from "next-i18next/pages/serverSideTranslations";
import i18nextConfig from "../../next-i18next.config";

export const getI18nPaths = () =>
	i18nextConfig.i18n.locales.map((lng: string) => ({
		params: {
			locale: lng,
		},
	}));

export const getStaticPaths = () => ({
	fallback: false,
	paths: getI18nPaths(),
});

// export const getI18nProps = async (ctx: GetStaticPropsContext, ns: string[] = ["common"]) => {
// 	const locale = ctx?.params?.locale || i18nextConfig.i18n.defaultLocale;
// 	let props = {
// 		...(await serverSideTranslations(locale as string, ns)),
// 	};
// 	return props;
// };

export const makeStaticProps =
	(ns: string[] = ["common"]) =>
	async (ctx: GetServerSidePropsContext | GetStaticPropsContext) => ({
		props: await getI18nProps(ctx, ns),
	});
export function getLocale(params: GetServerSidePropsContext | GetStaticPropsContext) {
	const routeLocale = params.params?.locale;
	const validLocales = i18nextConfig.i18n.locales;

	if (typeof routeLocale === "string" && !validLocales.includes(routeLocale)) {
		return null; // caller can return notFound()
	}

	const locale = typeof routeLocale === "string" ? routeLocale : params.locale;

	return validLocales.includes(locale as string)
		? (locale as string)
		: i18nextConfig.i18n.defaultLocale;
}

export async function getI18nProps(
	params: GetServerSidePropsContext | GetStaticPropsContext,
	namespaces: string[]
) {
	const locale = getLocale(params);
	if (!locale) return null;

	// The shared layout (navbar/footer) always renders contact details and
	// social links from the "contact" namespace, so load it on every page.
	const ns = Array.from(new Set(["contact", ...namespaces]));

	return {
		...(await serverSideTranslations(locale, ns, i18nextConfig)),
	};
}
