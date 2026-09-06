/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useRef, useState, type ReactElement, type ReactNode } from "react";

interface DeferredMountProps {
	children: ReactNode;
	fallback: ReactNode;
	/** Begin loading shortly before the content enters the viewport. */
	rootMargin?: string;
	className?: string;
}

/** Keeps optional, client-heavy content out of the render tree until nearby. */
export function DeferredMount({
	children,
	fallback,
	rootMargin = "320px 0px",
	className="",
}: DeferredMountProps): ReactElement {
	const ref = useRef<HTMLDivElement>(null);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		const element = ref.current;
		if (!element || mounted) return;

		if (!("IntersectionObserver" in window)) {
			setMounted(true);
			return;
		}

		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				setMounted(true);
				observer.disconnect();
			},
			{ rootMargin },
		);

		observer.observe(element);
		return () => observer.disconnect();
	}, [mounted, rootMargin]);

	return (
		<div ref={ref} className={className}>
			{mounted ? children : fallback}
		</div>
	);
}

export default DeferredMount;
