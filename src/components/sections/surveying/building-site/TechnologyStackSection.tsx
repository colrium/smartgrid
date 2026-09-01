"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import Link from "next/link";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface TechItem {
	title: string;
	description?: string;
	icon?: string;
	href?: string | null;
}

interface TechnologyContent {
	tag?: string | null;
	headline: string;
	description?: string;
	learnMore?: string;
	items?: TechItem[];
}

const FALLBACK_ICONS = [
	"satellite-variant",
	"telescope",
	"quadcopter",
	"chart-bell-curve-cumulative",
	"radar",
];

export function TechnologyStackSection(): ReactElement {
	const { t } = useTranslation(["building-site-surveys"]);
	const section = t("building-site-surveys:technology", {
		returnObjects: true,
	}) as unknown as TechnologyContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return <></>;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-[26rem] h-[26rem] bg-primary-100/70 -top-24 -left-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					description={section.description || undefined}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 flex flex-wrap justify-center gap-5 sm:gap-6">
					{items.map((item, index) => (
						<FadeUp
							key={index}
							delay={(index % 3) * 0.07}
							className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1.334rem)]"
						>
							<article className="group relative h-full overflow-hidden rounded-2xl hairline bg-surface card-shadow p-7 transition-all duration-500 hover:-translate-y-1.5 hover:card-shadow-lift hover:border-primary">
								<span
									className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-primary-100/50 blur-[70px] transition-all duration-500 group-hover:bg-primary-100/80"
									aria-hidden
								/>

								<div className="relative flex items-start justify-between gap-4">
									<span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
										<span
											className={`mdi mdi-${item.icon ?? FALLBACK_ICONS[index % FALLBACK_ICONS.length]} text-2xl`}
										/>
									</span>
									<span className="flex items-end gap-1" aria-hidden>
										{[0, 1, 2].map((bar) => (
											<span
												key={bar}
												className={`w-1 rounded-full ${
													bar === 1
														? "h-6 bg-primary"
														: bar === 0
															? "h-4 bg-primary/50"
															: "h-5 bg-primary-300"
												}`}
											/>
										))}
									</span>
								</div>

								<h3 className="relative mt-6 text-lg font-medium tracking-tight text-ink leading-snug">
									{item.title}
								</h3>
								{item.description && (
									<p className="relative mt-3 text-sm text-on-surface/60 leading-relaxed">
										{item.description}
									</p>
								)}
								{item.href && section.learnMore && (
									<Link
										href={item.href}
										className="relative mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-700"
									>
										<span className="mdi mdi-arrow-top-right text-sm" />
										{section.learnMore}
									</Link>
								)}
							</article>
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default TechnologyStackSection;