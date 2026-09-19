"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import Link from "@/components/Link";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/shared/decor";

interface CostTier {
	icon?: string | null;
	title: string;
	price: string;
	priceUnit?: string | null;
	note?: string | null;
	features?: string[] | null;
	featured?: boolean;
}

interface CostContent {
	tag?: string | null;
	headline: string;
	description?: string;
	featuredLabel?: string | null;
	tiers?: CostTier[] | null;
	cta?: { label?: string; href?: string; icon?: string | null } | null;
}

export interface CadastralCostData {
	tag?: string | null;
	headline: string;
	description?: string;
	featuredLabel?: string | null;
	tiers?: CostTier[] | null;
	cta?: { label?: string; href?: string; icon?: string | null } | null;
}

export function CostSection({ data, id }: { data?: CadastralCostData | null; id?: string } = {}): ReactElement {
	const { t } = useTranslation(["surveying/cadastral-surveys"]);
	// Keystatic-owned content when `data` is provided (M11 `cadastralCost`
	// unique section); legacy locale strings otherwise.
	const section = (data ??
		(t("surveying/cadastral-surveys:cost", {
			returnObjects: true,
		}) as unknown as CostContent)) as CostContent;
	const tiers = Array.isArray(section?.tiers) ? section.tiers : [];

	if (tiers.length === 0) return <></>;

	return (
		<section id={id} className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<Blob
				className="w-[28rem] h-[28rem] bg-primary-100/60 -bottom-24 -left-24"
				opacity={0.5}
			/>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					description={section.description || undefined}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
					{tiers.map((tier, index) => (
						<FadeUp key={index} delay={index * 0.08} className="h-full">
							<article
								className={`relative h-full flex flex-col rounded-c bg-paper hairline card-shadow p-8 transition-all duration-250 hover:card-shadow-lift ${
									tier.featured
										? " card-shadow-lift border-primary/30! shadow-primary-300! lg:-translate-y-2"
										: ""
								}`}
							>
								{tier.featured && section.featuredLabel && (
									<span className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-primary-700 card-shadow">
										<span className="mdi mdi-star text-sm" />
										{section.featuredLabel}
									</span>
								)}

								<span
									className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${
										tier.featured
											? "bg-primary text-surface"
											: "bg-primary-50 text-primary"
									}`}
								>
									<span
										className={`mdi mdi-${tier.icon || "map-marker-radius"} text-2xl`}
									/>
								</span>

								<h3 className="mt-6 text-lg font-semibold tracking-tight text-ink">
									{tier.title}
								</h3>

								<div className="mt-3">
									<p
										className={`font-light tracking-tight leading-tight ${
											tier.featured
												? "text-3xl text-primary"
												: "text-2xl text-ink"
										}`}
									>
										{tier.price}
									</p>
									{tier.priceUnit && (
										<p className="mt-1 text-sm font-medium text-accent-600">
											{tier.priceUnit}
										</p>
									)}
								</div>

								{tier.note && (
									<p className="mt-4 text-sm text-on-surface/60 leading-relaxed">
										{tier.note}
									</p>
								)}

								{Array.isArray(tier.features) && tier.features.length > 0 && (
									<ul className="mt-6 pt-6 border-t border-ink/10 grid gap-3">
										{tier.features.map((feature, featureIndex) => (
											<li
												key={featureIndex}
												className="flex items-start gap-2.5 text-sm text-ink/75 leading-snug"
											>
												<span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary">
													<span className="mdi mdi-check text-xs" />
												</span>
												{feature}
											</li>
										))}
									</ul>
								)}
							</article>
						</FadeUp>
					))}
				</div>

				{section.cta?.href && (
					<FadeUp delay={0.15}>
						<div className="mt-14 flex justify-center">
							<Link
								href={section.cta.href}
								className="group inline-flex items-center gap-3 h-14 rounded-full bg-primary px-8 text-surface font-medium text-base transition-all duration-300 hover:-translate-y-0.5 hover:card-shadow-lift"
							>
								<span
									className={`mdi mdi-${section.cta.icon ?? "cash-multiple"} text-xl text-surface`}
								/>
								{section.cta.label}
								<span className="mdi mdi-arrow-right text-xl transition-transform duration-300 group-hover:translate-x-1" />
							</Link>
						</div>
					</FadeUp>
				)}
			</div>
		</section>
	);
}

export default CostSection;