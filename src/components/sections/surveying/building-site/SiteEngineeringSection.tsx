"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface EngineeringItem {
	title: string;
	description?: string | null;
}

interface EngineeringContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	items?: EngineeringItem[] | null;
}

const FALLBACK_ICONS = [
	"map-outline",
	"pencil-ruler",
	"cube-scan",
	"vector-polyline",
	"file-check-outline",
	"shovel",
];

interface SiteEngineeringSectionProps {
	/** Locale key suffix (legacy lookup). Unused when `data` is provided. */
	sectionKey?: string;
	data?: EngineeringContent | null;
	id?: string;
}

/**
 * Site-engineering surveys — shared indexed card grid with header-row number
 * badges (content: surveying/building-site-surveys:siteEngineeringSurveys).
 * M11: additive `data` prop for Keystatic-owned content (omitted = legacy `t()`).
 */
export function SiteEngineeringSection({ sectionKey, data, id }: SiteEngineeringSectionProps): ReactElement | null {
	const { t } = useTranslation(["surveying/building-site-surveys"]);
	const legacy = sectionKey
		? (t(`surveying/building-site-surveys:${sectionKey}`, {
				returnObjects: true,
			}) as unknown as EngineeringContent)
		: null;
	const section = (data ?? legacy) as EngineeringContent | null;
	const items = (Array.isArray(section?.items) ? section.items : []) as CardItem[];

	if (items.length === 0) return null;

	return (
		<CardGrid
			id={id}
			tag={section?.tag ?? null}
			headline={section?.headline ?? ""}
			description={section?.description ?? undefined}
			items={items}
			columns={3}
			headerAlign="left"
			indexed
			fallbackIcons={FALLBACK_ICONS}
			card={{
				headerRow: true,
				indexBadgePosition: "end",
				indexBadgeClassName:
					"text-sm font-semibold tabular-nums tracking-[0.14em] text-on-surface/30",
			}}
		/>
	);
}

export default SiteEngineeringSection;
