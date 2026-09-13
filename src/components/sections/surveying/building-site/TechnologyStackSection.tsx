"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface TechItem {
	title: string;
	description?: string | null;
	icon?: string | null;
	href?: string | null;
}

interface TechnologyContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	learnMore?: string | null;
	items?: TechItem[] | null;
}

const FALLBACK_ICONS = [
	"satellite-variant",
	"telescope",
	"quadcopter",
	"chart-bell-curve-cumulative",
	"radar",
];

/**
 * Building-site technology stack — shared icon card grid with per-card
 * learn-more links (content: surveying/building-site-surveys:technology).
 */
export function TechnologyStackSection(): ReactElement | null {
	const { t } = useTranslation(["surveying/building-site-surveys"]);
	const section = t("surveying/building-site-surveys:technology", {
		returnObjects: true,
	}) as unknown as TechnologyContent;
	const rows = Array.isArray(section?.items) ? section.items : [];

	if (rows.length === 0) return null;

	const items: CardItem[] = rows.map((item) => ({
		icon: item.icon ?? null,
		title: item.title,
		description: item.description ?? undefined,
		href: item.href ?? undefined,
		link:
			item.href && section.learnMore
				? { label: section.learnMore, href: item.href, icon: "arrow-top-right" }
				: undefined,
	}));

	return (
		<CardGrid
			tag={section.tag ?? null}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={3}
			hoverArrow
			fallbackIcons={FALLBACK_ICONS}
		/>
	);
}

export default TechnologyStackSection;
