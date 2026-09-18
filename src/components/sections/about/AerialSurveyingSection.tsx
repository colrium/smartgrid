"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface AerialSurveyingContent {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	items?: CardItem[] | null;
}

export interface AerialSurveyingData {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	items?: CardItem[] | null;
}

const FALLBACK_ICONS = [
	"map-outline",
	"clipboard-pulse-outline",
	"leaf",
	"sprout",
	"cube-outline",
	"road-variant",
	"terrain",
	"vector-triangle",
	"alert-octagon-outline",
];

/**
 * Aerial surveying capabilities — shared popup card grid; items carrying
 * `popupContent` open the shared modal (content: about:aerialSurveying).
 */
export function AerialSurveyingSection({ data, id }: { data?: AerialSurveyingData | null; id?: string } = {}): ReactElement | null {
	const { t } = useTranslation(["about"]);
	// Keystatic-owned content when `data` is provided (M11
	// `aboutAerialSurveying` unique section); legacy `about:aerialSurveying`
	// locale strings otherwise. Presentation (columns/align/tone,
	// positional fallback icons, "Learn more" trigger) stays hardcoded in
	// the wrapper — only strings are data.
	const section = (data ??
		(t("about:aerialSurveying", { returnObjects: true }) as unknown as AerialSurveyingContent)) as AerialSurveyingContent;
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
			align="center"
			tone="surface"
			fallbackIcons={FALLBACK_ICONS}
			popupTrigger="Learn more"
		/>
	);
}

export default AerialSurveyingSection;
