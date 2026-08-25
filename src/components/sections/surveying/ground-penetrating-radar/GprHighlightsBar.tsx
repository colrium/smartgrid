"use client";

import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";

interface HighlightItem {
	icon?: string | null;
	label: string;
}

export function GprHighlightsBar() {
	const { t } = useTranslation(["ground-penetrating-radar"]);
	const items = (t("ground-penetrating-radar:highlights", {
		returnObjects: true,
	}) as unknown as HighlightItem[]) ?? [];

	if (!Array.isArray(items) || items.length === 0) return null;

	return (
		<section className="relative py-8 border-y border-ink/5 bg-surface">
			<div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<div className="flex flex-wrap items-center justify-center gap-3">
						{items.map((item, index) => (
							<span
								key={index}
								className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-5 py-2.5 text-xs font-medium text-primary"
							>
								{item.icon && <span className={`mdi mdi-${item.icon} text-base`} />}
								{item.label}
							</span>
						))}
					</div>
				</FadeUp>
			</div>
		</section>
	);
}

export default GprHighlightsBar;
