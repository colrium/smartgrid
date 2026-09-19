"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface IndustryItem {
	icon?: string | null;
	title?: string;
	description?: string | null;
	href?: string | null;
}

interface IndustriesContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	items?: IndustryItem[] | null;
}

export interface AerialIndustriesData {
	tag?: string | null;
	headline: string;
	description?: string | null;
	items?: IndustryItem[] | null;
}

const FALLBACK_ICONS = [
	"road-variant",
	"domain",
	"transmission-tower",
	"pickaxe",
	"sprout",
	"bank",
	"forest",
];

/**
 * Aerial industries — shared link-card grid; the last card widens to a full
 * row when the count leaves a single remainder (content:
 * surveying/aerial-surveys:industries).
 */
export function AerialIndustriesSection({ data }: { data?: AerialIndustriesData | null } = {}): ReactElement | null {
	const { t } = useTranslation(["surveying/aerial-surveys"]);
	// Keystatic-owned content when `data` is provided (M11 `aerialIndustries`
	// unique section); legacy locale strings otherwise. The wide-last-card
	// computation + positional fallback icons stay in the renderer.
	const section = (data ??
		(t("surveying/aerial-surveys:industries", { returnObjects: true }) as unknown as IndustriesContent)) as IndustriesContent;
	const raw = Array.isArray(section?.items) ? section.items : [];

	if (raw.length === 0) return null;

	const items: CardItem[] = raw.map((item, index) => ({
		title: item.title,
		description: item.description ?? undefined,
		href: item.href ?? null,
		icon: item.icon ?? null,
		wide: index === raw.length - 1 && raw.length % 3 === 1,
	}));

	return (
		<CardGrid
			tag={section.tag ?? null}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={3}
			headerRow
			fallbackIcons={FALLBACK_ICONS}
		/>
	);
}

export default AerialIndustriesSection;