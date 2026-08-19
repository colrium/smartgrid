"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { SectionHeader } from "./SectionHeader";
import { FadeUp } from "@/components/animations/Fade";
import { ParallaxDecor, Blob } from "./decor";

interface InstrumentItem {
	label: string;
	img: string;
}

export function SurveyingInstrumentsSection() {
	const { t } = useTranslation(["home"]);
	const items = t("home:surveyingInstruments.items", {
		returnObjects: true,
	}) as unknown as InstrumentItem[];

	return (
		<section
			id="surveying-instruments"
			className="py-24 sm:py-28 relative overflow-hidden"
		>
			{/* Soft institutional background shapes */}
			<Blob className="w-[28rem] h-[28rem] bg-primary-200/40 top-1/2 right-8" opacity={0.55} />
			<ParallaxDecor speed={-0.06} className="absolute top-1/2 left-1/4 z-0">
				<Blob className="w-64 h-64 bg-primary-100/70" opacity={0.6} />
			</ParallaxDecor>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={t("home:surveyingInstruments.tag") as string}
					headline={t("home:surveyingInstruments.headline") as string}
					description={t("home:surveyingInstruments.description") as string}
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
					{Array.isArray(items) &&
						items.map((item, index) => (
							<FadeUp
								key={index}
								delay={(index % 4) * 0.08}
								className={index === 0 ? "sm:col-span-2 lg:col-span-2" : ""}
							>
								<article className="group relative h-64 sm:h-80 overflow-hidden rounded-2xl hairline bg-surface card-shadow transition-all duration-500 hover:-translate-y-1.5 hover:card-shadow-lift hover:border-primary-300">
									{item.img && (
										<Image
											src={item.img}
											alt={item.label}
											fill
											sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
											className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
										/>
									)}
									<div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />

									

									<div className="absolute inset-x-5 bottom-5">
										<span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-primary-200 mb-1.5">
											{t("home:surveyingInstruments.label", {
												defaultValue: "Instrument",
											}) as string}
										</span>
										<h3 className="flex items-end justify-between gap-3 text-xl sm:text-2xl font-light uppercase tracking-tight text-surface leading-none">
											{item.label}
											{/* <span className="mdi mdi-arrow-right shrink-0 text-primary-200 text-lg -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100" /> */}
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

export default SurveyingInstrumentsSection;