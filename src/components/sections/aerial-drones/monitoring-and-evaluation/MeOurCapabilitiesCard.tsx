"use client";

import type { ReactElement } from "react";
import { CardGrid, type CardItem } from "@/components/sections/shared";

interface CapabilitiesContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items?: CardItem[] | null;
}

const FALLBACK_ICONS = ["terrain", "water-outline", "thermometer-lines", "swap-horizontal"];

/**
 * Capabilities grid for the `meOurCapabilities` unique section (M11 batch
 * 18). M13 batch 7 retired the `OurCapabilitiesSection` wrapper, so this
 * component carries the same presentation literals — columns 4, centered
 * align, surface tone, `iconShape: "xl"`, and the hardcoded
 * `fallbackIcons` array — and renders the shared `CardGrid` directly.
 * `data` (M9 additive-`data` precedent): the Keystatic-owned content;
 * omitted = legacy `t()` render.
 */
export function MeOurCapabilitiesCard({ data }: { data?: CapabilitiesContent | null }): ReactElement | null {
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
			fallbackIcons={FALLBACK_ICONS}
		/>
	);
}

export default MeOurCapabilitiesCard;
