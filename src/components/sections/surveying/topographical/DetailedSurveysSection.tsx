"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface DetailedItem {
	title: string;
	description: string;
	image?: string | null;
}

interface DetailedContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: DetailedItem[];
}

export function DetailedSurveysSection() {
	const { t } = useTranslation(["topographical-surveys"]);
	const section = t("topographical-surveys:detailedTopographicalSurveys", {
		returnObjects: true,
	}) as unknown as DetailedContent;
	const items = Array.isArray(section.items) ? section.items : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<Blob className="w-[26rem] h-[26rem] bg-brand-100/60 -top-20 right-0" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag}
					headline={section.headline}
					description={section.description}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % 4) * 0.08}>
							<article className="group relative h-full overflow-hidden rounded-2xl hairline bg-paper card-shadow transition-all duration-500 hover:-translate-y-1.5 hover:card-shadow-lift hover:border-brand-300 flex flex-col">
								{item.image && (
									<div className="relative h-52 overflow-hidden shrink-0">
										<Image
											src={item.image}
											alt={item.title}
											fill
											sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
											className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-ink/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
										<span className="absolute top-4 left-4 inline-flex items-center gap-2 glass rounded-full text-sm font-semibold uppercase tracking-[0.18em] text-ink px-3 py-1.5">
											<span className="h-1.5 w-1.5 rounded-full bg-primary" />
											{String(index + 1).padStart(2, "0")}
										</span>
									</div>
								)}

								<div className="flex-1 p-5 sm:p-6">
									<h3 className="text-lg font-medium tracking-tight text-ink leading-snug transition-colors duration-300 group-hover:text-primary">
										{item.title}
									</h3>
									<p className="mt-2.5 text-sm text-on-surface/60 leading-relaxed">
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

export default DetailedSurveysSection;