"use client";

import Ripple from "@/lib/ripple";
import { useEffect } from "react";

/**
 * Wires the ripple effect to every element carrying `data-ripple-light` or
 * `data-ripple-dark`. Uses a single delegated document listener instead of
 * per-element listeners, so ripple elements mounted later (menus, drawers,
 * dynamically rendered buttons) are picked up automatically.
 */
export default function RippleSetup(): null {
	useEffect(() => {
		const ripple = new Ripple();

		const handleMouseUp = (event: MouseEvent) => {
			const target = event.target as HTMLElement | null;
			if (!target) {
				return;
			}
			const lightEl = target.closest<HTMLElement>('[data-ripple-light="true"]');
			const darkEl = target.closest<HTMLElement>('[data-ripple-dark="true"]');

			// When both variants nest, the innermost element wins.
			let el: HTMLElement | null = null;
			let color: "light" | "dark" = "light";
			if (lightEl && darkEl) {
				if (darkEl.contains(lightEl)) {
					el = lightEl;
					color = "light";
				} else {
					el = darkEl;
					color = "dark";
				}
			} else if (lightEl) {
				el = lightEl;
				color = "light";
			} else if (darkEl) {
				el = darkEl;
				color = "dark";
			}

			if (!el) {
				return;
			}
			ripple.create(Object.assign({}, event, { currentTarget: el }) as MouseEvent, color);
		};

		document.addEventListener("mouseup", handleMouseUp);
		return () => document.removeEventListener("mouseup", handleMouseUp);
	}, []);

	return null;
}
