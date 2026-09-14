"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import Link from "@/components/Link";
import { FadeUp } from "@/components/animations/Fade";
import { SectionTag } from "@/components/SectionTag";
import { Blob } from "@/components/sections/shared/decor";

interface CtaAction {
	label: string;
	href: string;
	icon?: string | null;
}

interface PostHeroCtaContent {
	tag?: string | null;
	headline: string;
	description?: string;
	ctaPrimary?: CtaAction | null;
	ctaSecondary?: CtaAction | null;
}

export function PostHeroCtaSection(): ReactElement {
	const { t } = useTranslation(["surveying/cadastral-surveys"]);
	const section = t("surveying/cadastral-surveys:postHeroCta", {
		returnObjects: true,
	}) as unknown as PostHeroCtaContent;

	if (!section?.headline) return <></>;

	return (
		<section className="pt-14 sm:pt-20 pb-4 relative overflow-hidden">
			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<div className="group/band relative rounded-c bg-paper hairline card-shadow overflow-hidden px-8 py-10 sm:px-12 sm:py-12 shimmer-t shimmer-gold-200">
						<Blob className="w-72 h-72 bg-primary-100/70 -top-24 -right-16" opacity={0.6} />

						<div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
							<div className="flex-1 min-w-0">
								{section.tag && (
									<SectionTag className="mb-4">
										{section.tag}
									</SectionTag>
								)}
								<h2 className="font-light tracking-tight leading-[1.15] text-2xl sm:text-3xl lg:text-[2.1rem] text-ink">
									{section.headline}
								</h2>
								{section.description && (
									<p className="mt-3 text-sm sm:text-base text-on-surface/60 leading-relaxed max-w-2xl">
										{section.description}
									</p>
								)}
							</div>

							<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
								{section.ctaPrimary?.href && (
									<Link
										href={section.ctaPrimary.href}
										className="group/btn inline-flex items-center justify-center gap-3 h-14 rounded-full bg-primary px-8 text-surface font-medium text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-10px_rgba(0,151,178,0.55)]"
									>
										<span className={`mdi mdi-${section.ctaPrimary.icon ?? "chat"} text-xl`} />
										{section.ctaPrimary.label}
										<span className="mdi mdi-arrow-right text-xl transition-transform duration-300 group-hover/btn:translate-x-1" />
									</Link>
								)}
								{section.ctaSecondary?.href && (
									<Link
										href={section.ctaSecondary.href}
										className="inline-flex items-center justify-center gap-2.5 h-14 rounded-full border border-ink/20 px-8 text-ink text-base font-medium transition-[border-color,background-color] duration-300 hover:border-primary hover:bg-primary-50/60"
									>
										<span
											className={`mdi mdi-${section.ctaSecondary.icon ?? "email-outline"} text-xl text-primary`}
										/>
										{section.ctaSecondary.label}
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

export default PostHeroCtaSection;