"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface AerialSurveyItem {
	label: string;
	image?: string | null;
}

interface AerialSurveyingContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: AerialSurveyItem[];
}

export function AerialSurveyingSection() {
	const { t } = useTranslation(["aerial-surveys"]);
	const section = t("aerial-surveys:aerialSurveying", {
		returnObjects: true,
	}) as unknown as AerialSurveyingContent;
	const items = Array.isArray(section.items) ? section.items : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-104 h-104 bg-brand-100/70 -top-24 -left-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<div className="flex flex-col items-center">
					<FadeUp className="my-6">
						<SectionHeader
							tag={section.tag}
							headline={section.headline}
						/>
						<div className="mt-8">
							<p className="text-base sm:text-lg leading-relaxed text-on-surface/60 whitespace-pre-line">
								{section.description}
							</p>
						</div>
					</FadeUp>

					<div >
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
							{items.map((item, index) => (
								<FadeUp key={index} delay={(index % 2) * 0.05}>
									<article className="group relative h-64 sm:h-72 overflow-hidden rounded-2xl hairline bg-surface card-shadow transition-all duration-500 hover:-translate-y-1 hover:card-shadow-lift hover:border-brand-300">
										{item.image && (
											<Image
												src={item.image}
												alt={item.label}
												fill
												sizes="(min-width: 1024px) 35vw, (min-width: 640px) 50vw, 100vw"
												className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
											/>
										)}
										<div className="absolute inset-0 bg-linear-to-r from-ink/80 via-ink/40 to-ink/10 transition-opacity duration-300" />

										<div className="relative h-full flex items-center gap-4 px-5">
											<span className="h-1.5 w-1.5 rounded-full bg-brand-200 shrink-0" />
											<span className="text-sm sm:text-base font-medium text-white leading-snug">
												{item.label}
											</span>
											<span className="mdi mdi-arrow-right ml-auto text-white/40 text-lg -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 group-hover:text-brand-200" />
										</div>
									</article>
								</FadeUp>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default AerialSurveyingSection;