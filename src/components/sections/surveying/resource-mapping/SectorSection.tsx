"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface SectorItem {
	icon?: string | null;
	title?: string | null;
	description?: string | null;
}

interface SectorContent {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	images?: (string | null)[] | null;
	items?: SectorItem[] | null;
}

export interface SectorData {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	images?: (string | null)[] | null;
	items?: SectorItem[] | null;
}

interface SectorSectionProps {
	/** Locale key suffix (legacy lookup). Unused when `data` is provided. */
	sectionKey?: string;
	/** Retired: the lead-image strip renders identically for every sector. */
	imagePosition?: "left" | "right";
	tone?: "default" | "surface";
	data?: SectorData | null;
	id?: string;
}

/**
 * Resource-mapping sector section (agriculture, energy, mining, civil,
 * environment, disaster) — shared card grid with a lead image strip above
 * the cards. The `imagePosition` presentation prop is retired: the strip
 * renders identically for every sector (content:
 * surveying/resource-mapping:<sectionKey>).
 */
export function SectorSection({ sectionKey, tone = "default", data, id }: SectorSectionProps): ReactElement | null {
	const { t } = useTranslation(["surveying/resource-mapping"]);
	// Keystatic-owned content when `data` is provided (M11 `rmSector`
	// unique section, one branch per sector in the entry); legacy
	// `surveying/resource-mapping:<sectionKey>` locale strings otherwise.
	const legacy = sectionKey
		? (t(`surveying/resource-mapping:${sectionKey}`, {
				returnObjects: true,
			}) as unknown as SectorContent)
		: null;
	const section = (data ?? legacy) as SectorContent | null;
	const items = (Array.isArray(section?.items) ? section.items : []) as CardItem[];
	const images = (Array.isArray(section?.images) ? section.images : []).filter(
		(src): src is string => typeof src === "string" && src.length > 0
	);

	if (items.length === 0 && images.length === 0) return null;

	return (
		<CardGrid
			id={id}
			tag={section?.tag ?? null}
			headline={section?.headline ?? ""}
			description={section?.description ?? undefined}
			items={items}
			columns={3}
			tone={tone}
			leadImages={images.slice(0, 2)}
		/>
	);
}

export default SectorSection;
