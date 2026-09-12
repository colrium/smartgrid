import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared";
import type { ReactElement } from "react";

interface CardContentItem {
	title: string;
	description: string;
}

interface LidarCardsContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: CardContentItem[];
}

interface LidarCardGridProps {
	sectionKey: string;
	tone?: "default" | "surface";
}

export function LidarCardGrid({ sectionKey, tone = "default" }: LidarCardGridProps): ReactElement | null {
	const { t } = useTranslation(["aerial-drones/lidar-mapping"]);
	const section = t(`aerial-drones/lidar-mapping:${sectionKey}`, {
		returnObjects: true,
	}) as unknown as LidarCardsContent;
	const items: CardItem[] = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<CardGrid
			tag={section.tag}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={4}
			indexed
			tone={tone}
		/>
	);
}

export default LidarCardGrid;