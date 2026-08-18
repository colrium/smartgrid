"use client";

import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob, ParallaxDecor } from "@/components/sections/home/decor";

interface WhyStandOutItem {
	icon?: string;
	title: string;
	description: string;
}

interface WhyStandOutContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: WhyStandOutItem[];
}

export function WhyStandOutSection() {
	const { t } = useTranslation(["resource-mapping"]);
	const section = t("resource-mapping:whySmartGridStandsOut", {
		returnObjects: true,
	}) as unknown as WhyStandOutContent;
	const items = Array.isArray(section.items) ? section.items : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<Blob className="w-[28rem] h-[28rem] bg-primary-100/60 -bottom-24 -left-24" opacity={0.5} />
			<ParallaxDecor speed={-0.06} className="absolute top-16 -right-24 z-0">
				<Blob className="w-72 h-72 bg-primary-200/70" opacity={0.6} />
			</ParallaxDecor>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag}
					headline={section.headline}
					description={section.description}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % 4) * 0.07}>
							<article className="group relative h-full flex flex-col items-center gap-4 rounded-[20px] bg-surface hairline card-shadow p-8 text-center transition-all duration-500 hover:card-shadow-lift hover:border-primary">
								{item.icon && (
									<span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
										<span className={`mdi mdi-${item.icon} text-2xl`} />
									</span>
								)}

								<h3 className="text-lg font-medium tracking-tight text-ink leading-snug">
									{item.title}
								</h3>
								<p className="flex-1 text-sm text-on-surface/60 leading-relaxed">
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

export default WhyStandOutSection;