"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView, cubicBezier } from "framer-motion"; 
const EXPO = cubicBezier(0.16, 1, 0.3, 1);
const SLOW = cubicBezier(0.25, 0.46, 0.45, 0.94);

export default function ClipReveal({
	children,
	direction = "right",
	delay = 0,
	className = "",
}: {
	children: React.ReactNode;
	direction?: "right" | "left" | "up";
	delay?: number;
	className?: string;
}) {
	const ref = useRef<HTMLDivElement>(null);
	const inView = useInView(ref, { once: true, margin: "-10%" });

	const variants = {
		right: {
			hidden: { clipPath: "inset(0% 100% 0% 0%)" },
			show: { clipPath: "inset(0% 0% 0% 0%)" },
		},
		left: {
			hidden: { clipPath: "inset(0% 0% 0% 100%)" },
			show: { clipPath: "inset(0% 0% 0% 0%)" },
		},
		up: {
			hidden: { clipPath: "inset(100% 0% 0% 0%)" },
			show: { clipPath: "inset(0% 0% 0% 0%)" },
		},
	};

	return (
		<motion.div
			ref={ref}
			variants={variants[direction]}
			initial="hidden"
			animate={inView ? "show" : "hidden"}
			transition={{ duration: 1.05, delay, ease: EXPO }}
			className={className}
		>
			{children}
		</motion.div>
	);
}
