"use client";

import type { ReactElement } from "react";
import Image from "next/image";

import { useTranslation } from "@/hooks";
import Link from "@/components/Link";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob, ParallaxDecor } from "@/components/sections/home/decor";

interface NeedItem {
	icon?: string | null;
	title: string;
	description?: string;
	href?: string | null;
}

interface WhenYouNeedContent {
	tag?: string | null;
	headline: string;
	description?: string;
	image?: string | null;
	imageBadge?: string | null;
	items: NeedItem[];
}

const FALLBACK_ICONS = [
	"file-certificate-outline",
	"grid-large",
	"scale-balance",
	"account-hard-hat",
	"domain",
	"shield-sun-outline",
	"fence",
];

export function WhenYouNeedSection(): ReactElement {
	const { t } = useTranslation(["surveying/cadastral-surveys"]);
	const section = t("surveying/cadastral-surveys:whenYouNeed", {
		returnObjects: true,
	}) as unknown as WhenYouNeedContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return <></>;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-[28rem] h-[28rem] bg-primary-100/60 -bottom-24 -right-24" opacity={0.5} />
			<ParallaxDecor speed={-0.06} className="absolute top-24 -left-24 z-0">
				<Blob className="w-72 h-72 bg-primary-50" opacity={0.6} />
			</ParallaxDecor>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					description={section.description || undefined}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
					{section.image && (
						<FadeUp className="lg:col-span-5 pb-6">
							<div className="relative">
								<div className="relative bg-surface p-4 rounded-[20px] hairline card-shadow">
									<div className="relative aspect-4/5 rounded-xl overflow-hidden bg-slate-900">
										<Image
											src={section.image}
											alt={section.headline}
											fill
											sizes="(min-width: 1024px) 40vw, 100vw"
											className="object-fill object-center transition-transform duration-700 hover:scale-105"
										/>
									</div>
								</div>
								{section.imageBadge && (
									<div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center text-center gap-2 rounded-full bg-accent px-3 py-2.5 text-[9px] text-surface card-shadow">
										<span className="mdi mdi-shield-check text-md text-surface" />
										{section.imageBadge}
									</div>
								)}
							</div>
						</FadeUp>
					)}

					<div
						className={`grid grid-cols-1 sm:grid-cols-2 gap-5 ${
							section.image ? "lg:col-span-7" : "lg:col-span-12"
						}`}
					>
						{items.map((item, index) => {
							const isWide = index === items.length - 1 && items.length % 2 === 1;
							const isLinked = Boolean(item.href);

							const card = (
								<article
									className={`group relative h-full rounded-[20px] bg-paper hairline card-shadow p-7 transition-all duration-500 hover:card-shadow-lift ${
										isLinked ? "hover:border-primary cursor-pointer" : ""
									} ${isWide ? "sm:col-span-2 sm:flex sm:items-center sm:gap-7" : "flex flex-col gap-3"}`}
								>
									<div className={isWide ? "flex items-start gap-5 sm:shrink-0" : "flex items-start justify-between gap-4"}>
										<span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
											<span
												className={`mdi mdi-${
													item.icon || FALLBACK_ICONS[index % FALLBACK_ICONS.length]
												} text-xl`}
											/>
										</span>
										<span className="text-sm font-semibold tabular-nums tracking-[0.14em] text-on-surface/30">
											{String(index + 1).padStart(2, "0")}
										</span>
									</div>

									<div className={isWide ? "sm:min-w-0" : ""}>
										<h3 className="text-base font-semibold tracking-tight text-ink leading-snug">
											{item.title}
										</h3>
										{item.description && (
											<p className={`text-sm text-on-surface/60 leading-relaxed ${isWide ? "sm:mt-2" : "mt-2"}`}>
												{item.description}
											</p>
										)}
									</div>

									{isLinked && (
										<span
											className={`mdi mdi-arrow-top-right text-xl text-primary transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${
												isWide ? "sm:ml-auto sm:self-center" : "absolute top-6 right-6"
											}`}
										/>
									)}
								</article>
							);

							return (
								<FadeUp key={index} delay={(index % 2) * 0.07} className={isWide ? "sm:col-span-2" : ""}>
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
			</div>
		</section>
	);
}

export default WhenYouNeedSection;