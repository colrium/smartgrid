"use client";

import Image from "next/image";
import { useState, type ReactElement } from "react";

import { useTranslation } from "@/hooks";
import type { MediaImage } from "@/lib/types";
import { SectionHeader } from "@/components/sections/home/SectionHeader";
import { FadeUp, FadeLeft } from "@/components/animations/Fade";

export interface DeliverableItemContent {
	title?: string;
	format?: string | null;
	icon?: string | null;
	image?: MediaImage | string | null;
	description?: string;
}

export interface DeliverablesContent {
	tag?: string | null;
	headline?: string;
	description?: string;
	liveLabel?: string;
	checks?: string[];
	items?: DeliverableItemContent[];
}

interface DeliverablesProps {
	/** i18n namespace that holds the deliverables content */
	ns: string;
	/** key of the deliverables block inside the namespace (defaults to "deliverables") */
	baseKey?: string;
	/** id applied to the wrapping <section> (e.g. for anchor/jump-nav links) */
	id?: string;
	/** extra classes for the wrapping <section> (e.g. background tokens) */
	className?: string;
}

export interface DeliverablesExplorerProps {
	/** deliverables content object (tag/headline/description are ignored - render your own header) */
	content?: DeliverablesContent | null;
	/** extra classes for the explorer grid (e.g. top margin) */
	className?: string;
}

const FALLBACK_ICONS = [
	"vector-square",
	"file-pdf-box",
	"map-marker-path",
	"image-filter-hdr",
	"axis-z-arrow",
	"table-large",
	"layers-triple",
	"file-certificate",
];

const toImageSrc = (image?: MediaImage | string | null): string | null => {
	const src = typeof image === "string" ? image : image?.url;
	return typeof src === "string" && (src.startsWith("/") || src.startsWith("http")) ? src : null;
};

/**
 * Interactive deliverables explorer: a live-preview panel next to the
 * selectable list of deliverables. Deliverables may optionally carry an
 * image (`MediaImage | string`) which is shown in the preview.
 *
 * Embedded variant of <Deliverables /> - used by the standalone section and
 * directly inside composite sections (e.g. the home services tabs).
 */
