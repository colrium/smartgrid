import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared";

interface SolutionsContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: { title: string; description: string }[];
}

export interface AsBuiltSolutionsData {
	tag?: string | null;
	headline: string;
	description?: string;
	items: { title: string; description: string }[];
}

export function AsBuiltSolutionsSection({ data, id }: { data?: AsBuiltSolutionsData | null; id?: string } = {}): ReactElement | null {
	const { t } = useTranslation(["civil/as-built-surveys"]);
	// Keystatic-owned content when `data` is provided (M11 `asBuiltSolutions`
	// unique section — `indexed` numbering is outside the shared `cardGrid`
	// contract); legacy locale strings otherwise.
	const section = (data ??
		(t("civil/as-built-surveys:asBuiltSolutions", {
			returnObjects: true,
		}) as unknown as SolutionsContent)) as SolutionsContent;
	const items: CardItem[] = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<CardGrid
			id={id}
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