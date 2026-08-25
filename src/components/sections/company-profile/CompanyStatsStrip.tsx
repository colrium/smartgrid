"use client";

import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";

interface StatItem {
	icon?: string | null;
	value: string;
	label: string;
}

interface StatsContent {
	items: StatItem[];
}

export function CompanyStatsStrip() {
	const { t } = useTranslation(["company-profile"]);
	const section = t("company-profile:stats", {
		returnObjects: true,
	}) as unknown as StatsContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<section className="relative z-10 -mt-4 pb-8">
			<div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<div className="grid grid-cols-2 lg:grid-cols-4 rounded-[20px] ink-panel card-shadow overflow-hidden">
					{items.map((item, index) => (
						<FadeUp key={index} delay={index * 0.06}>
							<div
								className={`flex flex-col items-center text-center gap-2.5 px-6 py-9 ${
									index > 0 ? "border-l border-surface/10" : ""
								}`}
							>
								<span className="flex h-20 w-20 items-center justify-center rounded-xl hover:bg-surface/10 text-surface">
									{item.icon && <span className={`mdi mdi-${item.icon} text-4xl`} />}
								</span>
								<span className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
									{item.value}
								</span>
								<span className="text-[11px] uppercase tracking-widest text-white/55 leading-snug max-w-[12rem]">
									{item.label}
								</span>
							</div>
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default CompanyStatsStrip;
