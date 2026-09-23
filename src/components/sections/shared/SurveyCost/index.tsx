"use client";

import { useState, type ReactElement } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Blob } from "../decor";
import { FadeUp } from "@/components/animations/Fade";
import { CountUp } from "@/components/animations/ScrollReveal";
import { SectionHeader, type SectionHeaderClassesProp } from "../SectionHeader";

export interface CostFactor {
	icon: string;
	label: string;
	description: string;
}

export interface CostRangeItem {
	icon: string;
	label: string;
	price: number;
	pricePrefix: string;
	tagline: string;
	description: string;
	includes?: string[] | null;
}

export interface SurveyCostContent {
	tag?: string | null;
	headline: string;
	description?: string;
	factors?: {
		label?: string;
		items?: CostFactor[] | null;
	};
	ranges?: {
		label?: string;
		hint?: string;
		items?: CostRangeItem[] | null;
	};
	disclaimer?: string;
	cta?: { label: string; href: string; icon?: string } | null;
	secondaryCta?: { label: string; href: string; icon?: string } | null;
}

export interface SurveyCostClassesProp {
	section?: string;
	blob?: string;
	leftColumn?: string;
	header?: SectionHeaderClassesProp;
	factorsLabel?: string;
	factorsList?: string;
	factorItem?: string;
	factorIcon?: string;
	factorLabel?: string;
	factorDescription?: string;
	rightColumn?: string;
	panel?: string;
	panelBlob?: string;
	tabsHeader?: string;
	tabsLabel?: string;
	tabsHint?: string;
	tabsGrid?: string;
	tabButton?: string;
	tabIcon?: string;
	tabLabel?: string;
	activeCard?: string;
	pricePrefix?: string;
	priceValue?: string;
	priceTagline?: string;
	activeDescription?: string;
	includesGrid?: string;
	includeItem?: string;
	disclaimer?: string;
	ctaRow?: string;
	ctaPrimary?: string;
	ctaSecondary?: string;
	ctaIcon?: string;
}

export interface SurveyCostProps {
	data: SurveyCostContent;
	classes?: SurveyCostClassesProp;
	id?: string;
	className?: string;
}

const formatKES = (value: number): string =>
	`KES ${Math.round(value).toLocaleString("en-US")}`;

