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
	/** Keystatic page when the `terms-of-use` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

const TermsOfUsePage: NextPage<PageProps> = ({ keystaticPage }) => {
	const { t } = useTranslation(["common", "terms", "meta"]);

	// Migration source switch (M3): Keystatic owns this route only when the
	// slug is allowlisted via `KEYSTATIC_PAGES` and the entry is published.
	// Otherwise the legacy locale-JSON implementation renders unchanged.
	if (keystaticPage) {
		return (
			<div className="relative">
				<PageHead pageName="terms_of_use" />
				<PageBuilderDocument page={keystaticPage} />
			</div>
		);
	}

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

	const locale = getLocale(context);
	const lang: Lang = locale === "sw" ? "sw" : "en";
	const resolution = await resolveKeystaticPage("terms-of-use", lang);

	return {
		props: { ...i18nProps, keystaticPage: resolution.status === "keystatic" ? resolution.page : null },
	};
};

export default TermsOfUsePage;
