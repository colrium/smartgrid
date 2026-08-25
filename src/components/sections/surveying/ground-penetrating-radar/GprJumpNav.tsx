"use client";

import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";

interface JumpNavItem {
	label: string;
	href: string;
}

export function GprJumpNav() {
	const { t } = useTranslation(["ground-penetrating-radar"]);
	const items = (t("ground-penetrating-radar:jumpNav", {
		returnObjects: true,
	}) as unknown as JumpNavItem[]) ?? [];

	if (!Array.isArray(items) || items.length === 0) return null;

	return (
		<nav
			aria-label="Section navigation"
			className="sticky top-[72px] z-30 bg-surface/90 backdrop-blur border-b border-ink/5"
		>
			<div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<div className="flex items-center gap-1 overflow-x-auto py-3 -mx-1">
						{items.map((item, index) => (
							<a
								key={index}
								href={item.href}
								className="shrink-0 rounded-full px-4 py-1.5 text-xs font-medium text-on-surface/60 transition-colors duration-300 hover:bg-primary-50 hover:text-primary"
							>
								{item.label}
							</a>
						))}
					</div>
				</FadeUp>
			</div>
		</nav>
	);
}

export default GprJumpNav;
