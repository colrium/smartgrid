"use client";

import { useInView } from "@/hooks";

// Standard HTML div props instead of HTMLMotionProps
interface FadeProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	delay?: number;
	className?: string;
}

export function FadeUp({ children, delay = 0, className = "", ...props }: FadeProps) {
	// Replicating viewport={{ margin: "-50px" }}
	const { ref, isInView } = useInView({ rootMargin: "-56px" });

	return (
		<div
			ref={ref}
			className={`transition-all duration-700 ease-out ${
				isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-[36px]"
			} ${className}`}
			style={{ transitionDelay: `${delay}s` }}
			{...props}
		>
			{children}
		</div>
	);
}

export function FadeLeft({ children, delay = 0, className = "", ...props }: FadeProps) {
	const { ref, isInView } = useInView();

	return (
		<div
			ref={ref}
			className={`transition-all duration-700 ease-out ${
				isInView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-[50px]"
			} ${className}`}
			style={{ transitionDelay: `${delay}s` }}
			{...props}
		>
			{children}
		</div>
	);
}

export function FadeRight({ children, delay = 0, className = "", ...props }: FadeProps) {
	const { ref, isInView } = useInView();

	return (
		<div
			ref={ref}
			className={`transition-all duration-700 ease-out ${
				isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-[50px]"
			} ${className}`}
			style={{ transitionDelay: `${delay}s` }}
			{...props}
		>
			{children}
		</div>
	);
}