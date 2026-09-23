"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface ServiceDetailItem {
	title?: string | null;
	description?: string | null;
}

interface ServicesDetailContent {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	items?: ServiceDetailItem[] | null;
}

export interface ServicesDetailData {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	items?: ServiceDetailItem[] | null;
}

const FALLBACK_ICONS = [
	"file-document-edit-outline",
	"ruler-square-compass",
	"vector-polygon",
	"cube-scan",
];

/**
 * Sectional-property services — shared indexed card grid with header-row
 * number badges (content:
 * surveying/sectional-properties:sectionalPropertyServices).
 */
export function ServicesDetailSection({ data, id }: { data?: ServicesDetailData | null; id?: string } = {}): ReactElement | null {
	const { t } = useTranslation(["surveying/sectional-properties"]);
	// Keystatic-owned content when `data` is provided (M11
	// `sectionalServicesDetail` unique section); legacy locale strings
	// otherwise. Presentation (indexed cards, positional fallback icons)
	// stays in the wrapper — only strings are data.
	const section = (data ??
		(t("surveying/sectional-properties:sectionalPropertyServices", {
			returnObjects: true,
		}) as unknown as ServicesDetailContent)) as ServicesDetailContent;
	const items = (Array.isArray(section?.items) ? section.items : []) as CardItem[];

	if (items.length === 0) return null;

	return (
		<CardGrid
			id={id}
			tag={section.tag ?? null}
			headline={section.headline ?? ""}
			description={section.description ?? undefined}
			items={items}
			columns={4}
			tone="surface"
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

export default ServicesDetailSection;
