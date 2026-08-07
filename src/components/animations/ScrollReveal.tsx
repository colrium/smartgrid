// @ts-nocheck
"use client";

/**
 * scroll-reveal-wrappers.tsx
 *
 * A collection of reusable scroll-triggered animation wrapper components built
 * on Framer Motion + Lenis. Every component:
 *   - triggers once the element enters the viewport (useInView)
 *   - accepts margin, delay, duration, ease overrides
 *   - wraps any React children (div, text, image, card…)
 *   - is fully typed with TypeScript
 *
 * Usage:
 *   import { FadeUp, SplitWords, ... } from "@/components/scroll-reveal-wrappers";
 *   <FadeUp><p>Hello world</p></FadeUp>
 */

import { useRef, type ReactNode, type CSSProperties } from "react";
import {
	motion,
	useScroll,
	useTransform,
	useSpring,
	useInView,
	cubicBezier,
	type Transition,
	type TargetAndTransition,
} from "framer-motion";

// ─── Shared types ─────────────────────────────────────────────────────────────

export interface RevealProps {
	children: ReactNode;
	/** Delay before animation starts (seconds) */
	delay?: number;
	/** Animation duration (seconds) */
	duration?: number;
	/** Viewport margin before element is considered "in view" */
	margin?: string;
	/** Whether animation runs every time element enters viewport */
	once?: boolean;
	className?: string;
	style?: CSSProperties;
}

// ─── Shared eases ─────────────────────────────────────────────────────────────

const EXPO = cubicBezier(0.16, 1, 0.3, 1);
const CIRC = cubicBezier(0.85, 0, 0.15, 1);
const BACK = cubicBezier(0.34, 1.56, 0.64, 1); // slight overshoot
const SLIDE = cubicBezier(0.77, 0, 0.175, 1);
const SLOW = cubicBezier(0.25, 0.46, 0.45, 0.94);

// ─── Helper: shared inView + transition ──────────────────────────────────────

function useReveal(margin = "-80px", once = true) {
	const ref = useRef<HTMLDivElement>(null);
	const inView = useInView(ref, {
		once,
		margin: margin || undefined,
	});
	return { ref, inView };
}

// ══════════════════════════════════════════════════════════════════════════════
// 1. ClipReveal
//    A solid curtain (same colour as the background) slides away to reveal
//    content — left-to-right, right-to-left, or bottom-to-top.
//    This is the signature SOM / Reform Collective effect.
// ══════════════════════════════════════════════════════════════════════════════

export type ClipDirection = "right" | "left" | "up" | "down";

export interface ClipRevealProps extends RevealProps {
	/** Direction the curtain wipes away */
	direction?: ClipDirection;
	/** Colour of the curtain overlay */
	curtainColor?: string;
}

const CLIP_VARIANTS: Record<
	ClipDirection,
	{ hidden: TargetAndTransition; show: TargetAndTransition }
> = {
	right: {
		hidden: { clipPath: "inset(0% 100% 0% 0%)" },
		show: { clipPath: "inset(0% 0%   0% 0%)" },
	},
	left: {
		hidden: { clipPath: "inset(0% 0% 0% 100%)" },
		show: { clipPath: "inset(0% 0% 0% 0%)" },
	},
	up: {
		hidden: { clipPath: "inset(100% 0% 0% 0%)" },
		show: { clipPath: "inset(0%   0% 0% 0%)" },
	},
	down: {
		hidden: { clipPath: "inset(0% 0% 100% 0%)" },
		show: { clipPath: "inset(0% 0% 0%   0%)" },
	},
};

export function ClipReveal({
	children,
	direction = "right",
	delay = 0,
	duration = 1.05,
	margin = "-80px",
	once = true,
	className,
	style,
}: ClipRevealProps) {
	const { ref, inView } = useReveal(margin, once);

	return (
		<motion.div
			ref={ref}
			variants={CLIP_VARIANTS[direction]}
			initial="hidden"
			animate={inView ? "show" : "hidden"}
			transition={{ duration, delay, ease: EXPO }}
			className={className}
			style={style}
		>
			{children}
		</motion.div>
	);
}

