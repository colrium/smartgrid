import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { useTranslation } from "@/hooks";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { PageBuilderDocument } from "@/components/keystatic/PageBuilderDocument";
import { Hero, type HeroContent } from "@/components/sections/shared/Hero";
import { SplitMedia } from "@/components/sections/shared/SplitMedia";
import {
	WorkflowSection,
	type WorkflowCta,
	type WorkflowStep,
} from "@/components/sections/shared/WorkflowSection";
import { Deliverables } from "@/components/sections/Deliverables";
import { FinalCta, type FinalCtaAction } from "@/components/sections/shared/FinalCta";
import IntroSection from "@/components/sections/surveying/aerial/IntroSection";
import WhyDroneSurveysSection from "@/components/sections/surveying/aerial/WhyDroneSurveysSection";
import AerialServicesSection from "@/components/sections/surveying/aerial/AerialServicesSection";
import AerialSurveyingSection from "@/components/sections/surveying/aerial/AerialSurveyingSection";
import AerialIndustriesSection from "@/components/sections/surveying/aerial/AerialIndustriesSection";
import IndustryCtaSection from "@/components/sections/surveying/aerial/IndustryCtaSection";
import ProjectsSection from "@/components/sections/surveying/aerial/ProjectsSection";
import TechStackSection from "@/components/sections/surveying/aerial/TechStackSection";
import CapabilityCtaSection from "@/components/sections/surveying/aerial/CapabilityCtaSection";
import AdditionalServicesSection from "@/components/sections/surveying/aerial/AdditionalServicesSection";

type PageProps = {
	/** Keystatic page when the `aerial-surveys` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

interface PrecisionContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	image?: string | null;
}

interface AerialWorkflowContent {
	tag?: string | null;
	headline: string;
	description?: string;
	outcomeLabel?: string | null;
	steps?: WorkflowStep[] | null;
	ctaNote?: string | null;
	cta?: WorkflowCta | null;
}

interface AerialFinalCtaContent {
	tag?: string | null;
	headline: string;
	description?: string;
	actionsLabel?: string | null;
	actions?: FinalCtaAction[] | null;
}

/**
 * All fifteen legacy sections are Keystatic-owned in page order (see the
 * `aerial-surveys` mapping in `scripts/migrate-locale-to-keystatic.mjs`):
 * hero, aerialIntro, aerialWhyDrones, aerialServices, precision
 * splitMedia, workflow, aerialSurveyingGrid, deliverables,
 * aerialIndustries, aerialIndustryCta, aerialProjects, aerialTechStack,
 * aerialCapabilityCta, aerialAdditionalServices, finalCta (M11 batch
 * 11, 2026-09-19 — entry order IS page order, so editors can add, remove,
 * and reorder sections freely; the M3 resolver taxonomy remains the only
 * fallback. M13 batch 1, 2026-09-20 — the single-shared-child wrappers
 * `AerialHeroSection`, `PrecisionSection`, `AerialWorkflowSection`,
 * `DeliverablesSection` and `AerialFinalCtaSection` were removed; the
 * legacy branch below renders the shared `Hero`, `SplitMedia`,
 * `WorkflowSection`, `Deliverables` and `FinalCta` directly, and the entry
 * uses the shared `hero`/`splitMedia`/`workflow`/`deliverables`/`finalCta`
 * branches with content preserved).
 */
const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	const { t } = useTranslation(["surveying/aerial-surveys"]);
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

	const heroData = t("surveying/aerial-surveys:hero", { returnObjects: true }) as unknown as HeroContent;
	const precision = t("surveying/aerial-surveys:precision", {
		returnObjects: true,
	}) as unknown as PrecisionContent;
	const workflow = t("surveying/aerial-surveys:workflow", {
		returnObjects: true,
	}) as unknown as AerialWorkflowContent;
	const finalCta = t("surveying/aerial-surveys:finalCta", {
		returnObjects: true,
	}) as unknown as AerialFinalCtaContent;

	return (
		<div className="relative">
			<PageHead pageName="aerial-surveys" />
			<div className="flex flex-col min-h-screen">
				<Hero data={heroData} />
				<IntroSection />
				<WhyDroneSurveysSection />
				<AerialServicesSection />
				{precision?.headline ? (
					<SplitMedia
						data={{
							tag: precision.tag ?? null,
							headline: precision.headline,
							description: precision.description ?? null,
							image: precision.image ?? null,
						}}
						imagePosition="right"
						tone="surface"
					/>
				) : null}
				<WorkflowSection
					tag={workflow.tag}
					headline={workflow.headline}
					description={workflow.description}
					steps={workflow.steps}
					outcome={workflow.outcomeLabel}
					ctaNote={workflow.ctaNote}
					cta={workflow.cta}
				/>
				<AerialSurveyingSection />
				<Deliverables ns="surveying/aerial-surveys" className="bg-surface" />
				<AerialIndustriesSection />
				<IndustryCtaSection />
				<ProjectsSection />
				<TechStackSection />
				<CapabilityCtaSection />
				<AdditionalServicesSection />
				{finalCta?.headline ? (
					<FinalCta
						tag={finalCta.tag}
						headline={finalCta.headline}
						description={finalCta.description}
						watermark="drone"
						actions={finalCta.actions ?? null}
						actionsLabel={finalCta.actionsLabel}
						columns={4}
					/>
				) : (
					<></>
				)}
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
