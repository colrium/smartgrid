import { useTranslation } from "@/hooks";
import { Gallery } from "@/components/sections/shared";
import type { ReactElement } from "react";

interface DronePhotographyImageSliderContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	items: string[];
}

export function DronePhotographyImageSliderSection(): ReactElement | null {
	const { t } = useTranslation(["about"]);
	const section = t("about:dronePhotographyimageSlider", {
		returnObjects: true,
	}) as unknown as DronePhotographyImageSliderContent;
	const images = Array.isArray(section?.items) ? section.items : [];

	if (images.length === 0) return null;

	return (
		<Gallery
			tag={section.tag}
			headline={section.headline}
			description={section.description}
			items={images}
			layout="slider"
			tone="surface"
		/>
	);
}

export default DronePhotographyImageSliderSection;