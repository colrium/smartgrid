"use client";

import type { ReactElement } from "react";
import { SectionTag } from "@/components/SectionTag";
import { FadeUp } from "@/components/animations/Fade";
import { CountUp } from "@/components/animations/ScrollReveal";

export interface MetricItem {
	icon?: string | null;
	name: string;
	value: number;
}

export interface MetricsContent {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	items?: MetricItem[] | null;
}

export interface MetricsClassesProp {
	section?: string;
	panel?: string;
	glowTop?: string;
	glowBottom?: string;
	watermark?: string;
	header?: string;
	tag?: string;
	description?: string;
	grid?: string;
	card?: string;
	value?: string;
	label?: string;
	icon?: string;
}

export interface MetricsProps {
	data: MetricsContent;
	classes?: MetricsClassesProp;
	id?: string;
	className?: string;
}

const METRIC_ICONS: string[] = ["globe-model", "briefcase-check", "clock-outline", "thumb-up"];

const formatValue = (name: string) => (value: number) =>
	name.includes("%") ? `${Math.round(value)}%` : `${Math.round(value)}`;

export function Metrics(props: MetricsProps): ReactElement | null {
	const data = props.data;
	const items = Array.isArray(data?.items) ? data.items : [];

	if (items.length === 0) return null;

	return (
		<section
			id={props.id ?? "metrics"}
			className={`py-24 sm:py-28 relative overflow-hidden ${props.classes?.section ?? ""} ${props.className ?? ""}`.trim()}
		>
			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<div className={`relative rounded-c ink-panel card-shadow overflow-hidden px-8 py-16 sm:px-12 sm:py-20 ${props.classes?.panel ?? ""}`}>
						<span
							className={`absolute -top-24 -right-20 w-80 h-80 rounded-full bg-primary/40 pointer-events-none ${props.classes?.glowTop ?? ""}`}
							style={{
								WebkitMaskImage: "radial-gradient(closest-side, black 30%, transparent 72%)",
								maskImage: "radial-gradient(closest-side, black 30%, transparent 72%)",
							}}
						/>
						<span
							className={`absolute -bottom-28 -left-16 w-80 h-80 rounded-full bg-accent-200/25 pointer-events-none ${props.classes?.glowBottom ?? ""}`}
							style={{
								WebkitMaskImage: "radial-gradient(closest-side, black 30%, transparent 72%)",
								maskImage: "radial-gradient(closest-side, black 30%, transparent 72%)",
							}}
						/>
						<span
							className={`absolute -left-4 bottom-0 font-light tracking-tighter text-[13rem] leading-none text-surface/10 select-none pointer-events-none ${props.classes?.watermark ?? ""}`}
							aria-hidden
						>
							{String(items.length).padStart(2, "0")}
						</span>

						<div className={`relative flex flex-col items-center gap-4 mb-12 sm:mb-16 ${props.classes?.header ?? ""}`}>
							<SectionTag className={`text-surface ${props.classes?.tag ?? ""}`}>
								{data?.tag ?? ""}
							</SectionTag>
							<p
								className={`text-base sm:text-lg leading-relaxed max-w-2xl mx-auto text-surface/60 text-center ${props.classes?.description ?? ""}`}
							>
								{data?.description ?? ""}
							</p>
						</div>

						<div className={`relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 ${props.classes?.grid ?? ""}`}>
							{items.map((item, index) => (
								<FadeUp
									key={index}
									delay={(index % 4) * 0.08}
									className="h-full"
								>
									<div className={`relative glass-dark rounded-xl h-full p-8 flex flex-col items-center text-center gap-4 transition-[transform,border-color] duration-250 hover:-translate-y-1.5 hover:border-surface/30 overflow-hidden ${props.classes?.card ?? ""}`}>
										<span className={`text-5xl sm:text-[3.4rem] font-light text-surface tabular-nums leading-none tracking-tight ${props.classes?.value ?? ""}`}>
											<CountUp
												to={item.value}
												duration={1.8}
												format={formatValue(item.name)}
											/>
										</span>

										<span className={`text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em] text-surface/75 ${props.classes?.label ?? ""}`}>
											{item.name}
										</span>
										<span
											className={`mdi mdi-${
												item.icon || METRIC_ICONS[index % METRIC_ICONS.length]
											} text-surface/10 text-[9rem] absolute bottom-6 -right-6 ${props.classes?.icon ?? ""}`}
											aria-hidden
										/>
									</div>
								</FadeUp>
							))}
						</div>
					</div>
				</FadeUp>
			</div>
		</section>
	);
}

export default Metrics;