// ══════════════════════════════════════════════════════════════════════════════
// 2. FadeUp
//    The most universal reveal: element fades in while drifting upward.
//    Optional blur (gives a "materialising" feel) and scale.
// ══════════════════════════════════════════════════════════════════════════════

export interface FadeUpProps extends RevealProps {
	/** Starting Y offset in px */
	distance?: number;
	/** Add a blur-in effect */
	blur?: boolean;
	/** Subtle scale from < 1 */
	scale?: number;
}

export function FadeUp({
	children,
	delay = 0,
	duration = 0.8,
	distance = 40,
	blur = false,
	scale,
	margin = "-60px",
	once = true,
	className,
	style,
}: FadeUpProps) {
	const { ref, inView } = useReveal(margin, once);

	return (
		<motion.div
			ref={ref}
			initial={{
				opacity: 0,
				y: distance,
				...(blur && { filter: "blur(8px)" }),
				...(scale !== undefined && { scale }),
			}}
			animate={
				inView
					? {
							opacity: 1,
							y: 0,
							...(blur && { filter: "blur(0px)" }),
							...(scale !== undefined && { scale: 1 }),
						}
					: {}
			}
			transition={{ duration, delay, ease: EXPO }}
			className={className}
			style={style}
		>
			{children}
		</motion.div>
	);
}

// ══════════════════════════════════════════════════════════════════════════════
// 3. SlideIn
//    Content slides in from left or right (off-screen) and optionally bounces
//    with a spring ease. Great for cards, images, side panels.
// ══════════════════════════════════════════════════════════════════════════════

export interface SlideInProps extends RevealProps {
	from?: "left" | "right";
	/** px offset to start from */
	distance?: number;
	spring?: boolean;
}

export function SlideIn({
	children,
	from = "left",
	distance = 80,
	spring = false,
	delay = 0,
	duration = 0.9,
	margin = "-60px",
	once = true,
	className,
	style,
}: SlideInProps) {
	const { ref, inView } = useReveal(margin, once);
	const x = from === "left" ? -distance : distance;

	const transition: Transition = spring
		? { type: "spring", stiffness: 60, damping: 18, delay }
		: { duration, delay, ease: EXPO };

	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, x }}
			animate={inView ? { opacity: 1, x: 0 } : {}}
			transition={transition}
			className={className}
			style={style}
		>
			{children}
		</motion.div>
	);
}

// ══════════════════════════════════════════════════════════════════════════════
// 4. ScaleReveal
//    Content scales from a smaller size to full size, with a subtle elastic
//    overshoot. Excellent for cards, images, badges, icons.
// ══════════════════════════════════════════════════════════════════════════════

export interface ScaleRevealProps extends RevealProps {
	/** Starting scale (0–1) */
	from?: number;
	/** "elastic" adds spring overshoot, "smooth" uses EXPO */
	mode?: "elastic" | "smooth";
	/** Transform origin */
	origin?: string;
}

export function ScaleReveal({
	children,
	from = 0.85,
	mode = "elastic",
	origin = "center center",
	delay = 0,
	duration = 0.75,
	margin = "-60px",
	once = true,
	className,
	style,
}: ScaleRevealProps) {
	const { ref, inView } = useReveal(margin, once);

	const transition: Transition =
		mode === "elastic"
			? { type: "spring", stiffness: 200, damping: 20, delay }
			: { duration, delay, ease: BACK };

	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, scale: from }}
			animate={inView ? { opacity: 1, scale: 1 } : {}}
			transition={transition}
			style={{ transformOrigin: origin, ...style }}
			className={className}
		>
			{children}
		</motion.div>
	);
}

