"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface ImportanceItem {
	icon?: string | null;
	title: string;
	features?: string[] | null;
}

interface WhyGisCriticalContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	items?: ImportanceItem[] | null;
}

export interface GisImportanceData {
	tag?: string | null;
	headline: string;
	description?: string | null;
	items?: ImportanceItem[] | null;
}

/**
 * Why-GIS-critical capabilities — shared card grid; each item's feature list
 * renders as the card inset checklist (content:
 * surveying/gis-mapping:whyGisCritical).
 */
export function GisImportanceSection({ data }: { data?: GisImportanceData | null } = {}): ReactElement | null {
	const { t } = useTranslation(["surveying/gis-mapping"]);
	// Keystatic-owned content when `data` is provided (M11 `gisImportance`
	// unique section — columns/tone/fallbackIcons/leadGrid are outside the
	// shared `cardGrid` contract); legacy locale strings otherwise.
	const section = (data ??
		(t("surveying/gis-mapping:whyGisCritical", {
			returnObjects: true,
		}) as unknown as WhyGisCriticalContent)) as WhyGisCriticalContent;
	const rows = Array.isArray(section?.items) ? section.items : [];

	if (rows.length === 0) return null;

	const items: CardItem[] = rows.map((item) => ({
		icon: item.icon ?? null,
		title: item.title,
		subItems: (Array.isArray(item.features) ? item.features : []).map((feature) => ({ title: feature })),
	}));

	return (
		<CardGrid
			tag={section.tag ?? null}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={4}
			tone="surface"
			fallbackIcons={["map-marker-radius"]}
			classes={{
				leadGrid: "sm:grid-cols-1!"
			}}
		/>
	);
}

export default GisImportanceSection;
