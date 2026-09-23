import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";
import { LegalPageSection } from "@/components/sections";
import { useTranslation } from "@/hooks";
import { getI18nProps, getLocale } from "@/lib/i18n";
import { PageBuilderDocument } from "@/components/keystatic/PageBuilderDocument";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import type { Lang } from "@/lib/types";

type LegalSection = {
	title: string;
	content: string[];
};

type PageProps = {
	/** Keystatic page when the `privacy-policy` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

const PrivacyPolicyPage: NextPage<PageProps> = ({ keystaticPage }) => {
    const { t } = useTranslation(["common", "privacy", "meta"]);

	// Migration source switch (M3/M7): Keystatic owns this route only when the
	// slug is allowlisted via `KEYSTATIC_PAGES` and the entry is published.
	// Otherwise the legacy locale-JSON implementation renders unchanged.
	if (keystaticPage) {
		return (
			<div className="relative">
				<PageHead pageName="privacy_policy" />
				<PageBuilderDocument page={keystaticPage} />
			</div>
		);
	}

    const siteTitle = t("meta:site.title", { defaultValue: "" });
	const sections = t("privacy:articles", { returnObjects: true, site_title: siteTitle, defaultValue: [] }) as LegalSection[];
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

	const locale = getLocale(context);
	const lang: Lang = locale === "sw" ? "sw" : "en";
	const resolution = await resolveKeystaticPage("privacy-policy", lang);

	return {
		props: { ...i18nProps, keystaticPage: resolution.status === "keystatic" ? resolution.page : null },
	};
};

export default PrivacyPolicyPage;
