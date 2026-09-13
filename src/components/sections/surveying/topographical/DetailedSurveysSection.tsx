"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface DetailedContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	items?: CardItem[] | null;
}

/**
 * Detailed-surveys capability cards — shared media-top card grid with
 * numbered glass chips (content:
 * surveying/topographical-surveys:detailedTopographicalSurveys).
 */
export function DetailedSurveysSection(): ReactElement | null {
	const { t } = useTranslation(["surveying/topographical-surveys"]);
	const section = t("surveying/topographical-surveys:detailedTopographicalSurveys", {
		returnObjects: true,
	}) as unknown as DetailedContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<CardGrid
			tag={section.tag ?? null}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={4}
			mediaBadged
			card={{ variant: "paper" }}
		/>
	);
}

export default DetailedSurveysSection;
