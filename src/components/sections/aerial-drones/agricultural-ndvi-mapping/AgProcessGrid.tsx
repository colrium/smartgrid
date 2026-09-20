"use client";

import type { ReactElement } from "react";
import { Process } from "@/components/sections/shared/Process";

interface ProcessContent {
	tag?: string | null;
	headline: string;
	items: { title: string; description: string }[];
}

/**
 * Process grid variant for the `agProcess` unique section (M11 batch 19).
 * M13 batch 7 retired the `ProcessSection` wrapper, so this component
 * carries the same presentation literals — the shared `Process` with
 * `layout="grid"` and `columns={3}` (both outside the shared `process`
 * contract, which is why M7 batch 15a skipped it). `data` (M9
 * additive-`data` precedent): the Keystatic-owned content; omitted =
 * legacy `t()` render.
 */
export function AgProcessGrid({ data }: { data?: ProcessContent | null }): ReactElement | null {
	const section = data;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return <Process tag={section?.tag} headline={section?.headline ?? ""} items={items} layout="grid" columns={3} />;
}

export default AgProcessGrid;
