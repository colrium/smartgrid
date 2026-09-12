"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared";

const NS = "aerial-drones/landfill-quarry-drone-surveys";

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

export function WhatWeOfferSection(): ReactElement | null {
	const { t } = useTranslation([NS]);
	const section = t(`${NS}:whatWeOffer`, {
		returnObjects: true,
	}) as unknown as OfferContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<CardGrid
			tag={section.tag}
			headline={section.headline}
			items={items}
			columns={3}
			align="center"
			tone="surface"
			card={{ density: "roomy", iconShape: "circle", iconSize: "lg" }}
			fallbackIcons={FALLBACK_ICONS}
		/>
	);
}

export default WhatWeOfferSection;