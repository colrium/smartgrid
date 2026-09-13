"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface TechItem {
	icon?: string | null;
	title?: string;
	note?: string | null;
	href?: string | null;
}

interface TechStackContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	items?: TechItem[] | null;
}

const FALLBACK_ICONS = ["quadcopter", "drone", "radar", "crosshairs-gps", "cube-scan", "map-legend"];

/** Technology stack — shared paper card grid (content:
 * surveying/aerial-surveys:techStack). */
export function TechStackSection(): ReactElement | null {
	const { t } = useTranslation(["surveying/aerial-surveys"]);
	const section = t("surveying/aerial-surveys:techStack", { returnObjects: true }) as unknown as TechStackContent;
	const raw = Array.isArray(section?.items) ? section.items : [];

	if (raw.length === 0) return null;

	const items: CardItem[] = raw.map((item) => ({
		title: item.title,
		description: item.note ?? undefined,
		href: item.href ?? null,
		icon: item.icon ?? null,
	}));

	return (
		<CardGrid
			tag={section.tag ?? null}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={3}
			tone="surface"
			headerRow
			fallbackIcons={FALLBACK_ICONS}
			card={{ variant: "paper" }}
		/>
	);
}

export default TechStackSection;