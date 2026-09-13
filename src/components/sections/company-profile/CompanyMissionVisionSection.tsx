"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface MissionVisionContent {
	tag?: string | null;
	headline: string;
	items?: CardItem[] | null;
}

/**
 * Mission / vision / values — shared centred card grid (content:
 * company-profile:missionVision).
 */
export function CompanyMissionVisionSection(): ReactElement | null {
	const { t } = useTranslation(["company-profile"]);
	const section = t("company-profile:missionVision", { returnObjects: true }) as unknown as MissionVisionContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<CardGrid
			tag={section.tag ?? null}
			headline={section.headline}
			items={items}
			columns={3}
			align="center"
			tone="surface"
			card={{ density: "roomy", iconSize: "lg" }}
		/>
	);
}

export default CompanyMissionVisionSection;

