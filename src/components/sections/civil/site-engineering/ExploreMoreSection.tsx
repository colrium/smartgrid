import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared";

interface ExploreContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: { image?: string | null; title: string; href?: string }[];
}

export function ExploreMoreSection(): ReactElement | null {
	const { t } = useTranslation(["civil/site-engineering"]);
	const section = t("civil/site-engineering:exploreMore", {
		returnObjects: true,
	}) as unknown as ExploreContent;
	const items: CardItem[] = Array.isArray(section?.items)
		? section.items.map((item) => ({
				title: item.title,
				media: item.image ?? null,
				mediaAlt: item.title,
				href: item.href ?? null,
			}))
		: [];

	if (items.length === 0) return null;

	return (
		<CardGrid
			tag={section.tag}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={3}
			headerAlign="left"
			card={{
				mediaPosition: "background",
				mediaAspect: "h-64 sm:h-72",
				elevation: 1,
			}}
		/>
	);
}

export default ExploreMoreSection;