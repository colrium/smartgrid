"use client";

import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home";

interface OverviewContent {
	tag?: string | null;
	headline: string;
	paragraphs?: string[] | null;
}

export function GprOverviewSection() {
	const { t } = useTranslation(["ground-penetrating-radar"]);
	const section = t("ground-penetrating-radar:overview", {
		returnObjects: true,
	}) as unknown as OverviewContent;
	const paragraphs = Array.isArray(section?.paragraphs) ? section.paragraphs : [];

	if (paragraphs.length === 0) return null;

	return (
		<section id="overview" className="scroll-mt-36 py-20 sm:py-24 relative overflow-hidden">
			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					align="center"
				/>

				<div className="mt-10 max-w-3xl mx-auto flex flex-col gap-5">
					{paragraphs.map((paragraph, index) => (
						<FadeUp key={index} delay={index * 0.06}>
							<p className="text-sm sm:text-base text-on-surface/65 leading-relaxed text-center">
								{paragraph}
							</p>
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default GprOverviewSection;
