"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import Link from "@/components/Link";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface TechItem {
	icon?: string | null;
	title: string;
	note?: string | null;
	href?: string | null;
}

interface ResourceMappingTechStackContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items?: TechItem[] | null;
}

const FALLBACK_ICONS = ["drone", "cube-scan", "crosshairs-gps", "map-legend", "satellite-variant", "robot-outline"];

export function ResourceMappingTechStackSection(): ReactElement {
	const { t } = useTranslation(["surveying/resource-mapping"]);
	const section = t("surveying/resource-mapping:techStack", {
		returnObjects: true,
	}) as unknown as ResourceMappingTechStackContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return <></>;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<Blob className="w-[28rem] h-[28rem] bg-primary-200/40 -bottom-24 -left-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					description={section.description || undefined}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
					{items.map((item, index) => {
						const isLinked = Boolean(item.href);

						const card = (
							<article
								className={`group relative h-full flex flex-col rounded-c bg-paper hairline card-shadow p-7 transition-all duration-250 hover:card-shadow-lift ${
									isLinked ? "hover:border-primary cursor-pointer" : "hover:border-primary/30"
								}`}
							>
								<div className="flex items-center justify-between gap-4">
									<span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
										<span
											className={`mdi mdi-${
												item.icon || FALLBACK_ICONS[index % FALLBACK_ICONS.length]
											} text-2xl`}
										/>
									</span>
									{isLinked && (
										<span className="mdi mdi-arrow-top-right text-xl text-primary transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
									)}
								</div>

								<h3 className="mt-6 text-lg font-semibold tracking-tight text-ink leading-snug">
									{item.title}
								</h3>
								{item.note && (
									<p className="mt-2.5 text-sm text-on-surface/60 leading-relaxed">
										{item.note}
									</p>
								)}
							</article>
						);

						return (
							<FadeUp key={index} delay={(index % 3) * 0.07} className="h-full">
								{isLinked ? (
									<Link href={item.href as string} className="block h-full">
										{card}
									</Link>
								) : (
									card
								)}
							</FadeUp>
						);
					})}
				</div>
			</div>
		</section>
	);
}

export default ResourceMappingTechStackSection;