"use client";

import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob, ParallaxDecor } from "@/components/sections/home/decor";

interface OfferItem {
	title: string;
	description: string;
}

interface OfferContent {
	tag?: string | null;
	headline: string;
	items: OfferItem[];
}

const FALLBACK_ICONS = [
	"ruler-square-compass",
	"layers-triple",
	"earth",
];

export function WhatWeOfferSection() {
	const { t } = useTranslation(["topographical-surveys"]);
	const section = t("topographical-surveys:whatWeOffer", {
		returnObjects: true,
	}) as unknown as OfferContent;
	const items = Array.isArray(section.items) ? section.items : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-[28rem] h-[28rem] bg-brand-200/40 -top-24 -right-24" opacity={0.5} />
			<ParallaxDecor speed={-0.06} className="absolute bottom-16 -left-24 z-0">
				<Blob className="w-72 h-72 bg-brand-100/80" opacity={0.6} />
			</ParallaxDecor>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag}
					headline={section.headline}
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
					{items.map((item, index) => (
						<FadeUp key={index} delay={index * 0.08}>
							<article className="group relative h-full p-8 rounded-[20px] bg-surface hairline card-shadow transition-all duration-500 hover:-translate-y-1.5 hover:card-shadow-lift hover:border-primary">
								<div className="flex items-start justify-between gap-4">
									<span className="p-3 rounded-xl bg-brand-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
										<span
											className={`mdi mdi-${
												FALLBACK_ICONS[index % FALLBACK_ICONS.length]
											} text-2xl`}
										/>
									</span>
									<span className="text-sm font-semibold tabular-nums tracking-[0.14em] text-on-surface/30">
										{String(index + 1).padStart(2, "0")}
									</span>
								</div>

								<h3 className="mt-6 text-xl sm:text-2xl font-medium tracking-tight text-ink leading-snug">
									{item.title}
								</h3>
								<p className="mt-3 text-sm sm:text-[15px] text-on-surface/60 leading-relaxed">
									{item.description}
								</p>
							</article>
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default WhatWeOfferSection;