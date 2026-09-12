import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared";
import type { ReactElement } from "react";

interface IndustryItem {
	icon?: string | null;
	label: string;
	description?: string;
}

interface IndustriesContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: IndustryItem[];
}

export function IndustriesWeServeSection(): ReactElement | null {
	const { t } = useTranslation(["home"]);
	const section = t("home:industriesWeServe", {
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
		/>
	);
}

export default IndustriesWeServeSection;