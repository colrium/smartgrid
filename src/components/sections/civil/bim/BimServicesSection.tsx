import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared";

interface BimServicesContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: { title: string; description: string }[];
}

export function BimServicesSection(): ReactElement | null {
	const { t } = useTranslation(["civil/bim"]);
	const section = t("civil/bim:bimServices", {
		returnObjects: true,
	}) as unknown as BimServicesContent;
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
			headerAlign="left"
			indexed
		/>
	);
}

export default BimServicesSection;