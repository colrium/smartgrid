"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import Link from "next/link";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/shared/decor";

interface CtaLink {
	label: string;
	href: string;
	icon?: string;
}

interface ConsultationStep {
	title: string;
	description: string;
}

interface ConsultationContent {
	tag?: string | null;
	headline: string;
	description?: string;
	stepsLabel?: string;
	ctaPrimary?: CtaLink | null;
	ctaSecondary?: CtaLink | null;
	steps?: ConsultationStep[];
}

export function ConsultationSection(): ReactElement {
	const { t } = useTranslation(["surveying/building-site-surveys"]);
	const section = t("surveying/building-site-surveys:consultation", {
		returnObjects: true,
	}) as unknown as ConsultationContent;
	const steps = Array.isArray(section?.steps) ? section.steps : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden ">
			<Blob className="w-[26rem] h-[26rem] bg-primary-100/60 -top-24 -right-24" opacity={0.5} />
			<Blob className="w-[20rem] h-[20rem] bg-primary-200/40 -bottom-24 -left-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
					<FadeUp className="lg:col-span-6">
						<SectionHeader tag={section.tag || undefined} headline={section.headline} />

						{section.description && (
							<p className="mt-6 text-base sm:text-lg leading-relaxed text-on-surface/60 max-w-2xl">
								{section.description}
							</p>
						)}

						<div className="mt-9 flex flex-col sm:flex-row flex-wrap items-start gap-4">
							{section.ctaPrimary?.href && (
								<Link
									href={section.ctaPrimary.href}
									className="group inline-flex items-center gap-3 h-14 rounded-full bg-primary px-8 text-surface font-medium text-base transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary hover:shadow-[0_18px_42px_-10px_rgba(1,55,61,0.55)]"
								>
									<span className="h-1.5 w-1.5 rounded-full bg-surface transition-transform duration-300 group-hover:scale-125" />
									{section.ctaPrimary.label}
									{section.ctaPrimary.icon && (
										<span className={`mdi mdi-${section.ctaPrimary.icon} text-lg transition-transform duration-300 group-hover:scale-110`} />
									)}
								</Link>
							)}
							{section.ctaSecondary?.href && (
								<Link
									href={section.ctaSecondary.href}
									className="inline-flex items-center gap-2.5 h-14 rounded-full border border-ink/15 px-7 text-ink text-sm font-medium transition-[border-color,background-color] duration-300 hover:border-primary hover:bg-primary/5"
								>
									{section.ctaSecondary.icon && (
										<span className={`mdi mdi-${section.ctaSecondary.icon} text-lg text-primary`} />
									)}
									{section.ctaSecondary.label}
								</Link>
							)}
						</div>
					</FadeUp>

					<FadeUp delay={0.1} className="lg:col-span-6">
						<div className="relative rounded-c hairline bg-paper card-shadow p-8 sm:p-10 overflow-hidden">
							<span
								className="absolute -top-8 -right-6 font-light tracking-tighter text-[8rem] leading-none text-primary/[0.05] select-none pointer-events-none"
								aria-hidden
							>
								↗
							</span>

							<h3 className="relative text-sm font-semibold uppercase tracking-[0.22em] text-primary">
								{section.stepsLabel}
							</h3>

							<div className="relative mt-8 flex flex-col">
								{steps.map((step, index) => (
									<div key={index} className="relative flex gap-5 pb-8 last:pb-0">
										{index < steps.length - 1 && (
											<span
												className="absolute left-5 top-11 bottom-0 w-px bg-gradient-to-b from-primary/30 to-transparent"
												aria-hidden
											/>
										)}
										<span className="relative inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-semibold tabular-nums text-primary hairline">
											{String(index + 1).padStart(2, "0")}
										</span>
										<div className="pt-0.5">
											<h4 className="text-base font-semibold tracking-tight text-ink">
												{step.title}
											</h4>
											<p className="mt-1.5 text-sm text-on-surface/60 leading-relaxed">
												{step.description}
											</p>
										</div>
									</div>
								))}
							</div>
						</div>
					</FadeUp>
				</div>
			</div>
		</section>
	);
}

export default ConsultationSection;