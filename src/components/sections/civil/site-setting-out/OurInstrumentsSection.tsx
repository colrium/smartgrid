"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared";

interface InstrumentsContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	items?: CardItem[] | null;
}

/**
 * Site setting-out instruments — shared full-bleed image card grid with
 * numbered glass chips (content: civil/site-setting-out:ourInstruments).
 */
export function OurInstrumentsSection(): ReactElement | null {
	const { t } = useTranslation(["civil/site-setting-out"]);
	const section = t("civil/site-setting-out:ourInstruments", {
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
			columns={3}
			tone="surface"
			mediaBadged
			card={{ mediaPosition: "background", mediaAspect: "h-64 sm:h-72" }}
		/>
	);
}

export default OurInstrumentsSection;
