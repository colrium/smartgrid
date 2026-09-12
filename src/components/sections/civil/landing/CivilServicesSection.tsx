import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared";

interface ServicesContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: { icon?: string | null; title: string; description?: string; href?: string | null }[];
}

export function CivilServicesSection(): ReactElement | null {
	const { t } = useTranslation(["civil/landing"]);
	const section = t("civil/landing:services", { returnObjects: true }) as unknown as ServicesContent;
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

export default CivilServicesSection;
