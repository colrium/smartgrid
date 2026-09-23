import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared";
import type { ReactElement } from "react";

interface WhyChooseItem {
	icon?: string | null;
	title: string;
	description: string;
}

interface WhyChooseSmartGridContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: WhyChooseItem[];
}

export function WhyChooseSmartGridSection(): ReactElement | null {
	const { t } = useTranslation(["about"]);
	const section = t("about:whyChooseSmartGrid", {
		returnObjects: true,
	}) as unknown as WhyChooseSmartGridContent;
	const items: CardItem[] = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<CardGrid
			tag={section.tag}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={5}
			align="center"
		/>
	);
}

export default WhyChooseSmartGridSection;