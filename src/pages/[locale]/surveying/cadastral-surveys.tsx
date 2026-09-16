import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { renderSection } from "@/lib/keystatic/sectionRenderers";
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
 * Sections migrated to Keystatic in page order (see the `cadastral-surveys`
 * mapping in `scripts/migrate-locale-to-keystatic.mjs`): hero only.
 * `whatsABoundarySurvey` stays DORMANT — its IntroSection is commented out of
 * the route, so it is not migrated (revisit if the route re-enables it).
 * All other tails (bespoke postHeroCta band, WhenYouNeed/Process/Cost/
 * Timeline/Compliance/CaseStudy/FinalCta case-work) stay legacy. If an edit
 * changes the section COUNT, the route falls back to legacy rather than
 * misplacing sections — keep this in sync with the mapping.
 */
const KEYSTATIC_SECTION_COUNT = 1;

function orderedSections(page: ResolvedKeystaticPage) {
	if (page.sections.length !== KEYSTATIC_SECTION_COUNT) {
		console.warn(
			`[keystatic] page "cadastral-surveys" has ${page.sections.length} sections, expected ${KEYSTATIC_SECTION_COUNT} — falling back to legacy content`
		);
		return null;
	}
	return page.sections;
}

const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	// Migration source switch (M3/M7): Keystatic owns the hero only when the
	// slug is allowlisted via `KEYSTATIC_PAGES` and the entry is published.
	// Otherwise the legacy locale-JSON implementation renders unchanged.
	const sections = keystaticPage ? orderedSections(keystaticPage) : null;

	if (keystaticPage && sections) {
		const locale = keystaticPage.locale;
		const renderAt = (index: number) => {
			const section = sections[index];
			return renderSection(section.id, section.value, locale, section.key);
		};
		return (
			<div className="relative">
				<PageHead pageName="cadastral-surveys" />
				<div className="flex flex-col min-h-screen" data-keystatic-page={keystaticPage.slug}>
					{renderAt(0)}
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
