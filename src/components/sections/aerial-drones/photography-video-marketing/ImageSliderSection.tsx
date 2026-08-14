"use client";

import { useTranslation } from "@/hooks";
import { Slider, type SliderSlide } from "@/components/Slider";
import { FadeUp } from "@/components/animations/Fade";

interface SliderSectionContent {
	items: SliderSlide[];
}

export function ImageSliderSection() {
	const { t } = useTranslation(["photography-video-marketing"]);
	const section = t("photography-video-marketing:imageSlider", {
		returnObjects: true,
	}) as unknown as SliderSectionContent;
	const slides = Array.isArray(section.items) ? section.items : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<div className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<Slider slides={slides} autoplay={5000} showArrows showDots />
				</FadeUp>
			</div>
		</section>
	);
}

export default ImageSliderSection;