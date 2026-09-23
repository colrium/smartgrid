"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface DamsLakesItem {
	icon?: string | null;
	title?: string | null;
	description?: string | null;
}

interface DamsLakesContent {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	images?: (string | null)[] | null;
	items?: DamsLakesItem[] | null;
}

export interface BathyDamsLakesData {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	images?: (string | null)[] | null;
	items?: DamsLakesItem[] | null;
}

/**
 * Dams/lakes/sea/ocean coverage — shared card grid with a lead image strip
 * above the cards (content: surveying/bathymetric-surveys:damsLakesSeaOcean).
 */
export function DamsLakesSection({ data, id }: { data?: BathyDamsLakesData | null; id?: string } = {}): ReactElement | null {
	const { t } = useTranslation(["surveying/bathymetric-surveys"]);
	// Keystatic-owned content when `data` is provided (M11 `bathyDamsLakes`
	// unique section); legacy locale strings otherwise. The lead-image
	// computation (first two) stays in the wrapper.
	const section = (data ??
		(t("surveying/bathymetric-surveys:damsLakesSeaOcean", {
			returnObjects: true,
		}) as unknown as DamsLakesContent)) as DamsLakesContent;
	const items = (Array.isArray(section?.items) ? section.items : []) as CardItem[];
	const images = (Array.isArray(section?.images) ? section.images : []).filter(
		(src): src is string => typeof src === "string" && src.length > 0
	);

	if (items.length === 0 && images.length === 0) return null;

	return (
		<CardGrid
			id={id}
			tag={section.tag ?? null}
			headline={section.headline ?? ""}
			description={section.description ?? undefined}
			items={items}
			columns={3}
			leadImages={images.slice(0, 2)}
		/>
	);
}

export default DamsLakesSection;
