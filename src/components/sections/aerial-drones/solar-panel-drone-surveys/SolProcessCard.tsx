"use client";

import type { ReactElement } from "react";
import { CardGrid, type CardItem } from "@/components/sections/shared";

interface ProcessContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items?: CardItem[] | null;
}

/**
 * Drone-integration process grid for the `solProcess` unique section (M11
 * batch 17). M13 batch 7 retired the `DroneIntegrationProcessSection`
 * wrapper, so this component carries the same presentation literals —
 * columns 3, headerRow, indexed numbering, comfortable density with
 * end-positioned index badges — and renders the shared `CardGrid` directly.
 * `data` (M9 additive-`data` precedent): the Keystatic-owned content;
 * omitted = legacy `t()` render.
 */
export function SolProcessCard({ data }: { data?: ProcessContent | null }): ReactElement | null {
	const section = data;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<CardGrid
			tag={section?.tag}
			headline={section?.headline ?? ""}
			description={section?.description}
			items={items}
			columns={3}
			headerRow
			indexed
			card={{
				density: "comfortable",
				iconShape: "xl",
				iconSize: "sm",
				indexBadgePosition: "end",
				indexBadgeClassName:
					"h-9 w-9 rounded-full bg-primary/10 text-primary text-sm transition-colors duration-300 group-hover:bg-primary/20",
			}}
		/>
	);
}

export default SolProcessCard;
