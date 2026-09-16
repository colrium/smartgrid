import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared";

interface ExpertiseItem {
	icon?: string | null;
	label: string;
	description: string;
	href?: string;
}

interface CoreExpertiseContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: ExpertiseItem[];
}

export function CoreExpertiseSection(): ReactElement | null {
	const { t } = useTranslation(["common"]);
	const section = t("common:coreExpertise", {
		returnObjects: true,
	}) as unknown as CoreExpertiseContent;
	const items: CardItem[] = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<CardGrid
			id="core-expertise"
			tag={section.tag}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={3}
			headerRow
			hoverArrow
			watermarkedIndexed
		/>
	);
}

export default CoreExpertiseSection;