// ══════════════════════════════════════════════════════════════════════════════
// 5. SplitWords
//    Splits children string into individual words; each drops in from below its
//    own overflow-hidden clip. The classic editorial "words fall into place" reveal.
//    Only works with string children.
// ══════════════════════════════════════════════════════════════════════════════

export interface SplitWordsProps {
	children: string;
	delay?: number;
	duration?: number;
	stagger?: number;
	margin?: string;
	once?: boolean;
	className?: string;
	wordClassName?: string;
}

export function SplitWords({
	children,
	delay = 0,
	duration = 0.85,
	stagger = 0.06,
	margin = "-60px",
	once = true,
	className,
	wordClassName,
}: SplitWordsProps) {
	const { ref, inView } = useReveal(margin, once);
	const words = children.split(" ");

	return (
		<span ref={ref} className={`inline ${className ?? ""}`} aria-label={children}>
			{words.map((word, i) => (
				<span key={i} className="inline-block overflow-hidden leading-[1.15]">
					<motion.span
						className={`inline-block ${wordClassName ?? ""}`}
						initial={{ y: "110%" }}
						animate={inView ? { y: "0%" } : {}}
						transition={{ duration, delay: delay + i * stagger, ease: EXPO }}
					>
						{word}
						{i < words.length - 1 ? "\u00A0" : ""}
					</motion.span>
				</span>
			))}
		</span>
	);
}

// ══════════════════════════════════════════════════════════════════════════════
// 6. SplitChars
//    Like SplitWords but character-by-character — each letter spins or drops in.
//    Ideal for short headings, logos, labels.
// ══════════════════════════════════════════════════════════════════════════════

export interface SplitCharsProps {
	children: string;
	delay?: number;
	duration?: number;
	stagger?: number;
	/** "up" = slide from below, "spin" = rotateX flip, "scale" = grow in */
	mode?: "up" | "spin" | "scale";
	margin?: string;
	once?: boolean;
	className?: string;
	charClassName?: string;
}

const CHAR_VARIANTS = {
	up: {
		hidden: { y: "110%", opacity: 0 },
		show: { y: "0%", opacity: 1 },
	},
	spin: {
		hidden: { rotateX: 90, opacity: 0 },
		show: { rotateX: 0, opacity: 1 },
	},
	scale: {
		hidden: { scale: 0, opacity: 0 },
		show: { scale: 1, opacity: 1 },
	},
};

export function SplitChars({
	children,
	delay = 0,
	duration = 0.6,
	stagger = 0.03,
	mode = "up",
	margin = "-60px",
	once = true,
	className,
	charClassName,
}: SplitCharsProps) {
	const { ref, inView } = useReveal(margin, once);
	const chars = children.split("");
	const transition: Transition =
		mode === "spin" ? { duration, ease: EXPO } : { duration, ease: BACK };

	return (
		<span
			ref={ref}
			className={`inline-block ${className ?? ""}`}
			aria-label={children}
			style={{ perspective: "600px" }}
		>
			{chars.map((char, i) => (
				<span key={i} className="inline-block overflow-hidden">
					<motion.span
						className={`inline-block ${charClassName ?? ""}`}
						variants={CHAR_VARIANTS[mode]}
						initial="hidden"
						animate={inView ? "show" : "hidden"}
						transition={{ ...transition, delay: delay + i * stagger }}
					>
						{char === " " ? "\u00A0" : char}
					</motion.span>
				</span>
			))}
		</span>
	);
}

// ══════════════════════════════════════════════════════════════════════════════
// 7. Parallax
//    Wraps content in a scroll-driven vertical parallax layer.
//    The child moves slower or faster than the viewport as you scroll.
// ══════════════════════════════════════════════════════════════════════════════

export interface ParallaxProps {
	children: ReactNode;
	/** Fraction of scroll range to translate (e.g. 0.15 = ±15%) */
	speed?: number;
	/** Spring smoothing */
	springConfig?: { stiffness: number; damping: number };
	className?: string;
	style?: CSSProperties;
}

