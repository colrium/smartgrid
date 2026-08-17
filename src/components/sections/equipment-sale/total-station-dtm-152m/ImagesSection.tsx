"use client";

import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { Slider } from "@/components/Slider";

interface ImagesContent {
	images?: string[] | null;
}

const  ImagesSection = () => {
	const { t } = useTranslation(["total-station-dtm-152m"]);
	const section = t("total-station-dtm-152m:productImages", {
		returnObjects: true,
	}) as unknown as ImagesContent;
	const images = Array.isArray(section.images) ? section.images : [];
    console.log("images", images);
	if (images.length === 0) return null;

	const slides = images.map((image, index) => ({
		image,
		alt: `Product image ${index + 1}`,
	}));
    
	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<Slider
						slides={slides}
						autoplay={0}
						showArrows
						showDots
						imgClassName="object-contain!"
					/>
				</FadeUp>
			</div>
		</section>
	);
}

export default ImagesSection;