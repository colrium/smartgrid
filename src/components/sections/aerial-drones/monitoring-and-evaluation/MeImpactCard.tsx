"use client";

import type { ReactElement } from "react";
import { CardGrid, type CardItem } from "@/components/sections/shared";

interface ImpactContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items?: CardItem[] | null;
}

const FALLBACK_ICONS = ["water", "sprout", "home-flood"];

/**
 * Impact grid for the `meImpact` unique section (M11 batch 18). M13 batch
 * 7 retired the `ImpactSection` wrapper, so this component carries the
 * same presentation literals — columns 3, centered align, roomy density
 * with `iconShape: "xl"`, and the hardcoded `fallbackIcons` array — and
 * renders the shared `CardGrid` directly. `data` (M9 additive-`data`
 * precedent): the Keystatic-owned content; omitted = legacy `t()` render.
 */
export function MeImpactCard({ data }: { data?: ImpactContent | null }): ReactElement | null {
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
			align="center"
			card={{ density: "roomy", iconShape: "xl" }}
			fallbackIcons={FALLBACK_ICONS}
		/>
	);
}

export default MeImpactCard;
