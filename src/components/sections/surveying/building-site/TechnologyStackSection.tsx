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

interface TechnologyStackSectionProps {
	/** Locale key suffix (legacy lookup). Unused when `data` is provided. */
	sectionKey?: string;
	data?: TechnologyContent | null;
	id?: string;
}

/**
 * Building-site technology stack — shared icon card grid with per-card
 * learn-more links (content: surveying/building-site-surveys:technology).
 * M11: additive `data` prop for Keystatic-owned content (omitted = legacy `t()`).
 */
export function TechnologyStackSection({ sectionKey, data, id }: TechnologyStackSectionProps): ReactElement | null {
	const { t } = useTranslation(["surveying/building-site-surveys"]);
	const legacy = sectionKey
		? (t(`surveying/building-site-surveys:${sectionKey}`, {
				returnObjects: true,
			}) as unknown as TechnologyContent)
		: null;
	const section = (data ?? legacy) as TechnologyContent | null;
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
			id={id}
			tag={section?.tag ?? null}
			headline={section?.headline ?? ""}
			description={section?.description ?? undefined}
			items={items}
			columns={3}
			hoverArrow
			fallbackIcons={FALLBACK_ICONS}
		/>
	);
}

export default TechnologyStackSection;
