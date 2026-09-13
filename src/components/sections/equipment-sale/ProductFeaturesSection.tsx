"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared";

interface KeyFeaturesContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: { icon?: string | null; title: string; description?: string }[];
}

interface ProductFeaturesSectionProps {
	namespace: string;
}

/**
 * Product key features — shared icon card grid
 * (content: `<ns>:keyFeatures`).
 */
export function ProductFeaturesSection({ namespace }: ProductFeaturesSectionProps): ReactElement | null {
	const { t } = useTranslation([namespace]);
	const section = t(`${namespace}:keyFeatures`, {
		returnObjects: true,
	}) as unknown as KeyFeaturesContent;
	const items: CardItem[] = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<CardGrid
			tag={section.tag}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={4}
			tone="surface"
		/>
	);
}

export default ProductFeaturesSection;
