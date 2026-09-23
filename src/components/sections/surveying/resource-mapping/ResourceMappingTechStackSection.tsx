"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface TechItem {
	icon?: string | null;
	title?: string | null;
	note?: string | null;
	href?: string | null;
}

interface TechStackContent {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	items?: TechItem[] | null;
}

export interface RmTechStackData {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	items?: TechItem[] | null;
}

const FALLBACK_ICONS = ["drone", "cube-scan", "crosshairs-gps", "map-legend", "satellite-variant", "robot-outline"];

/**
 * Resource-mapping tech stack — shared icon card grid with linkable cards
 * (content: surveying/resource-mapping:techStack).
 */
export function ResourceMappingTechStackSection({ data, id }: { data?: RmTechStackData | null; id?: string } = {}): ReactElement | null {
	const { t } = useTranslation(["surveying/resource-mapping"]);
	// Keystatic-owned content when `data` is provided (M11 `rmTechStack`
	// unique section); legacy locale strings otherwise. The note→description
	// mapping and positional fallback icons stay in the wrapper.
	const section = (data ??
		(t("surveying/resource-mapping:techStack", {
			returnObjects: true,
		}) as unknown as TechStackContent)) as TechStackContent;
	const rows = Array.isArray(section?.items) ? section.items : [];

	if (rows.length === 0) return null;

	const items: CardItem[] = rows.map((item) => ({
		icon: item.icon ?? null,
		title: item.title ?? "",
		description: item.note ?? undefined,
		href: item.href ?? undefined,
	}));

	return (
		<CardGrid
			id={id}
			tag={section.tag ?? null}
			headline={section.headline ?? ""}
			description={section.description ?? undefined}
			items={items}
			columns={3}
			tone="surface"
			hoverArrow
			fallbackIcons={FALLBACK_ICONS}
		/>
	);
}

export default ResourceMappingTechStackSection;
