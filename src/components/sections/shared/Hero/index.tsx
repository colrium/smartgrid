"use client";

import type { ReactElement } from "react";
import Image from "next/image";
import { FadeUp } from "@/components/animations/Fade";
import { SectionTag } from "@/components/SectionTag";
import { CtaPill, type CtaAction } from "../CtaPill";

export interface HeroContent {
	/** Kicker/tag rendered above the h1 (SectionTag, dark tone). */
	headline?: string | null;
	/** Main h1 copy. Falls back to `description` when absent. */
	title?: string | null;
	/** Lede paragraph below the h1 (skipped when it doubles as the h1). */
	description?: string | null;
	/** Full-bleed background image; falls back to a solid ink panel. */
	image?: string | null;
	/** Presentation variant: `bottom` (default) or `centered` framed hero. */
	layout?: "bottom" | "centered";
	/** Inset rounded frame ring (centered variant). */
	frame?: boolean;
	/** Bouncing scroll cue anchored bottom-centre (centered variant). */
	scrollCue?: boolean;
	ctaPrimary?: {
		label: string;
		href: string;
		icon?: string | null;
		/** `start` = leading icon + trailing arrow; default `end` on the bottom layout. */
		iconPosition?: "start" | "end";
	} | null;
}

export interface HeroProps {
	/** Section content object, usually `t("<ns>:hero", { returnObjects: true })`. */
	data: HeroContent;
	/** Overrides `data.layout`: `bottom` (default) or `centered` framed hero. */
	layout?: "bottom" | "centered";
	/** Overrides `data.frame`: inset rounded frame ring over the hero edges. */
	frame?: boolean;
	/** Overrides `data.scrollCue`: bouncing scroll cue anchored bottom-centre. */
	scrollCue?: boolean;
	id?: string;
	className?: string;
}

/**
 * Shared full-bleed page hero: bottom-aligned copy over a priority-loaded
 * background image (or solid `ink-panel` fallback) with the standard ink
 * gradient overlays, dark kicker, h1 and pill CTA. `layout="centered"`
 * renders the framed centre-stage variant (surveying landing): ink backdrop,
 * primary pill CTA and optional scroll cue — all settable from the locale
 * entry so CRUD flows can flip the presentation without code edits.
 * Consolidates the per-page hero copies that only differed by i18n namespace.
 */
export function Hero(props: HeroProps): ReactElement {
	const hero = props.data ?? {};
	const centered = (props.layout ?? hero.layout ?? "bottom") === "centered";
	const framed = props.frame ?? hero.frame ?? false;
	const cue = props.scrollCue ?? hero.scrollCue ?? false;
	const hasImage = typeof hero.image === "string" && hero.image.startsWith("/");
	const heading = hero.title || hero.description || "";
	const lede = hero.title ? (hero.description ?? null) : null;
	const ctaIcon = hero.ctaPrimary.icon ?? (centered ? null : "arrow-right");
	const ctaIconStart = centered || hero.ctaPrimary.iconPosition === "start";
	const action: CtaAction | null = hero.ctaPrimary?.href
		? {
				label: hero.ctaPrimary.label,
				href: hero.ctaPrimary.href,
				icon: ctaIcon,
				iconPosition: ctaIconStart ? "start" : "end",
				trailingArrow: centered || ctaIconStart ? true : undefined,
			}
		: null;

	return (
		<section
			id={props.id}
			className={`relative flex overflow-hidden ${
				centered
					? "min-h-[92vh] items-center justify-center bg-ink"
					: "min-h-[86dvh] items-end pb-14 sm:pb-20"
			} ${props.className ?? ""}`.trim()}
		>
			{hasImage ? (
				<Image
					src={hero.image as string}
					alt={hero.headline || heading || "Hero"}
					fill
					priority
					fetchPriority="high"
					sizes="100vw"
					className="object-cover object-center"
				/>
			) : (
				<div className="absolute inset-0 ink-panel" />
			)}
			{centered ? (
				<>
					<div className="absolute inset-0 bg-gradient-to-b from-ink/85 via-ink/45 to-ink/85" />
					<span
						className="pointer-events-none absolute inset-x-64 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
						aria-hidden
					/>
				</>
			) : (
				<>
					<div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/30" />
					<div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-ink/40" />
				</>
			)}
			{framed ? (
				<span
					className="pointer-events-none absolute inset-4 sm:inset-7 rounded-[24px] border border-surface/20"
					aria-hidden
				/>
			) : null}

			<div
				className={`relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-12 ${
					centered ? "py-48" : ""
				}`.trim()}
			>
				<FadeUp className={centered ? "mx-auto max-w-3xl" : undefined}>
					<div className={centered ? "flex flex-col items-center text-center gap-7" : undefined}>
						{hero.headline ? <SectionTag dark>{hero.headline}</SectionTag> : null}

						{heading ? (
							<h1
								className={
									centered
										? "font-light tracking-tight leading-[1.02] text-5xl sm:text-6xl lg:text-7xl text-white drop-shadow-sm"
										: "mt-5 max-w-4xl font-light tracking-tight leading-[1.05] text-4xl sm:text-6xl lg:text-7xl text-surface"
								}
							>
								{heading}
							</h1>
						) : null}

						{lede ? (
							<p
								className={
									centered
										? "max-w-2xl text-base sm:text-lg text-white/75 leading-relaxed whitespace-pre-line"
										: "mt-6 max-w-2xl text-base sm:text-lg text-surface/70 leading-relaxed whitespace-pre-line"
								}
							>
								{lede}
							</p>
						) : null}

						{action ? (
							<div
								className={
									centered
										? "mt-1 flex flex-wrap items-center justify-center gap-4"
										: "mt-10"
								}
							>
								<CtaPill action={action} variant={centered ? "primary" : "solid"} />
							</div>
						) : null}
					</div>
				</FadeUp>
			</div>

			{cue ? (
				<span
					className="absolute bottom-9 left-1/2 -translate-x-1/2 z-10 mdi mdi-chevron-double-down text-2xl text-white/50 animate-bounce"
					aria-hidden
				/>
			) : null}
		</section>
	);
}

export default Hero;