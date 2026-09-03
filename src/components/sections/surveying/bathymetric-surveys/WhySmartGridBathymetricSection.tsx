"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob, ParallaxDecor } from "@/components/sections/home/decor";

interface WhySmartGridBathymetricContent {
	tag?: string | null;
	headline: string;
	items: string[];
}

export function WhySmartGridBathymetricSection(): ReactElement {
	const { t } = useTranslation(["surveying/bathymetric-surveys"]);
	const section = t("surveying/bathymetric-surveys:whySmartGridBathymetric", {
		returnObjects: true,
	}) as unknown as WhySmartGridBathymetricContent;
	const items = Array.isArray(section.items) ? section.items : [];

	if (items.length === 0) return <></>;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<Blob className="w-[28rem] h-[28rem] bg-primary-100/60 -top-24 -right-24" opacity={0.5} />
			<ParallaxDecor speed={-0.06} className="absolute bottom-16 -left-24 z-0">
				<Blob className="w-72 h-72 bg-primary/70" opacity={0.6} />
			</ParallaxDecor>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % 3) * 0.08} className="h-full">
							<article className="group relative h-full flex flex-col gap-4 rounded-c bg-paper hairline card-shadow p-7 transition-all duration-500 hover:card-shadow-lift hover:border-primary">
								<div className="flex items-start gap-3">
									<span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
										<span className="mdi mdi-check-bold text-base" />
									</span>
									<h3 className="flex-1 text-base font-semibold tracking-tight text-ink leading-snug">
										{item}
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

export default WhySmartGridBathymetricSection;