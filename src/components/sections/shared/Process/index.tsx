"use client";
import type { ReactElement } from "react";

import Link from "@/components/Link";
import { FadeUp } from "@/components/animations/Fade";
import { SectionShell } from "@/components/sections/shared/SectionShell";

export interface ProcessItem {
	/** Step label / phase chip text (e.g. "01", "Survey"). */
	phase?: string | null;
	title?: string | null;
	name?: string | null;
	description?: string | null;
	/** Optional deliverable/outcome line rendered as a check pill. */
	outcome?: string | null;
	icon?: string | null;
}

/** Per-phase chip override: chip classes + optional leading MDI icon. */
export interface ProcessPhaseStyle {
	chip?: string;
	icon?: string | null;
}

/** Optional per-phase chip overrides, keyed by the `phase` text. */
export type ProcessPhaseStyles = Record<string, ProcessPhaseStyle>;

/** Closing call-to-action rendered below the steps. */
export interface ProcessCta {
	label: string;
	href: string;
	/** MDI icon name (without the `mdi-` prefix); defaults to `download`. */
	icon?: string | null;
}

export interface ProcessTimelineStage {
	/** Stage name rendered on the timeline rail and stage list. */
	label?: string | null;
	/** Optional human range descriptor, e.g. "2–4 days". */
	range?: string | null;
	/** Duration in days used for the rail width. Defaults to `1`. */
	days?: number | null;
}

export interface ProcessTimelineProps {
	/**
	 * Optional timeline-specific payload. When provided, the timeline renderer
	 * switches from step cards to the stage-bar timeline used by
	 * `surveying/sectional-properties:timeline`.
	 */
	stages?: ProcessTimelineStage[] | null;
	/** Small eyebrow line above the stage list. */
	barLabel?: string | null;
	/** Start/end eyebrow labels rendered under the rail. */
	startLabel?: string | null;
	endLabel?: string | null;
	/** Supporting note rendered below the stage list. */
	timelineNote?: string | null;
	/** Cost/information callout rendered below the stage list. */
	costNote?: string | null;
	/** Optional closing email CTA. */
	emailCta?: { label?: string; href?: string } | null;
}

export interface ProcessProps {
	id?: string;
	tag?: string | null;
	headline: string;
	description?: string | null;
	/** Process steps; `items` and the legacy `steps` key are interchangeable. */
	items?: ProcessItem[] | null;
	steps?: ProcessItem[] | null;
	/** `grid` = numbered step cards; `timeline` = alternating centre-line cards. */
	layout?: "grid" | "timeline";
	tone?: "default" | "surface";
	columns?: 2 | 3 | 4;
	phaseStyles?: ProcessPhaseStyles | null;
	note?: string | null;
	/** Section-level outcome pill rendered below the steps. */
	outcome?: string | null;
	/** Supporting line rendered above the closing CTA. */
	ctaNote?: string | null;
	/** Closing call-to-action button. */
	cta?: ProcessCta | null;
	className?: string;
	/** Timeline-specific overrides used by `surveying/sectional-properties:timeline`. */
	timeline?: ProcessTimelineProps | null;
}

const GRID_COLUMNS: Record<2 | 3 | 4, string> = {
	2: "sm:grid-cols-2",
	3: "sm:grid-cols-2 lg:grid-cols-3",
	4: "sm:grid-cols-2 lg:grid-cols-4",
};

const DEFAULT_CHIP = "bg-primary-50 text-primary";

/**
 * Shared process/workflow section. Consolidates the numbered step-grid copies
 * (agricultural-ndvi, sectional-properties, building-site, landings) and the
 * alternating centre-line timeline copies (as-built, sectional Timeline,
 * resource-mapping Workflow) behind one implementation.
 */
