"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { Pricing } from "@/components/sections/shared/Pricing";

interface CostContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	factorsTitle?: string | null;
	factors?: string[] | null;
	influencesTitle?: string | null;
	influences?: string[] | null;
	priceRangeTitle?: string | null;
	priceRange?: string | null;
	priceRangeNote?: string | null;
}

/**
 * Topographical cost guidance — shared pricing section (content:
 * surveying/topographical-surveys:cost).
 */
export function TopographicalCostSection(): ReactElement | null {
	const { t } = useTranslation(["surveying/topographical-surveys"]);
	const section = t("surveying/topographical-surveys:cost", {
		returnObjects: true,
	}) as unknown as CostContent;

	return (
		<Pricing
			tag={section.tag ?? null}
			headline={section.headline}
			description={section.description ?? undefined}
			cards={[
				{ title: section.factorsTitle ?? null, items: section.factors ?? null },
				{ title: section.influencesTitle ?? null, items: section.influences ?? null },
			]}
			price={{
				label: section.priceRangeTitle ?? null,
				value: section.priceRange ?? null,
				note: section.priceRangeNote ?? null,
			}}
		/>
	);
}

export default TopographicalCostSection;

