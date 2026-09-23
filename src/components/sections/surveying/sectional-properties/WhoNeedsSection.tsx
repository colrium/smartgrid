"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface WhoNeedsItem {
	icon?: string | null;
	title?: string | null;
	description?: string | null;
	href?: string | null;
}

interface WhoNeedsContent {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	linkLabel?: string | null;
	items?: WhoNeedsItem[] | null;
}

export interface SectionalWhoNeedsData {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	linkLabel?: string | null;
	items?: WhoNeedsItem[] | null;
}

/**
 * Who-needs-sectional services — shared linkable card grid with per-card
 * footer links (content: surveying/sectional-properties:whoNeeds).
 */
export function WhoNeedsSection({ data, id }: { data?: SectionalWhoNeedsData | null; id?: string } = {}): ReactElement | null {
	const { t } = useTranslation(["surveying/sectional-properties"]);
	// Keystatic-owned content when `data` is provided (M11 `sectionalWhoNeeds`
	// unique section); legacy locale strings otherwise. The per-card footer
	// link computation (linkLabel + href fallback) stays in the wrapper.
	const section = (data ??
		(t("surveying/sectional-properties:whoNeeds", {
			returnObjects: true,
		}) as unknown as WhoNeedsContent)) as WhoNeedsContent;
	const rows = Array.isArray(section?.items) ? section.items : [];

	if (rows.length === 0) return null;

	const items: CardItem[] = rows.map((item) => ({
		icon: item.icon ?? null,
		title: item.title ?? "",
		description: item.description ?? undefined,
		href: item.href ?? "/contact",
		link: section.linkLabel
			? { label: section.linkLabel, href: item.href ?? "/contact", icon: "arrow-right" }
			: undefined,
	}));

	return (
		<CardGrid
			id={id}
			tag={section.tag ?? null}
			headline={section.headline ?? ""}
			description={section.description}
			items={items}
			columns={3}
			tone="surface"
			headerAlign="left"
			hoverArrow
			fallbackIcons={["account-group"]}
		/>
	);
}

export default WhoNeedsSection;
