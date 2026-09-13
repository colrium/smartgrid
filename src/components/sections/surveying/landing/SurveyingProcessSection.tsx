"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface ProcessContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	items?: CardItem[] | null;
}

/**
 * Land-surveying landing process — numbered step cards rendered through the
 * shared card grid (content: surveying/landing:process).
 */
export function SurveyingProcessSection(): ReactElement | null {
	const { t } = useTranslation(["surveying/landing"]);
	const section = t("surveying/landing:process", { returnObjects: true }) as unknown as ProcessContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<CardGrid
			tag={section.tag ?? null}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={3}
			watermarkedIndexed
			indexed
			card={{
				indexBadgeClassName:
					"flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-surface text-sm",
			}}
		/>
	);
}

export default SurveyingProcessSection;

