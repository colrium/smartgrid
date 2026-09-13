"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface AerialSurveyingContent {
	tag?: string | null;
	headline: string;
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
export function AerialSurveyingSection(): ReactElement | null {
	const { t } = useTranslation(["about"]);
	const section = t("about:aerialSurveying", { returnObjects: true }) as unknown as AerialSurveyingContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<CardGrid
			tag={section.tag ?? null}
			headline={section.headline}
			description={section.description}
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
