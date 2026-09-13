"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid } from "@/components/sections/shared";

const NS = "aerial-drones/monitoring-and-evaluation";

interface OfferItem {
	label?: string;
	title?: string;
	image?: string | null;
}

interface WhatWeOfferContent {
	tag?: string | null;
	headline: string;
	description?: string;
	images?: string[] | null;
	items?: OfferItem[] | null;
}

export function WhatWeOfferSection(): ReactElement | null {
	const { t } = useTranslation([NS]);
	const section = t(`${NS}:whatWeOffer`, {
		returnObjects: true,
	}) as unknown as WhatWeOfferContent;
	const items = Array.isArray(section?.items) ? section.items : [];
	const leadImages = Array.isArray(section?.images) ? section.images : [];

	if (items.length === 0) return null;

	return (
		<CardGrid
			tag={section.tag}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={4}
			headerAlign="left"
			leadImages={leadImages.length > 0 ? leadImages : null}
			card={{ mediaPosition: "top", mediaAspect: "h-40" }}
		/>
	);
}

export default WhatWeOfferSection;