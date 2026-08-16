"use client";

import { motion, HTMLMotionProps } from "framer-motion";

interface FadeUpProps extends HTMLMotionProps<"div"> {
	children: React.ReactNode;
	delay?: number;
	className?: string;
}

export function FadeUp({ children, delay = 0, className = "", ...props }: FadeUpProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 36 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-50px" }}
			transition={{ duration: 0.7, delay }}
			className={className}
			{...props}
		>
			{children}
		</motion.div>
	);
}

export function FadeLeft({ children, delay = 0, className = "", ...props }: FadeUpProps) {
	return (
		<motion.div
			initial={{ opacity: 0, x: -50 }}
			whileInView={{ opacity: 1, x: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.7, delay }}
			className={className}
			{...props}
		>
			{children}
		</motion.div>
	);
}

export function FadeRight({ children, delay = 0, className = "", ...props }: FadeUpProps) {
	return (
		<motion.div
			initial={{ opacity: 0, x: 50 }}
			whileInView={{ opacity: 1, x: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.7, delay }}
			className={className}
			{...props}
		>
			{children}
		</motion.div>
	);
}
