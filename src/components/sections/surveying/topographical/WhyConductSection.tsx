"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface WhyContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	items?: CardItem[] | null;
}

/**
 * Why-conduct-a-survey — shared numbered card grid with the crosshairs
 * header-end glyph (content: surveying/topographical-surveys:whyConductSurvey).
 */
export function WhyConductSection(): ReactElement | null {
	const { t } = useTranslation(["surveying/topographical-surveys"]);
	const section = t("surveying/topographical-surveys:whyConductSurvey", {
		returnObjects: true,
	}) as unknown as WhyContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<CardGrid
			tag={section.tag ?? null}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={3}
			indexed
			card={{
				density: "roomy",
				headerRow: true,
				headerEnd: (
					<span
						className="mdi mdi-crosshairs-gps text-xl text-on-surface/20 transition-colors duration-300 group-hover:text-primary"
						aria-hidden
					/>
				),
				indexBadgeClassName:
					"text-sm font-semibold tabular-nums tracking-[0.14em] text-primary",
			}}
		/>
	);
}

export default WhyConductSection;
