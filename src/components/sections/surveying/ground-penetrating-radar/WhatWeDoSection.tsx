"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob, ParallaxDecor } from "@/components/sections/home/decor";

interface WhatWeDoItem {
	icon?: string;
	image?: string | null;
	title: string;
	description: string;
}

interface WhatWeDoContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: WhatWeDoItem[];
}

export function WhatWeDoSection() {
	const { t } = useTranslation(["ground-penetrating-radar"]);
	const section = t("ground-penetrating-radar:whatWeDo", {
		returnObjects: true,
	}) as unknown as WhatWeDoContent;
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
					description={section.description}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % 3) * 0.08}>
							<article className="group relative h-full flex flex-col overflow-hidden rounded-[20px] bg-surface hairline card-shadow transition-all duration-500 hover:card-shadow-lift hover:border-primary">
								{item.image && (
									<div className="relative h-96 overflow-hidden bg-slate-900">
										<Image
											src={item.image}
											alt={item.title}
											fill
											sizes="(min-width: 1024px) 33vw, 100vw"
											className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
									</div>
								)}

								<div className="flex flex-col flex-1 p-8">
									{item.icon && (
										<span className="self-start  mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white card-shadow-lift">
											<span className={`mdi mdi-${item.icon} text-xl`} />
										</span>
									)}

									<h3 className="text-lg sm:text-xl font-medium tracking-tight text-ink leading-snug">
										{item.title}
									</h3>
									<p className="mt-3 flex-1 text-sm text-on-surface/60 leading-relaxed">
										{item.description}
									</p>
								</div>
							</article>
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default WhatWeDoSection;