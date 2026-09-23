"use client";

import type { ReactElement } from "react";
import { CardGrid, type CardItem } from "@/components/sections/shared";

interface OfferContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items?: CardItem[] | null;
}

const FALLBACK_ICONS = [
	"map-outline",
	"office-building-outline",
	"leaf",
	"sprout",
	"cube-outline",
	"road-variant",
	"terrain",
	"chart-box-outline",
	"alert-octagon-outline",
];

/**
 * What-we-offer grid for the `lqWhatWeOffer` unique section (M11 batch 17).
 * M13 batch 7 retired the `WhatWeOfferSection` wrapper, so this component
 * carries the same presentation literals — columns 3, centered align,
 * surface tone, roomy density with circle/lg icon shapes, and the
 * hardcoded `fallbackIcons` array — and renders the shared `CardGrid`
 * directly; items flow straight through (locale items carry
 * `popupContent` for the card modals; icons come from the fallback array).
 * `data` (M9 additive-`data` precedent): the Keystatic-owned content;
 * omitted = legacy `t()` render.
 */
export function LqWhatWeOfferCard({ data }: { data?: OfferContent | null }): ReactElement | null {
	const section = data;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<CardGrid
			tag={section?.tag}
			headline={section?.headline ?? ""}
			items={items}
			columns={3}
			align="center"
			tone="surface"
			card={{ density: "roomy", iconShape: "circle", iconSize: "lg" }}
			fallbackIcons={FALLBACK_ICONS}
		/>
	);
}

export default LqWhatWeOfferCard;
