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

/**
 * `data` (M11 batch 18, 2026-09-20): Keystatic-owned content for the
 * `meWhatWeOffer` unique section. When provided, the locale lookup is
 * skipped; omitted = legacy `t()` render (bare callers untouched).
 */
export interface WhatWeOfferSectionProps {
	data?: WhatWeOfferContent | null;
}

export function WhatWeOfferSection({ data }: WhatWeOfferSectionProps = {}): ReactElement | null {
	const { t } = useTranslation([NS]);
	const section =
		data ??
		(t(`${NS}:whatWeOffer`, {
			returnObjects: true,
		}) as unknown as WhatWeOfferContent);
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