"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface TypeCategory {
	title?: string | null;
	icon?: string | null;
	items?: (string | null)[] | null;
}

interface TypesContent {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	categories?: TypeCategory[] | null;
}

export interface RmTypesData {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	categories?: TypeCategory[] | null;
}

const FALLBACK_ICONS = ["earth", "factory", "tractor-variant", "city-variant"];

/**
 * Types of resource mapping — shared card grid; each category's string list
 * renders as the card inset checklist (content:
 * surveying/resource-mapping:typesOfResourceMapping).
 */
export function TypesOfResourceMappingSection({ data, id }: { data?: RmTypesData | null; id?: string } = {}): ReactElement | null {
	const { t } = useTranslation(["surveying/resource-mapping"]);
	// Keystatic-owned content when `data` is provided (M11 `rmTypes`
	// unique section); legacy locale strings otherwise. The
	// category→subItems computation stays in the wrapper.
	const section = (data ??
		(t("surveying/resource-mapping:typesOfResourceMapping", {
			returnObjects: true,
		}) as unknown as TypesContent)) as TypesContent;
	const categories = Array.isArray(section?.categories) ? section.categories : [];

	if (categories.length === 0) return null;

	const items: CardItem[] = categories.map((category) => ({
		icon: category.icon ?? null,
		title: category.title ?? "",
		subItems: (Array.isArray(category.items) ? category.items : [])
			.filter((item): item is string => typeof item === "string" && item.length > 0)
			.map((item) => ({ title: item })),
	}));

	return (
		<CardGrid
			id={id}
			tag={section.tag ?? null}
			headline={section.headline ?? ""}
			description={section.description ?? undefined}
			items={items}
			columns={4}
			fallbackIcons={FALLBACK_ICONS}
		/>
	);
}

export default TypesOfResourceMappingSection;