export function Process(props: ProcessProps): ReactElement | null {
	const raw = (props.items ?? props.steps ?? []) as ProcessItem[];
	if (!Array.isArray(raw)) return null;
	const items = raw.filter(
		(item) => item && (item.title || item.name || item.description),
	);
	if (items.length === 0) return null;

	const layout = props.layout ?? "grid";
	const columns = props.columns ?? 3;

	const styleFor = (item: ProcessItem): ProcessPhaseStyle | undefined => {
		if (!item.phase) return undefined;
		return props.phaseStyles?.[item.phase] || undefined;
	};

	const phaseChip = (item: ProcessItem): ReactElement | null => {
		if (!item.phase) return null;
		const style = styleFor(item);
		return (
			<span
				className={`inline-flex items-center gap-2 rounded-full px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${style?.chip || DEFAULT_CHIP}`}
			>
				{style?.icon ? (
					<span className={`mdi mdi-${style.icon} text-sm`} aria-hidden />
				) : null}
				{item.phase}
			</span>
		);
	};

	const gridCard = (item: ProcessItem, index: number): ReactElement => (
		<article className="group h-full flex flex-col gap-4 rounded-c bg-surface hairline card-shadow p-7 transition-all duration-250 hover:card-shadow-lift hover:border-primary">
			<span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
				{item.icon ? (
					<span className={`mdi mdi-${item.icon} text-2xl`} aria-hidden />
				) : (
					<span className="text-lg font-semibold tabular-nums">
						{String(index + 1).padStart(2, "0")}
					</span>
				)}
			</span>
			{phaseChip(item)}
			<h3 className="text-lg font-medium tracking-tight text-ink leading-snug">
				{item.title ?? item.name}
			</h3>
			{item.description && (
				<p className="text-sm text-on-surface/60 leading-relaxed">{item.description}</p>
			)}
			{item.outcome && (
				<span className="mt-auto inline-flex items-center gap-2 pt-1 text-xs font-medium text-primary">
					<span className="mdi mdi-check-circle text-base" aria-hidden />
					{item.outcome}
				</span>
			)}
		</article>
	);

	const timelineItem = (item: ProcessItem, index: number): ReactElement => {
		const even = index % 2 === 0;
		return (
			<li className="relative">
				<span
					aria-hidden
					className="absolute left-4 top-8 z-10 flex h-3.5 w-3.5 -translate-x-1/2 items-center justify-center rounded-full border-2 border-primary bg-surface lg:left-1/2"
				>
					<span className="h-1.5 w-1.5 rounded-full bg-primary" />
				</span>
				<div className="ml-12 grid grid-cols-1 lg:ml-0 lg:grid-cols-2 lg:gap-16">
					<div className={even ? "lg:col-start-1" : "lg:col-start-2"}>
						<FadeUp delay={Math.min(index * 0.06, 0.3)}>
							<div className="group flex flex-col gap-3 rounded-c bg-surface hairline card-shadow p-6 sm:p-7 transition-all duration-250 hover:card-shadow-lift hover:border-primary">
								<div className="flex flex-wrap items-center justify-between gap-3">
									{phaseChip(item)}
									<span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-on-surface/40">
										Step {String(index + 1).padStart(2, "0")}
									</span>
								</div>
								<h3 className="text-lg sm:text-xl font-medium tracking-tight text-ink leading-snug">
									{item.title ?? item.name}
								</h3>
								{item.description && (
									<p className="text-sm text-on-surface/60 leading-relaxed">
										{item.description}
									</p>
								)}
								{item.outcome && (
									<span className="inline-flex items-center gap-2 text-xs font-medium text-primary">
										<span className="mdi mdi-check-circle text-base" aria-hidden />
										{item.outcome}
									</span>
								)}
							</div>
						</FadeUp>
					</div>
				</div>
			</li>
		);
	};

	const footerNode = (): ReactElement | null => {
		if (!props.outcome && !props.ctaNote && !props.cta?.href) return null;
		return (
			<FadeUp>
				<div className="relative mt-14 flex flex-col items-center gap-6 text-center">
					{props.outcome && (
						<div className="inline-flex flex-wrap items-center justify-center gap-3 rounded-full border border-whatsapp/40 bg-whatsapp/10 px-7 py-3.5 text-sm sm:text-base font-medium text-ink/80 text-center">
							<span className="mdi mdi-check-decagram text-xl text-whatsapp" aria-hidden />
							{props.outcome}
						</div>
					)}
					{props.ctaNote && (
						<p className="max-w-2xl text-sm sm:text-base text-on-surface/60 leading-relaxed">
							{props.ctaNote}
						</p>
					)}
					{props.cta?.href && (
						<Link
							href={props.cta.href}
							className="group inline-flex items-center gap-3 h-14 rounded-full bg-primary px-8 text-surface font-medium text-base transition-all duration-300 hover:-translate-y-0.5 hover:card-shadow-lift"
						>
							<span
								className={`mdi mdi-${props.cta.icon ?? "download"} text-xl`}
								aria-hidden
							/>
							{props.cta.label}
							<span
								className="mdi mdi-arrow-right text-xl transition-transform duration-300 group-hover:translate-x-1"
								aria-hidden
							/>
						</Link>
					)}
				</div>
			</FadeUp>
		);
	};

	if (layout === "timeline") {
		const stages = Array.isArray(props.timeline?.stages)
			? props.timeline.stages
			: items.map((item, index) => ({
					label: item.phase ?? item.title,
					range: item.description ?? undefined,
					days: index === 0 ? 1 : undefined,
				}));

		if (Array.isArray(props.timeline?.stages) && stages.length > 0) {
			const totalDays = stages.reduce((sum, stage) => sum + (stage.days ?? 1), 0) || 1;
			const TONE_SEGMENTS = [
				"bg-primary-800",
				"bg-primary-700",
				"bg-primary-600",
				"bg-primary-500",
				"bg-primary-400",
				"bg-primary-300",
				"bg-primary-200",
			];

			return (
				<SectionShell
					id={props.id}
					tag={props.tag}
					headline={props.headline}
					description={props.description}
					align="center"
					tone={props.tone ?? "surface"}
					className={props.className}
				>
					<div className="relative mt-16 sm:mt-20">
						{props.timeline?.barLabel && (
							<p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-primary">
								{props.timeline.barLabel}
							</p>
						)}
						<div className="mt-5 flex h-16 sm:h-20 w-full overflow-hidden rounded-2xl hairline card-shadow">
							{stages.map((stage, index) => (
								<div
									key={index}
									title={`${(stage.label ?? "").trim()} — ${(stage.range ?? "").trim()}`}
									className="group relative flex items-center justify-center border-r border-surface/40 last:border-r-0 transition-[filter] duration-300 hover:brightness-110"
									style={{ width: `${((stage.days ?? 1) / totalDays) * 100}%` }}
								>
									<div className={`absolute inset-0 ${TONE_SEGMENTS[index % TONE_SEGMENTS.length]}`} />
									<span
										className={`relative z-10 px-1 text-center text-[10px] sm:text-xs font-semibold leading-tight ${
											index >= 5 ? "text-ink" : "text-surface"
										}`}
									>
										{stage.days}
									</span>
								</div>
							))}
						</div>
						<div className="mt-3 flex justify-between text-[11px] font-medium uppercase tracking-[0.18em] text-ink/40">
							<span>{props.timeline?.startLabel}</span>
							<span>{props.timeline?.endLabel}</span>
						</div>
						<div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
							{stages.map((stage, index) => (
								<span key={index} className="inline-flex items-center gap-2 text-xs sm:text-sm text-ink/70">
									<span className={`h-2.5 w-2.5 rounded-sm ${TONE_SEGMENTS[index % TONE_SEGMENTS.length]}`} />
									<span className="font-semibold text-ink">{stage.label ?? ""}</span>
									<span className="text-ink/50">{stage.range ?? ""}</span>
								</span>
							))}
						</div>
						{props.timeline?.costNote && (
							<div className="mx-auto mt-10 flex max-w-2xl items-start justify-center gap-3 rounded-2xl pale-panel hairline card-shadow px-6 py-5 text-sm leading-relaxed text-ink/70">
								<span className="mdi mdi-cash-multiple mt-0.5 shrink-0 text-lg text-accent-500" />
								{props.timeline.costNote}
							</div>
						)}
						{props.timeline?.emailCta?.href && (
							<div className="mt-9 flex justify-center">
								<Link
									href={props.timeline.emailCta.href}
									className="group inline-flex items-center gap-3 h-14 rounded-full bg-ink px-8 text-surface font-medium text-base transition-all duration-300 hover:-translate-y-0.5 hover:card-shadow-lift"
								>
									<span className="mdi mdi-email-fast-outline text-xl text-primary-300" aria-hidden />
									{props.timeline.emailCta.label}
								</Link>
							</div>
						)}
					</div>
					{footerNode()}
				</SectionShell>
			);
		}

		return (
			<SectionShell
				id={props.id}
				tag={props.tag}
				headline={props.headline}
				description={props.description}
				align="center"
				tone={props.tone ?? "surface"}
				className={props.className}
			>
				<div className="relative mt-16 sm:mt-20">
					<span
						aria-hidden
						className="absolute left-4 lg:left-1/2 lg:-translate-x-1/2 top-2 bottom-2 w-px bg-gradient-to-b from-primary/0 via-primary/40 to-accent/50"
					/>
					<ol className="space-y-10 lg:space-y-14">
						{items.map((item, index) => timelineItem(item, index))}
					</ol>
				</div>
				{props.note && (
					<FadeUp>
						<p className="mt-12 text-center text-sm text-on-surface/55">{props.note}</p>
					</FadeUp>
				)}
				{footerNode()}
			</SectionShell>
		);
	}

	return (
		<SectionShell
			id={props.id}
			tag={props.tag}
			headline={props.headline}
			description={props.description}
			align="center"
			tone={props.tone ?? "default"}
			className={props.className}
		>
			<div
				className={`mt-14 sm:mt-20 grid grid-cols-1 gap-5 sm:gap-6 ${GRID_COLUMNS[columns]}`}
			>
				{items.map((item, index) => (
					<FadeUp key={index} delay={(index % columns) * 0.07} className="h-full">
						{gridCard(item, index)}
					</FadeUp>
				))}
			</div>
			{props.note && (
				<FadeUp delay={0.15}>
					<p className="mt-12 text-center text-sm text-on-surface/55">{props.note}</p>
				</FadeUp>
			)}
			{footerNode()}
		</SectionShell>
	);
}

export default Process;
