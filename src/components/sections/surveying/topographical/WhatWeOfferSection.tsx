"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface OfferContent {
	tag?: string | null;
	headline: string;
	items?: CardItem[] | null;
}

const FALLBACK_ICONS = [
	"ruler-square-compass",
	"layers-triple",
	"earth",
];

/**
 * What-we-offer services — shared icon + numbered card grid (content:
 * surveying/topographical-surveys:whatWeOffer).
 */
export function WhatWeOfferSection(): ReactElement | null {
	const { t } = useTranslation(["surveying/topographical-surveys"]);
	const section = t("surveying/topographical-surveys:whatWeOffer", {
		returnObjects: true,
	}) as unknown as OfferContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<CardGrid
			tag={section.tag ?? null}
			headline={section.headline}
			items={items}
			columns={3}
			headerAlign="left"
			indexed
			fallbackIcons={FALLBACK_ICONS}
			card={{
				density: "roomy",
				iconSize: "lg",
				headerRow: true,
				indexBadgePosition: "end",
				indexBadgeClassName:
					"text-sm font-semibold tabular-nums tracking-[0.14em] text-on-surface/30",
			}}
		/>
	);
}

export default WhatWeOfferSection;
