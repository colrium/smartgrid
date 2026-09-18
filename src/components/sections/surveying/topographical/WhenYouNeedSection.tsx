"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";
import type { CardSubItem } from "@/components/ui/Card";

interface ChildItem {
	title?: string | null;
	description?: string | null;
}

interface NeedItem {
	icon?: string | null;
	title?: string | null;
	description?: string | null;
	children?: ChildItem[] | null;
}

interface WhenYouNeedContent {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	items?: NeedItem[] | null;
}

export interface WhenYouNeedData {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	items?: NeedItem[] | null;
}

/**
 * When-you-need use cases — shared 2-col card grid; entries carrying a
 * `children` list render as full-width cards with the inset sub-item
 * checklist (content: surveying/topographical-surveys:whenYouNeed).
 */
export function WhenYouNeedSection({ data }: { data?: WhenYouNeedData | null } = {}): ReactElement | null {
	const { t } = useTranslation(["surveying/topographical-surveys"]);
	// Keystatic-owned content when `data` is provided (M11
	// `topoWhenYouNeed` unique section); legacy locale strings otherwise.
	// The children→subItems + wide computation stays in the wrapper.
	const section = (data ??
		(t("surveying/topographical-surveys:whenYouNeed", {
			returnObjects: true,
		}) as unknown as WhenYouNeedContent)) as WhenYouNeedContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	const cards: CardItem[] = items.map((item) => ({
		icon: item.icon ?? null,
		title: item.title ?? "",
		description: item.description ?? undefined,
		subItems: (Array.isArray(item.children) ? item.children : null) as CardSubItem[] | null,
		wide: Array.isArray(item.children) && item.children.length > 0,
	}));

	return (
		<CardGrid
			tag={section.tag ?? null}
			headline={section.headline ?? ""}
			description={section.description ?? undefined}
			items={cards}
			columns={2}
			card={{ iconSize: "lg" }}
		/>
	);
}

export default WhenYouNeedSection;

