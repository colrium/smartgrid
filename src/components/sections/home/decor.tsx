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

/** Soft, blurred background blob (institutional texture, like Biofarma's misc-01) */
export function Blob({
	className = "",
	style,
	opacity = 0.5,
}: DecorProps & { opacity?: number }) {
	return (
		<span
			aria-hidden
			style={{ opacity, filter: "blur(48px)", ...style }}
			className={`pointer-events-none select-none absolute block rounded-full ${className}`}
		/>
	);
}