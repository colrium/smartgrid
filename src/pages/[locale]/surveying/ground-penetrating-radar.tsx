import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { renderSection } from "@/lib/keystatic/sectionRenderers";
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
 * Sections migrated to Keystatic in page order (see the
 * `ground-penetrating-radar` mapping in
 * `scripts/migrate-locale-to-keystatic.mjs`): technicalCta ctaBand, faqs faq.
 * Fifteen legacy tails (bespoke service hero, highlights/jumpNav/overview/
 * methodology bespoke, `indexed` applications grid, `fallbackIcons` detect
 * grid, deliverables/sue/limitations/beforeAfter/technology/summary/
 * featuredProjects bespoke, FinalCta) sit at fixed positions between them, so
 * the route renders each Keystatic section by index instead of one whole
 * PageBuilderDocument. If an edit changes the section COUNT, the route falls
 * back to legacy rather than misplacing sections — keep this in sync with
 * the mapping.
 */
const KEYSTATIC_SECTION_COUNT = 2;

function orderedSections(page: ResolvedKeystaticPage) {
	if (page.sections.length !== KEYSTATIC_SECTION_COUNT) {
		console.warn(
			`[keystatic] page "ground-penetrating-radar" has ${page.sections.length} sections, expected ${KEYSTATIC_SECTION_COUNT} — falling back to legacy content`
		);
		return null;
	}
	return page.sections;
}

const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	// Migration source switch (M3/M7): Keystatic owns the two migrated
	// sections only when the slug is allowlisted via `KEYSTATIC_PAGES` and the
	// entry is published. Otherwise the legacy locale-JSON implementation
	// renders unchanged.
	const sections = keystaticPage ? orderedSections(keystaticPage) : null;

	if (keystaticPage && sections) {
		const locale = keystaticPage.locale;
		const renderAt = (index: number) => {
			const section = sections[index];
			return renderSection(section.id, section.value, locale, section.key);
		};
		return (
			<div className="relative">
				<PageHead pageName="ground-penetrating-radar" />
				<div className="flex flex-col min-h-screen" data-keystatic-page={keystaticPage.slug}>
					<GprServiceHero />
					{renderAt(0)}
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
					{renderAt(1)}
					<GprFinalCtaSection />
				</div>
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
