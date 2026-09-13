"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface ApplicationItem {
	icon?: string | null;
	image?: string | null;
	title: string;
	description?: string | null;
}

interface ApplicationsContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	items?: ApplicationItem[] | null;
}

/**
 * Bathymetric applications — shared media-top card grid with numbered glass
 * chips (content: surveying/bathymetric-surveys:applications).
 */
export function ApplicationsSection(): ReactElement | null {
	const { t } = useTranslation(["surveying/bathymetric-surveys"]);
	const section = t("surveying/bathymetric-surveys:applications", {
		returnObjects: true,
	}) as unknown as ApplicationsContent;
	const items = (Array.isArray(section?.items) ? section.items : []) as CardItem[];

	if (items.length === 0) return null;

	return (
		<CardGrid
			tag={section.tag ?? null}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={4}
			tone="surface"
			mediaBadged
		/>
	);
}

export default ApplicationsSection;
