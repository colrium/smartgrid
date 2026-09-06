"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface WhoUsesItem {
	icon?: string | null;
	title: string;
	description?: string;
	href?: string | null;
}

interface WhoUsesCategory {
	title: string;
	icon?: string;
	items: WhoUsesItem[];
}

interface WhoUsesResourceMappingContent {
	tag?: string | null;
	headline: string;
	description?: string;
	categories: WhoUsesCategory[];
}

const FALLBACK_ICONS = [
	"city",
	"bridge",
	"transmission-tower",
	"earth",
	"briefcase",
];

export function WhoUsesResourceMappingSection(): ReactElement {
	const { t } = useTranslation(["surveying/resource-mapping"]);
	const section = t("surveying/resource-mapping:whoUsesResourceMapping", {
		returnObjects: true,
	}) as unknown as WhoUsesResourceMappingContent;
	const categories = Array.isArray(section.categories) ? section.categories : [];

	if (categories.length === 0) return <></>;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-[28rem] h-[28rem] bg-primary-100/60 -bottom-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					description={section.description || undefined}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
					{categories.map((category, catIndex) => (
						<FadeUp key={catIndex} delay={catIndex * 0.08} className="h-full">
							<article className="group relative h-full flex flex-col rounded-c bg-surface hairline card-shadow p-7 transition-all duration-250 hover:card-shadow-lift hover:border-primary">
								<div className="flex items-center gap-3">
									<span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
										<span className={`mdi mdi-${category.icon || FALLBACK_ICONS[catIndex % FALLBACK_ICONS.length]} text-xl`} />
									</span>
									<h3 className="text-lg font-semibold tracking-tight text-ink leading-snug">
										{category.title}
									</h3>
								</div>

								<ul className="mt-5 flex-1 space-y-4">
									{category.items.map((item, itemIndex) => (
										<li key={itemIndex} className="flex items-start gap-3">
											{item.icon && (
												<span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
													<span className={`mdi mdi-${item.icon} text-xs`} />
												</span>
											)}
											<div className="flex-1 min-w-0">
												{item.href ? (
													<a
														href={item.href}
														className="group inline-flex items-start gap-2"
													>
														<h4 className="text-base font-medium tracking-tight text-ink leading-snug group-hover:text-primary transition-colors">
															{item.title}
														</h4>
														<span className="mdi mdi-arrow-top-right text-sm text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
													</a>
												) : (
													<h4 className="text-base font-medium tracking-tight text-ink leading-snug">
														{item.title}
													</h4>
												)}
												{item.description && (
													<p className="mt-1.5 text-sm text-on-surface/60 leading-relaxed">
														{item.description}
													</p>
												)}
											</div>
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

export default WhoUsesResourceMappingSection;