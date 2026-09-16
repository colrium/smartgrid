import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { renderSection } from "@/lib/keystatic/sectionRenderers";
import {
	BuildingSiteHeroSection,
	IntroSection,
	BuildSmarterSection,
	SiteEngineeringSection,
	ProcessSection,
	AccuracyMattersSection,
	DeliverablesSection,
	TechnologyStackSection,
	ConsultationSection,
	ExploreMoreSection,
	SiteCtaSection,
	ActionCtaBand,
} from "@/components/sections/surveying/building-site";

type PageProps = {
	/** Keystatic page when the `building-site-surveys` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

/**
 * Sections migrated to Keystatic in page order (see the
 * `building-site-surveys` mapping in
 * `scripts/migrate-locale-to-keystatic.mjs`): section1 introText,
 * actionCtaEngineer ctaBand, exploreMore gallery, cta ctaBand. Eight legacy
 * tails (bespoke hero, indexed SiteEngineering grid, BuildSmarter/Accuracy/
 * Consultation bespoke, Process with layout/columns outside the registry
 * contract, deliverables explorer, fallbackIcons TechnologyStack grid) sit at
 * fixed positions between them, so the route renders each Keystatic section
 * by index instead of one whole PageBuilderDocument. If an edit changes the
 * section COUNT, the route falls back to legacy rather than misplacing
 * sections — keep this in sync with the mapping.
 */
const KEYSTATIC_SECTION_COUNT = 4;

function orderedSections(page: ResolvedKeystaticPage) {
	if (page.sections.length !== KEYSTATIC_SECTION_COUNT) {
		console.warn(
			`[keystatic] page "building-site-surveys" has ${page.sections.length} sections, expected ${KEYSTATIC_SECTION_COUNT} — falling back to legacy content`
		);
		return null;
	}
	return page.sections;
}

const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	// Migration source switch (M3/M7): Keystatic owns the four migrated
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
				<PageHead pageName="building-site-surveys" />
				<div className="flex flex-col min-h-screen" data-keystatic-page={keystaticPage.slug}>
					<BuildingSiteHeroSection />
					{renderAt(0)}
					<SiteEngineeringSection />
					<BuildSmarterSection />
					<ProcessSection />
					<AccuracyMattersSection />
					{renderAt(1)}
					<DeliverablesSection />
					<TechnologyStackSection />
					<ConsultationSection />
					{renderAt(2)}
					{renderAt(3)}
				</div>
			</div>
		);
	}

	return (
		<div className="relative">
			<PageHead pageName="building-site-surveys" />
			<div className="flex flex-col min-h-screen">
				<BuildingSiteHeroSection />
				<IntroSection />
				<SiteEngineeringSection />
				<BuildSmarterSection />
				<ProcessSection />
				<AccuracyMattersSection />
				<ActionCtaBand />
				<DeliverablesSection />
				<TechnologyStackSection />
				<ConsultationSection />
				<ExploreMoreSection />
				<SiteCtaSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "surveying/building-site-surveys"]);

	if (!i18nProps) return { notFound: true };

	const locale = getLocale(context);
	const lang: Lang = locale === "sw" ? "sw" : "en";
	const resolution = await resolveKeystaticPage("building-site-surveys", lang);

	return { props: { ...i18nProps, keystaticPage: resolution.status === "keystatic" ? resolution.page : null } };
};

export default Page;
