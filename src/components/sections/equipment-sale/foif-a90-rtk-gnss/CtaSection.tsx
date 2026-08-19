"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionTag } from "@/components/SectionTag";

interface CtaLink {
	icon?: string;
	label: string;
	href: string;
}

interface CtaContent {
	tag?: string | null;
	headline: string;
	description?: string;
	ctaPrimary?: CtaLink | null;
	ctaSecondary?: CtaLink | null;
}

export function CtaSection() {
	const { t } = useTranslation(["foif-a90-rtk-gnss"]);
	const section = t("foif-a90-rtk-gnss:cta", {
		returnObjects: true,
	}) as unknown as CtaContent;

	return (
		<section className="pb-24 sm:pb-28 relative overflow-hidden">
			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<div className="relative rounded-[20px] ink-panel card-shadow overflow-hidden px-8 py-16 sm:px-12 sm:py-24 text-center">
						<span className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-primary-300/30 blur-[90px] pointer-events-none" />
						<span className="absolute -bottom-28 -left-20 w-72 h-72 rounded-full bg-primary/30 blur-[90px] pointer-events-none" />
						

						<div className="relative flex flex-col items-center gap-6">
							{section.tag && <SectionTag dark>{section.tag}</SectionTag>}

							<h2 className="font-light tracking-tight leading-[1.08] text-3xl sm:text-5xl lg:text-[3.4rem] text-surface max-w-3xl">
								{section.headline}
							</h2>

							{section.description && (
								<p className="text-base sm:text-lg text-surface/65 leading-relaxed max-w-2xl mx-auto">
									{section.description}
								</p>
							)}

							{(section.ctaPrimary?.href || section.ctaSecondary?.href) && (
								<div className="mt-4 flex flex-wrap items-center justify-center gap-4">
									{section.ctaPrimary?.href && (
										<Link
											href={section.ctaPrimary.href}
											className="group inline-flex items-center gap-3 h-14 rounded-full bg-surface px-8 text-ink font-medium text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-10px_rgba(1,55,61,0.55)]"
										>
											{section.ctaPrimary.icon && (
												<span
													className={`mdi mdi-${section.ctaPrimary.icon} text-xl text-ink transition-transform duration-300 group-hover:translate-x-1`}
												/>
											)}
											{section.ctaPrimary.label}
										</Link>
									)}

									{section.ctaSecondary?.href && (
										<Link
											href={section.ctaSecondary.href}
											className="group inline-flex items-center gap-3 h-14 rounded-full border border-surface/40 px-8 text-surface font-medium text-base transition-all duration-300 hover:bg-surface hover:text-ink"
										>
											{section.ctaSecondary.icon && (
												<span className={`mdi mdi-${section.ctaSecondary.icon} text-xl`} />
											)}
											{section.ctaSecondary.label}
											<span className="mdi mdi-arrow-right text-xl transition-transform duration-300 group-hover:translate-x-1" />
										</Link>
									)}
								</div>
							)}
						</div>
					</div>
				</FadeUp>
			</div>
		</section>
	);
}

export default CtaSection;