"use client";

import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";
import { Slider } from "@/components/Slider";

interface GprSliderItem {
	image?: string | null;
	title?: string;
	description?: string;
}

interface GprImagesSliderContent {
	items: GprSliderItem[];
}

export function GprImagesSliderSection() {
	const { t } = useTranslation(["ground-penetrating-radar"]);
	const section = t("ground-penetrating-radar:gprImagesSlider", {
		returnObjects: true,
	}) as unknown as GprImagesSliderContent;
	const items = Array.isArray(section.items) ? section.items : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-[28rem] h-[28rem] bg-primary-200/40 -top-24 -left-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					headline="GPR Field Work Gallery"
					align="center"
				/>

				<FadeUp delay={0.1} className="mt-12 sm:mt-16">
					<Slider slides={items} autoplay={5000} />
				</FadeUp>
			</div>
		</section>
	);
}

export default GprImagesSliderSection;