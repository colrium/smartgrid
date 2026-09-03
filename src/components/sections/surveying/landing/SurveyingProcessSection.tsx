"use client";

import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home";
import { Blob } from "@/components/sections/home/decor";

interface ProcessItem {
	title: string;
	description?: string;
}

interface ProcessContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: ProcessItem[];
}

export function SurveyingProcessSection() {
	const { t } = useTranslation(["surveying/landing"]);
	const section = t("surveying/landing:process", { returnObjects: true }) as unknown as ProcessContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-[28rem] h-[28rem] bg-primary-200/40 -bottom-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					description={section.description || undefined}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % 3) * 0.07} className="h-full">
							<article className="group relative h-full flex flex-col gap-4 rounded-c bg-surface hairline card-shadow p-7 transition-all duration-500 hover:card-shadow-lift hover:border-primary overflow-hidden">
								<span className="absolute -top-5 -right-2 text-[6rem] font-bold leading-none text-primary/5 select-none pointer-events-none transition-colors duration-500 group-hover:text-primary/10">
									{String(index + 1).padStart(2, "0")}
								</span>

								<div className="relative flex items-center gap-4">
									<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-surface text-sm font-semibold">
										{String(index + 1).padStart(2, "0")}
									</span>
									<h3 className="text-base sm:text-lg font-medium tracking-tight text-ink leading-snug">
										{item.title}
									</h3>
								</div>

								{item.description && (
									<p className="relative flex-1 text-sm text-on-surface/60 leading-relaxed">
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

export default SurveyingProcessSection;
