"use client";

import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home/SectionHeader";
import { Slider } from "@/components/Slider";

interface DronePhotographyImageSliderContent {
	headline: string;
	items: string[];
}

export function DronePhotographyImageSliderSection() {
	const { t } = useTranslation(["about"]);
	const section = t("about:dronePhotographyimageSlider", {
		returnObjects: true,
	}) as unknown as DronePhotographyImageSliderContent;
	const images = Array.isArray(section.items) ? section.items : [];

	const slides = images.map((image, index) => ({
		image,
		alt: `${section.headline} ${index + 1}`,
	}));

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<SectionHeader headline={section.headline} align="center" />
				</FadeUp>

				<div className="mt-12 sm:mt-16 max-w-5xl mx-auto">
					<FadeUp delay={0.1}>
						<Slider slides={slides} autoplay={5000} showArrows showDots />
					</FadeUp>
				</div>
			</div>
		</section>
	);
}

export default DronePhotographyImageSliderSection;