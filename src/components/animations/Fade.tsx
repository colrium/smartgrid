"use client";
import React, { useEffect, useRef, useState } from "react";

interface FadeProps {
	children: React.ReactNode;
	delay?: number;
	className?: string;
}

type Cb = () => void;
let observer: IntersectionObserver | null = null;
const callbacks = new WeakMap<Element, Cb>();

function getObserver() {
	if (!observer) {
		observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						callbacks.get(entry.target)?.();
						observer!.unobserve(entry.target);
						callbacks.delete(entry.target);
					}
				}
			},
			{ threshold: 0.1, rootMargin: "0px 0px -10% 0px" }
		);
	}
	return observer;
}

function useReveal<T extends HTMLElement>() {
	const ref = useRef<T>(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const obs = getObserver();
		callbacks.set(el, () => setVisible(true));
		obs.observe(el);
		return () => {
			obs.unobserve(el);
			callbacks.delete(el);
		};
	}, []);

	return { ref, visible };
}

function makeFade(hiddenTransform: string) {
	return function FadeComponent({ children, delay = 0, className = "" }: FadeProps) {
		const { ref, visible } = useReveal<HTMLDivElement>();
		return (
			<div
				ref={ref}
				className={`transition-all duration-700 ease-out will-change-transform ${
					visible
						? "opacity-100 translate-x-0 translate-y-0"
						: `opacity-0 ${hiddenTransform}`
				} ${className}`}
				style={{ transitionDelay: `${delay}ms` }}
			>
				{children}
			</div>
		);
	};
}

export const FadeUp = makeFade("translate-y-6");
export const FadeDown = makeFade("-translate-y-6");
export const FadeLeft = makeFade("translate-x-6");
export const FadeRight = makeFade("-translate-x-6");
