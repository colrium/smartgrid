"use client";

import type { ReactElement } from "react";
import { CardGrid, type CardItem } from "@/components/sections/shared";

interface InstrumentsContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	items?: CardItem[] | null;
}

/**
 * Media-badged instruments grid for the `ssoInstruments` unique section
 * (M11 batch 16). M13 batch 6 retired the `OurInstrumentsSection` wrapper,
 * so this component carries the same presentation literals — columns 3,
 * surface tone, mediaBadged glass chips, background media with the
 * h-64/sm:h-72 aspect — and renders the shared `CardGrid` directly. `data`
 * (M9 additive-`data` precedent): the Keystatic-owned content; omitted =
 * legacy `t()` render.
 */
export function SsoInstrumentsCard({ data }: { data?: InstrumentsContent | null }): ReactElement | null {
	const section = data;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<CardGrid
			tag={section?.tag ?? null}
			headline={section?.headline ?? ""}
			description={section?.description}
			items={items}
			columns={3}
			tone="surface"
			mediaBadged
			card={{ mediaPosition: "background", mediaAspect: "h-64 sm:h-72" }}
		/>
	);
}

export default SsoInstrumentsCard;
