"use client";

import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface HowItWorksItem {
	title: string;
	description: string;
}

interface HowItWorksContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: HowItWorksItem[];
}

export function HowItWorksSection() {
	const { t } = useTranslation(["lidar-mapping"]);
	const section = t("lidar-mapping:howItWorks", {
		returnObjects: true,
	}) as unknown as HowItWorksContent;
	const items = Array.isArray(section.items) ? section.items : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden ">
			<Blob className="w-[28rem] h-[28rem] bg-brand-100/60 -bottom-24 -right-24" opacity={0.5} />

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
							<article className="group relative h-full flex flex-col gap-4 rounded-[20px] bg-surface hairline card-shadow p-7 transition-all duration-500 hover:card-shadow-lift hover:border-primary">
								<span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white font-semibold card-shadow-lift">
									{String(index + 1).padStart(2, "0")}
								</span>

								<h3 className="text-base sm:text-lg font-medium tracking-tight text-ink leading-snug">
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

export default HowItWorksSection;