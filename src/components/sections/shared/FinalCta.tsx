"use client";

import type { ReactElement } from "react";
import Link from "@/components/Link";
import { FadeUp } from "@/components/animations/Fade";
import { SectionTag } from "@/components/SectionTag";

export interface FinalCtaAction {
	icon?: string | null;
	label: string;
	description?: string | null;
	href: string;
}

interface FinalCtaProps {
	id?: string;
	tag?: string | null;
	headline: string;
	/** `muted` renders the standard muted lede, `accent` the emphasised primary-200 line. */
	description?: string | null;
	descriptionTone?: "muted" | "accent";
	note?: string | null;
	/** Decorative MDI icon name (without `mdi-` prefix) watermarked bottom-right. */
	watermark?: string | null;
	actions?: FinalCtaAction[] | null;
	actionsLabel?: string | null;
	/** MDI icon used when an action has no icon of its own. */
	actionIconFallback?: string;
	/** Action card grid columns on `sm+` screens. */
	columns?: 3 | 4;
	/** Action card text alignment. */
	align?: "center" | "left";
	className?: string;
}

/**
 * Shared full-bleed dark closing CTA: `ink-panel` section with a watermark
 * glyph, glow blob, centred header and an optional grid of action cards.
 * Consolidates the FinalCtaSection copies (bathymetric, cadastral, aerial).
 */
export function FinalCta({
	id,
	tag,
	headline,
	description,
	descriptionTone = "muted",
	note,
	watermark,
	actions,
	actionsLabel,
	actionIconFallback = "arrow-right",
	columns = 4,
	align = "center",
	className = "",
}: FinalCtaProps): ReactElement {
	const cards = Array.isArray(actions) ? actions : [];
	const gridClass =
		columns === 3
			? "mt-7 grid grid-cols-1 sm:grid-cols-3 gap-4"
			: "mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4";
	const cardClass =
		align === "left"
			? "group flex flex-col gap-3 rounded-c bg-surface/[0.05] hairline-dark p-6 text-left transition-all duration-250 hover:-translate-y-1.5 hover:bg-surface/10 hover:border-primary-300/50"
			: "group flex flex-col items-center gap-3 rounded-c bg-surface/[0.05] hairline-dark p-7 text-center transition-all duration-250 hover:-translate-y-1.5 hover:bg-surface/10 hover:border-primary-300/50";

	return (
		<section
			id={id}
			className={`relative overflow-hidden ink-panel py-24 sm:py-28 ${className}`.trim()}
		>
			{watermark && (
				<span
					aria-hidden
					className={`mdi mdi-${watermark} pointer-events-none absolute -bottom-20 -right-8 select-none font-light leading-none tracking-tighter text-[18rem] sm:text-[24rem] text-surface/5`}
				/>
			)}
			<span
				aria-hidden
				className="pointer-events-none absolute -top-24 left-1/4 w-80 h-80 rounded-full bg-primary/25 blur-[100px]"
			/>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<div className="flex flex-col items-center text-center">
						{tag && <SectionTag dark>{tag}</SectionTag>}
						<h2 className="mt-5 font-light tracking-tight leading-[1.08] text-3xl sm:text-4xl lg:text-5xl text-surface max-w-3xl">
							{headline}
						</h2>
						{description &&
							(descriptionTone === "accent" ? (
								<p className="mt-5 text-base sm:text-lg font-medium text-primary-200">
									{description}
								</p>
							) : (
								<p className="mt-5 text-base sm:text-lg text-surface/65 leading-relaxed max-w-2xl">
									{description}
								</p>
							))}
						{note && (
							<p className="mt-3 text-sm sm:text-base text-surface/60 leading-relaxed max-w-2xl">
								{note}
							</p>
						)}
					</div>
				</FadeUp>

				{cards.length > 0 && (
					<FadeUp delay={0.12}>
						<div className="mt-12">
							{actionsLabel && (
								<p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-primary-200">
									{actionsLabel}
								</p>
							)}

							<div className={gridClass}>
								{cards.map((action, index) => (
									<Link key={index} href={action.href} className={cardClass}>
										<span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary-200 transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
											<span
												className={`mdi mdi-${action.icon || actionIconFallback} text-2xl`}
											/>
										</span>
										<span className="text-base font-semibold tracking-tight text-surface leading-snug">
											{action.label}
										</span>
										{action.description && (
											<span className="text-sm text-surface/55 leading-relaxed">
												{action.description}
											</span>
										)}
										<span className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-medium text-primary-200">
											<span className="mdi mdi-arrow-right transition-transform duration-300 group-hover:translate-x-1" />
										</span>
									</Link>
								))}
							</div>
						</div>
					</FadeUp>
				)}
			</div>
		</section>
	);
}

export default FinalCta;
