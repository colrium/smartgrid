"use client";

import { useTranslation } from "@/hooks";
import { SectionTag } from "@/components/SectionTag";
import { FadeUp } from "@/components/animations/Fade";
import { CountUp } from "@/components/animations/ScrollReveal";

interface MetricItem {
	icon?: string | null;
	name: string;
	value: number;
}

const METRIC_ICONS = ["globe-model", "briefcase-check", "clock-outline", "thumb-up"];

export function MetricsSection() {
	const { t } = useTranslation(["home"]);
	const items = t("home:metrics.items", { returnObjects: true }) as unknown as MetricItem[];

	const formatValue = (name: string) => (value: number) =>
		name.includes("%") ? `${Math.round(value)}%` : `${Math.round(value)}`;

	return (
		<section id="metrics" className="py-24 sm:py-28 relative overflow-hidden">
			<div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<div
						className="relative rounded-4xl overflow-hidden px-8 py-16 sm:px-12 sm:py-20"
						style={{
							background:
								"linear-gradient(135deg, #003742 0%, #00677a 55%, #0097b2 120%)",
						}}
					>
						<div
							className="absolute inset-0 opacity-20 pointer-events-none"
							style={{
								backgroundImage:
									"linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
								backgroundSize: "56px 56px",
								maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 100%)",
							}}
						/>
						<div className="absolute -top-20 -right-20 w-72 h-72 bg-brand-200/30 rounded-full blur-3xl pointer-events-none" />
						<div className="absolute -bottom-28 -left-16 w-80 h-80 bg-black/20 rounded-full blur-3xl pointer-events-none" />

						<div className="relative flex flex-col items-center gap-4 mb-12 sm:mb-16">
							<SectionTag className="text-brand-200">{t("home:metrics.tag") as string}</SectionTag>
						</div>

						<div className="relative grid grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8">
							{Array.isArray(items) &&
								items.map((item, index) => (
									<FadeUp
										key={index}
										delay={index * 0.1}
										className="flex flex-col items-center text-center gap-3"
									>
										<span
											className={`mdi mdi-${
												item.icon || METRIC_ICONS[index % METRIC_ICONS.length]
											} text-2xl text-brand-200`}
										/>
										<span className="text-5xl sm:text-6xl font-display font-bold text-white tabular-nums leading-none">
											<CountUp
												to={item.value}
												duration={1.8}
												format={formatValue(item.name)}
											/>
										</span>
										<span className="text-xs sm:text-sm font-mono uppercase tracking-[0.18em] text-white/60 font-medium">
											{item.name}
										</span>
										<span className="w-10 h-0.5 bg-brand-200/60 rounded-full" />
									</FadeUp>
								))}
						</div>
					</div>
				</FadeUp>
			</div>
		</section>
	);
}

export default MetricsSection;