"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import Link from "@/components/Link";
import { FadeUp } from "@/components/animations/Fade";
import { SectionTag } from "@/components/SectionTag";

interface CtaLink {
	label?: string;
	href?: string;
	icon?: string | null;
}

interface TechnicalCtaContent {
	tag?: string | null;
	headline: string;
	description?: string;
	watermark?: string | null;
	primary?: CtaLink | null;
	secondary?: CtaLink | null;
}

export function GprTechnicalProposalCta(): ReactElement {
	const { t } = useTranslation(["surveying/ground-penetrating-radar"]);
	const content = t("surveying/ground-penetrating-radar:technicalCta", {
		returnObjects: true,
	}) as unknown as TechnicalCtaContent;

	if (!content?.headline) return <></>;

	return (
		<section className="pt-4 sm:pt-6 pb-14 sm:pb-16 relative overflow-hidden">
			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<div className="group/band relative rounded-[20px] ink-panel card-shadow overflow-hidden px-8 py-12 sm:px-12 sm:py-14 shimmer-t shimmer-gold-200">
						{content.watermark && (
							<span
								aria-hidden
								className={`mdi mdi-${content.watermark} absolute -right-8 -top-10 text-[11rem] leading-none text-surface/[0.06] select-none pointer-events-none transition-transform duration-700 group-hover/band:rotate-6 group-hover/band:scale-105`}
							/>
						)}

						<div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
							<div className="flex-1 min-w-0">
								{content.tag && (
									<SectionTag dark className="mb-4">
										{content.tag}
									</SectionTag>
								)}
								<h2 className="font-light tracking-tight leading-[1.1] text-2xl sm:text-3xl lg:text-[2.1rem] text-surface">
									{content.headline}
								</h2>
								{content.description && (
									<p className="mt-3 text-sm sm:text-base text-surface/60 leading-relaxed max-w-xl">
										{content.description}
									</p>
								)}
							</div>

							<div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-3 shrink-0">
								{content.primary?.href && (
									<Link
										href={content.primary.href}
										className="group/btn inline-flex items-center justify-center gap-3 h-12 rounded-full bg-surface px-7 text-ink font-medium text-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-10px_rgba(1,55,61,0.55)]"
									>
										<span className="h-1.5 w-1.5 rounded-full bg-primary transition-transform duration-300 group-hover/btn:scale-125" />
										{content.primary.label}
										{content.primary.icon && (
											<span
												className={`mdi mdi-${content.primary.icon} text-lg transition-transform duration-300 group-hover/btn:translate-x-1`}
											/>
										)}
									</Link>
								)}
								{content.secondary?.href && (
									<Link
										href={content.secondary.href}
										className="inline-flex items-center justify-center gap-2.5 h-12 rounded-full border border-surface/30 px-7 text-surface text-sm font-medium transition-[border-color,background-color] duration-300 hover:border-surface hover:bg-surface/10"
									>
										{content.secondary.icon && (
											<span className={`mdi mdi-${content.secondary.icon} text-lg text-primary-200`} />
										)}
										{content.secondary.label}
									</Link>
								)}
							</div>
						</div>
					</div>
				</FadeUp>
			</div>
		</section>
	);
}

export default GprTechnicalProposalCta;