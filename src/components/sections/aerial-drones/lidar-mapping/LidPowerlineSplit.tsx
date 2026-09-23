"use client";

import type { ReactElement } from "react";
import { SplitMedia, type SplitMediaContent } from "@/components/sections/shared/SplitMedia";

/**
 * Powerline split-media band for the `lidPowerline` unique section (M11
 * batch 19). M13 batch 7 retired the `LidarPowerlineSection` wrapper, so
 * this component carries the same presentation literals — the shared
 * `SplitMedia` with the route's inline `mediaAspect="aspect-16/10"` band
 * (defaults for position/tone). `data` (M9 additive-`data` precedent):
 * the Keystatic-owned content; omitted = legacy `t()` render.
 */
export function LidPowerlineSplit({ data }: { data?: SplitMediaContent | null }): ReactElement | null {
	const section = data;

	if (!section?.headline) return null;

	return <SplitMedia data={section} mediaAspect="aspect-16/10" />;
}

export default LidPowerlineSplit;