export function Parallax({
	children,
	speed = 0.15,
	springConfig = { stiffness: 40, damping: 18 },
	className,
	style,
}: ParallaxProps) {
	const ref = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
	const rawY = useTransform(scrollYProgress, [0, 1], [`${-speed * 100}%`, `${speed * 100}%`]);
	const y = useSpring(rawY, springConfig);

	return (
		<div ref={ref} className={`overflow-hidden ${className ?? ""}`} style={style}>
			<motion.div style={{ y }} className="h-full w-full">
				{children}
			</motion.div>
		</div>
	);
}

// ══════════════════════════════════════════════════════════════════════════════
// 8. HorizontalParallax
//    Content drifts left or right driven by page scroll — perfect for
//    wide marquee-style text, image strips, or decorative layers.
// ══════════════════════════════════════════════════════════════════════════════

export interface HorizontalParallaxProps {
	children: ReactNode;
	speed?: number;
	reversed?: boolean;
	springConfig?: { stiffness: number; damping: number };
	className?: string;
	style?: CSSProperties;
}

export function HorizontalParallax({
	children,
	speed = 0.12,
	reversed = false,
	springConfig = { stiffness: 40, damping: 18 },
	className,
	style,
}: HorizontalParallaxProps) {
	const ref = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
	const dir = reversed ? 1 : -1;
	const rawX = useTransform(
		scrollYProgress,
		[0, 1],
		[`${dir * speed * 100}%`, `${-dir * speed * 100}%`]
	);
	const x = useSpring(rawX, springConfig);

	return (
		<div ref={ref} className={`overflow-hidden ${className ?? ""}`} style={style}>
			<motion.div style={{ x }} className="w-full">
				{children}
			</motion.div>
		</div>
	);
}

// ══════════════════════════════════════════════════════════════════════════════
// 9. MaskReveal
//    A gradient mask sweeps across the child from the chosen direction,
//    creating a "painted-on" appearance. Softer than the hard ClipReveal.
// ══════════════════════════════════════════════════════════════════════════════

export interface MaskRevealProps extends RevealProps {
	direction?: "right" | "left" | "up" | "down";
	/** Softness of the mask edge (px) */
	feather?: number;
}

export function MaskReveal({
	children,
	direction = "right",
	delay = 0,
	duration = 1.1,
	margin = "-60px",
	once = true,
	className,
	style,
}: MaskRevealProps) {
	const { ref, inView } = useReveal(margin, once);

	const isHorizontal = direction === "right" || direction === "left";
	const axis = isHorizontal ? "to right" : "to bottom";

	// We animate a CSS gradient mask from fully hidden to fully visible
	const hiddenMask = isHorizontal
		? `linear-gradient(${axis}, transparent 0%, transparent 0%, transparent 100%)`
		: `linear-gradient(${axis}, transparent 0%, transparent 0%, transparent 100%)`;

	// Revealed: the gradient wipes from the entry side to full opacity
	const startOpaque = direction === "right" || direction === "down";

	const maskHidden = startOpaque
		? `linear-gradient(${axis}, rgba(0,0,0,1) 0%, rgba(0,0,0,0) 0%)`
		: `linear-gradient(${axis}, rgba(0,0,0,0) 100%, rgba(0,0,0,1) 100%)`;

	const maskShown = `linear-gradient(${axis}, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 100%)`;

	return (
		<motion.div
			ref={ref}
			initial={{ WebkitMaskImage: maskHidden, maskImage: maskHidden, opacity: 0 }}
			animate={inView ? { WebkitMaskImage: maskShown, maskImage: maskShown, opacity: 1 } : {}}
			transition={{ duration, delay, ease: SLOW }}
			className={className}
			style={style}
		>
			{children}
		</motion.div>
	);
}

// ══════════════════════════════════════════════════════════════════════════════
// 10. RotateIn
//     Content enters with a 3-D rotation (rotateX or rotateY) and fades in.
//     Looks spectacular on cards and large images.
// ══════════════════════════════════════════════════════════════════════════════

