"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface DetailedContent {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	items?: CardItem[] | null;
}

export interface DetailedSurveysData {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	items?: CardItem[] | null;
}

/**
 * Detailed-surveys capability cards — shared media-top card grid with
 * numbered glass chips (content:
 * surveying/topographical-surveys:detailedTopographicalSurveys).
 */
export function DetailedSurveysSection({ data }: { data?: DetailedSurveysData | null } = {}): ReactElement | null {
	const { t } = useTranslation(["surveying/topographical-surveys"]);
	// Keystatic-owned content when `data` is provided (M11
	// `topoDetailedSurveys` unique section); legacy locale strings
	// otherwise. Presentation (media badges, paper variant) stays in the
	// wrapper — only strings and image paths are data.
	const section = (data ??
		(t("surveying/topographical-surveys:detailedTopographicalSurveys", {
			returnObjects: true,
		}) as unknown as DetailedContent)) as DetailedContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<CardGrid
			tag={section.tag ?? null}
			headline={section.headline ?? ""}
			description={section.description ?? undefined}
			items={items}
			columns={4}
			mediaBadged
			card={{ variant: "paper" }}
		/>
	);
}

export default DetailedSurveysSection;
