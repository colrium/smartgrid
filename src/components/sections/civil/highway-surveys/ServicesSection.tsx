import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared";

interface ServicesContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: { title: string; description: string }[];
}

export interface HighwayServicesData {
	tag?: string | null;
	headline: string;
	description?: string;
	items: { title: string; description: string }[];
}

export function ServicesSection({ data, id }: { data?: HighwayServicesData | null; id?: string } = {}): ReactElement | null {
	const { t } = useTranslation(["civil/highway-surveys"]);
	// Keystatic-owned content when `data` is provided (M11 `highwayServices`
	// unique section — `indexed` numbering is outside the shared `cardGrid`
	// contract); legacy locale strings otherwise.
	const section = (data ??
		(t("civil/highway-surveys:services", {
			returnObjects: true,
		}) as unknown as ServicesContent)) as ServicesContent;
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
			indexed
		/>
	);
}

export default ServicesSection;