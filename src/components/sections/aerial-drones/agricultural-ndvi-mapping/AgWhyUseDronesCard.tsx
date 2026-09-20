"use client";

import type { ReactElement } from "react";
import { SplitMedia, type CardItem } from "@/components/sections/shared";

interface WhyUseDronesContent {
	headline: string;
	description?: string | null;
	image?: string | null;
	items?: CardItem[] | null;
}

/**
 * Why-use-drones section for the `agWhyUseDrones` unique section (M11
 * batch 19). M13 batch 7 retired the `WhyUseDronesSection` wrapper, so
 * this component carries the same presentation literals — the shared
 * `SplitMedia` (default imagePosition/tone/aspect) with its below-the-split
 * card row: columns 4, left align, comfortable density with xl/sm icon
 * shapes. `data` (M9 additive-`data` precedent): the Keystatic-owned
 * content; omitted = legacy `t()` render.
 */
export function AgWhyUseDronesCard({ data }: { data?: WhyUseDronesContent | null }): ReactElement | null {
	const section = data;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (!section?.headline) return null;

	return (
		<SplitMedia
			data={section}
			columns={4}
			align="left"
			items={items}
			card={{ density: "comfortable", iconShape: "xl", iconSize: "sm" }}
		/>
	);
}

export default AgWhyUseDronesCard;
