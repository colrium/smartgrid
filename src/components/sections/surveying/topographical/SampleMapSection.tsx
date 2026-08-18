"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface SampleMapContent {
	tag?: string | null;
	headline: string;
	description: string;
	map: {
		title: string;
		description: string;
		image?: string | null;
		items: string[];
	};
}

export function SampleMapSection() {
	const { t } = useTranslation(["topographical-surveys"]);
	const section = t("topographical-surveys:sampleTopographicalMap", {
		returnObjects: true,
	}) as unknown as SampleMapContent;
	const highlights = Array.isArray(section.map?.items) ? section.map.items : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-[26rem] h-[26rem] bg-primary-100/60 -bottom-24 -left-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag}
					headline={section.headline}
					description={section.description}
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
					{/* Highlights list */}
					<FadeUp className="lg:col-span-5">
						<div className="relative rounded-r-[20px] border-l-2 border-primary bg-surface hairline p-8 sm:p-10 card-shadow">
							<span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
								<span className="h-1.5 w-1.5 rounded-full bg-primary" />
								{section.map?.title}
							</span>

							<p className="mt-4 text-sm sm:text-[15px] text-on-surface/60 leading-relaxed">
								{section.map?.description}
							</p>

							<ul className="mt-8 space-y-4">
								{highlights.map((item, index) => (
									<li
										key={index}
										className="flex items-start gap-3.5 text-sm sm:text-[15px] text-on-surface/80 leading-relaxed"
									>
										<span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-primary-50 text-primary flex items-center justify-center">
											<span className="mdi mdi-check text-xs" />
										</span>
										{item}
									</li>
								))}
							</ul>
						</div>
					</FadeUp>

					{/* Map frame */}
					<FadeUp delay={0.1} className="lg:col-span-7">
						{section.map?.image && (
							<div className="relative">
								<div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
								<div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />

								<figure className="relative bg-surface p-4 rounded-[20px] hairline card-shadow overflow-hidden">
									<div className="relative h-[28rem] rounded-xl overflow-hidden bg-slate-900">
										<Image
											src={section.map.image}
											alt={section.map.title}
											fill
											sizes="(min-width: 1024px) 58vw, 100vw"
											className="object-cover object-center"
										/>
									</div>
								</figure>
							</div>
						)}
					</FadeUp>
				</div>
			</div>
		</section>
	);
}

export default SampleMapSection;