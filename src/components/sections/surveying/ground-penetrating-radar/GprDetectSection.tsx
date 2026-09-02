"use client";

import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home";
import { Blob, ParallaxDecor } from "@/components/sections/home/decor";

interface DetectItem {
	icon?: string | null;
	title: string;
	note?: string | null;
}

interface DetectContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	items: DetectItem[];
}

const FALLBACK_ICONS = [
	"pipe",
	"barrel-outline",
	"cable-data",
	"access-point-network",
	"circle-multiple",
	"archive-outline",
];

export function GprDetectSection() {
	const { t } = useTranslation(["surveying/ground-penetrating-radar"]);
	const section = t("surveying/ground-penetrating-radar:detectCaps", {
		returnObjects: true,
	}) as unknown as DetectContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<section id="detect" className="scroll-mt-36 py-20 sm:py-24 relative overflow-hidden bg-surface">
			<Blob className="w-[26rem] h-[26rem] bg-primary-100/60 -top-24 right-0" opacity={0.5} />
			<ParallaxDecor speed={-0.06} className="absolute bottom-16 -left-24 z-0">
				<Blob className="w-64 h-64 bg-primary-50" opacity={0.6} />
			</ParallaxDecor>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					description={section.description || undefined}
					align="center"
				/>

				<div className="mt-14 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % 3) * 0.07} className="h-full">
							<article className="group relative h-full flex items-center gap-4 rounded-[16px] bg-paper hairline card-shadow p-5 sm:p-6 transition-all duration-500 hover:card-shadow-lift hover:border-primary">
								<span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
									<span
										className={`mdi mdi-${item.icon || FALLBACK_ICONS[index % FALLBACK_ICONS.length]} text-xl`}
									/>
								</span>
								<div className="min-w-0">
									<h3 className="text-sm sm:text-[15px] font-semibold tracking-tight text-ink leading-snug">
										{item.title}
									</h3>
									{item.note && (
										<p className="mt-0.5 text-xs text-on-surface/50 leading-snug">
											{item.note}
										</p>
									)}
								</div>
							</article>
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default GprDetectSection;