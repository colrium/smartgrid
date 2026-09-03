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

interface CapabilityCtaContent {
	tag?: string | null;
	headline: string;
	description?: string;
	watermark?: string | null;
	primary?: CtaLink | null;
	secondary?: CtaLink | null;
}

export function CapabilityCtaSection(): ReactElement {
	const { t } = useTranslation(["surveying/aerial-surveys"]);
	const content = t("surveying/aerial-surveys:capabilityCta", {
		returnObjects: true,
	}) as unknown as CapabilityCtaContent;

	if (!content?.headline) return <></>;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<div className="group/band relative rounded-c ink-panel card-shadow overflow-hidden px-8 py-14 sm:px-12 sm:py-16 text-center shimmer-t shimmer-gold-200">
						{content.watermark && (
							<span
								aria-hidden
								className={`mdi mdi-${content.watermark} absolute -right-8 -top-6 text-[13rem] leading-none text-surface/[0.05] select-none pointer-events-none transition-transform duration-700 group-hover/band:rotate-6 group-hover/band:scale-105`}
							/>
						)}
						<span aria-hidden className="absolute inset-3 rounded-[15px] hairline-dark pointer-events-none" />

						<div className="relative flex flex-col items-center gap-6">
							{content.tag && (
								<SectionTag dark>
									{content.tag}
								</SectionTag>
							)}

							<h2 className="font-light tracking-tight leading-[1.08] text-3xl sm:text-4xl lg:text-5xl text-surface max-w-3xl">
								{content.headline}
							</h2>

							{content.description && (
								<p className="text-base sm:text-lg text-surface/65 leading-relaxed max-w-2xl mx-auto">
									{content.description}
								</p>
							)}

							<div className="mt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
								{content.primary?.href && (
									<Link
										href={content.primary.href}
										className="group inline-flex items-center gap-3 h-14 rounded-full bg-surface px-8 text-ink font-medium text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-10px_rgba(1,55,61,0.55)]"
									>
										{content.primary.icon && (
											<span className={`mdi mdi-${content.primary.icon} text-xl text-primary`} />
										)}
										{content.primary.label}
										<span className="mdi mdi-arrow-right text-xl transition-transform duration-300 group-hover:translate-x-1" />
									</Link>
								)}
								{content.secondary?.href && (
									<Link
										href={content.secondary.href}
										className="inline-flex items-center justify-center gap-2.5 h-14 rounded-full border border-surface/25 px-8 text-surface font-medium text-base transition-all duration-300 hover:border-primary-300 hover:bg-surface/5"
									>
										{content.secondary.icon && (
											<span className={`mdi mdi-${content.secondary.icon} text-xl text-primary-200`} />
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

export default CapabilityCtaSection;