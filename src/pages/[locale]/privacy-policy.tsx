import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";
import { LegalPageSection } from "@/components/sections";
import { useTranslation } from "@/hooks";
import { getI18nProps } from "@/lib/i18n";
type PageProps = {
	// Add custom props here
};

const PrivacyPolicyPage: NextPage<PageProps> = () => {
    const { t } = useTranslation(["common", "privacy", "meta"]);
    const siteTitle = t("meta:site.title", { defaultValue: "" });
	const sections = t("privacy:articles", { returnObjects: true, site_title: siteTitle, defaultValue: [] }) as {
		title: string;
		content: string[];
	}[];
	return (
		<div className="relative">
			<PageHead pageName="privacy_policy" />
			<LegalPageSection
				label={t("privacy:misc.label", { defaultValue: "Privacy", site_title: siteTitle })}
				title={t("privacy:misc.title", { defaultValue: "Privacy Policy", site_title: siteTitle })}
				description={t("privacy:misc.description", { site_title: siteTitle })}
				lastUpdated={`${t("privacy:misc.lastUpdatedLabel", { site_title: siteTitle })} ${t("privacy:misc.lastUpdated", { site_title: siteTitle })}`}
				sections={sections}
				contactHref={t("privacy:misc.contactLink", { site_title: siteTitle })}
                contactLabel={t("privacy:misc.contactLabel", { site_title: siteTitle })}
                note={t("privacy:misc.note", { site_title: siteTitle })}
			/>
		</div>
	);
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "privacy"]);

	if (!i18nProps) return { notFound: true };

	return { props: { ...i18nProps } };
};

export default PrivacyPolicyPage;