export function SurveyCost(props: SurveyCostProps): ReactElement | null {
	const content = props.data;
	const ranges = Array.isArray(content?.ranges?.items) ? content.ranges.items : [];
	const factors = Array.isArray(content?.factors?.items) ? content.factors.items : [];
	const [activeIndex, setActiveIndex] = useState(0);
	const active = ranges[activeIndex] ?? ranges[0];

	if (!active) return null;

	return (
		<section
			id={props.id ?? "survey-cost"}
			className={`py-24 sm:py-28 relative overflow-hidden ${props.classes?.section ?? ""} ${props.className ?? ""}`.trim()}
		>
			<Blob
				className={`w-80 h-80 bg-primary-200/40 -left-20 top-16 ${props.classes?.blob ?? ""}`}
				opacity={0.45}
			/>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
					<FadeUp
						className={`lg:col-span-5 lg:sticky lg:top-28 self-start ${props.classes?.leftColumn ?? ""}`}
					>
						<div className="flex flex-col">
							<SectionHeader
								tag={(content.tag || undefined) as string | undefined}
								headline={content.headline}
								description={
									(content.description || undefined) as string | undefined
								}
								classes={props.classes?.header}
							/>

							{factors.length > 0 && (
								<div className={`mt-10 ${props.classes?.factorsList ?? ""}`}>
									<p
										className={`text-[11px] font-semibold uppercase tracking-[0.22em] text-on-surface/45 ${props.classes?.factorsLabel ?? ""}`}
									>
										{content.factors?.label ?? ""}
									</p>
									<ul
										className={`mt-6 flex flex-col gap-6 ${props.classes?.factorsList ?? ""}`}
									>
										{factors.map((factor, index) => (
											<li key={factor.label}>
												<FadeUp delay={0.05 * index}>
													<div
														className={`group flex items-start gap-4 ${props.classes?.factorItem ?? ""}`}
													>
														<span
															className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface ${props.classes?.factorIcon ?? ""}`}
														>
															<span
																className={`mdi mdi-${factor.icon} text-xl`}
															/>
														</span>
														<div>
															<h3
																className={`text-base font-medium tracking-tight text-ink leading-snug ${props.classes?.factorLabel ?? ""}`}
															>
																{factor.label}
															</h3>
															<p
																className={`mt-1 text-sm text-on-surface/60 leading-relaxed ${props.classes?.factorDescription ?? ""}`}
															>
																{factor.description}
															</p>
														</div>
													</div>
												</FadeUp>
											</li>
										))}
									</ul>
								</div>
							)}
						</div>
					</FadeUp>

					<FadeUp
						delay={0.1}
						className={`lg:col-span-7 h-full ${props.classes?.rightColumn ?? ""}`}
					>
						<div
							className={`relative h-full rounded-c hgb-panel card-shadow overflow-hidden p-6 sm:p-8 ${props.classes?.panel ?? ""}`}
						>
							<Blob
								className={`w-64 h-64 bg-primary-100/90 -top-16 -right-16 ${props.classes?.panelBlob ?? ""}`}
								opacity={0.7}
							/>

							<div
								className={`relative flex flex-wrap items-center justify-between gap-3 ${props.classes?.tabsHeader ?? ""}`}
							>
								<span
									className={`text-[11px] font-semibold uppercase tracking-[0.22em] text-on-surface/45 ${props.classes?.tabsLabel ?? ""}`}
								>
									{content.ranges?.label ?? ""}
								</span>
								{content.ranges?.hint && (
									<span
										className={`hidden sm:inline-flex items-center gap-2 text-[11px] text-on-surface/40 ${props.classes?.tabsHint ?? ""}`}
									>
										<span className="mdi mdi-cursor-default-click-outline text-sm text-primary" />
										{content.ranges.hint}
									</span>
								)}
							</div>

							<div
								className={`relative mt-5 grid grid-cols-3 gap-2 sm:gap-3 ${props.classes?.tabsGrid ?? ""}`}
							>
								{ranges.map((item, index) => {
									const isActive = index === activeIndex;
									return (
										<button
											key={item.label}
											type="button"
											onClick={() => setActiveIndex(index)}
											aria-pressed={isActive}
											className={`flex flex-col items-center gap-2 rounded-cmd px-2 py-4 text-center transition-all duration-300 ${
												isActive
													? "bg-primary text-surface card-shadow -translate-y-0.5"
													: "bg-surface/70 cursor-pointer hairline text-ink hover:bg-surface hover:-translate-y-0.5"
											} ${props.classes?.tabButton ?? ""}`}
										>
											<span
												className={`mdi mdi-${item.icon} text-2xl ${
													isActive ? "text-surface" : "text-primary"
												} ${props.classes?.tabIcon ?? ""}`}
											/>
											<span
												className={`text-[11px] sm:text-xs font-semibold leading-tight ${props.classes?.tabLabel ?? ""}`}
											>
												{item.label}
											</span>
										</button>
									);
								})}
							</div>

							<motion.div
								key={active.label}
								initial={{ opacity: 0, y: 14 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.45, ease: "easeOut" }}
								className={`relative mt-6 rounded-cmd bg-surface/85 hairline p-6 sm:p-7 ${props.classes?.activeCard ?? ""}`}
							>
								<div className="flex flex-wrap items-end justify-between gap-4">
									<div>
										<span
											className={`text-[11px] font-semibold uppercase tracking-[0.22em] text-on-surface/45 ${props.classes?.pricePrefix ?? ""}`}
										>
											{active.pricePrefix}
										</span>
										<p
											className={`mt-1 text-4xl sm:text-5xl font-light tracking-tight text-ink tabular-nums leading-none ${props.classes?.priceValue ?? ""}`}
										>
											<CountUp
												key={active.label}
												to={active.price}
												duration={1.4}
												format={formatKES}
											/>
										</p>
									</div>
									<span
										className={`inline-flex items-center gap-2 rounded-full bg-primary-50 text-primary px-4 py-2 text-xs font-semibold ${props.classes?.priceTagline ?? ""}`}
									>
										<span className={`mdi mdi-${active.icon}`} />
										{active.tagline}
									</span>
								</div>

								<p
									className={`mt-4 text-sm sm:text-[15px] text-on-surface/60 leading-relaxed ${props.classes?.activeDescription ?? ""}`}
								>
									{active.description}
								</p>

								{Array.isArray(active.includes) && active.includes.length > 0 && (
									<ul
										className={`mt-5 grid gap-2.5 sm:grid-cols-3 ${props.classes?.includesGrid ?? ""}`}
									>
										{active.includes.map((include) => (
											<li
												key={include}
												className={`flex items-start gap-2 text-sm text-ink/70 leading-snug ${props.classes?.includeItem ?? ""}`}
											>
												<span className="mdi mdi-check-circle text-primary text-base mt-0.5" />
												{include}
											</li>
										))}
									</ul>
								)}
							</motion.div>

							{content.disclaimer && (
								<p
									className={`relative mt-5 flex items-start gap-2 text-xs text-on-surface/45 leading-relaxed ${props.classes?.disclaimer ?? ""}`}
								>
									<span className="mdi mdi-information-outline text-sm text-primary/70 mt-0.5" />
									{content.disclaimer}
								</p>
							)}

							<div
								className={`relative mt-6 flex flex-col sm:flex-row items-center gap-3 ${props.classes?.ctaRow ?? ""}`}
							>
								{content.cta?.href && (
									<Link
										href={content.cta.href}
										className={`group inline-flex items-center justify-center gap-3 h-12 rounded-full bg-primary px-7 text-surface font-medium text-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:card-shadow-lift w-full sm:w-auto ${props.classes?.ctaPrimary ?? ""}`}
									>
										<span className="h-1.5 w-1.5 rounded-full bg-primary-200 transition-transform duration-300 group-hover:scale-125" />
										{content.cta.label}
										{content.cta.icon && (
											<span
												className={`mdi mdi-${content.cta.icon} text-lg transition-transform duration-300 group-hover:translate-x-1 ${props.classes?.ctaIcon ?? ""}`}
											/>
										)}
									</Link>
								)}
								{content.secondaryCta?.href && (
									<Link
										href={content.secondaryCta.href}
										className={`inline-flex items-center justify-center gap-2.5 h-12 rounded-full hairline bg-surface/70 px-6 text-ink text-sm font-medium transition-[border-color,color] duration-300 hover:border-primary hover:text-primary w-full sm:w-auto ${props.classes?.ctaSecondary ?? ""}`}
									>
										{content.secondaryCta.icon && (
											<span
												className={`mdi mdi-${content.secondaryCta.icon} text-base text-primary ${props.classes?.ctaIcon ?? ""}`}
											/>
										)}
										{content.secondaryCta.label}
									</Link>
								)}
							</div>
						</div>
					</FadeUp>
				</div>
			</div>
		</section>
	);
}

export default SurveyCost;