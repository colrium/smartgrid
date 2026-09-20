"use client";

import type { ReactElement } from "react";
import { CardGrid, type CardItem } from "@/components/sections/shared";

interface WhatWeDoContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items?: CardItem[] | null;
}

/**
 * Capabilities grid for the `solWhatWeDo` unique section (M11 batch 17).
 * M13 batch 7 retired the `WhatWeDoSection` wrapper, so this component
 * carries the same presentation literals — columns 4, centered align,
 * surface tone, `iconShape: "xl"` — and renders the shared `CardGrid`
 * directly. `data` (M9 additive-`data` precedent): the Keystatic-owned
 * content; omitted = legacy `t()` render.
 */
export function SolWhatWeDoCard({ data }: { data?: WhatWeDoContent | null }): ReactElement | null {
	const section = data;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<CardGrid
			tag={section?.tag}
			headline={section?.headline ?? ""}
			description={section?.description}
			items={items}
			columns={4}
			align="center"
			tone="surface"
			card={{ iconShape: "xl" }}
		/>
	);
}

export default SolWhatWeDoCard;
