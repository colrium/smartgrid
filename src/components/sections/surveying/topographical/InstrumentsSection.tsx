"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface InstrumentsContent {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	items?: CardItem[] | null;
}

export interface TopoInstrumentsData {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	items?: CardItem[] | null;
}

/**
 * Surveying instruments — shared full-bleed image card grid with numbered
 * glass chips (content: surveying/topographical-surveys:surveyingInstruments).
 */
export function InstrumentsSection({ data }: { data?: TopoInstrumentsData | null } = {}): ReactElement | null {
	const { t } = useTranslation(["surveying/topographical-surveys"]);
	// Keystatic-owned content when `data` is provided (M11 `topoInstruments`
	// unique section); legacy locale strings otherwise. Presentation
	// (background media cards) stays in the wrapper.
	const section = (data ??
		(t("surveying/topographical-surveys:surveyingInstruments", {
			returnObjects: true,
		}) as unknown as InstrumentsContent)) as InstrumentsContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<CardGrid
			tag={section.tag ?? null}
			headline={section.headline ?? ""}
			description={section.description ?? undefined}
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
