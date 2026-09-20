"use client";

import type { ReactElement } from "react";
import { CardGrid, type CardItem } from "@/components/sections/shared";

interface WhyDronesContent {
	tag?: string | null;
	headline: string;
	items?: CardItem[] | null;
}

const FALLBACK_ICONS = ["vector-triangle", "speedometer", "leaf", "layers-triple"];

/**
 * Why-use-drones grid for the `abWhyUseDrones` unique section (M11 batch
 * 18). M13 batch 7 retired the `WhyUseDronesSection` wrapper, so this
 * component carries the same presentation literals — columns 2, centered
 * align, surface tone, roomy density with xl/lg icon shapes, and the
 * hardcoded `fallbackIcons` array — and renders the shared `CardGrid`
 * directly. `data` (M9 additive-`data` precedent): the Keystatic-owned
 * content; omitted = legacy `t()` render.
 */
export function AbWhyUseDronesCard({ data }: { data?: WhyDronesContent | null }): ReactElement | null {
	const section = data;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<CardGrid
			tag={section?.tag}
			headline={section?.headline ?? ""}
			items={items}
			columns={2}
			align="center"
			tone="surface"
			card={{ density: "roomy", iconShape: "xl", iconSize: "lg" }}
			fallbackIcons={FALLBACK_ICONS}
		/>
	);
}

export default AbWhyUseDronesCard;
