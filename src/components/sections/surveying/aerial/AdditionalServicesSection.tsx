"use client";

import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface AdditionalServicesContent {
	tag?: string | null;
	headline: string;
	items: string[];
	description?: string;
}

export function AdditionalServicesSection() {
	const { t } = useTranslation(["aerial-surveys"]);
	const section = t("aerial-surveys:additionalServices", {
		returnObjects: true,
	}) as unknown as AdditionalServicesContent;
	const items = Array.isArray(section.items) ? section.items : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-[28rem] h-[28rem] bg-brand-200/40 -bottom-24 -left-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag}
					headline={section.headline}
					align="center"
				/>

				<div className="mt-12 sm:mt-16 flex flex-col items-center gap-10 sm:gap-14">
					<div className="flex flex-wrap justify-center gap-3 sm:gap-4">
						{items.map((item, index) => (
							<FadeUp key={index} delay={index * 0.06}>
								<span className="inline-flex items-center gap-2.5 rounded-full border border-ink/10 bg-surface px-6 py-3 text-sm font-medium text-on-surface/80 card-shadow transition-colors duration-300 hover:border-primary hover:text-primary">
									<span className="mdi mdi-camera text-primary" />
									{item}
								</span>
							</FadeUp>
						))}
					</div>

					{section.description && (
						<FadeUp delay={0.15}>
							<p className="max-w-3xl text-center text-base sm:text-lg leading-relaxed text-on-surface/60">
								{section.description}
							</p>
						</FadeUp>
					)}
				</div>
			</div>
		</section>
	);
}

export default AdditionalServicesSection;