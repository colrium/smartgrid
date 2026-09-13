"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface TypeCategory {
	title: string;
	icon?: string | null;
	items?: string[] | null;
}

interface TypesContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	categories?: TypeCategory[] | null;
}

const FALLBACK_ICONS = ["earth", "factory", "tractor-variant", "city-variant"];

/**
 * Types of resource mapping — shared card grid; each category's string list
 * renders as the card inset checklist (content:
 * surveying/resource-mapping:typesOfResourceMapping).
 */
export function TypesOfResourceMappingSection(): ReactElement | null {
	const { t } = useTranslation(["surveying/resource-mapping"]);
	const section = t("surveying/resource-mapping:typesOfResourceMapping", {
		returnObjects: true,
	}) as unknown as TypesContent;
	const categories = Array.isArray(section?.categories) ? section.categories : [];

	if (categories.length === 0) return null;

	const items: CardItem[] = categories.map((category) => ({
		icon: category.icon ?? null,
		title: category.title,
		subItems: (Array.isArray(category.items) ? category.items : []).map((item) => ({ title: item })),
	}));

	return (
		<CardGrid
			tag={section.tag ?? null}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={4}
			fallbackIcons={FALLBACK_ICONS}
		/>
	);
}

export default TypesOfResourceMappingSection;
