"use client";

import Ripple from "@/lib/ripple";
import { useEffect } from "react";

export default function RippleSetup() {
	useEffect(() => {
		const ripple = new Ripple();

		const lightEls = document.querySelectorAll<HTMLElement>('[data-ripple-light="true"]');
		const darkEls = document.querySelectorAll<HTMLElement>('[data-ripple-dark="true"]');

		const lightHandler = (event: Event) => ripple.create(event as MouseEvent, "light");
		const darkHandler = (event: Event) => ripple.create(event as MouseEvent, "dark");

		lightEls.forEach((el) => el.addEventListener("mouseup", lightHandler));
		darkEls.forEach((el) => el.addEventListener("mouseup", darkHandler));

		return () => {
			lightEls.forEach((el) => el.removeEventListener("mouseup", lightHandler));
			darkEls.forEach((el) => el.removeEventListener("mouseup", darkHandler));
		};
	}, []);

	return null;
}
