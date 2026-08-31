"use client";

import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home";

interface MethodItem {
	title: string;
	description?: string;
}

interface MethodologyContent {
	tag?: string | null;
	headline: string;
	items: MethodItem[];
}

const METHOD_ICONS = ["clipboard-text-search-outline", "radar", "chart-timeline-variant"];

export function GprMethodologySection() {
	const { t } = useTranslation(["ground-penetrating-radar"]);
	const section = t("ground-penetrating-radar:methodology", {
		returnObjects: true,
	}) as unknown as MethodologyContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<section id="methodology" className="scroll-mt-36 py-20 sm:py-24 relative overflow-hidden bg-surface">
			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					align="center"
				/>

				<div className="mt-14 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
					{items.map((item, index) => (
						<FadeUp key={index} delay={index * 0.08}>
							<article className="relative flex flex-col items-center text-center gap-4 px-4">
								<div className="relative">
									<span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary">
										<span className={`mdi mdi-${METHOD_ICONS[index % METHOD_ICONS.length]} text-2xl`} />
									</span>
									<span className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-ink text-[10px] font-semibold text-surface">
										{String(index + 1).padStart(2, "0")}
									</span>
									{index < items.length - 1 && (
										<span
											className="hidden md:block absolute top-1/2 -translate-y-1/2 left-full w-8 lg:w-16 border-t-2 border-dashed border-primary/30"
											aria-hidden
										/>
									)}
								</div>

								<h3 className="text-base font-semibold tracking-tight text-ink leading-snug max-w-[16rem]">
									{item.title}
								</h3>

								{item.description && (
									<p className="text-[13px] text-on-surface/60 leading-relaxed max-w-[17rem]">
										{item.description}
									</p>
								)}
							</article>
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default GprMethodologySection;
