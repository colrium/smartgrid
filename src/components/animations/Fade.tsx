"use client";
import React, { useEffect, useRef, useState } from "react";

interface ViewportOptions {
	once?: boolean;
	amount?: number;
	margin?: string;
}

interface FadeProps {
	children: React.ReactNode;
	delay?: number; // in seconds
	className?: string;
	viewport?: ViewportOptions;
}

type Entry = { onIntersect: (v: boolean) => void; once: boolean };
const registry = new WeakMap<Element, Entry>();
const observers = new Map<string, IntersectionObserver>();

function getObserver(amount: number, margin: string) {
	const key = `${amount}|${margin}`;
	let obs = observers.get(key);
	if (!obs) {
		obs = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					const reg = registry.get(entry.target);
					if (!reg) continue;
					if (entry.isIntersecting) {
						reg.onIntersect(true);
						if (reg.once) {
							obs!.unobserve(entry.target);
							registry.delete(entry.target);
						}
					} else if (!reg.once) {
						reg.onIntersect(false);
					}
				}
			},
			{ threshold: amount, rootMargin: margin }
		);
		observers.set(key, obs);
	}
	return obs;
}

function useReveal<T extends HTMLElement>(viewport?: ViewportOptions) {
	const once = viewport?.once ?? true;
	const amount = viewport?.amount ?? 0.1;
	const margin = viewport?.margin ?? "0px 0px -10% 0px";
	const ref = useRef<T>(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const obs = getObserver(amount, margin);
		registry.set(el, { onIntersect: setVisible, once });
		obs.observe(el);
		return () => {
			obs.unobserve(el);
			registry.delete(el);
		};
	}, [once, amount, margin]);

	return { ref, visible };
}

function makeFade(hiddenTransform: string) {
	return function FadeComponent({ children, delay = 0, className = "", viewport }: FadeProps) {
		const { ref, visible } = useReveal<HTMLDivElement>(viewport);
		return (
			<div
				ref={ref}
				className={`transition-all duration-700 ease-out will-change-transform ${
					visible
						? "opacity-100 translate-x-0 translate-y-0"
						: `opacity-0 ${hiddenTransform}`
				} ${className}`}
				style={{ transitionDelay: `${delay}s` }}
			>
				{children}
			</div>
		);
	};
}

export const FadeUp = makeFade("translate-y-8");
export const FadeDown = makeFade("-translate-y-8");
export const FadeLeft = makeFade("translate-x-8");
export const FadeRight = makeFade("-translate-x-8");
