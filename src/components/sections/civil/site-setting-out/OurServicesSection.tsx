"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared";

interface ServicesContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: { title: string; description: string }[];
}

/**
 * Site setting-out services — shared indexed card grid with a left-aligned
 * header (content: civil/site-setting-out:ourServices).
 */
export function OurServicesSection(): ReactElement | null {
	const { t } = useTranslation(["civil/site-setting-out"]);
	const section = t("civil/site-setting-out:ourServices", {
		returnObjects: true,
	}) as unknown as ServicesContent;
	const items: CardItem[] = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<CardGrid
			tag={section.tag}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={3}
			headerAlign="left"
			indexed
		/>
	);
}

export default OurServicesSection;
