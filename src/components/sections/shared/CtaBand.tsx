"use client";

import type { ReactElement } from "react";
import { FadeUp } from "@/components/animations/Fade";
import { SectionTag } from "@/components/SectionTag";
import { CtaPill, type CtaAction } from "./CtaPill";

interface CtaBandProps {
	/** Kicker rendered above the headline (dark tone). */
	tag?: string | null;
	headline: string;
	description?: string | null;
	primary?: CtaAction | null;
	secondary?: CtaAction | null;
	/** `"centered"` (stacked, centred) or `"split"` (copy left, actions right). */
	layout?: "centered" | "split";
	/** Band density: `xl` = flagship bands, `lg` = medium centred bands, `md` = split bands. */
	size?: "xl" | "lg" | "md";
	/** Background ornaments: soft blurred glows or radially masked circles. */
	decor?: "glow" | "masked" | "none";
	/** Decorative MDI icon name (without the `mdi-` prefix). */
	watermark?: string | null;
	/** Decorative text glyph (e.g. `↗`) shown bottom-right on flagship bands. */
	glyph?: string | null;
	/** Adds the gold shimmer top edge. */
	shimmer?: boolean;
	/** Adds the inset dark hairline ring. */
	hairline?: boolean;
	id?: string;
	/** Outer `<section>` classes. Replaces the default - include spacing + overflow. */
	className?: string;
}

const MASK_IMAGE = {
	WebkitMaskImage: "radial-gradient(closest-side, black 30%, transparent 72%)",
	maskImage: "radial-gradient(closest-side, black 30%, transparent 72%)",
} as const;

/**
 * Shared framed CTA band: the rounded `ink-panel` card with ornaments, kicker,
 * headline, lede and pill actions. Consolidates the per-page CTA band copies
 * (home, civil, aerial-drones, equipment-catalogue, surveying) behind one
 * implementation while letting each page keep its own translated content.
 */
export function CtaBand({
	tag,
	headline,
	description,
	primary,
	secondary,
	layout = "centered",
	size,
	decor = "glow",
	watermark,
	glyph,
	shimmer = false,
	hairline = false,
	id,
	className,
}: CtaBandProps): ReactElement {
	const isSplit = layout === "split";
	const effectiveSize = size ?? (isSplit ? "md" : "xl");

	const bandPad =
		effectiveSize === "xl"
			? "px-8 py-16 sm:px-12 sm:py-24"
			: effectiveSize === "lg"
				? "px-8 py-14 sm:px-12 sm:py-16"
				: "px-8 py-12 sm:px-12 sm:py-14";

	const headlineClass =
		effectiveSize === "xl"
			? "font-light tracking-tight leading-[1.08] text-3xl sm:text-5xl lg:text-[3.4rem] text-surface max-w-3xl"
			: effectiveSize === "lg"
				? "font-light tracking-tight leading-[1.08] text-3xl sm:text-4xl lg:text-5xl text-surface max-w-3xl"
				: "font-light tracking-tight leading-[1.1] text-2xl sm:text-3xl lg:text-[2.1rem] text-surface";

	const descriptionClass = isSplit
		? "mt-3 text-sm sm:text-base text-surface/60 leading-relaxed max-w-xl"
		: "text-base sm:text-lg text-surface/65 leading-relaxed max-w-2xl mx-auto";

	const hasActions = Boolean(primary?.href || secondary?.href);

	return (
		<section
			id={id}
			className={className ?? "py-24 sm:py-28 relative overflow-hidden"}
		>
			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<div
						className={`group/band relative rounded-c ink-panel card-shadow overflow-hidden ${bandPad} ${
							isSplit ? "" : "text-center"
						} ${shimmer ? "shimmer-t shimmer-gold-200" : ""}`}
					>
						{/* Background ornaments */}
						{decor === "glow" && (
							<>
								<span
									aria-hidden
									className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-primary-300/30 blur-[90px] pointer-events-none"
								/>
								<span
									aria-hidden
									className="absolute -bottom-28 -left-20 w-72 h-72 rounded-full bg-primary/30 blur-[90px] pointer-events-none"
								/>
							</>
						)}
						{decor === "masked" && (
							<>
								<span
									aria-hidden
									className="absolute -top-24 -right-24 w-120 h-120 rounded-full bg-primary-300/20 pointer-events-none"
									style={MASK_IMAGE}
								/>
								<span
									aria-hidden
									className="absolute -bottom-28 -left-20 w-72 h-72 rounded-full bg-primary/30 pointer-events-none"
									style={MASK_IMAGE}
								/>
							</>
						)}
						{hairline && (
							<span
								aria-hidden
								className="absolute inset-3 rounded-cmd hairline-dark pointer-events-none"
							/>
						)}
						{watermark && !isSplit && (
							<span
								aria-hidden
								className={`mdi mdi-${watermark} absolute -right-8 -top-6 text-[13rem] leading-none text-surface/[0.05] select-none pointer-events-none transition-transform duration-700 group-hover/band:rotate-6 group-hover/band:scale-105`}
							/>
						)}
						{watermark && isSplit && (
							<>
								<span
									aria-hidden
									className={`mdi mdi-${watermark} absolute -right-8 -top-10 text-[11rem] leading-none text-surface/[0.06] select-none pointer-events-none transition-transform duration-700 group-hover/band:rotate-6 group-hover/band:scale-105`}
								/>
								<span
									aria-hidden
									className={`mdi mdi-${watermark} absolute left-6 bottom-6 hidden sm:block text-6xl -rotate-12 text-surface/[0.05] select-none pointer-events-none transition-transform duration-700 group-hover/band:rotate-0`}
								/>
							</>
						)}
						{glyph && (
							<span
								aria-hidden
								className="absolute -bottom-10 right-4 font-light tracking-tighter text-[11rem] leading-none text-surface/[0.03] select-none pointer-events-none hidden sm:block"
							>
								{glyph}
							</span>
						)}

						{isSplit ? (
							<div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
								<div className="flex-1 min-w-0">
									{tag && (
										<SectionTag dark className="mb-4">
											{tag}
										</SectionTag>
									)}
									<h2 className={headlineClass}>{headline}</h2>
									{description && (
										<p className={descriptionClass}>{description}</p>
									)}
								</div>

								{hasActions && (
									<div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-3 shrink-0">
										{primary?.href && <CtaPill action={primary} size="md" />}
										{secondary?.href && (
											<CtaPill action={secondary} size="md" variant="outline" />
										)}
									</div>
								)}
							</div>
						) : (
							<div className="relative flex flex-col items-center gap-6">
								{tag && <SectionTag dark>{tag}</SectionTag>}
								<h2 className={headlineClass}>{headline}</h2>
								{description && <p className={descriptionClass}>{description}</p>}

								{hasActions && (
									<div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
										{primary?.href && <CtaPill action={primary} />}
										{secondary?.href && (
											<CtaPill action={secondary} variant="outline" />
										)}
									</div>
								)}
							</div>
						)}
					</div>
				</FadeUp>
			</div>
		</section>
	);
}

export default CtaBand;

