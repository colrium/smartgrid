import type { GetServerSideProps, NextPage } from "next";
import { cloneElement, type ReactElement } from "react";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { renderSection } from "@/lib/keystatic/sectionRenderers";
import HeroSection from "@/components/sections/home/HeroSection";
import { AboutSection } from "@/components/sections/home/AboutSection";
import { PlanningInfographicSection } from "@/components/sections/home/PlanningInfographicSection";
import LeadGenBar from "@/components/sections/shared/LeadGenBar";
import {
	SurveyingInstrumentsSection,
	DronesSection,
	WhyChooseUsSection,
	KeyFactsSection,
	CoreExpertiseSection,
	CertificationsSection,
	ServicesSection,
	CtaSection,
	TrusteesSection,
	// MetricsSection,
	IndustriesWeServeSection,
	SurveyCostSection,
	CoverageAreaSection,
	FaqSection,
	ActionCtaSection,
} from "@/components/sections/home";

interface PageProps {
	/** Keystatic page when the `home` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
}

/**
 * Sections migrated to Keystatic in page order (see the `home` mapping in
 * `scripts/migrate-locale-to-keystatic.mjs`): actionCtaSurveyor ctaBand,
 * industriesWeServe cardGrid, faq, actionCtaEngineer ctaBand, defaultCta
 * ctaBand, trustees, certifications, keyFacts, whyChooseUs, about,
 * surveyingInstruments, coreExpertise, planningInfographic, surveyCost,
 * coverageArea, leadGenBar (M8, 2026-09-16/17; leadGenBar M9 follow-up).
 * Thirteen legacy tails (bespoke WebGL hero,
 * Drones/Services bespoke) sit at fixed
 * positions between them, so the route renders each Keystatic section by
 * index instead of one whole PageBuilderDocument. If an edit changes the
 * section COUNT, the route falls back to legacy rather than misplacing
 * sections — keep this in sync with the mapping.
 *
 * `leadGenBar` keeps its route-level positioning (`-mt-48` overlap) via
 * `cloneElement`: the registry stores content only, never `className`.
 */
const KEYSTATIC_SECTION_COUNT = 16;

function orderedSections(page: ResolvedKeystaticPage) {
	if (page.sections.length !== KEYSTATIC_SECTION_COUNT) {
		console.warn(
			`[keystatic] page "home" has ${page.sections.length} sections, expected ${KEYSTATIC_SECTION_COUNT} — falling back to legacy content`
		);
		return null;
	}
	return page.sections;
}

const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	// Migration source switch (M3/M7): Keystatic owns the sixteen migrated
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
			<div className="relative ">
				<PageHead pageName="home" />
				<div className="flex flex-col min-h-screen" data-keystatic-page={keystaticPage.slug}>
					<HeroSection />
					<div className="flex flex-col mx-auto max-w-7xl px-6 w-full">
						{cloneElement(renderAt(15) as ReactElement<{ className?: string }>, {
							className: "my-12  -mt-48",
						})}
						{renderAt(9)}
						{renderAt(12)}
					</div>
					{renderAt(10)}
					<DronesSection />

					{renderAt(0)}

					<ServicesSection />
					{renderAt(1)}
					<div className="flex flex-col  w-full">
						{renderAt(8)}

						{renderAt(11)}

						{renderAt(13)}
						{renderAt(14)}
						{renderAt(2)}
						{renderAt(3)}
						{renderAt(7)}
						{renderAt(6)}
						{renderAt(5)}
						{/* <MetricsSection /> */}
					</div>

					{renderAt(4)}
				</div>
			</div>
		);
	}

	return (
		<div className="relative ">
			<PageHead pageName="home" />
			<div className="flex flex-col min-h-screen">
				<HeroSection />
				<div className="flex flex-col mx-auto max-w-7xl px-6 w-full">
					<LeadGenBar
						className="my-12  -mt-48"
						// className="my-12 "
					/>
					<AboutSection />
					<PlanningInfographicSection />
				</div>
				<SurveyingInstrumentsSection />
				<DronesSection />

				<ActionCtaSection contentKey="actionCtaSurveyor" />

				<ServicesSection />
				<IndustriesWeServeSection />
				<div className="flex flex-col  w-full">
					<WhyChooseUsSection />

					<CoreExpertiseSection />

					<SurveyCostSection />
					<CoverageAreaSection />
					<FaqSection />
					<ActionCtaSection contentKey="actionCtaEngineer" />
					<KeyFactsSection />
					<CertificationsSection />
					<TrusteesSection />
					{/* <MetricsSection /> */}
				</div>

				<CtaSection />
			</div>
		</div>
	);
};


export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, [
		"common",
		"meta",
        "home"
	]);

	if (!i18nProps) return { notFound: true };

	const locale = getLocale(context);
	const lang: Lang = locale === "sw" ? "sw" : "en";
	const resolution = await resolveKeystaticPage("home", lang);

	return { props: { ...i18nProps, keystaticPage: resolution.status === "keystatic" ? resolution.page : null } };
};

export default Page;