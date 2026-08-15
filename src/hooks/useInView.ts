"use client";

import { useEffect, useRef, useState } from "react";



// Custom hook to handle the scroll intersection (replaces whileInView)
function useInView(options?: IntersectionObserverInit) {
	const ref = useRef<HTMLDivElement>(null);
	const [isInView, setIsInView] = useState(false);

	useEffect(() => {
		const currentRef = ref.current;
		if (!currentRef) return;

		const observer = new IntersectionObserver(([entry]) => {
			if (entry.isIntersecting) {
				setIsInView(true);
				// Unobserve once triggered to mimic `viewport={{ once: true }}`
				observer.unobserve(currentRef);
			}
		}, options);

		observer.observe(currentRef);

		return () => {
			if (currentRef) observer.unobserve(currentRef);
		};
	}, [options]);

	return { ref, isInView };
}
export default useInView;