import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { useTranslation } from "@/hooks";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { PageBuilderDocument } from "@/components/keystatic/PageBuilderDocument";
import { Hero, type HeroContent } from "@/components/sections/shared/Hero";
import {
	WorkflowSection,
	type WorkflowPhaseStyles,
	type WorkflowSectionProps,
} from "@/components/sections/shared/WorkflowSection";
import { FinalCta, type FinalCtaAction } from "@/components/sections/shared/FinalCta";
import {
	PostHeroCtaSection,
	// IntroSection,
	WhenYouNeedSection,
	ProcessCtaSection,
	CostSection,
	TimelineSection,
	ComplianceSection,
	CaseStudySection,
} from "@/components/sections/surveying/cadastral";

type PageProps = {
	/** Keystatic page when the `cadastral-surveys` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

interface CadastralFinalCtaContent {
	tag?: string | null;
	headline: string;
	description?: string;
	actionsLabel?: string | null;
	actions?: FinalCtaAction[] | null;
}

/** Domain-specific chip styling: the default ACQUISITION icon is hydrographic (boat). */
const PHASE_STYLE_OVERRIDES: WorkflowPhaseStyles = {
	ACQUISITION: {
		chip: "border-purple-300/60 bg-purple-50 text-purple-700",
		icon: "satellite-variant",
	},
};

/**
 * All ten legacy sections are Keystatic-owned in page order (see the
 * `cadastral-surveys` mapping in `scripts/migrate-locale-to-keystatic.mjs`):
 * hero, cadastralPostHeroCta, cadastralWhenYouNeed, workflow,
 * cadastralProcessCta, cadastralCost, cadastralTimeline,
 * cadastralCompliance, cadastralCaseStudy, finalCta (M11 batch 12,
 * 2026-09-19 — entry order IS page order, so editors can add, remove, and
 * reorder sections freely; the M3 resolver taxonomy remains the only
 * fallback. M13 batch 2, 2026-09-20 — the single-shared-child wrappers
 * `CadastralHeroSection`, `ProcessFlowSection` and `FinalCtaSection` were
 * removed; the legacy branch below renders the shared `Hero`,
 * `WorkflowSection` (with the ACQUISITION override) and `FinalCta`
 * directly, and the entry uses the shared `hero`/`workflow`/`finalCta`
 * branches with content preserved).
 * `whatsABoundarySurvey` stays DORMANT (commented out of the
 * route — never migrated).
 */
const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	const { t } = useTranslation(["surveying/cadastral-surveys"]);
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

	const heroData = t("surveying/cadastral-surveys:hero", { returnObjects: true }) as unknown as HeroContent;
	const process = t("surveying/cadastral-surveys:process", {
		returnObjects: true,
	}) as unknown as WorkflowSectionProps;
	const finalCta = t("surveying/cadastral-surveys:finalCta", {
		returnObjects: true,
	}) as unknown as CadastralFinalCtaContent;

	return (
		<div className="relative">
			<PageHead pageName="cadastral-surveys" />
			<div className="flex flex-col min-h-screen">
				<Hero data={heroData} />
				<PostHeroCtaSection />
				{/* <IntroSection /> */}
				<WhenYouNeedSection />
				<WorkflowSection {...process} phaseStyles={PHASE_STYLE_OVERRIDES} />
				<ProcessCtaSection />
				<CostSection />
				<TimelineSection />
				<ComplianceSection />
				<CaseStudySection />
				{finalCta?.headline ? (
					<FinalCta
						tag={finalCta.tag}
						headline={finalCta.headline}
						description={finalCta.description}
						watermark="vector-square"
						actions={finalCta.actions ?? null}
						actionsLabel={finalCta.actionsLabel}
						columns={4}
						align="left"
					/>
				) : (
					<></>
				)}
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
