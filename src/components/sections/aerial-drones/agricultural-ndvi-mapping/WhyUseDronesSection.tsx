"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface WhyUseItem {
	icon?: string;
	title: string;
	description: string;
}

interface WhyUseContent {
	tag?: string | null;
	headline: string;
	description?: string;
	image?: string | null;
	items: WhyUseItem[];
}

export function WhyUseDronesSection() {
	const { t } = useTranslation(["agricultural-ndvi-mapping"]);
	const section = t("agricultural-ndvi-mapping:whyUseDronesInAgriculture", {
		returnObjects: true,
	}) as unknown as WhyUseContent;
	const items = Array.isArray(section.items) ? section.items : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<Blob className="w-[28rem] h-[28rem] bg-brand-100/60 -bottom-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
					<FadeUp className="lg:col-span-6">
						<SectionHeader tag={section.tag} headline={section.headline} />

						{section.description && (
							<p className="mt-8 text-base sm:text-lg leading-relaxed text-on-surface/60 whitespace-pre-line">
								{section.description}
							</p>
						)}
					</FadeUp>

					<FadeUp delay={0.1} className="lg:col-span-6">
						{section.image && (
							<div className="relative mx-auto max-w-lg lg:max-w-none">
								<div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
								<div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />

								<div className="relative bg-surface p-4 rounded-[20px] hairline card-shadow">
									<div className="relative h-96 rounded-xl overflow-hidden bg-slate-900">
										<Image
											src={section.image}
											alt={section.headline}
											fill
											sizes="(min-width: 1024px) 50vw, 100vw"
											className="object-cover object-center transition-transform duration-700 hover:scale-105"
										/>
									</div>
								</div>
							</div>
						)}
					</FadeUp>
				</div>

				<div className="mt-14 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % 4) * 0.06}>
							<article className="group relative h-full flex flex-col gap-4 rounded-[20px] bg-surface hairline card-shadow p-7 transition-all duration-500 hover:card-shadow-lift hover:border-primary">
								{item.icon && (
									<span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
										<span className={`mdi mdi-${item.icon} text-lg`} />
									</span>
								)}

								<h3 className="text-base sm:text-lg font-medium tracking-tight text-ink leading-snug">
									{item.title}
								</h3>
								<p className="flex-1 text-sm text-on-surface/60 leading-relaxed">
									{item.description}
								</p>
							</article>
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default WhyUseDronesSection;