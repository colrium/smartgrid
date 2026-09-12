import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared";

interface IndustriesContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: { icon?: string; title: string; description: string }[];
}

export function KeyIndustriesSection(): ReactElement | null {
	const { t } = useTranslation(["civil/as-built-surveys"]);
	const section = t("civil/as-built-surveys:keyIndustries", {
		returnObjects: true,
	}) as unknown as IndustriesContent;
	const items: CardItem[] = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<CardGrid
			tag={section.tag}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={3}
			align="center"
		/>
	);
}

export default KeyIndustriesSection;