"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface TypeCategory {
	title: string;
	icon?: string;
	items: string[];
}

interface TypesOfResourceMappingContent {
	tag?: string | null;
	headline: string;
	description?: string;
	categories: TypeCategory[];
}

const FALLBACK_ICONS = ["earth", "factory", "tractor-variant", "city-variant"];

export function TypesOfResourceMappingSection(): ReactElement {
	const { t } = useTranslation(["surveying/resource-mapping"]);
	const section = t("surveying/resource-mapping:typesOfResourceMapping", {
		returnObjects: true,
	}) as unknown as TypesOfResourceMappingContent;
	const categories = Array.isArray(section.categories) ? section.categories : [];

	if (categories.length === 0) return <></>;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-[28rem] h-[28rem] bg-primary-100/60 -bottom-24 -left-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					description={section.description || undefined}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-5 sm:gap-6">
					{categories.map((category, catIndex) => (
						<FadeUp key={catIndex} delay={catIndex * 0.07} className="h-full">
							<article className="group relative h-full flex flex-col rounded-[20px] bg-surface hairline card-shadow p-7 transition-all duration-500 hover:card-shadow-lift hover:border-primary">
								<div className="flex items-center gap-3">
									<span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
										<span className={`mdi mdi-${category.icon || FALLBACK_ICONS[catIndex % FALLBACK_ICONS.length]} text-xl`} />
									</span>
									<h3 className="text-lg font-semibold tracking-tight text-ink leading-snug">
										{category.title}
									</h3>
								</div>

								<ul className="mt-5 flex-1 space-y-3">
									{category.items.map((item, itemIndex) => (
										<li key={itemIndex} className="flex items-start gap-3">
											<span className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
												<span className="mdi mdi-check text-xs" />
											</span>
											<span className="text-sm text-on-surface/70 leading-relaxed">
												{item}
											</span>
										</li>
									))}
								</ul>
							</article>
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default TypesOfResourceMappingSection;