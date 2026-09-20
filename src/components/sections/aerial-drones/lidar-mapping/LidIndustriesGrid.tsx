"use client";

import type { ReactElement } from "react";
import { CardGrid, type CardItem } from "@/components/sections/shared";

interface LidarCardsContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: CardItem[];
}

/**
 * Indexed industries grid for the `lidIndustries` unique section (M11
 * batch 19). M13 batch 7 retired the `IndustriesWeServeSection` wrapper,
 * so this component carries the same presentation literals — the shared
 * `CardGrid` with columns 4, `indexed` numbering, surface tone. `data`
 * (M9 additive-`data` precedent): the Keystatic-owned content; omitted =
 * legacy `t()` render. Renders nothing without items (legacy guard).
 */
export function LidIndustriesGrid({ data }: { data?: LidarCardsContent | null }): ReactElement | null {
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
			indexed
			tone="surface"
		/>
	);
}

export default LidIndustriesGrid;