export interface RotateInProps extends RevealProps {
	axis?: "X" | "Y";
	/** Starting rotation in degrees */
	degrees?: number;
	origin?: string;
}

export function RotateIn({
	children,
	axis = "X",
	degrees = 25,
	origin = "top center",
	delay = 0,
	duration = 0.9,
	margin = "-60px",
	once = true,
	className,
	style,
}: RotateInProps) {
	const { ref, inView } = useReveal(margin, once);

	const hidden =
		axis === "X"
			? { rotateX: degrees, opacity: 0, y: 20 }
			: { rotateY: degrees, opacity: 0, x: 20 };

	const show = axis === "X" ? { rotateX: 0, opacity: 1, y: 0 } : { rotateY: 0, opacity: 1, x: 0 };

	return (
		<motion.div
			ref={ref}
			initial={hidden}
			animate={inView ? show : {}}
			transition={{ duration, delay, ease: EXPO }}
			style={{ transformOrigin: origin, transformPerspective: 900, ...style }}
			className={className}
		>
			{children}
		</motion.div>
	);
}

// ══════════════════════════════════════════════════════════════════════════════
// 11. Stagger
//     Wraps multiple children and staggers their reveal. Each direct child
//     gets its own fade-up with an offset delay. The cleanest way to animate
//     lists, grids, and card decks without repeating animation code.
// ══════════════════════════════════════════════════════════════════════════════

export interface StaggerProps {
	children: ReactNode;
	stagger?: number;
	delay?: number;
	duration?: number;
	distance?: number;
	margin?: string;
	once?: boolean;
	className?: string;
	style?: CSSProperties;
}

export function Stagger({
	children,
	stagger = 0.1,
	delay = 0,
	duration = 0.75,
	distance = 30,
	margin = "-60px",
	once = true,
	className,
	style,
}: StaggerProps) {
	const { ref, inView } = useReveal(margin, once);

	return (
		<div ref={ref} className={className} style={style}>
			{Array.isArray(children)
				? (children as ReactNode[]).map((child, i) => (
						<motion.div
							key={i}
							initial={{ opacity: 0, y: distance }}
							animate={inView ? { opacity: 1, y: 0 } : {}}
							transition={{ duration, delay: delay + i * stagger, ease: EXPO }}
						>
							{child}
						</motion.div>
					))
				: children}
		</div>
	);
}

// ══════════════════════════════════════════════════════════════════════════════
// 12. CountUp
//    Animates a numeric value from 0 (or a custom start) to a target number
//    when it enters the viewport. Pass a formatter for currency, %, etc.
// ══════════════════════════════════════════════════════════════════════════════

import { useEffect, useState } from "react";

export interface CountUpProps {
	/** Target value */
	to: number;
	from?: number;
	duration?: number;
	delay?: number;
	decimals?: number;
	/** Custom formatter: receives the raw animated number */
	format?: (value: number) => string;
	margin?: string;
	once?: boolean;
	className?: string;
}

