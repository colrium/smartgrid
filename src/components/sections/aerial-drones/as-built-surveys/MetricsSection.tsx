"use client";

import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";

interface MetricItem {
	value: string;
	description: string;
}

interface MetricsContent {
	items: MetricItem[];
}

export function MetricsSection() {
	const { t } = useTranslation(["aerial-drones-as-built-surveys"]);
	const section = t("aerial-drones-as-built-surveys:metrics", {
		returnObjects: true,
	}) as unknown as MetricsContent;
	const items = Array.isArray(section.items) ? section.items : [];

	return (
		<section className="relative overflow-hidden bg-primary">
			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20">
				<div className="grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-8">
					{items.map((item, index) => (
						<FadeUp key={index} delay={index * 0.08}>
							<div className="flex flex-col items-center gap-2 text-center">
								<span className="text-4xl sm:text-5xl font-light tracking-tight text-surface">
									{item.value}
								</span>
								<span className="inline-block h-px w-10 bg-surface/40" />
								<span className="text-sm sm:text-[15px] text-surface/70 leading-relaxed">
									{item.description}
								</span>
							</div>
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default MetricsSection;