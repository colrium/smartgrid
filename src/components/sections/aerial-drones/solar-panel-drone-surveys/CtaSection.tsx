"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";

interface CtaLink {
	label: string;
	href: string;
}

interface CtaContent {
	tag?: string | null;
	headline: string;
	description?: string;
	ctaPrimary?: CtaLink | null;
}

export function CtaSection() {
	const { t } = useTranslation(["solar-panel-drone-surveys"]);
	const section = t("solar-panel-drone-surveys:cta", {
		returnObjects: true,
	}) as unknown as CtaContent;

	return (
		<section className="pb-24 sm:pb-28 relative overflow-hidden">
			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<div className="relative rounded-[20px] ink-panel card-shadow overflow-hidden px-8 py-16 sm:px-12 sm:py-24 text-center">
						<span className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-brand-300/30 blur-[90px] pointer-events-none" />
						<span className="absolute -bottom-28 -left-20 w-72 h-72 rounded-full bg-primary/30 blur-[90px] pointer-events-none" />
						<span className="absolute inset-3 rounded-[15px] hairline-dark pointer-events-none" aria-hidden />

						<div className="relative flex flex-col items-center gap-6">
							{section.tag && (
								<span className="inline-flex items-center gap-3 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-brand-200">
									<span className="inline-block h-px w-9 bg-brand-200/70" />
									{section.tag}
									<span className="inline-block h-px w-9 bg-brand-200/70" />
								</span>
							)}

							<h2 className="font-light tracking-tight leading-[1.08] text-3xl sm:text-5xl lg:text-[3.4rem] text-surface max-w-3xl">
								{section.headline}
							</h2>

							{section.description && (
								<p className="text-base sm:text-lg text-surface/65 leading-relaxed max-w-2xl mx-auto">
									{section.description}
								</p>
							)}

							{section.ctaPrimary?.href && (
								<div className="mt-4">
									<Link
										href={section.ctaPrimary.href}
										className="group inline-flex items-center gap-3 h-14 rounded-full bg-surface px-8 text-ink font-medium text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-10px_rgba(1,55,61,0.55)]"
									>
										<span className="h-1.5 w-1.5 rounded-full bg-primary transition-transform duration-300 group-hover:scale-125" />
										{section.ctaPrimary.label}
										<span className="mdi mdi-arrow-right text-xl text-ink transition-transform duration-300 group-hover:translate-x-1" />
									</Link>
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