export function CountUp({
	to,
	from = 0,
	duration = 1.6,
	delay = 0,
	decimals = 0,
	format,
	margin = "-60px",
	once = true,
	className,
}: CountUpProps) {
	const { ref, inView } = useReveal(margin, once);
	const [display, setDisplay] = useState(format ? format(from) : from.toFixed(decimals));

	useEffect(() => {
		if (!inView) return;
		let startTime: number | null = null;
		const startDelaySec = delay * 1000;

		const tick = (ts: number) => {
			if (!startTime) startTime = ts + startDelaySec;
			if (ts < startTime) {
				requestAnimationFrame(tick);
				return;
			}

			const elapsed = ts - startTime;
			const t = Math.min(elapsed / (duration * 1000), 1);
			// Ease-out cubic
			const eased = 1 - Math.pow(1 - t, 3);
			const current = from + (to - from) * eased;
			setDisplay(format ? format(current) : current.toFixed(decimals));
			if (t < 1) requestAnimationFrame(tick);
		};

		const raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [inView, to, from, duration, delay, decimals, format]);

	return (
		<span ref={ref} className={className}>
			{display}
		</span>
	);
}

// ══════════════════════════════════════════════════════════════════════════════
// 13. LineReveal
//    Draws a horizontal or vertical line outward from the centre (or one end)
//    using scaleX / scaleY. Use as a decorative divider or accent bar.
// ══════════════════════════════════════════════════════════════════════════════

export interface LineRevealProps {
	orientation?: "horizontal" | "vertical";
	color?: string;
	thickness?: number | string;
	/** "center" expands from middle, "start" wipes from left/top */
	origin?: "center" | "start" | "end";
	delay?: number;
	duration?: number;
	margin?: string;
	once?: boolean;
	className?: string;
}

export function LineReveal({
	orientation = "horizontal",
	color = "currentColor",
	thickness = 1,
	origin = "center",
	delay = 0,
	duration = 0.9,
	margin = "-60px",
	once = true,
	className,
}: LineRevealProps) {
	const { ref, inView } = useReveal(margin, once);

	const isH = orientation === "horizontal";
	const transformOrigin =
		origin === "center"
			? "center center"
			: origin === "start"
				? isH
					? "left center"
					: "top center"
				: isH
					? "right center"
					: "bottom center";

	return (
		<motion.div
			ref={ref}
			initial={{ scaleX: isH ? 0 : 1, scaleY: isH ? 1 : 0 }}
			animate={inView ? { scaleX: 1, scaleY: 1 } : {}}
			transition={{ duration, delay, ease: EXPO }}
			style={{
				backgroundColor: color,
				transformOrigin,
				width: isH ? "100%" : thickness,
				height: isH ? thickness : "100%",
			}}
			className={className}
		/>
	);
}

// ══════════════════════════════════════════════════════════════════════════════
// 14. BlurReveal
//    Content materialises from a fully blurred + transparent state into sharp
//    focus. A cinematic, dreamlike entrance — excellent for hero images.
// ══════════════════════════════════════════════════════════════════════════════

export interface BlurRevealProps extends RevealProps {
	blurAmount?: number;
	scale?: number;
}

export function BlurReveal({
	children,
	blurAmount = 20,
	scale = 1.04,
	delay = 0,
	duration = 1.1,
	margin = "-60px",
	once = true,
	className,
	style,
}: BlurRevealProps) {
	const { ref, inView } = useReveal(margin, once);

	return (
		<motion.div
			ref={ref}
			initial={{ opacity: 0, filter: `blur(${blurAmount}px)`, scale }}
			animate={inView ? { opacity: 1, filter: "blur(0px)", scale: 1 } : {}}
			transition={{ duration, delay, ease: SLOW }}
			className={className}
			style={style}
		>
			{children}
		</motion.div>
	);
}

// ══════════════════════════════════════════════════════════════════════════════
// 15. ScrollProgress
//    Wraps children and exposes a progress value (0–1) to a render-prop child,
//    allowing custom scroll-driven animations beyond what the presets offer.
// ══════════════════════════════════════════════════════════════════════════════

export interface ScrollProgressProps {
	children: (progress: ReturnType<typeof useScroll>["scrollYProgress"]) => ReactNode;
	offset?: [string, string];
	smooth?: boolean;
	springConfig?: { stiffness: number; damping: number };
	className?: string;
	style?: CSSProperties;
}

export function ScrollProgress({
	children,
	offset = ["start end", "end start"],
	smooth = true,
	springConfig = { stiffness: 60, damping: 20 },
	className,
	style,
}: ScrollProgressProps) {
	const ref = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: offset as Parameters<typeof useScroll>[0]["offset"],
	});
	const smoothed = useSpring(scrollYProgress, springConfig);

	return (
		<div ref={ref} className={className} style={style}>
			{children(smooth ? smoothed : scrollYProgress)}
		</div>
	);
}
