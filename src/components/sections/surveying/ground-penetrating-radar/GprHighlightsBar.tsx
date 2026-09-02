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
					<div className="relative rounded-[20px] ink-panel overflow-hidden">
						{/* radar grid background */}
						<span
							aria-hidden
							className="pointer-events-none absolute inset-0 opacity-[0.04]"
							style={{
								backgroundImage:
									"linear-gradient(to right, rgb(255 255 255 / 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.5) 1px, transparent 1px)",
								backgroundSize: "32px 32px",
							}}
						/>
						<span
							aria-hidden
							className="pointer-events-none absolute inset-0 opacity-[0.06]"
							style={{
								background:
									"radial-gradient(circle at 20% 50%, rgb(255 255 255 / 0.4) 0%, transparent 50%)",
							}}
						/>

						<div className="relative z-10 grid grid-cols-1 sm:grid-cols-3">
							{items.map((item, index) => (
								<div
									key={index}
									className={`group relative flex items-center gap-4 px-6 sm:px-8 py-6 sm:py-7 transition-all duration-500 hover:bg-surface/[0.06] ${
										index > 0
											? "border-t border-surface/[0.08] sm:border-t-0 sm:border-l sm:border-surface/[0.08]"
											: ""
									}`}
								>
									{/* pulse ring on first node */}
									{index === 0 && (
										<span
											aria-hidden
											className="absolute left-[3.15rem] top-[1.85rem] sm:left-[3.35rem] sm:top-[1.95rem] h-3 w-3 rounded-full bg-primary/30 animate-ping"
										/>
									)}

									<span className="relative inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary ring-2 ring-primary/20 transition-all duration-500 group-hover:bg-primary group-hover:text-surface group-hover:ring-primary/40">
										{item.icon && <span className={`mdi mdi-${item.icon} text-xl`} />}
									</span>

									<span className="flex flex-col gap-0.5 min-w-0">
										<span className="text-sm sm:text-[15px] font-semibold tracking-tight text-surface leading-snug">
											{item.label}
										</span>
										<span className="text-[11px] font-medium tracking-[0.18em] uppercase text-surface/30">
											{String(index + 1).padStart(2, "0")}
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
