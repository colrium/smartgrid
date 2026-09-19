"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface WhyItem {
	icon?: string | null;
	title: string;
}

interface WhySmartgridContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	items?: WhyItem[] | null;
}

export interface GisWhySmartgridData {
	tag?: string | null;
	headline: string;
	description?: string | null;
	items?: WhyItem[] | null;
}

/**
 * Why-SmartGrid GIS differentiators — shared icon card grid (content:
 * surveying/gis-mapping:whySmartgrid).
 */
export function GisWhySmartgridSection({ data }: { data?: GisWhySmartgridData | null } = {}): ReactElement | null {
	const { t } = useTranslation(["surveying/gis-mapping"]);
	// Keystatic-owned content when `data` is provided (M11 `gisWhySmartgrid`
	// unique section — tone + `fallbackIcons` are outside the shared
	// `cardGrid` contract); legacy locale strings otherwise.
	const section = (data ??
		(t("surveying/gis-mapping:whySmartgrid", {
			returnObjects: true,
		}) as unknown as WhySmartgridContent)) as WhySmartgridContent;
	const items = (Array.isArray(section?.items) ? section.items : []) as CardItem[];

	if (items.length === 0) return null;

	return (
		<CardGrid
			tag={section.tag ?? null}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={3}
			tone="surface"
			fallbackIcons={["check-decagram"]}
		/>
	);
}

export default GisWhySmartgridSection;
