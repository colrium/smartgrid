import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { PageBuilderDocument } from "@/components/keystatic/PageBuilderDocument";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import {
	SurveyingHeroSection,
	SurveyingServicesSection,
	SurveyingProcessSection,
	SurveyingDeliverablesSection,
} from "@/components/sections/surveying/landing";

type PageProps = {
	/** Keystatic page when the `surveying` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	// Migration source switch (M3/M7): Keystatic owns the shared hero only
	// when the slug is allowlisted via `KEYSTATIC_PAGES` and the entry is
	// published. The bespoke services grid (lead map below), indexed process
	// cards, and deliverables explorer always render from legacy locale JSON
	// (hybrid strategy) — see the `surveying` mapping in
	// `scripts/migrate-locale-to-keystatic.mjs`.
	return (
		<div className="relative">
			<PageHead pageName="surveying" />
			<div className="flex flex-col min-h-screen">
				{keystaticPage ? <PageBuilderDocument page={keystaticPage} /> : <SurveyingHeroSection />}
				<SurveyingServicesSection />
				<SurveyingProcessSection />
				<SurveyingDeliverablesSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "surveying/landing"]);

	if (!i18nProps) return { notFound: true };

	const locale = getLocale(context);
	const lang: Lang = locale === "sw" ? "sw" : "en";
	const resolution = await resolveKeystaticPage("surveying", lang);

	return { props: { ...i18nProps, keystaticPage: resolution.status === "keystatic" ? resolution.page : null } };
};

export default Page;
