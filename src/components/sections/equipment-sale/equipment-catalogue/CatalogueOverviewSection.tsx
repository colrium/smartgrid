"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { IntroTextSection } from "@/components/sections/shared";

interface CatalogueOverviewContent {
	tag?: string | null;
	headline: string;
	description?: string;
}

/**
 * Catalogue overview — shared centred intro text
 * (content: equipment-catalogue:catalogueOverview).
 */
export function CatalogueOverviewSection(): ReactElement {
	const { t } = useTranslation(["equipment-catalogue"]);
	const section = t("equipment-catalogue:catalogueOverview", {
		returnObjects: true,
	}) as unknown as CatalogueOverviewContent;

	return (
		<IntroTextSection
			align="center"
			tag={section?.tag}
			headline={section?.headline}
			description={section?.description}
		/>
	);
}

export default CatalogueOverviewSection;
