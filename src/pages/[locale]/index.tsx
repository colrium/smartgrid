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
 * Sections migrated to Keystatic in legacy page order (see the `home`
 * mapping in `scripts/migrate-locale-to-keystatic.mjs`): homeHero,
 * leadGenBar, about, planningInfographic, surveyingInstruments, homeDrones,
 * actionCtaSurveyor ctaBand, services, industriesWeServe cardGrid,
 * whyChooseUs, coreExpertise, surveyCost, coverageArea, faq,
 * actionCtaEngineer ctaBand, keyFacts, certifications, trustees,
 * defaultCta ctaBand (M12, 2026-09-18 — entry order IS page order).
 * The Keystatic branch destructures them once into named slots in entry
 * order (`hero`, `leadGenBar`, … — no index literals) and places each slot
 * at its legacy position instead of one whole PageBuilderDocument, because
 * route-level layout chrome (centering divs, the `-mt-48` overlap) lives
 * outside the registry. If an edit changes the section COUNT, the route
 * falls back to legacy rather than misplacing sections — keep this in sync
 * with the mapping.
 *
 * `leadGenBar` keeps its route-level positioning (`-mt-48` overlap) via
 * `cloneElement`: the registry stores content only, never `className`.
 */
const KEYSTATIC_SECTION_COUNT = 19;

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
	// Migration source switch (M3/M7): Keystatic owns the nineteen migrated
	// sections only when the slug is allowlisted via `KEYSTATIC_PAGES` and the
	// entry is published. Otherwise the legacy locale-JSON implementation
	// renders unchanged.
	const sections = keystaticPage ? orderedSections(keystaticPage) : null;
    
	if (keystaticPage && sections) {
		const locale = keystaticPage.locale;
        
		// M12: entry order IS page order — destructure once into named
		// slots, no index literals. Positions below mirror the legacy
		// branch; the count guard in `orderedSections` keeps a mismatch
		// on legacy.
		const [
			hero,
			leadGenBar,
			aboutSection,
			planning,
			instruments,
			drones,
			surveyorCta,
			servicesSection,
			industries,
			whyChoose,
			coreExpertise,
			surveyCost,
			coverageArea,
			faqSection,
			engineerCta,
			keyFacts,
			certifications,
			trustees,
			defaultCta,
		] = sections.map((section) => renderSection(section.id, section.value, locale, section.key));
		return (
			<div className="relative ">
				<PageHead pageName="home" />
				<div className="flex flex-col min-h-screen" data-keystatic-page={keystaticPage.slug}>
					{hero}
					<div className="flex flex-col mx-auto max-w-7xl px-6 w-full">
						{cloneElement(leadGenBar as ReactElement<{ className?: string }>, {
							className: "my-12  -mt-48",
						})}
						{aboutSection}
						{planning}
					</div>
					{instruments}
					{drones}

					{surveyorCta}

					{servicesSection}
					{industries}
					<div className="flex flex-col  w-full">
						{whyChoose}

						{coreExpertise}

						{surveyCost}
						{coverageArea}
						{faqSection}
						{engineerCta}
						{keyFacts}
						{certifications}
						{trustees}
						{/* <MetricsSection /> */}
					</div>

					{defaultCta}
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