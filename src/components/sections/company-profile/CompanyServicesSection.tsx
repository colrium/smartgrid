"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface ServicesContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	items?: CardItem[] | null;
}

/**
 * Company services — shared link-card grid (content:
 * company-profile:services).
 */
export function CompanyServicesSection(): ReactElement | null {
	const { t } = useTranslation(["company-profile"]);
	const section = t("company-profile:services", { returnObjects: true }) as unknown as ServicesContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<CardGrid
			tag={section.tag ?? null}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={3}
			headerRow
			card={{ iconSize: "lg" }}
		/>
	);
}

export default CompanyServicesSection;

