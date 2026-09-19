import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { PageBuilderDocument } from "@/components/keystatic/PageBuilderDocument";
import {
	GprServiceHero,
	GprTechnicalProposalCta,
	GprHighlightsBar,
	GprJumpNav,
	GprOverviewSection,
	GprMethodologySection,
	GprApplicationsSection,
	GprDetectSection,
	GprDeliverablesSection,
	GprSueComplianceSection,
	GprLimitationsSection,
	GprBeforeAfterSection,
	GprTechnologySection,
	GprSummarySection,
	GprFinalCtaSection,
	FeaturedProjectsSection,
	GprFaqSection,
} from "@/components/sections/surveying/ground-penetrating-radar";

type PageProps = {
	/** Keystatic page when the `ground-penetrating-radar` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

/**
 * All seventeen legacy sections are Keystatic-owned in page order (see the
 * `ground-penetrating-radar` mapping in
 * `scripts/migrate-locale-to-keystatic.mjs`): gprHero, technicalCta ctaBand,
 * gprHighlights, gprJumpNav, gprOverview, gprMethodology, gprApplications,
 * gprDetect, deliverables, gprSue, gprLimitations, gprBeforeAfter,
 * gprTechnology, gprFeaturedProjects, gprSummary, faqs faq, gprFinalCta
 * (M11 batch 13, 2026-09-19 — entry order IS page order, so editors can add,
 * remove, and reorder sections freely; the M3 resolver taxonomy remains the
 * only fallback).
 */
const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	// Migration source switch (M3/M7, completed M11 batch 13): Keystatic owns
	// the whole page when the slug is allowlisted via `KEYSTATIC_PAGES` and
	// the entry is published. Otherwise the legacy locale-JSON implementation
	// renders unchanged.
	if (keystaticPage) {
		return (
			<div className="relative">
				<PageHead pageName="ground-penetrating-radar" />
				<PageBuilderDocument page={keystaticPage} />
			</div>
		);
	}

	return (
		<div className="relative">
			<PageHead pageName="ground-penetrating-radar" />
			<div className="flex flex-col min-h-screen">
				<GprServiceHero />
				<GprTechnicalProposalCta />
				<GprHighlightsBar />
				<GprJumpNav />
				<GprOverviewSection />
				<GprMethodologySection />
				<GprApplicationsSection />
				<GprDetectSection />
				<GprDeliverablesSection />
				<GprSueComplianceSection />
				<GprLimitationsSection />
				<GprBeforeAfterSection />
				<GprTechnologySection />
				<FeaturedProjectsSection />
				<GprSummarySection />
				<GprFaqSection />
				<GprFinalCtaSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "surveying/ground-penetrating-radar"]);

	if (!i18nProps) return { notFound: true };

	const locale = getLocale(context);
	const lang: Lang = locale === "sw" ? "sw" : "en";
	const resolution = await resolveKeystaticPage("ground-penetrating-radar", lang);

	return { props: { ...i18nProps, keystaticPage: resolution.status === "keystatic" ? resolution.page : null } };
};

export default Page;
