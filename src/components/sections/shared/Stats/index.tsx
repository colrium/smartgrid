"use client";
import type { ReactElement } from "react";

import { SectionHeader } from "@/components/sections/shared/SectionHeader";
import { FadeUp } from "@/components/animations/Fade";
import { SectionShell, type SectionShellClassesProp } from "@/components/sections/shared/SectionShell";

export interface StatItem {
	value?: string | number;
	description?: string;
	label?: string;
	icon?: string | null;
}

export interface StatsClassesProp {
	sectionHeader?: SectionShellClassesProp["sectionHeader"];
	grid?: string;
	card?: string;
}
export interface StatsProps {
	id?: string;
	tag?: string | null;
	headline?: string;
	description?: string | null;
	/** Metric items; `items` and the legacy `metrics` key are interchangeable. */
	items?: StatItem[] | null;
	metrics?: StatItem[] | null;
	/** `band` = full-bleed primary band; `cards` = light stat cards;
	 *  `panel` = rounded ink-panel strip overlapping the section above. */
	layout?: "band" | "cards" | "panel";
	tone?: "default" | "surface";
	columns?: 2 | 3 | 4;
	classes?: StatsClassesProp;
	className?: string;
}

const BAND_COLUMNS: Record<2 | 3 | 4, string> = {
	2: "sm:grid-cols-2",
	3: "sm:grid-cols-3",
	4: "sm:grid-cols-2 lg:grid-cols-4",
};

const CARD_COLUMNS: Record<2 | 3 | 4, string> = {
	2: "sm:grid-cols-2",
	3: "sm:grid-cols-2 lg:grid-cols-3",
	4: "sm:grid-cols-2 lg:grid-cols-4",
};

/**
 * Shared metrics/stats section. Consolidates the per-page metric bands
 * (big value + divider + description) with an optional light card variant.
 */
export function Stats(props: StatsProps): ReactElement | null {
	const items = (props.items ?? props.metrics ?? []) as StatItem[];
	if (!Array.isArray(items) || items.length === 0) return null;

	const layout = props.layout ?? "band";
	const columns = props.columns ?? 3;

	if (layout === "cards") {
		return (
			<SectionShell
				id={props.id}
				tag={props.tag}
				headline={props.headline}
				description={props.description}
				align="center"
				tone={props.tone ?? "default"}
				className={props.className}
				classes={props.classes ? { sectionHeader: props.classes.sectionHeader } : undefined}
			>
				<div
					className={`mt-14 sm:mt-20 grid grid-cols-1 gap-5 sm:gap-6 ${CARD_COLUMNS[columns]} ${props.classes?.grid ?? ""}`}
				>
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % columns) * 0.07}>
							<div className={`group h-full flex flex-col items-center gap-2 rounded-c bg-surface hairline card-shadow p-7 text-center transition-all duration-250 hover:card-shadow-lift hover:border-primary ${props.classes?.card ?? ""}`}>
								{item.icon && (
									<span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary">
										<span className={`mdi mdi-${item.icon} text-2xl`} />
									</span>
								)}
								<span className="text-4xl sm:text-5xl font-light tracking-tight text-ink tabular-nums leading-none">
									{item.value}
								</span>
								{item.label && (
									<span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface/50">
										{item.label}
									</span>
								)}
								{item.description && (
									<span className="mt-1 text-sm text-on-surface/60 leading-relaxed">
										{item.description}
									</span>
								)}
							</div>
						</FadeUp>
					))}
				</div>
			</SectionShell>
		);
	}

	if (layout === "panel") {
		return (
			<section id={props.id} className={`relative z-10 -mt-4 pb-8 ${props.className ?? ""}`.trim()}>
				<div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
					<div className={`grid grid-cols-2 lg:grid-cols-4 rounded-c ink-panel card-shadow overflow-hidden ${props.classes?.grid ?? ""}`}>
						{items.map((item, index) => (
							<FadeUp key={index} delay={index * 0.06}>
								<div className={`flex flex-col items-center text-center gap-2.5 px-6 py-9 ${props.classes?.card ?? ""}`}>
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

	return (
		<section
			id={props.id}
			className={`relative overflow-hidden bg-primary ${props.className ?? ""}`.trim()}
		>
			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-20">
				{props.headline && (
					<FadeUp>
						<SectionHeader
							tag={props.tag ?? undefined}
							headline={props.headline}
							description={props.description ?? undefined}
							align="center"
							tone="dark"
						classes={props.classes?.sectionHeader}
						/>
					</FadeUp>
				)}
				<div
					className={`grid grid-cols-1 gap-10 sm:gap-8 ${BAND_COLUMNS[columns]} ${props.headline ? "mt-12" : ""} ${props.classes?.grid ?? ""}`}
				>
					{items.map((item, index) => (
						<FadeUp key={index} delay={index * 0.08}>
							<div className={`flex flex-col items-center gap-2 text-center ${props.classes?.card ?? ""}`}>
								{item.icon && (
									<span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-surface/10 text-primary-200">
										<span className={`mdi mdi-${item.icon} text-2xl`} />
									</span>
								)}
								<span className="text-4xl sm:text-5xl font-light tracking-tight text-surface tabular-nums">
									{item.value}
								</span>
								<span className="inline-block h-px w-10 bg-surface/40" />
								{item.label && (
									<span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-surface/50">
										{item.label}
									</span>
								)}
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

export default Stats;