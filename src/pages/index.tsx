import Page, { getServerSideProps } from "./[locale]/index";
export default Page
export { getServerSideProps };
    
/*
import { Redirect } from "@/lib/redirect";
import { GetServerSideProps } from "next";
export default Redirect;

export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, [
		"common",
		"meta",
		"home",
		"faq",
		"testimonials",
		"invest",
		"operations",
		"why",
		"compliance",
		"cta",
	]);

	if (!i18nProps) return { notFound: true };

	return { props: { ...i18nProps } };
}; */
// to keep this root page with the defaultLocale
/* import Page, { getServerSideProps } from "./[locale]/index";
export default Page
export { getServerSideProps }; */