export function DeliverablesExplorer({
	content,
	className = "",
}: DeliverablesExplorerProps): ReactElement | null {
	const items = Array.isArray(content?.items) ? content.items : [];
	const checks = Array.isArray(content?.checks) ? content.checks : [];
	const [activeIndex, setActiveIndex] = useState(0);
	const active = items.length > 0 ? items[Math.min(activeIndex, items.length - 1)] : null;
	const activeImage = toImageSrc(active?.image);

	if (items.length === 0) return null;

	return (
		<div
			className={`grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-12 items-stretch ${className}`.trim()}
		>
			<FadeLeft className="h-full">
				<div className="relative h-full min-h-[22rem] overflow-hidden rounded-c bg-surface card-shadow p-8 sm:p-10">
					<span className="absolute -top-20 -right-20 w-60 h-60 rounded-full bg-primary-300/30 blur-[90px] pointer-events-none" />
					<span className="absolute -bottom-16 -left-10 w-48 h-48 rounded-full bg-primary/25 blur-[80px] pointer-events-none" />
					{!activeImage && (
						<span
							className={`absolute -bottom-6 -right-6 font-light tracking-tighter text-[16rem] leading-none text-ink/5 select-none pointer-events-none mdi mdi-${active?.icon ?? FALLBACK_ICONS[activeIndex % FALLBACK_ICONS.length]}`}
							aria-hidden
						/>
					)}

					{active && (
						<div key={activeIndex} className="relative flex h-full flex-col">
							<div className="flex items-center justify-between gap-4">
								{content?.liveLabel && (
									<span className="inline-flex items-center gap-2 rounded-full bg-ink-soft/5 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink hairline-dark">
										{content.liveLabel}
									</span>
								)}
								<span className="text-2xl text-primary-600/70">
									{String(activeIndex + 1).padStart(2, "0")} /{" "}
									{String(items.length).padStart(2, "0")}
								</span>
							</div>

							{activeImage ? (
								<div className="relative mt-8 overflow-hidden rounded-2xl hairline aspect-4/3">
									<Image
										src={activeImage}
										alt={active.title ?? ""}
										fill
										sizes="(max-width: 1024px) 100vw, 40vw"
										className="object-fill"
									/>
								</div>
							) : (
								<div className="mt-8 flex items-center gap-4">
									<span className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-ink/10 text-ink hairline">
										<span
											className={`mdi mdi-${active.icon ?? FALLBACK_ICONS[activeIndex % FALLBACK_ICONS.length]} text-2xl`}
										/>
									</span>
									<h3 className="text-2xl sm:text-3xl font-light tracking-tight text-ink leading-tight">
										{active.title}
									</h3>
								</div>
							)}

							{activeImage && (
								<h3 className="mt-6 text-2xl sm:text-3xl font-light tracking-tight text-ink leading-tight">
									{active.title}
								</h3>
							)}

							{active.format && (
								<div className="mt-5 inline-flex self-start items-center gap-2 rounded-full bg-accent/20 text-accent-700 px-4 py-1.5 text-xs font-semibold tracking-wide hairline-dark">
									<span className="mdi mdi-file-outline text-sm" />
									{active.format}
								</div>
							)}

							<p className="mt-6 text-sm sm:text-base text-ink/65 leading-relaxed max-w-xl">
								{active.description}
							</p>

							{checks.length > 0 && (
								<div className="mt-auto pt-8 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-xs text-ink/75">
									{checks.map((check, index) => (
										<span
											key={index}
											className="inline-flex items-center gap-2"
										>
											<span className="mdi mdi-check-circle-outline text-primary-500" />
											{check}
										</span>
									))}
								</div>
							)}
						</div>
					)}
				</div>
			</FadeLeft>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:-order-1 gap-3.5 content-start">
				{items.map((item, index) => {
					const itemImage = toImageSrc(item.image);
					return (
						<FadeUp key={index} delay={(index % 2) * 0.06}>
							<button
								type="button"
								onClick={() => setActiveIndex(index)}
								className={`group flex w-full items-center gap-3.5 rounded-2xl border p-4 text-left cursor-pointer transition-all duration-300 ${
									activeIndex === index
										? "border-primary bg-primary-50 card-shadow-lift"
										: "hairline bg-paper card-shadow hover:border-primary/40 hover:card-shadow-lift"
								}`}
								data-ripple-light="true"
							>
								{/*itemImage ? (
									<span className="relative inline-flex h-11 w-11 shrink-0 overflow-hidden rounded-xl hairline">
										<Image
											src={itemImage}
											alt={item.title ?? ""}
											fill
											sizes="44px"
											className="object-cover transition-transform duration-250 group-hover:scale-110"
										/>
									</span>
								) : (
									<span
										className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
											activeIndex === index
												? "bg-primary text-surface"
												: "bg-primary-50 text-primary group-hover:bg-primary group-hover:text-surface"
										}`}
									>
										<span
											className={`mdi mdi-${item.icon ?? FALLBACK_ICONS[index % FALLBACK_ICONS.length]} text-xl`}
										/>
									</span>
								) */}
								<span
									className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${
										activeIndex === index
											? "bg-primary text-surface"
											: "bg-primary-50/50 text-mute group-hover:bg-primary group-hover:text-surface"
									}`}
								>
									<span
										className={`mdi mdi-${item.icon ?? FALLBACK_ICONS[index % FALLBACK_ICONS.length]} text-xl`}
									/>
								</span>
								<span className="flex min-w-0 flex-col gap-1">
									<span className="truncate text-sm font-semibold tracking-tight text-ink">
										{item.title}
									</span>
									{item.format && (
										<span className="truncate text-xs text-on-surface/50">
											{item.format}
										</span>
									)}
								</span>
								<span
									className={`ml-auto shrink-0 mdi mdi-chevron-right text-lg transition-colors ${
										activeIndex === index
											? "text-primary"
											: "text-on-surface/25 group-hover:text-primary"
									}`}
								/>
							</button>
						</FadeUp>
					);
				})}
			</div>
		</div>
	);
}

/**
 * Reusable, interactive deliverables explorer section.
 * Reads its content from `<ns>:<baseKey>` and renders a header plus the
 * <DeliverablesExplorer /> grid. Deliverables may optionally carry an
 * image (`MediaImage | string`) which is shown in the preview.
 */
export function Deliverables({
	ns,
	baseKey = "deliverables",
	id,
	className = "",
}: DeliverablesProps): ReactElement | null {
	const { t } = useTranslation([ns]);
	const section = t(`${ns}:${baseKey}`, {
		returnObjects: true,
	}) as unknown as DeliverablesContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<section id={id} className={`py-24 sm:py-28 relative overflow-hidden ${className}`.trim()}>
			

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline ?? ""}
					description={section.description || undefined}
					align="center"
				/>

				<DeliverablesExplorer content={section} className="mt-14 sm:mt-20" />
			</div>
		</section>
	);
}

export default Deliverables;
