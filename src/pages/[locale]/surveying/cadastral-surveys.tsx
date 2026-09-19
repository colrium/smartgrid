import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { PageBuilderDocument } from "@/components/keystatic/PageBuilderDocument";
import {
	CadastralHeroSection,
	PostHeroCtaSection,
	// IntroSection,
	WhenYouNeedSection,
	ProcessFlowSection,
	ProcessCtaSection,
	CostSection,
	TimelineSection,
	ComplianceSection,
	CaseStudySection,
	FinalCtaSection,
} from "@/components/sections/surveying/cadastral";

type PageProps = {
	/** Keystatic page when the `cadastral-surveys` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

/**
 * All ten legacy sections are Keystatic-owned in page order (see the
 * `cadastral-surveys` mapping in `scripts/migrate-locale-to-keystatic.mjs`):
 * hero, cadastralPostHeroCta, cadastralWhenYouNeed, cadastralProcess,
 * cadastralProcessCta, cadastralCost, cadastralTimeline,
 * cadastralCompliance, cadastralCaseStudy, cadastralFinalCta (M11 batch 12,
 * 2026-09-19 — entry order IS page order, so editors can add, remove, and
 * reorder sections freely; the M3 resolver taxonomy remains the only
 * fallback). `whatsABoundarySurvey` stays DORMANT (commented out of the
 * route — never migrated).
 */
const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	// Migration source switch (M3/M7, completed M11 batch 12): Keystatic owns
	// the whole page when the slug is allowlisted via `KEYSTATIC_PAGES` and
	// the entry is published. Otherwise the legacy locale-JSON implementation
	// renders unchanged.
	if (keystaticPage) {
		return (
			<div className="relative">
				<PageHead pageName="cadastral-surveys" />
				<PageBuilderDocument page={keystaticPage} />
			</div>
		);
	}

	return (
		<div className="relative">
			<PageHead pageName="cadastral-surveys" />
			<div className="flex flex-col min-h-screen">
				<CadastralHeroSection />
				<PostHeroCtaSection />
				{/* <IntroSection /> */}
				<WhenYouNeedSection />
				<ProcessFlowSection />
				<ProcessCtaSection />
				<CostSection />
				<TimelineSection />
				<ComplianceSection />
				<CaseStudySection />
				<FinalCtaSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "surveying/cadastral-surveys"]);

	if (!i18nProps) return { notFound: true };

	const locale = getLocale(context);
	const lang: Lang = locale === "sw" ? "sw" : "en";
	const resolution = await resolveKeystaticPage("cadastral-surveys", lang);

	return { props: { ...i18nProps, keystaticPage: resolution.status === "keystatic" ? resolution.page : null } };
};

export default Page;
