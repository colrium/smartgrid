"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface OfferContent {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	items?: CardItem[] | null;
}

export interface WhatWeOfferData {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
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
export function WhatWeOfferSection({ data }: { data?: WhatWeOfferData | null } = {}): ReactElement | null {
	const { t } = useTranslation(["surveying/topographical-surveys"]);
	// Keystatic-owned content when `data` is provided (M11
	// `topoWhatWeOffer` unique section); legacy locale strings otherwise.
	// Presentation (indexed cards, positional fallback icons) stays in the
	// wrapper — only strings are data.
	const section = (data ??
		(t("surveying/topographical-surveys:whatWeOffer", {
			returnObjects: true,
		}) as unknown as OfferContent)) as OfferContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<CardGrid
			tag={section.tag ?? null}
			headline={section.headline ?? ""}
			description={section.description ?? undefined}
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
