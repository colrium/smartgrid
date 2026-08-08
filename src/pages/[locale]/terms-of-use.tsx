import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";
import { LegalPageSection } from "@/components/sections";
import { useTranslation } from "@/hooks";
import { getI18nProps } from "@/lib/i18n";

type LegalSection = {
	title: string;
	content: string[];
};

const TermsOfUsePage: NextPage = () => {
	const { t } = useTranslation(["common", "terms", "meta"]);
	const siteTitle = t("meta:site.title", { defaultValue: "" });
	const sections = t("terms:articles", {
		returnObjects: true,
		site_title: siteTitle,
		defaultValue: [],
	}) as LegalSection[];

	return (
		<div className="relative">
			<PageHead pageName="terms_of_use" />
			<LegalPageSection
				label={t("terms:misc.label", { site_title: siteTitle })}
				title={t("terms:misc.title", { site_title: siteTitle })}
				description={t("terms:misc.description", { site_title: siteTitle })}
				lastUpdated={`${t("terms:misc.lastUpdatedLabel", {
					site_title: siteTitle,
				})} ${t("terms:misc.lastUpdated", { site_title: siteTitle })}`}
				sections={sections}
				contactHref={t("terms:misc.contactLink", { site_title: siteTitle })}
				contactLabel={t("terms:misc.contactLabel", { site_title: siteTitle })}
				note={t("terms:misc.note", { site_title: siteTitle })}
			/>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "terms"]);

	if (!i18nProps) return { notFound: true };

	return { props: { ...i18nProps } };
};

export default TermsOfUsePage;
