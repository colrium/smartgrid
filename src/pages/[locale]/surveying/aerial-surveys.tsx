import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { PageBuilderDocument } from "@/components/keystatic/PageBuilderDocument";
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
 * All fifteen legacy sections are Keystatic-owned in page order (see the
 * `aerial-surveys` mapping in `scripts/migrate-locale-to-keystatic.mjs`):
 * hero, aerialIntro, aerialWhyDrones, aerialServices, precision
 * splitMedia, aerialWorkflow, aerialSurveyingGrid, deliverables,
 * aerialIndustries, aerialIndustryCta, aerialProjects, aerialTechStack,
 * aerialCapabilityCta, aerialAdditionalServices, aerialFinalCta (M11 batch
 * 11, 2026-09-19 — entry order IS page order, so editors can add, remove,
 * and reorder sections freely; the M3 resolver taxonomy remains the only
 * fallback).
 */
const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	// Migration source switch (M3/M7, completed M11 batch 11): Keystatic owns
	// the whole page when the slug is allowlisted via `KEYSTATIC_PAGES` and
	// the entry is published. Otherwise the legacy locale-JSON implementation
	// renders unchanged.
	if (keystaticPage) {
		return (
			<div className="relative">
				<PageHead pageName="aerial-surveys" />
				<PageBuilderDocument page={keystaticPage} />
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
