import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared";

interface SolutionsContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: { title: string; description: string }[];
}

export function AsBuiltSolutionsSection(): ReactElement | null {
	const { t } = useTranslation(["civil/as-built-surveys"]);
	const section = t("civil/as-built-surveys:asBuiltSolutions", {
		returnObjects: true,
	}) as unknown as SolutionsContent;
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
			indexed
		/>
	);
}

export default AsBuiltSolutionsSection;