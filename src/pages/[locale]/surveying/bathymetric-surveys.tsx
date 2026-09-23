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
import {
	WhyBathymetricCriticalSection,
	EquipmentTechnologySection,
	WhySmartGridBathymetricSection,
	TechnicalLimitationsSection,
	BathymetricBeforeAfterSection,
	DamsLakesSection,
	ApplicationsSection,
} from "@/components/sections/surveying/bathymetric-surveys";

type PageProps = {
	/** Keystatic page when the `bathymetric-surveys` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

interface WhatIsContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	image?: string | null;
}

interface BathyWorkflowContent {
	tag?: string | null;
	headline: string;
	description?: string;
	outcome?: string | null;
	steps?: WorkflowStep[] | null;
	ctaNote?: string | null;
	cta?: WorkflowCta | null;
}

interface BathyFinalCtaContent {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	note?: string | null;
	actions?: FinalCtaAction[] | null;
};

/**
 * All twelve legacy sections are Keystatic-owned in page order (see the
 * `bathymetric-surveys` mapping in
 * `scripts/migrate-locale-to-keystatic.mjs`): hero, whatIs, whyCritical,
 * workflow, bathyEquipment, deliverables, whySmartGrid,
 * bathyLimitations, bathyDamsLakes, bathyApplications, bathyBeforeAfter,
 * finalCta (M11 batch 8; converted to `PageBuilderDocument` in M12
 * batch 10, 2026-09-19 — entry order IS page order, so editors can add,
 * remove, and reorder sections freely; the M3 resolver taxonomy remains the
 * only fallback. M13 batch 8, 2026-09-20 — the single-shared-child wrappers
 * `BathymetricHeroSection`, `WhatIsBathymetricSection`,
 * `BathymetricWorkflowSection`, `BathymetricDeliverablesSection` and
 * `FinalCtaSection` were removed; the legacy branch below renders the shared
 * `Hero`, `SplitMedia`, `WorkflowSection`, `Deliverables` and `FinalCta`
 * directly, and the entry uses the shared
 * `hero`/`splitMedia`/`workflow`/`deliverables`/`finalCta` branches with
 * content preserved).
 */
const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	// Migration source switch (M3/M7, completed M11 batch 8, flexible since
	// M12 batch 10): Keystatic owns the whole page when the slug is
	// allowlisted via `KEYSTATIC_PAGES` and the entry is published.
	// Otherwise the legacy locale-JSON implementation renders unchanged.
	const { t } = useTranslation(["surveying/bathymetric-surveys"]);
	if (keystaticPage) {
		return (
			<div className="relative">
				<PageHead pageName="bathymetric-surveys" />
				<PageBuilderDocument page={keystaticPage} />
			</div>
		);
	}

	const heroData = t("surveying/bathymetric-surveys:hero", { returnObjects: true }) as unknown as HeroContent;
	const whatIs = t("surveying/bathymetric-surveys:whatIsBathymetricSurveys", {
		returnObjects: true,
	}) as unknown as WhatIsContent;
	const workflow = t("surveying/bathymetric-surveys:bathymetricWorkflow", {
		returnObjects: true,
	}) as unknown as BathyWorkflowContent;
	const finalCta = t("surveying/bathymetric-surveys:finalCta", {
		returnObjects: true,
	}) as unknown as BathyFinalCtaContent;

	return (
		<div className="relative">
			<PageHead pageName="bathymetric-surveys" />
			<div className="flex flex-col min-h-screen">
				<Hero data={heroData} />
				{whatIs?.headline ? (
					<SplitMedia
						data={{
							tag: whatIs.tag ?? null,
							headline: whatIs.headline,
							description: whatIs.description ?? null,
							image: whatIs.image ?? null,
						}}
						imagePosition="right"
						tone="surface"
					/>
				) : null}
				<WhyBathymetricCriticalSection />
				<WorkflowSection
					tag={workflow.tag}
					headline={workflow.headline}
					description={workflow.description}
					steps={workflow.steps}
					outcome={workflow.outcome}
					ctaNote={workflow.ctaNote}
					cta={workflow.cta}
				/>
				<EquipmentTechnologySection />
				<Deliverables ns="surveying/bathymetric-surveys" className="bg-surface" />
				<WhySmartGridBathymetricSection />
				<TechnicalLimitationsSection />
				<DamsLakesSection />
				<ApplicationsSection />
				<BathymetricBeforeAfterSection />
				{finalCta?.headline ? (
					<FinalCta
						id="get-started"
						tag={finalCta.tag ?? null}
						headline={finalCta.headline}
						description={finalCta.description ?? undefined}
						descriptionTone="accent"
						note={finalCta.note ?? undefined}
						watermark="water"
						actions={(finalCta.actions ?? []) as FinalCtaAction[]}
						actionIconFallback="email-outline"
						columns={3}
					/>
				) : (
					<></>
				)}
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, ["common", "meta", "surveying/bathymetric-surveys"]);

	if (!i18nProps) return { notFound: true };

	const locale = getLocale(context);
	const lang: Lang = locale === "sw" ? "sw" : "en";
	const resolution = await resolveKeystaticPage("bathymetric-surveys", lang);

	return { props: { ...i18nProps, keystaticPage: resolution.status === "keystatic" ? resolution.page : null } };
};

export default Page;
