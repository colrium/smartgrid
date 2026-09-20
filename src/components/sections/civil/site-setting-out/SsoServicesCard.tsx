"use client";

import type { ReactElement } from "react";
import { CardGrid, type CardItem } from "@/components/sections/shared";

interface ServicesContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: { title: string; description: string }[];
}

/**
 * Indexed services grid for the `ssoServices` unique section (M11 batch
 * 16). M13 batch 6 retired the `OurServicesSection` wrapper, so this
 * component carries the same presentation literals — columns 3, left
 * header, indexed numbering — and renders the shared `CardGrid` directly.
 * `data` (M9 additive-`data` precedent): the Keystatic-owned content;
 * omitted = legacy `t()` render.
 */
export function SsoServicesCard({ data }: { data?: ServicesContent | null }): ReactElement | null {
	const section = data;
	const items: CardItem[] = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<CardGrid
			tag={section?.tag}
			headline={section?.headline ?? ""}
			description={section?.description}
			items={items}
			columns={3}
			headerAlign="left"
			indexed
		/>
	);
}

export default SsoServicesCard;
