"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface TechItem {
	icon?: string | null;
	title: string;
	note?: string | null;
	href?: string | null;
}

interface TechStackContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	items?: TechItem[] | null;
}

const FALLBACK_ICONS = ["drone", "cube-scan", "crosshairs-gps", "map-legend", "satellite-variant", "robot-outline"];

/**
 * Resource-mapping tech stack — shared icon card grid with linkable cards
 * (content: surveying/resource-mapping:techStack).
 */
export function ResourceMappingTechStackSection(): ReactElement | null {
	const { t } = useTranslation(["surveying/resource-mapping"]);
	const section = t("surveying/resource-mapping:techStack", {
		returnObjects: true,
	}) as unknown as TechStackContent;
	const rows = Array.isArray(section?.items) ? section.items : [];

	if (rows.length === 0) return null;

	const items: CardItem[] = rows.map((item) => ({
		icon: item.icon ?? null,
		title: item.title,
		description: item.note ?? undefined,
		href: item.href ?? undefined,
	}));

	return (
		<CardGrid
			tag={section.tag ?? null}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={3}
			tone="surface"
			hoverArrow
			fallbackIcons={FALLBACK_ICONS}
		/>
	);
}

export default ResourceMappingTechStackSection;
