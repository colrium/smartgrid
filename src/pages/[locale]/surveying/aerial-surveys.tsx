import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { renderSection } from "@/lib/keystatic/sectionRenderers";
import AerialHeroSection from "@/components/sections/surveying/aerial/AerialHeroSection";
import IntroSection from "@/components/sections/surveying/aerial/IntroSection";
import WhyDroneSurveysSection from "@/components/sections/surveying/aerial/WhyDroneSurveysSection";
import AerialServicesSection from "@/components/sections/surveying/aerial/AerialServicesSection";
import PrecisionSection from "@/components/sections/surveying/aerial/PrecisionSection";
import AerialWorkflowSection from "@/components/sections/surveying/aerial/AerialWorkflowSection";
import AerialSurveyingSection from "@/components/sections/surveying/aerial/AerialSurveyingSection";
import DeliverablesSection from "@/components/sections/surveying/aerial/DeliverablesSection";
import AerialIndustriesSection from "@/components/sections/surveying/aerial/AerialIndustriesSection";
import IndustryCtaSection from "@/components/sections/surveying/aerial/IndustryCtaSection";
import ProjectsSection from "@/components/sections/surveying/aerial/ProjectsSection";
import TechStackSection from "@/components/sections/surveying/aerial/TechStackSection";
import CapabilityCtaSection from "@/components/sections/surveying/aerial/CapabilityCtaSection";
import AdditionalServicesSection from "@/components/sections/surveying/aerial/AdditionalServicesSection";
import AerialFinalCtaSection from "@/components/sections/surveying/aerial/AerialFinalCtaSection";

type PageProps = {
	/** Keystatic page when the `aerial-surveys` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

/**
 * Sections migrated to Keystatic in page order (see the `aerial-surveys`
 * mapping in `scripts/migrate-locale-to-keystatic.mjs`): hero (with footnote
 * chips), precision splitMedia. Thirteen legacy tails (bespoke intro,
 * popup-card services, WorkflowSection workflow, deliverables explorer,
 * fallbackIcons industries/tech grids, CtaBand CTAs with `size` + pill
 * overrides outside the v1 contract, projects/additional/final bespoke) sit
 * at fixed positions between them, so the route renders each Keystatic
 * section by index instead of one whole PageBuilderDocument. If an edit
 * changes the section COUNT, the route falls back to legacy rather than
 * misplacing sections — keep this in sync with the mapping.
 */
const KEYSTATIC_SECTION_COUNT = 2;

function orderedSections(page: ResolvedKeystaticPage) {
	if (page.sections.length !== KEYSTATIC_SECTION_COUNT) {
		console.warn(
			`[keystatic] page "aerial-surveys" has ${page.sections.length} sections, expected ${KEYSTATIC_SECTION_COUNT} — falling back to legacy content`
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
				<PageHead pageName="aerial-surveys" />
				<div className="flex flex-col min-h-screen" data-keystatic-page={keystaticPage.slug}>
					{renderAt(0)}
					<IntroSection />
					<WhyDroneSurveysSection />
					<AerialServicesSection />
					{renderAt(1)}
					<AerialWorkflowSection />
					<AerialSurveyingSection />
					<DeliverablesSection />
					<AerialIndustriesSection />
					<IndustryCtaSection />
					<ProjectsSection />
					<TechStackSection />
					<CapabilityCtaSection />
					<AdditionalServicesSection />
					<AerialFinalCtaSection />
				</div>
			</div>
		);
	}

	return (
		<div className="relative">
			<PageHead pageName="aerial-surveys" />
			<div className="flex flex-col min-h-screen">
				<AerialHeroSection />
				<IntroSection />
				<WhyDroneSurveysSection />
				<AerialServicesSection />
				<PrecisionSection />
				<AerialWorkflowSection />
				<AerialSurveyingSection />
				<DeliverablesSection />
				<AerialIndustriesSection />
				<IndustryCtaSection />
				<ProjectsSection />
				<TechStackSection />
				<CapabilityCtaSection />
				<AdditionalServicesSection />
				<AerialFinalCtaSection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "surveying/aerial-surveys"]);

	if (!i18nProps) return { notFound: true };

	const locale = getLocale(context);
	const lang: Lang = locale === "sw" ? "sw" : "en";
	const resolution = await resolveKeystaticPage("aerial-surveys", lang);

	return { props: { ...i18nProps, keystaticPage: resolution.status === "keystatic" ? resolution.page : null } };
};

export default Page;
