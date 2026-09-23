"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface ProcessContent {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	items?: CardItem[] | null;
}

export interface SurveyingProcessData {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	items?: CardItem[] | null;
}

/**
 * Land-surveying landing process — numbered step cards rendered through the
 * shared card grid (content: surveying/landing:process).
 */
export function SurveyingProcessSection({ data, id }: { data?: SurveyingProcessData | null; id?: string } = {}): ReactElement | null {
	const { t } = useTranslation(["surveying/landing"]);
	// Keystatic-owned content when `data` is provided (M11
	// `surveyingProcess` unique section); legacy `surveying/landing:process`
	// locale strings otherwise. Presentation (indexed/watermarked cards)
	// stays in the wrapper — only strings are data.
	const section = (data ??
		(t("surveying/landing:process", { returnObjects: true }) as unknown as ProcessContent)) as ProcessContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<CardGrid
			id={id}
			tag={section.tag ?? null}
			headline={section.headline ?? ""}
			description={section.description ?? undefined}
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

