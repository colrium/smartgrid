"use client";

import type { ReactElement } from "react";
import Image from "next/image";
import { FadeUp } from "@/components/animations/Fade";
import { SectionTag } from "@/components/SectionTag";
import { Blob } from "@/components/sections/shared/decor";
import { CtaPill, type CtaAction } from "../CtaPill";
import { ScrollIndicator } from "@/components/ui/ScrollIndicator";

export interface HeroContent {
	/**
	 * Kicker/tag rendered above the h1 (SectionTag). On the `banner` layout the
	 * roles swap: `title` becomes the tag + giant ghost watermark and
	 * `headline` becomes the h1.
	 */
	headline?: string | null;
	/** Main h1 copy. Falls back to `description` when absent. */
	title?: string | null;
	/** Lede paragraph below the h1 (skipped when it doubles as the h1). */
	description?: string | null;
	/** Full-bleed background image; falls back to a solid ink panel. */
	image?: string | null;
	/** Presentation variant — `bottom` (default), `centered`, `banner`, `light`. */
	layout?: "bottom" | "centered" | "banner" | "light";
	/** Inset rounded frame ring (centered variant). */
	frame?: boolean;
	/** Bouncing scroll cue anchored bottom-centre (centered variant). */
	scrollCue?: boolean;
	/** Label for the bottom scroll cue (banner variant). */
	cueLabel?: string | null;
	/** Footnote chips rendered under the CTA row (hero trust markers). */
	footnoteItems?: { icon?: string | null; text?: string }[] | null;
	ctaPrimary?: {
		label: string;
		href: string;
		icon?: string | null;
		/** `start` = leading icon; default `end` on the bottom layout. */
		iconPosition?: "start" | "end";
		/** Overrides the layout-default trailing arrow (centered/banner/light render one unless set to `false`). */
		trailingArrow?: boolean;
	} | null;
	/** Secondary outline pill (rendered beside the primary pill). */
	ctaSecondary?: {
		label: string;
		href: string;
		icon?: string | null;
	} | null;
}

export interface HeroClassesProp {
	tag?: string;
	watermark?: string;
	content?: string;
	heading?: string;
	lede?: string;
	actions?: string;
	footnote?: string;
}
export interface HeroProps {
	/** Section content object, usually `t("<ns>:hero", { returnObjects: true })`. */
	data: HeroContent;
	/** Overrides `data.layout`. */
	layout?: "bottom" | "centered" | "banner" | "light";
	/** Overrides `data.frame`: inset rounded frame ring over the hero edges. */
	frame?: boolean;
	/** Overrides `data.scrollCue`: bouncing scroll cue anchored bottom-centre. */
	scrollCue?: boolean;
	id?: string;
	classes?: HeroClassesProp;
	className?: string;
}

/**
 * Shared page hero with four locale-driven layouts:
 * - `bottom`: copy bottom-left over a full-bleed image (or ink panel).
 * - `centered`: framed centre-stage variant (surveying landing).
 * - `banner`: dark ink band with a giant ghost watermark title, centred copy
 *   and a labelled scroll cue (careers).
 * - `light`: light centred intro hero with brand blobs (company profile).
 * Copy, presentation keys and pill CTAs are read from the locale entry so
 * CRUD flows can flip the presentation without code edits. Consolidates the
 * per-page hero copies that only differed by i18n namespace.
 */
