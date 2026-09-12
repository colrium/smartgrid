import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared";

interface BenefitsContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: { icon?: string; title: string; description: string }[];
}

export function BenefitsSection(): ReactElement | null {
	const { t } = useTranslation(["civil/highway-surveys"]);
	const section = t("civil/highway-surveys:benefitsOfHighwaySurveys", {
		returnObjects: true,
	}) as unknown as BenefitsContent;
	const items: CardItem[] = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<CardGrid
			tag={section.tag}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={3}
			tone="surface"
		/>
	);
}

export default BenefitsSection;