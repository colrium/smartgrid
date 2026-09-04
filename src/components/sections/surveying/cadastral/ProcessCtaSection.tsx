"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import Link from "@/components/Link";
import { FadeUp } from "@/components/animations/Fade";
import { SectionTag } from "@/components/SectionTag";

interface CtaAction {
	label: string;
	href: string;
	icon?: string | null;
}

interface ProcessCtaContent {
	tag?: string | null;
	headline: string;
	description?: string;
	ctaPrimary?: CtaAction | null;
	ctaSecondary?: CtaAction | null;
	chips?: string[] | null;
}

export function ProcessCtaSection(): ReactElement {
	const { t } = useTranslation(["surveying/cadastral-surveys"]);
	const section = t("surveying/cadastral-surveys:processCta", {
		returnObjects: true,
	}) as unknown as ProcessCtaContent;
	const chips = Array.isArray(section?.chips) ? section.chips : [];

	if (!section?.headline) return <></>;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<div className="group/band relative rounded-c ink-panel card-shadow overflow-hidden px-8 py-14 sm:px-12 sm:py-16 text-center shimmer-t shimmer-gold-200">
						<span
							aria-hidden
							className="mdi mdi-vector-square absolute -right-10 -top-12 text-[12rem] leading-none text-surface/5 select-none pointer-events-none transition-transform duration-700 group-hover/band:rotate-6 group-hover/band:scale-105"
						/>
						<span
							aria-hidden
							className="absolute -bottom-28 -left-20 w-72 h-72 rounded-full bg-primary/30 blur-[90px] pointer-events-none"
						/>
						<span aria-hidden className="absolute inset-3 rounded-cmd hairline-dark pointer-events-none" />

						<div className="relative flex flex-col items-center gap-6">
							{section.tag && (
								<SectionTag dark>
									{section.tag}
								</SectionTag>
							)}

							<h2 className="font-light tracking-tight leading-[1.08] text-3xl sm:text-4xl lg:text-5xl text-surface max-w-3xl">
								{section.headline}
							</h2>

							{section.description && (
								<p className="text-base sm:text-lg text-surface/65 leading-relaxed max-w-2xl mx-auto">
									{section.description}
								</p>
							)}

							<div className="mt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
								{section.ctaPrimary?.href && (
									<Link
										href={section.ctaPrimary.href}
										className="group inline-flex items-center gap-3 h-14 rounded-full bg-surface px-8 text-ink font-medium text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-10px_rgba(1,55,61,0.55)]"
									>
										<span className={`mdi mdi-${section.ctaPrimary.icon ?? "email-outline"} text-xl text-primary`} />
										{section.ctaPrimary.label}
										<span className="mdi mdi-arrow-right text-xl transition-transform duration-300 group-hover:translate-x-1" />
									</Link>
								)}
								{section.ctaSecondary?.href && (
									<Link
										href={section.ctaSecondary.href}
										className="inline-flex items-center justify-center gap-2.5 h-14 rounded-full border border-surface/25 px-8 text-surface font-medium text-base transition-all duration-300 hover:border-primary-300 hover:bg-surface/5"
									>
										<span
											className={`mdi mdi-${section.ctaSecondary.icon ?? "whatsapp"} text-xl text-whatsapp`}
										/>
										{section.ctaSecondary.label}
									</Link>
								)}
							</div>

							{chips.length > 0 && (
								<div className="mt-2 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
									{chips.map((chip, index) => (
										<span
											key={index}
											className="inline-flex items-center gap-2 text-xs sm:text-sm text-surface/60"
										>
											<span className="mdi mdi-check-decagram text-base text-primary-300" />
											{chip}
										</span>
									))}
								</div>
							)}
						</div>
					</div>
				</FadeUp>
			</div>
		</section>
	);
}

export default ProcessCtaSection;