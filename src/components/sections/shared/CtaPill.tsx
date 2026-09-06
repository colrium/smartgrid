"use client";

import type { ReactElement } from "react";
import Link from "@/components/Link";

export interface CtaAction {
	/** Visible label. */
	label: string;
	/** Destination href (internal or external - routed via `@/components/Link`). */
	href: string;
	/** Optional MDI icon name (without the `mdi-` prefix). */
	icon?: string | null;
	/** Icon placement. Defaults to `"end"` on solid pills and `"start"` on outline pills. */
	iconPosition?: "start" | "end";
	/** Appends a trailing `arrow-right` glyph that nudges right on hover. */
	trailingArrow?: boolean;
}

interface CtaPillProps {
	action: CtaAction;
	/** `solid` = light pill on dark band, `outline` = hairline pill. */
	variant?: "solid" | "outline";
	/** `lg` = flagship bands (h-14), `md` = compact split bands (h-12). */
	size?: "lg" | "md";
	className?: string;
}

/**
 * Shared pill-shaped CTA link used by every CTA band and final CTA section.
 * One component keeps hover physics, icon slots and focus behaviour
 * consistent site-wide instead of re-declaring the markup per section.
 */
export function CtaPill({
	action,
	variant = "solid",
	size = "lg",
	className = "",
}: CtaPillProps): ReactElement {
	const { label, href, icon, iconPosition, trailingArrow } = action;
	const isMd = size === "md";

	// Compact pills scope their hover state to `group/btn` so it cannot
	// collide with the parent band's `group/band` watermark animations.
	// Every Tailwind candidate is written out literally (no interpolated
	// prefixes) so the scanner can pick all variants up.
	const groupClass = isMd ? "group/btn" : "group";

	const sizeClasses = isMd
		? "h-12 px-7 text-sm justify-center"
		: "h-14 px-8 text-base";

	const baseClass =
		variant === "solid"
			? `${groupClass} inline-flex items-center gap-3 ${sizeClasses} rounded-full bg-surface text-ink font-medium transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-10px_rgba(1,55,61,0.55)]`
			: `${groupClass} inline-flex items-center gap-2.5 ${sizeClasses} rounded-full border border-surface/30 text-surface font-medium transition-[border-color,background-color] duration-300 hover:border-surface hover:bg-surface/10`;

	const iconAtEnd = iconPosition ? iconPosition === "end" : variant === "solid";
	const iconAtStart = Boolean(icon) && !iconAtEnd;

	return (
		<Link href={href} className={`${baseClass} ${className}`.trim()}>
			{variant === "solid" && iconAtEnd && (
				<span
					className={
						isMd
							? "h-1.5 w-1.5 rounded-full bg-primary transition-transform duration-300 group-hover/btn:scale-125"
							: "h-1.5 w-1.5 rounded-full bg-primary transition-transform duration-300 group-hover:scale-125"
					}
					aria-hidden
				/>
			)}

			{iconAtStart && (
				<span
					className={`mdi mdi-${icon} ${
						isMd ? "text-lg" : "text-xl"
					} ${variant === "solid" ? "text-primary" : "text-primary-200"}`}
					aria-hidden
				/>
			)}

			{!icon && variant === "outline" && (
				<span className="h-1.5 w-1.5 rounded-full bg-primary-200" aria-hidden />
			)}

			<span>{label}</span>

			{iconAtEnd && icon && (
				<span
					className={
						isMd
							? `mdi mdi-${icon} text-lg transition-transform duration-300 group-hover/btn:translate-x-1`
							: `mdi mdi-${icon} text-xl text-ink transition-transform duration-300 group-hover:translate-x-1`
					}
					aria-hidden
				/>
			)}

			{trailingArrow && (
				<span
					className={
						isMd
							? "mdi mdi-arrow-right text-lg transition-transform duration-300 group-hover/btn:translate-x-1"
							: "mdi mdi-arrow-right text-xl transition-transform duration-300 group-hover:translate-x-1"
					}
					aria-hidden
				/>
			)}
		</Link>
	);
}

export default CtaPill;
