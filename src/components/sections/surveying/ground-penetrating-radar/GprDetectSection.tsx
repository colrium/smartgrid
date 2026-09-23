"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface DetectItem {
	icon?: string | null;
	title: string;
	note?: string | null;
}

interface DetectContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	items?: DetectItem[] | null;
}

export interface GprDetectData {
	tag?: string | null;
	headline: string;
	description?: string | null;
	items?: DetectItem[] | null;
}

const FALLBACK_ICONS = [
	"pipe",
	"barrel-outline",
	"cable-data",
	"access-point-network",
	"circle-multiple",
	"archive-outline",
];

/**
 * GPR detection capabilities — shared icon card grid (content:
 * surveying/ground-penetrating-radar:detectCaps).
 */
export function GprDetectSection({ data, id }: { data?: GprDetectData | null; id?: string } = {}): ReactElement | null {
	const { t } = useTranslation(["surveying/ground-penetrating-radar"]);
	// Keystatic-owned content when `data` is provided (M11 `gprDetect` unique
	// section — `fallbackIcons` is outside the shared `cardGrid` contract);
	// legacy locale strings otherwise.
	const section = (data ??
		(t("surveying/ground-penetrating-radar:detectCaps", {
			returnObjects: true,
		}) as unknown as DetectContent)) as DetectContent;
	const rows = Array.isArray(section?.items) ? section.items : [];

	if (rows.length === 0) return null;

	const items: CardItem[] = rows.map((item) => ({
		icon: item.icon ?? null,
		title: item.title,
		description: item.note ?? undefined,
	}));

	return (
		<CardGrid
			id={id ?? "detect"}
			tag={section.tag ?? null}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={3}
			tone="surface"
			fallbackIcons={FALLBACK_ICONS}
		/>
	);
}

export default GprDetectSection;
