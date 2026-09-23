import { useTranslation } from "@/hooks";
import { Gallery } from "@/components/sections/shared";
import type { ReactElement } from "react";

interface LandSurveyingImageItem {
	image?: string | null;
	title: string;
}

interface LandSurveyingImagesContent {
	tag?: string | null;
	headline?: string;
	description?: string | null;
	items: LandSurveyingImageItem[];
}

export function LandSurveyingImagesSection(): ReactElement | null {
	const { t } = useTranslation(["about"]);
	const section = t("about:landSurveyingImages", {
		returnObjects: true,
	}) as unknown as LandSurveyingImagesContent;
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

export default LandSurveyingImagesSection;