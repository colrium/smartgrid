"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface ImpactItem {
	icon?: string | null;
	title: string;
}

interface ProjectImpactContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items?: ImpactItem[] | null;
}

export function GisProjectImpactSection(): ReactElement {
	const { t } = useTranslation(["surveying/gis-mapping"]);
	const section = t("surveying/gis-mapping:projectImpact", {
		returnObjects: true,
	}) as unknown as ProjectImpactContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return <></>;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<Blob className="w-[26rem] h-[26rem] bg-primary-200/40 -top-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					description={section.description || undefined}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % 5) * 0.06} className="h-full">
							<article className="group relative h-full flex flex-col gap-6 rounded-[20px] bg-paper hairline card-shadow p-6 transition-all duration-500 hover:card-shadow-lift hover:border-primary">
								<span
									aria-hidden
									className="text-4xl font-light leading-none tracking-tighter text-primary/20 transition-colors duration-500 group-hover:text-primary/50"
								>
									{String(index + 1).padStart(2, "0")}
								</span>
								<div className="mt-auto flex flex-col gap-3">
									<span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
										<span className={`mdi mdi-${item.icon || "trending-up"} text-lg`} />
									</span>
									<h3 className="text-sm sm:text-[15px] font-medium tracking-tight text-ink leading-snug">
										{item.title}
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

export default GisProjectImpactSection;