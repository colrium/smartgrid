"use client";

import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface WhyItem {
	title: string;
	description: string;
}

interface WhyContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: WhyItem[];
}

export function WhyConductSection() {
	const { t } = useTranslation(["topographical-surveys"]);
	const section = t("topographical-surveys:whyConductSurvey", {
		returnObjects: true,
	}) as unknown as WhyContent;
	const items = Array.isArray(section.items) ? section.items : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-[26rem] h-[26rem] bg-brand-100/60 -top-20 right-0" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag}
					headline={section.headline}
					description={section.description}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % 3) * 0.08}>
							<article className="group relative h-full border-t-2 border-primary/20 bg-surface hairline card-shadow rounded-b-[20px] p-8 transition-all duration-500 hover:-translate-y-1.5 hover:card-shadow-lift hover:border-t-primary">
								<div className="flex items-center justify-between gap-4">
									<span className="text-sm font-semibold tabular-nums tracking-[0.14em] text-primary">
										{String(index + 1).padStart(2, "0")}
									</span>
									<span className="mdi mdi-crosshairs-gps text-xl text-on-surface/20 transition-colors duration-300 group-hover:text-primary" />
								</div>

								<h3 className="mt-5 text-xl sm:text-2xl font-medium tracking-tight text-ink leading-snug">
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

export default WhyConductSection;