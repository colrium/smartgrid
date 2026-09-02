"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import Link from "@/components/Link";
import { FadeUp } from "@/components/animations/Fade";
import { SectionTag } from "@/components/SectionTag";

interface ChecklistItem {
	icon?: string | null;
	title: string;
	description?: string;
}

interface RelatedLink {
	label: string;
	href: string;
}

interface ComplianceContent {
	tag?: string | null;
	headline: string;
	description?: string;
	checklistTitle?: string | null;
	checklist?: ChecklistItem[] | null;
	relatedLabel?: string | null;
	related?: RelatedLink[] | null;
}

export function ComplianceSection(): ReactElement {
	const { t } = useTranslation(["surveying/cadastral-surveys"]);
	const section = t("surveying/cadastral-surveys:compliance", {
		returnObjects: true,
	}) as unknown as ComplianceContent;
	const checklist = Array.isArray(section?.checklist) ? section.checklist : [];
	const related = Array.isArray(section?.related) ? section.related : [];

	if (!section?.headline && checklist.length === 0) return <></>;

	return (
		<section className="relative overflow-hidden ink-panel py-24 sm:py-28">
			<span
				aria-hidden
				className="pointer-events-none absolute -bottom-16 -right-10 select-none font-light leading-none tracking-tighter text-[16rem] sm:text-[22rem] text-surface/5 mdi mdi-gavel"
			/>
			<span
				aria-hidden
				className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-primary/25 blur-[100px]"
			/>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
					<div className="lg:col-span-5 lg:sticky lg:top-28">
						<FadeUp>
							{section.tag && (
								<SectionTag dark>
									{section.tag}
								</SectionTag>
							)}
							<h2 className="mt-5 font-light tracking-tight leading-[1.08] text-3xl sm:text-4xl text-surface">
								{section.headline}
							</h2>
							{section.description && (
								<p className="mt-6 text-base sm:text-lg leading-relaxed text-surface/65">
									{section.description}
								</p>
							)}
							{section.checklistTitle && (
								<p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-primary-200">
									{section.checklistTitle}
								</p>
							)}
						</FadeUp>

						{related.length > 0 && (
							<FadeUp delay={0.15}>
								<div className="mt-8">
									{section.relatedLabel && (
										<p className="text-[11px] font-medium uppercase tracking-[0.18em] text-surface/40">
											{section.relatedLabel}
										</p>
									)}
									<div className="mt-4 flex flex-wrap gap-2.5">
										{related.map((link, index) => (
											<Link
												key={index}
												href={link.href}
												className="group inline-flex items-center gap-2 rounded-full border border-surface/20 px-4 py-2 text-xs font-medium text-surface/80 transition-[border-color,background-color] duration-300 hover:border-primary-300 hover:bg-surface/5"
											>
												<span className="mdi mdi-book-open-page-variant text-sm text-primary-200" />
												{link.label}
												<span className="mdi mdi-arrow-top-right text-sm text-surface/40 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary-200" />
											</Link>
										))}
									</div>
								</div>
							</FadeUp>
						)}
					</div>

					<div className="lg:col-span-7 space-y-4">
						{checklist.map((item, index) => (
							<FadeUp key={index} delay={(index % 3) * 0.08}>
								<article className="group flex items-start gap-5 rounded-[20px] bg-surface/[0.04] hairline-dark p-6 sm:p-7 transition-colors duration-500 hover:bg-surface/[0.07]">
									<span className="text-lg font-light tabular-nums tracking-wider text-primary-200/80 pt-0.5">
										{String(index + 1).padStart(2, "0")}
									</span>
									<span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary-200 transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
										<span className={`mdi mdi-${item.icon || "shield-check"} text-xl`} />
									</span>
									<div className="min-w-0">
										<h3 className="text-base sm:text-lg font-medium tracking-tight text-surface leading-snug">
											{item.title}
										</h3>
										{item.description && (
											<p className="mt-2 text-sm text-surface/60 leading-relaxed">
												{item.description}
											</p>
										)}
									</div>
								</article>
							</FadeUp>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

export default ComplianceSection;