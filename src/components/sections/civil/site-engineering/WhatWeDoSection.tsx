"use client";

import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionTag } from "@/components/SectionTag";
import { Blob } from "@/components/sections/home/decor";

interface ServiceItem {
	title: string;
	description: string;
}

interface ServicesContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: ServiceItem[];
}

export function WhatWeDoSection() {
	const { t } = useTranslation(["civil-site-engineering"]);
	const section = t("civil-site-engineering:WhatWeDo", {
		returnObjects: true,
	}) as unknown as ServicesContent;
	const items = Array.isArray(section.items) ? section.items : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<Blob className="w-[28rem] h-[28rem] bg-brand-100/60 -bottom-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<div className="max-w-3xl">
					<FadeUp>
						{section.tag && <SectionTag>{section.tag}</SectionTag>}

						<h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight leading-[1.1] text-ink max-w-2xl">
							{section.headline}
						</h2>

						{section.description && (
							<p className="mt-8 text-base sm:text-lg leading-relaxed text-on-surface/60 whitespace-pre-line">
								{section.description}
							</p>
						)}
					</FadeUp>
				</div>

				<div className="mt-14 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % 3) * 0.07}>
							<article className="group relative h-full flex flex-col gap-4 rounded-[20px] bg-surface hairline card-shadow p-7 transition-all duration-500 hover:card-shadow-lift hover:border-primary">
								<span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
									<span className="text-sm font-semibold tracking-wide">
										{String(index + 1).padStart(2, "0")}
									</span>
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

export default WhatWeDoSection;