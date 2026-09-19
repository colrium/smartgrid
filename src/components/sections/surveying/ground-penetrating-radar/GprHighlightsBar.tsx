"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";

interface HighlightItem {
	icon?: string | null;
	label: string;
}

export interface GprHighlightsData {
	items: HighlightItem[];
}

export function GprHighlightsBar({ data }: { data?: GprHighlightsData | null } = {}): ReactElement {
	const { t } = useTranslation(["surveying/ground-penetrating-radar"]);
	// Keystatic-owned content when `data` is provided (M11 `gprHighlights`
	// unique section); legacy locale strings otherwise. The locale node is a
	// root array — the migration wraps it as `{ items }`.
	const legacy = (t("surveying/ground-penetrating-radar:highlights", {
		returnObjects: true,
	}) as unknown as HighlightItem[]) ?? [];
	const items = (data?.items ?? legacy) as HighlightItem[];

	if (!Array.isArray(items) || items.length === 0) return null;

	return (
		<section className="relative py-6 sm:py-8">
			<div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<div className="relative rounded-c bg-surface hairline card-shadow overflow-hidden">
						
						

						<div className="relative z-10 grid grid-cols-1 sm:grid-cols-3">
							{items.map((item, index) => (
								<div
									key={index}
									className={`group relative flex items-center gap-4 px-6 sm:px-8 py-6 sm:py-7 transition-all duration-250 hover:bg-primary-50/40 `}
								>
									

									<span className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center  text-primary transition-all duration-250   ">
										{item.icon && <span className={`mdi mdi-${item.icon} text-xl`} />}
									</span>

									<span className="flex flex-col gap-0.5 min-w-0">
										<span className="text-sm sm:text-[15px] font-semibold tracking-tight text-ink leading-snug">
											{item.label}
										</span>
									</span>
								</div>
							))}
						</div>
					</div>
				</FadeUp>
			</div>
		</section>
	);
}

export default GprHighlightsBar;
