import { useTranslation } from "@/hooks";
import { Gallery } from "@/components/sections/shared";
import type { ReactElement } from "react";

interface ServicesByImageItem {
	label?: string;
	title?: string;
	image?: string | null;
}

interface ServicesByImagesContent {
	tag?: string | null;
	headline?: string;
	description?: string | null;
	items: ServicesByImageItem[];
}

export function ServicesByImagesSection(): ReactElement | null {
	const { t } = useTranslation(["about"]);
	const section = t("about:servicesByImages", {
		returnObjects: true,
	}) as unknown as ServicesByImagesContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<Gallery
			tag={section.tag}
			headline={section.headline}
			description={section.description}
			items={items}
			layout="overlay"
			columns={4}
		/>
	);
}

export default ServicesByImagesSection;