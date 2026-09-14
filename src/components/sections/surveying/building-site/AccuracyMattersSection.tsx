"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/shared/decor";

interface AccuracyItem {
	title: string;
	description: string;
	icon?: string;
	stat?: string | null;
}

interface AccuracyContent {
	tag?: string | null;
	headline: string;
	description?: string;
	solution?: string;
	items?: AccuracyItem[];
	keywords?: string[];
}

const FALLBACK_ICONS = [
	"vector-polyline",
	"ruler-square-compass",
	"hammer-wrench",
	"scale-balance",
];

export function AccuracyMattersSection(): ReactElement {
	const { t } = useTranslation(["surveying/building-site-surveys"]);
	const section = t("surveying/building-site-surveys:accuracyMatters", {
		returnObjects: true,
	}) as unknown as AccuracyContent;
	const items = Array.isArray(section?.items) ? section.items : [];
	const keywords = Array.isArray(section?.keywords) ? section.keywords : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-[26rem] h-[26rem] bg-primary-100/70 -top-24 -left-24" opacity={0.5} />
			<Blob className="w-[18rem] h-[18rem] bg-primary-200/40 -bottom-20 -right-20" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
					<FadeUp className="lg:col-span-5">
						<div className="lg:sticky lg:top-28">
							<SectionHeader tag={section.tag || undefined} headline={section.headline} />

							{section.description && (
								<p className="mt-6 text-base sm:text-lg leading-relaxed text-on-surface/60">
									{section.description}
								</p>
							)}

							{keywords.length > 0 && (
								<div className="mt-8 flex flex-wrap gap-2">
									{keywords.map((keyword, index) => (
										<span
											key={index}
											className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-700"
										>
											{keyword}
										</span>
									))}
								</div>
							)}
						</div>
					</FadeUp>

					<div className="lg:col-span-7 flex flex-col gap-5 sm:gap-6">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
							{items.map((item, index) => (
								<FadeUp key={index} delay={(index % 2) * 0.08}>
									<article className="group relative h-full overflow-hidden rounded-2xl hairline bg-surface card-shadow p-7 transition-all duration-250 hover:-translate-y-1.5 hover:card-shadow-lift hover:border-primary">
										<span
											className="absolute -right-4 -top-6 font-light tracking-tighter text-[6.5rem] leading-none text-primary/[0.05] select-none pointer-events-none"
											aria-hidden
										>
											{String(index + 1).padStart(2, "0")}
										</span>

										<div className="relative flex items-start justify-between gap-4">
											<span className="p-3 rounded-xl bg-primary-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
												<span className={`mdi mdi-${item.icon ?? FALLBACK_ICONS[index % FALLBACK_ICONS.length]} text-2xl`} />
											</span>
											{item.stat && (
												<span className="text-sm font-semibold tabular-nums tracking-[0.12em] text-primary-700/80">
													{item.stat}
												</span>
											)}
										</div>

										<h3 className="relative mt-6 text-xl font-medium tracking-tight text-ink leading-snug">
											{item.title}
										</h3>
										<p className="relative mt-3 text-sm text-on-surface/60 leading-relaxed">
											{item.description}
										</p>
									</article>
								</FadeUp>
							))}
						</div>

						{section.solution && (
							<FadeUp delay={0.1}>
								<div className="relative overflow-hidden rounded-c pale-panel card-shadow p-8 sm:p-10  border border-primary/10 ">
									<span className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-primary-300/30 blur-[80px] pointer-events-none" />
									<div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8">
										<span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-ink-soft/10 text-ink hairline-dark">
											<span className="mdi mdi-crosshairs-gps text-2xl" />
										</span>
										<p className="text-base sm:text-lg leading-relaxed text-ink/80">
											{section.solution}
										</p>
									</div>
								</div>
							</FadeUp>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}

export default AccuracyMattersSection;