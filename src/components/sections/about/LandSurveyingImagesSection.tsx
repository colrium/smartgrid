"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";

interface LandSurveyingImageItem {
	image?: string | null;
	title: string;
}

interface LandSurveyingImagesContent {
	items: LandSurveyingImageItem[];
}

export function LandSurveyingImagesSection() {
	const { t } = useTranslation(["about"]);
	const section = t("about:landSurveyingImages", {
		returnObjects: true,
	}) as unknown as LandSurveyingImagesContent;
	const items = Array.isArray(section.items) ? section.items : [];

	return (
		<section className="pb-24 sm:pb-28 relative overflow-hidden">
			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % 4) * 0.07}>
							<article className="group relative aspect-[4/5] rounded-[20px] overflow-hidden bg-ink hairline card-shadow">
								{item.image && (
									<Image
										src={item.image}
										alt={item.title}
										fill
										sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
										className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
									/>
								)}
								<div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />

								<div className="absolute inset-x-0 bottom-0 p-6">
									<h3 className="text-base sm:text-lg font-semibold tracking-tight text-surface leading-snug">
										{item.title}
									</h3>
								</div>
							</article>
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default LandSurveyingImagesSection;