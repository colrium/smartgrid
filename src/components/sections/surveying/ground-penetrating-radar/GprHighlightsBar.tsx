"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";

interface HighlightItem {
	icon?: string | null;
	label: string;
}

export function GprHighlightsBar(): ReactElement {
	const { t } = useTranslation(["surveying/ground-penetrating-radar"]);
	const items = (t("surveying/ground-penetrating-radar:highlights", {
		returnObjects: true,
	}) as unknown as HighlightItem[]) ?? [];

	if (!Array.isArray(items) || items.length === 0) return null;

	return (
		<section className="relative py-6 sm:py-8">
			<div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<div className="grid grid-cols-1 sm:grid-cols-3 rounded-[20px] bg-surface hairline card-shadow overflow-hidden">
						{items.map((item, index) => (
							<div
								key={index}
								className={`group flex items-center gap-3.5 px-6 sm:px-8 py-5 sm:py-6 transition-colors duration-300 hover:bg-primary-50/40 ${
									index > 0 ? "border-t border-ink/10 sm:border-t-0 sm:border-l" : ""
								}`}
							>
								<span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
									{item.icon && <span className={`mdi mdi-${item.icon} text-xl`} />}
								</span>
								<span className="flex-1 text-sm sm:text-[15px] font-semibold tracking-tight text-ink leading-snug">
									{item.label}
								</span>
								<span
									aria-hidden
									className="text-[11px] font-semibold tabular-nums tracking-[0.14em] text-on-surface/20"
								>
									{String(index + 1).padStart(2, "0")}
								</span>
							</div>
						))}
					</div>
				</FadeUp>
			</div>
		</section>
	);
}

export default GprHighlightsBar;
