"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView, cubicBezier } from "framer-motion";


// ─── Parallax image tile ──────────────────────────────────────────────────────
export function ParallaxTile({
	gradient,
	speed = 0.12,
	children,
	className = "",
}: {
	gradient: string;
	speed?: number;
	children?: React.ReactNode;
	className?: string;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
	const y = useTransform(scrollYProgress, [0, 1], [`${-speed * 100}%`, `${speed * 100}%`]);

	return (
		<div ref={ref} className={`relative overflow-hidden ${className}`}>
			<motion.div
				style={{ y }}
				className={`absolute inset-[-15%] ${gradient} flex items-center justify-center`}
			>
				{children}
			</motion.div>
		</div>
	);
}
