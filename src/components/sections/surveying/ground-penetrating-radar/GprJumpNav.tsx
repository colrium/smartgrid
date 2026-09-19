"use client";

import { useEffect, useMemo, useState, type MouseEvent, type ReactElement } from "react";
import { useLenis } from "lenis/react";
import { useTranslation } from "@/hooks";

interface JumpNavItem {
	label: string;
	href: string;
}

export interface GprJumpNavData {
	items: JumpNavItem[];
}

export function GprJumpNav({ data }: { data?: GprJumpNavData | null } = {}): ReactElement {
	const { t } = useTranslation(["surveying/ground-penetrating-radar"]);
	// Keystatic-owned content when `data` is provided (M11 `gprJumpNav`
	// unique section); legacy locale strings otherwise. The locale node is a
	// root array — the migration wraps it as `{ items }`. Sticky scroll-spy
	// behavior stays in the renderer. NOTE: renders a `<nav>` root (not
	// `<section>`) so sticky positioning survives — the check-script pins a
	// documented `nav`-root exemption for this id.
	const legacy = useMemo(
		() =>
			(t("surveying/ground-penetrating-radar:jumpNav", {
				returnObjects: true,
			}) as unknown as JumpNavItem[]) ?? [],
		[t],
	);
	const items = (data?.items ?? legacy) as JumpNavItem[];
	const lenis = useLenis();
	const [activeId, setActiveId] = useState<string>("");

	const hrefsKey = useMemo(
		() => (Array.isArray(items) ? items.map((item) => item.href).join("|") : ""),
		[items],
	);

	useEffect(() => {
		if (!hrefsKey) return;

		const elements = hrefsKey
			.split("|")
			.map((href) => document.getElementById(href.replace("#", "")))
			.filter((el): el is HTMLElement => Boolean(el));

		if (elements.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) setActiveId(entry.target.id);
				}
			},
			{ rootMargin: "-35% 0px -60% 0px", threshold: 0 },
		);

		elements.forEach((el) => observer.observe(el));
		return () => observer.disconnect();
	}, [hrefsKey]);

	if (!Array.isArray(items) || items.length === 0) return null;

	const handleClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
		event.preventDefault();
		const id = href.replace("#", "");
		const el = document.getElementById(id);
		if (!el) return;

		setActiveId(id);
		if (lenis) {
			lenis.scrollTo(el, {
				duration: 1.2,
				offset: -144,
				easing: (progress) => 1 - Math.pow(1 - progress, 4),
			});
		} else {
			el.scrollIntoView({ behavior: "smooth", block: "start" });
		}
	};

	return (
		<nav aria-label="Section navigation" className="sticky top-[96px] lg:top-[112px] z-30 py-3">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex items-center gap-1 overflow-x-auto rounded-full bg-surface/90 backdrop-blur-md hairline card-shadow px-2 py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
					{items.map((item, index) => {
						const id = item.href.replace("#", "");
						const active = activeId === id;

						return (
							<a
								key={index}
								href={item.href}
								onClick={(event) => handleClick(event, item.href)}
								aria-current={active ? "location" : undefined}
								className={`shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 ${
									active
										? "bg-primary text-surface card-shadow"
										: "text-on-surface/60 hover:bg-primary-50 hover:text-primary"
								}`}
							>
								{item.label}
							</a>
						);
					})}
				</div>
			</div>
		</nav>
	);
}

export default GprJumpNav;
