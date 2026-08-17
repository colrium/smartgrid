import { useCallback, useEffect, useRef, useState } from "react";
import {
	motion,
	useScroll,
	useTransform,
	useSpring,
	AnimatePresence,
	cubicBezier,
} from "framer-motion";
type ScrollYProgress = ReturnType<typeof useScroll>["scrollYProgress"];
// ─── Eases ───────────────────────────────────────────────────────────────────
const EXPO = cubicBezier(0.16, 1, 0.3, 1);
const SLIDE = cubicBezier(0.77, 0, 0.175, 1);
// ─── Scroll-wipe word reveal (orange or black) ────────────────────────────────
//
//  How it works:
//  An overlay div (same colour as page bg) sits on top of the text and its
//  `right` value is driven from 100% → 0% as the user scrolls, revealing the
//  word like a curtain pull from left to right.
//
export default function WipeWord({
	children,
	progress,
	range=[0, 1],
	orange = false,
}: {
	children: React.ReactNode;
	progress: ScrollYProgress;
	range: [number, number];
	orange?: boolean;
    }) {
    
	// Map scroll progress to curtain right-edge position
	const curtainRight = useTransform(progress, range, ["100%", "0%"]);
	const curtainSpring = useSpring(curtainRight, { stiffness: 80, damping: 22, mass: 0.6 });

	return (
		<span className="relative inline-block">
			<span className={orange ? "text-primary-500" : "text-on-surface"}>{children}</span>
			{/* Curtain overlay */}
			<motion.span
				aria-hidden
				className="pointer-events-none absolute inset-y-0 left-0 bg-[#f2ede6]"
				style={{ right: curtainSpring }}
			/>
		</span>
	);
}
