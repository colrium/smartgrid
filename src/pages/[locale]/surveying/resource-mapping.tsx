import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps, getLocale } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { useTranslation } from "@/hooks";
import { resolveKeystaticPage, type ResolvedKeystaticPage } from "@/lib/keystatic/resolvePage";
import { PageBuilderDocument } from "@/components/keystatic/PageBuilderDocument";
import { Hero, type HeroContent } from "@/components/sections/shared/Hero";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";
import { Deliverables } from "@/components/sections/Deliverables";
import { FinalCta, type FinalCtaAction } from "@/components/sections/shared/FinalCta";
import {
	WhatIsResourceMappingSection,
	TypesOfResourceMappingSection,
	ResourceMappingWorkflowSection,
	WhoUsesResourceMappingSection,
	ResourceMappingTechStackSection,
	DataAccuracySection,
	AgricultureSection,
	UtilitiesEnergySection,
	QuarryMiningSection,
	ConstructionCivilSection,
	EnvironmentalConservationSection,
	DisasterRiskReductionSection,
} from "@/components/sections/surveying/resource-mapping";

type PageProps = {
	/** Keystatic page when the `resource-mapping` slug is opted in; otherwise `null` (legacy). */
	keystaticPage: ResolvedKeystaticPage | null;
};

interface WhyStandOutContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	items?: CardItem[] | null;
}

interface RmFinalCtaContent {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	note?: string | null;
	actions?: FinalCtaAction[] | null;
}

/**
 * All sixteen legacy sections are Keystatic-owned in page order (see the
 * `resource-mapping` mapping in `scripts/migrate-locale-to-keystatic.mjs`):
 * hero, rmWhatIs, rmTypes, six rmSector variants, whyStandOut cardGrid,
 * rmWorkflow, deliverables, rmWhoUses, rmTechStack, rmDataAccuracy, finalCta
 * (M11 batch 9; M13 batch 9, 2026-09-20 — the single-shared-child wrappers
 * `ResourceMappingHeroSection`, `WhyStandOutSection`,
 * `ResourceMappingDeliverablesSection` and `FinalCtaSection` were removed;
 * the legacy branch below renders the shared `Hero`, `CardGrid`,
 * `Deliverables` and `FinalCta` directly, and the entry uses the shared
 * `hero`/`cardGrid`/`deliverables`/`finalCta` branches with content
 * preserved. `rmWorkflow` stays unique — its multi-phase
 * ACQUISITION/PROCESSING/DELIVERY custom styles have no shared-contract
 * home per the M13 batch-8 rule refinement).
 */
const Page: NextPage<PageProps> = ({ keystaticPage }) => {
	const { t } = useTranslation(["surveying/resource-mapping"]);
	// Migration source switch (M3/M7, completed M11 batch 9, flexible since
	// M12): Keystatic owns the whole page when the slug is allowlisted via
	// `KEYSTATIC_PAGES` and the entry is published. Otherwise the legacy
	// locale-JSON implementation renders unchanged.
	if (keystaticPage) {
		return (
			<div className="relative">
				<PageHead pageName="resource-mapping" />
				<PageBuilderDocument page={keystaticPage} />
			</div>
		);
	}

	const heroData = t("surveying/resource-mapping:hero", { returnObjects: true }) as unknown as HeroContent;
	const whyStandOut = t("surveying/resource-mapping:whySmartGridStandsOut", {
		returnObjects: true,
	}) as unknown as WhyStandOutContent;
	const finalCta = t("surveying/resource-mapping:finalCta", {
		returnObjects: true,
	}) as unknown as RmFinalCtaContent;

	return (
		<div className="relative">
			<PageHead pageName="resource-mapping" />
			<div className="flex flex-col min-h-screen">
				<Hero data={heroData} />
				<WhatIsResourceMappingSection />
				<TypesOfResourceMappingSection />
				<AgricultureSection />
				<UtilitiesEnergySection />
				<QuarryMiningSection />
				<ConstructionCivilSection />
				<EnvironmentalConservationSection />
				<DisasterRiskReductionSection />
				{(Array.isArray(whyStandOut?.items) ? whyStandOut.items : []).length === 0 ? null : (
					<CardGrid
						tag={whyStandOut.tag ?? null}
						headline={whyStandOut.headline}
						description={whyStandOut.description}
						items={whyStandOut.items as CardItem[]}
						columns={4}
						tone="surface"
						align="center"
					/>
				)}
				<ResourceMappingWorkflowSection />
				<Deliverables ns="surveying/resource-mapping" className="bg-surface" />
				<WhoUsesResourceMappingSection />
				<ResourceMappingTechStackSection />
				<DataAccuracySection />
				{finalCta?.headline ? (
					<FinalCta
						id="get-started"
						tag={finalCta.tag ?? null}
						headline={finalCta.headline}
						description={finalCta.description ?? undefined}
						descriptionTone="accent"
						note={finalCta.note ?? undefined}
						watermark="map-marker-radius"
						actions={(finalCta.actions ?? []).map((action) => ({
							icon: action.icon ?? null,
							label: action.label ?? "",
							description: action.description ?? undefined,
							href: action.href ?? "",
						}))}
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
	const i18nProps = await getI18nProps(context, ["common", "meta", "surveying/resource-mapping"]);

	if (!i18nProps) return { notFound: true };

	const locale = getLocale(context);
	const lang: Lang = locale === "sw" ? "sw" : "en";
	const resolution = await resolveKeystaticPage("resource-mapping", lang);

	return { props: { ...i18nProps, keystaticPage: resolution.status === "keystatic" ? resolution.page : null } };
};

export default Page;
