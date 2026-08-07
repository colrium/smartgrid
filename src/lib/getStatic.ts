import { GetStaticPropsContext } from "next/types";
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

export const getI18nProps = async (ctx: GetStaticPropsContext, ns: string[] = ["common"]) => {
	const locale = ctx?.params?.locale || i18nextConfig.i18n.defaultLocale;
	let props = {
		...(await serverSideTranslations(locale as string, ns, i18nextConfig)),
	};
	return props;
};

export const makeStaticProps =
	(ns: string[] = ["common"]) =>
	async (ctx: GetStaticPropsContext) => ({
		props: await getI18nProps(ctx, ns),
	});
