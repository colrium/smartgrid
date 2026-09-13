"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared";

interface EquipmentCategoriesContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: {
		icon?: string | null;
		title: string;
		description: string;
		badge?: string | null;
		ctaPrimary?: { icon?: string | null; label: string; href: string } | null;
	}[];
}

/**
 * Equipment catalogue categories — shared card grid; per-item badges and
 * links ride the Card badge/link slots
 * (content: equipment-catalogue:equipmentCategories).
 */
export function EquipmentCategoriesSection(): ReactElement | null {
	const { t } = useTranslation(["equipment-catalogue"]);
	const section = t("equipment-catalogue:equipmentCategories", {
		returnObjects: true,
	}) as unknown as EquipmentCategoriesContent;
	const items: CardItem[] = Array.isArray(section?.items)
		? section.items.map((item) => ({
				icon: item.icon ?? null,
				title: item.title,
				description: item.description,
				badge: item.badge ?? null,
				link: item.ctaPrimary?.href
					? {
							label: item.ctaPrimary.label,
							href: item.ctaPrimary.href,
							icon: item.ctaPrimary.icon ?? null,
						}
					: null,
			}))
		: [];

	if (items.length === 0) return null;

	return (
		<CardGrid
			tag={section.tag}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={3}
			tone="surface"
		/>
	);
}

export default EquipmentCategoriesSection;
