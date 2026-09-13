"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface InstrumentsContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	items?: CardItem[] | null;
}

/**
 * Surveying instruments — shared full-bleed image card grid with numbered
 * glass chips (content: surveying/topographical-surveys:surveyingInstruments).
 */
export function InstrumentsSection(): ReactElement | null {
	const { t } = useTranslation(["surveying/topographical-surveys"]);
	const section = t("surveying/topographical-surveys:surveyingInstruments", {
		returnObjects: true,
	}) as unknown as InstrumentsContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<CardGrid
			tag={section.tag ?? null}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={4}
			headerAlign="left"
			tone="surface"
			mediaBadged
			card={{ mediaPosition: "background", mediaAspect: "h-64 sm:h-80" }}
		/>
	);
}

export default InstrumentsSection;
