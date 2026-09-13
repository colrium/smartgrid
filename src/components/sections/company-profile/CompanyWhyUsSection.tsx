"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface WhyUsContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	items?: CardItem[] | null;
}

/** Why choose us — shared card grid (content: company-profile:whyUs). */
export function CompanyWhyUsSection(): ReactElement | null {
	const { t } = useTranslation(["company-profile"]);
	const section = t("company-profile:whyUs", { returnObjects: true }) as unknown as WhyUsContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<CardGrid
			tag={section.tag ?? null}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={3}
			tone="surface"
			card={{ iconSize: "lg" }}
		/>
	);
}

export default CompanyWhyUsSection;

