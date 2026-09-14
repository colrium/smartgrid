"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import Link from "@/components/Link";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/shared/decor";

interface RelatedItem {
	icon?: string | null;
	title: string;
	href?: string | null;
}

interface RelatedServicesContent {
	tag?: string | null;
	headline: string;
	description?: string;
	bottomNote?: string | null;
	items?: RelatedItem[] | null;
}

export function GisRelatedServicesSection(): ReactElement {
	const { t } = useTranslation(["surveying/gis-mapping"]);
	const section = t("surveying/gis-mapping:relatedServices", {
		returnObjects: true,
	}) as unknown as RelatedServicesContent;
	const items = (Array.isArray(section?.items) ? section.items : []).filter(
		(item) => typeof item.href === "string" && item.href.startsWith("/"),
	);

	if (items.length === 0) return <></>;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<Blob className="w-[26rem] h-[26rem] bg-primary-100/60 -bottom-24 -left-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					description={section.description || undefined}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % 3) * 0.07} className="h-full">
							<Link href={item.href as string} className="block h-full">
								<article className="group relative h-full flex flex-col rounded-c bg-paper hairline card-shadow p-7 transition-all duration-250 hover:card-shadow-lift hover:border-primary">
									<div className="flex items-start justify-between gap-4">
										<span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
											<span className={`mdi mdi-${item.icon || "map"} text-2xl`} />
										</span>
										<span
											aria-hidden
											className="mdi mdi-arrow-top-right text-xl text-on-surface/25 transition-all duration-300 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
										/>
									</div>
									<h3 className="mt-6 text-base sm:text-lg font-semibold tracking-tight text-ink leading-snug">
										{item.title}
									</h3>
									<span className="mt-auto pt-4 inline-flex items-center gap-2 text-sm font-medium text-primary">
										<span className="mdi mdi-arrow-right transition-transform duration-300 group-hover:translate-x-1" />
									</span>
								</article>
							</Link>
						</FadeUp>
					))}
				</div>

				{section.bottomNote && (
					<FadeUp delay={0.15}>
						<p className="mt-12 flex flex-wrap items-center justify-center gap-2 text-center text-sm sm:text-base text-on-surface/55">
							<span aria-hidden className="mdi mdi-database-outline text-lg text-primary" />
							{section.bottomNote}
							<Link
								href="/contact"
								className="inline-flex items-center gap-1.5 font-semibold text-primary transition-colors duration-300 hover:text-primary-700"
							>
								Get in touch
								<span aria-hidden className="mdi mdi-arrow-right text-base" />
							</Link>
						</p>
					</FadeUp>
				)}
			</div>
		</section>
	);
}

export default GisRelatedServicesSection;