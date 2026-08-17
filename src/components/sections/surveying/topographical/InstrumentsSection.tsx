"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob, ParallaxDecor } from "@/components/sections/home/decor";

interface InstrumentItem {
	label: string;
	image?: string | null;
}

interface InstrumentsContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: InstrumentItem[];
}

export function InstrumentsSection() {
	const { t } = useTranslation(["topographical-surveys"]);
	const section = t("topographical-surveys:surveyingInstruments", {
		returnObjects: true,
	}) as unknown as InstrumentsContent;
	const items = Array.isArray(section.items) ? section.items : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<Blob className="w-[28rem] h-[28rem] bg-brand-200/40 -top-24 -right-24" opacity={0.5} />
			<ParallaxDecor speed={-0.06} className="absolute top-1/2 left-1/4 z-0">
				<Blob className="w-64 h-64 bg-brand-100/70" opacity={0.6} />
			</ParallaxDecor>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag}
					headline={section.headline}
					description={section.description}
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % 4) * 0.08}>
							<article className="group relative h-64 sm:h-80 overflow-hidden rounded-2xl hairline bg-surface card-shadow transition-all duration-500 hover:-translate-y-1.5 hover:card-shadow-lift hover:border-brand-300">
								{item.image && (
									<Image
										src={item.image}
										alt={item.label}
										fill
										sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
										className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
									/>
								)}
								<div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />

								<span className="absolute top-4 left-4 inline-flex items-center gap-2 glass rounded-lg text-[11px] font-semibold uppercase tracking-[0.18em] text-ink px-3 py-1.5">
									<span className="h-1.5 w-1.5 rounded-full bg-primary" />
									{String(index + 1).padStart(2, "0")}
								</span>

								<div className="absolute inset-x-5 bottom-5">
									<h3 className="flex items-end justify-between gap-3 text-xl sm:text-2xl font-light uppercase tracking-tight text-surface leading-none">
										{item.label}
										<span className="mdi mdi-arrow-right shrink-0 text-brand-200 text-lg -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" />
									</h3>
								</div>
							</article>
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default InstrumentsSection;