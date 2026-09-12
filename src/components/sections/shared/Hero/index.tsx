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
	ctaPrimary?: {
		label: string;
		href: string;
		icon?: string | null;
	} | null;
}

export interface HeroProps {
	/** Section content object, usually `t("<ns>:hero", { returnObjects: true })`. */
	data: HeroContent;
	id?: string;
	className?: string;
}

/**
 * Shared full-bleed page hero: bottom-aligned copy over a priority-loaded
 * background image (or solid `ink-panel` fallback) with the standard ink
 * gradient overlays, dark kicker, h1 and pill CTA. Consolidates the per-page
 * hero copies that only differed by i18n namespace.
 */
export function Hero(props: HeroProps): ReactElement {
	const hero = props.data ?? {};
	const hasImage = typeof hero.image === "string" && hero.image.startsWith("/");
	const heading = hero.title || hero.description || "";
	const lede = hero.title ? (hero.description ?? null) : null;
	const action: CtaAction | null = hero.ctaPrimary?.href
		? {
				label: hero.ctaPrimary.label,
				href: hero.ctaPrimary.href,
				icon: hero.ctaPrimary.icon ?? "arrow-right",
				iconPosition: "end",
			}
		: null;

	return (
		<section
			id={props.id}
			className={`relative min-h-[86dvh] flex items-end overflow-hidden pb-14 sm:pb-20 ${props.className ?? ""}`.trim()}
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
			<div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/30" />
			<div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-ink/40" />

			<div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-8 lg:px-12">
				<FadeUp>
					{hero.headline ? <SectionTag dark>{hero.headline}</SectionTag> : null}

					{heading ? (
						<h1 className="mt-5 max-w-4xl font-light tracking-tight leading-[1.05] text-4xl sm:text-6xl lg:text-7xl text-surface">
							{heading}
						</h1>
					) : null}

					{lede ? (
						<p className="mt-6 max-w-2xl text-base sm:text-lg text-surface/70 leading-relaxed whitespace-pre-line">
							{lede}
						</p>
					) : null}

					{action ? (
						<div className="mt-10">
							<CtaPill action={action} />
						</div>
					) : null}
				</FadeUp>
			</div>
		</section>
	);
}

export default Hero;