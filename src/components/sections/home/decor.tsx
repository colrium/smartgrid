"use client";

import type { CSSProperties, ReactNode } from "react";
import { Parallax } from "@/components/animations/ScrollReveal";

interface DecorProps {
	className?: string;
	style?: CSSProperties;
}

/** Scroll-driven parallax wrapper for decorative layers only (kept subtle) */
export function ParallaxDecor({
	children,
	speed = 0.12,
	className = "",
	style,
}: DecorProps & { children: ReactNode; speed?: number }) {
	return (
		<Parallax speed={speed} className={className} style={style}>
			{children}
		</Parallax>
	);
}

/**
 * Soft, blurred background blob (institutional texture, like Biofarma's misc-01).
 * Uses a radial mask fade instead of `filter: blur()` — visually identical soft
 * falloff without the expensive GPU filter layer.
 */
export function Blob({
	className = "",
	style,
	opacity = 0.5,
}: DecorProps & { opacity?: number }) {
	return (
		<span
			aria-hidden
			style={{
				opacity,
				WebkitMaskImage: "radial-gradient(closest-side, black 30%, transparent 72%)",
				maskImage: "radial-gradient(closest-side, black 30%, transparent 72%)",
				...style,
			}}
			className={`pointer-events-none select-none absolute block rounded-full ${className}`}
		/>
	);
}
