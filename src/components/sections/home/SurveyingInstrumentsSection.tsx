"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { SectionHeader } from "./SectionHeader";
import { FadeUp } from "@/components/animations/Fade";

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
			<div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
			<div className="absolute -bottom-24 -left-24 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

			<div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
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
								delay={index * 0.08}
								className={index === 0 ? "sm:col-span-2 lg:col-span-2" : ""}
							>
								<article className="group relative h-64 sm:h-80 overflow-hidden rounded-3xl bg-surface border border-slate-200/70 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
									{item.img && (
										<Image
											src={item.img}
											alt={item.label}
											fill
											sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
											className="object-cover transition-transform duration-500 group-hover:scale-110"
										/>
									)}
									<div className="absolute inset-0 bg-gradient-to-t from-on-surface via-on-surface/30 to-transparent opacity-90" />

									<span className="absolute top-4 right-4 w-9 h-9 rounded-full bg-surface/80 backdrop-blur-sm flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
										<span className="mdi mdi-arrow-top-right text-lg" />
									</span>

									<div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
										<span className="inline-block text-[11px] font-mono uppercase tracking-[0.18em] text-primary font-semibold mb-2">
											{t("home:surveyingInstruments.label", {
												defaultValue: "Instrument",
											}) as string}
										</span>
										<h3 className="text-lg sm:text-xl font-bold text-surface leading-snug uppercase">
											{item.label}
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