export function Hero(props: HeroProps): ReactElement {
	const hero = props.data ?? {};
	const layout = props.layout ?? hero.layout ?? "bottom";
	const centered = layout === "centered";
	const banner = layout === "banner";
	const light = layout === "light";
	const framed = props.frame ?? hero.frame ?? false;
	const cue = props.scrollCue ?? hero.scrollCue ?? false;
	const footnotes = Array.isArray(hero.footnoteItems) ? hero.footnoteItems : [];
	const hasImage = typeof hero.image === "string" && hero.image.startsWith("/");
	const tag = banner ? (hero.title ?? hero.headline ?? null) : (hero.headline ?? null);
	const heading = banner
		? hero.headline || hero.description || ""
		: hero.title || hero.description || "";
	const lede = banner
		? hero.headline
			? (hero.description ?? null)
			: null
		: hero.title
			? (hero.description ?? null)
			: null;

	const ctaIcon = hero.ctaPrimary?.icon ?? (centered || light || banner ? null : "arrow-right");
	const ctaIconStart = centered || light || hero.ctaPrimary?.iconPosition === "start";
	const primary: CtaAction | null = hero.ctaPrimary?.href
		? {
				label: hero.ctaPrimary.label,
				href: hero.ctaPrimary.href,
				icon: ctaIcon,
				iconPosition: ctaIconStart ? "start" : "end",
				trailingArrow: hero.ctaPrimary.trailingArrow ?? (banner || centered || light ? true : undefined),
			}
		: null;
	const secondary: CtaAction | null = hero.ctaSecondary?.href
		? {
				label: hero.ctaSecondary.label,
				href: hero.ctaSecondary.href,
				icon: hero.ctaSecondary.icon ?? null,
				iconPosition: "start",
				trailingArrow: true,
			}
		: null;
	const pillVariant = centered || light ? "primary" : "solid";

	return (
		<section
			id={props.id}
			className={`relative ${light ? "overflow-hidden pt-44 sm:pt-52" : "flex overflow-hidden"} ${
				light
					? ""
					: centered
						? "min-h-[92vh] items-center justify-center bg-ink"
						: banner
							? "min-h-screen items-center justify-center pt-40 pb-24 sm:pt-44 sm:pb-28"
							: "min-h-[86dvh] items-end pb-14 sm:pb-20"
			} ${props.className ?? ""}`.trim()}
		>
			{banner ? (
				<>
					<div className="absolute inset-0 ink-panel" />
					<span
						aria-hidden
						className="absolute -top-32 -left-24 w-[30rem] h-[30rem] rounded-full bg-primary/25 blur-[120px] pointer-events-none"
					/>
					<span
						aria-hidden
						className="absolute -bottom-32 -right-24 w-[30rem] h-[30rem] rounded-full bg-primary/20 blur-[120px] pointer-events-none"
					/>
					<span
						aria-hidden
						className={`absolute inset-x-0 top-[25%] select-none pointer-events-none text-center font-mono font-bold uppercase tracking-[0.5em] text-surface/4 text-[22vw] lg:text-[13rem] leading-none whitespace-nowrap ${props.classes?.watermark ?? ""}`}
					>
						{hero.title}
					</span>
				</>
			) : light ? (
				<>
					<Blob
						className="w-[30rem] h-[30rem] bg-primary-100/50 -top-32 -left-24"
						opacity={0.5}
					/>
					<Blob
						className="w-[26rem] h-[26rem] bg-primary/10 -bottom-24 -right-20"
						opacity={0.5}
					/>
				</>
			) : (
				<>
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
					light ? "pb-16 sm:pb-20" : centered ? "py-48" : ""
				} ${props.classes?.content ?? ""}`.trim()}
			>
				<FadeUp
					className={
						banner
							? "max-w-4xl mx-auto flex flex-col items-center text-center"
							: centered
								? "mx-auto max-w-3xl"
								: undefined
					}
				>
					<div
						className={
							banner
								? "flex flex-col items-center text-center"
								: centered || light
									? "flex flex-col items-center text-center gap-7"
									: undefined
						}
					>
						{tag ? (
							<SectionTag
								dark={light ? undefined : true}
								className={props.classes?.tag ?? ""}
							>
								{tag}
							</SectionTag>
						) : null}

						{heading ? (
							<h1
								className={`${
									light
										? "font-light tracking-tight leading-[1.02] text-5xl sm:text-6xl lg:text-7xl text-ink max-w-4xl"
										: banner
											? "mt-7 max-w-4xl font-light tracking-tight leading-[1.05] text-4xl sm:text-6xl lg:text-[4.5rem] text-surface"
											: centered
												? "font-light tracking-tight leading-[1.02] text-5xl sm:text-6xl lg:text-7xl text-white drop-shadow-sm"
												: "mt-5 max-w-4xl font-light tracking-tight leading-[1.05] text-4xl sm:text-6xl lg:text-7xl text-surface"
								} ${props.classes?.heading ?? ""}`}
							>
								{heading}
							</h1>
						) : null}

						{lede ? (
							<p
								className={`${
									light
										? "max-w-2xl text-base sm:text-lg text-on-surface/60 leading-relaxed whitespace-pre-line"
										: banner
											? "mt-8 max-w-3xl text-base sm:text-lg text-surface/70 leading-relaxed"
											: centered
												? "max-w-2xl text-base sm:text-lg text-white/75 leading-relaxed whitespace-pre-line"
												: "mt-6 max-w-2xl text-base sm:text-lg text-surface/70 leading-relaxed whitespace-pre-line"
								} ${props.classes?.lede ?? ""}`}
							>
								{lede}
							</p>
						) : null}

						{primary || secondary ? (
							<div
								className={`${
									centered
										? "mt-1 flex flex-wrap items-center justify-center gap-4"
										: banner
											? "mt-11 flex flex-wrap items-center justify-center gap-4"
											: light
												? "flex flex-wrap items-center justify-center gap-4"
												: "mt-10 flex flex-wrap items-center gap-4"
								} ${props.classes?.actions ?? ""}`}
							>
								{primary ? (
									<CtaPill action={primary} variant={pillVariant} />
								) : null}
								{secondary ? (
									<CtaPill action={secondary} variant="outline" />
								) : null}
							</div>
						) : null}

						{footnotes.length > 0 ? (
							<ul
								className={`mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 ${props.classes?.footnote ?? ""}`}
							>
								{footnotes.map((item, index) => (
									<li
										key={index}
										className="inline-flex items-center gap-2 text-xs sm:text-sm text-surface/75"
									>
										<span
											className={`mdi mdi-${item.icon || "check-circle"} text-base text-primary-300`}
											aria-hidden
										/>
										{item.text}
									</li>
								))}
							</ul>
						) : null}
					</div>
				</FadeUp>
			</div>

			{banner && (hero.cueLabel || cue) ? (
				<div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-surface/50">
					<span className="text-[10px] uppercase tracking-[0.28em] font-semibold">
						{hero.cueLabel}
					</span>
					{/* <span className="mdi mdi-chevron-down animate-bounce text-xl" aria-hidden /> */}
					<ScrollIndicator color="surface"/>
				</div>
			) : null}
			{centered && cue ? (
				<span
					className="absolute bottom-9 left-1/2 -translate-x-1/2 z-10 mdi mdi-chevron-double-down text-2xl text-white/50 animate-bounce"
					aria-hidden
				/>
			) : null}
		</section>
	);
}

export default Hero;