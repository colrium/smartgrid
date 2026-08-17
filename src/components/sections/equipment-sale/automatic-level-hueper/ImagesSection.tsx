"use client";

import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { Slider } from "@/components/Slider";

interface ImagesContent {
	images?: string[] | null;
}

export function ImagesSection() {
	const { t } = useTranslation(["automatic-level-hueper"]);
	const section = t("automatic-level-hueper:productImages", {
		returnObjects: true,
	}) as unknown as ImagesContent;
	const images = Array.isArray(section.images) ? section.images : [];

	if (images.length === 0) return null;

	const slides = images.map((image, index) => ({
		image,
		alt: `Product image ${index + 1}`,
	}));

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<div className="relative z-10 max-w-7xl mx-auto sm:px-4 lg:px-2">
				<FadeUp>
					<Slider slides={slides} autoplay={5000} showArrows showDots />
				</FadeUp>
			</div>
		</section>
	);
}

export default ImagesSection;