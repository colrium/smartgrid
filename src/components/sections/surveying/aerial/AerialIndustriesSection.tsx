"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import Link from "@/components/Link";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface IndustryItem {
	icon?: string | null;
	title: string;
	description?: string;
	href?: string | null;
}

interface IndustriesContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: IndustryItem[];
}

const FALLBACK_ICONS = [
	"road-variant",
	"domain",
	"transmission-tower",
	"pickaxe",
	"sprout",
	"bank",
	"forest",
];

export function AerialIndustriesSection(): ReactElement {
	const { t } = useTranslation(["surveying/aerial-surveys"]);
	const section = t("surveying/aerial-surveys:industries", {
		returnObjects: true,
	}) as unknown as IndustriesContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return <></>;

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

				<div className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
					{items.map((item, index) => {
						const isWide = index === items.length - 1 && items.length % 3 === 1;
						const isLinked = Boolean(item.href);

						const card = (
							<article
								className={`group relative h-full rounded-[20px] bg-surface hairline card-shadow p-7 transition-all duration-500 hover:card-shadow-lift ${
									isLinked ? "hover:border-primary cursor-pointer" : ""
								} ${isWide ? "lg:col-span-3 lg:flex lg:items-center lg:gap-8" : "flex flex-col"}`}
							>
								<div className="flex items-start justify-between gap-4">
									<span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
										<span
											className={`mdi mdi-${
												item.icon || FALLBACK_ICONS[index % FALLBACK_ICONS.length]
											} text-xl`}
										/>
									</span>
									{isLinked && (
										<span className="mdi mdi-arrow-top-right text-xl text-primary transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
									)}
								</div>

								<h3 className={`mt-5 text-base sm:text-lg font-semibold tracking-tight text-ink leading-snug ${isWide ? "lg:mt-0 lg:min-w-[16rem]" : ""}`}>
									{item.title}
								</h3>

								{item.description && (
									<p className={`text-sm text-on-surface/60 leading-relaxed ${isWide ? "lg:flex-1" : "mt-2.5"}`}>
										{item.description}
									</p>
								)}
							</article>
						);

						return (
							<FadeUp
								key={index}
								delay={(index % 3) * 0.07}
								className={`h-full ${isWide ? "lg:col-span-3" : ""}`}
							>
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

export default AerialIndustriesSection;