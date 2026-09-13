"use client";
import { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FadeUp } from "@/components/animations/Fade";
import { Card, type CardProps, type CardSubItem } from "@/components/ui/Card";

export interface CardItem extends Omit<CardProps, "children"> {
	title?: string;
	label?: string;
	description?: string;
	icon?: string | null;
	image?: string | null;
	items?: string[] | null;
	/** Nested sub-items rendered as an inset 2-col checklist below the body. */
	subItems?: CardSubItem[] | null;
	/** Spans the grid's full row width at md+ (2-col) / lg+ (3-col) grids. */
	wide?: boolean;
	/** Glass number chip overlaid on the card media (top or background). */
	mediaBadge?: string | number | null;
	/** When present, the card renders a "Learn more" trigger that opens a modal. */
	popupContent?: string | null;
}

export interface CardListProps {
	items: CardItem[];
	columns?: 2 | 3 | 4 | 5;
	align?: "left" | "center";
	card?: Partial<CardProps>;
	headerRow?: boolean;
	hoverArrow?: boolean;
	watermarkedIndexed?: boolean;
	indexed?: boolean;
	kicker?: string | null;
	/** Icons cycled through when an item has no `icon` of its own. */
	fallbackIcons?: string[] | null;
	/** Kicker shown inside the popup modal (usually the section headline). */
	popupHeading?: string | null;
	popupTrigger?: string;
	/** Auto-numbers the `mediaBadge` glass chip ("01", "02", …). */
	mediaBadged?: boolean;
	/** Full grid wrapper classes; defaults to the standard responsive grid. */
	className?: string;
}

const COLS: Record<number, string> = {
	2: "lg:grid-cols-2",
	3: "sm:grid-cols-2 lg:grid-cols-3",
	4: "sm:grid-cols-2 lg:grid-cols-4",
	5: "sm:grid-cols-2 lg:grid-cols-5",
};

/** Responsive `lg:` column classes shared by every card grid surface. */
export function cardGridCols(columns: 2 | 3 | 4 | 5): string {
	return COLS[columns] ?? COLS[3];
}

function indexBadgeValue(item: CardItem, index: number): number | string | null {
	if (item.indexBadge !== undefined) return item.indexBadge;
	return index;
}

/**
 * Shared responsive grid of `Card` items — the layout core extracted out of
 * `CardGrid` so other section types (e.g. `SplitMedia`) can render identical
 * card rows without owning a `<section>` shell. Also owns the data-driven
 * popup modal: any item carrying `popupContent` gets a trigger button and the
 * grid renders one shared animated modal for it.
 */
export function CardList(props: CardListProps): ReactElement | null {
	const items = Array.isArray(props.items) ? props.items : [];
	const [active, setActive] = useState<CardItem | null>(null);
	const hasPopup = items.some((item) => item.popupContent);

	useEffect(() => {
		if (!hasPopup) return undefined;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setActive(null);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [hasPopup]);

	if (items.length === 0) return null;

	const columns = props.columns ?? 3;
	const fallbackIcons = Array.isArray(props.fallbackIcons) ? props.fallbackIcons : [];

	const footerFor = (item: CardItem): ReactElement | null => {
		if (!item.popupContent) return null;
		return (
			<button
				type="button"
				onClick={() => setActive(item)}
				className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary cursor-pointer ${props.align === "center" ? "mx-auto" : ""}`}
			>
				<span className="uppercase tracking-[0.14em] text-xs">{props.popupTrigger ?? "Learn more"}</span>
				<span className="mdi mdi-arrow-right ml-1 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
			</button>
		);
	};

	return (
		<>
			<div className={props.className ?? `grid grid-cols-1 sm:grid-cols-2 ${cardGridCols(columns)} gap-5 sm:gap-6`}>
				{items.map((raw, index) => {
					const item = raw as CardItem;
					const title = item.title ?? item.label ?? "";
					const itemCard: Partial<CardProps> = { ...(props.card ?? {}) };
					if (props.headerRow !== undefined && itemCard.headerRow === undefined) itemCard.headerRow = props.headerRow;
					if (props.hoverArrow !== undefined && itemCard.hoverArrow === undefined) itemCard.hoverArrow = props.hoverArrow;
					if (props.watermarkedIndexed && itemCard.watermark === undefined) itemCard.watermark = String(index + 1).padStart(2, "0");
					if (props.mediaBadged && itemCard.mediaBadge === undefined) itemCard.mediaBadge = String(index + 1).padStart(2, "0");
					return (
						<FadeUp
							key={index}
							delay={(index % columns) * 0.07}
							className={`h-full ${item.wide ? "sm:col-span-2 lg:col-span-3" : ""}`.trim()}
						>
							<Card
								variant={itemCard.variant ?? "outlined"}
								elevation={itemCard.elevation ?? 1}
								align={props.align ?? itemCard.align ?? "left"}
								header={title}
								headerIcon={item.icon ?? item.headerIcon ?? (fallbackIcons.length > 0 ? fallbackIcons[index % fallbackIcons.length] : null)}
								iconShape={itemCard.iconShape}
								iconSize={itemCard.iconSize}
								density={itemCard.density}
								body={item.description ?? item.body}
								media={item.image ?? item.media ?? null}
								mediaPosition={item.image || item.media ? (itemCard.mediaPosition ?? "top") : undefined}
								mediaAspect={itemCard.mediaAspect}
								mediaBadge={item.mediaBadge ?? itemCard.mediaBadge ?? null}
								subItems={item.subItems ?? null}
								accent={item.accent ?? itemCard.accent ?? null}
								tags={item.items ?? item.tags ?? null}
								indexBadge={props.indexed ? indexBadgeValue(item, index) : (item.indexBadge ?? null)}
								indexBadgePosition={itemCard.indexBadgePosition}
								indexBadgeClassName={itemCard.indexBadgeClassName}
								watermark={item.watermark ?? itemCard.watermark}
								headerRow={item.headerRow ?? itemCard.headerRow}
								hoverArrow={item.hoverArrow ?? itemCard.hoverArrow ?? Boolean(item.href)}
								link={item.link ?? null}
								href={item.href ?? null}
								kicker={item.kicker ?? props.kicker ?? null}
								footer={footerFor(item)}
								className={itemCard.className}
							/>
						</FadeUp>
					);
				})}
			</div>
			{hasPopup ? (
				<PopupModal active={active} heading={props.popupHeading ?? null} onClose={() => setActive(null)} />
			) : null}
		</>
	);
}

function PopupModal(props: {
	active: CardItem | null;
	heading: string | null;
	onClose: () => void;
}): ReactElement {
	return (
		<AnimatePresence>
			{props.active ? (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="fixed inset-0 z-[90] flex items-center justify-center p-6 bg-ink/60 backdrop-blur-sm"
					onClick={props.onClose}
				>
					<motion.div
						initial={{ opacity: 0, y: 24, scale: 0.97 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: 24, scale: 0.97 }}
						transition={{ duration: 0.25 }}
						className="relative w-full max-w-xl rounded-c bg-surface p-8 sm:p-10 card-shadow-lift"
						onClick={(e) => e.stopPropagation()}
					>
						<button
							type="button"
							aria-label="Close"
							onClick={props.onClose}
							className="absolute top-4 right-4 h-9 w-9 rounded-full border border-ink/15 text-on-surface/60 flex items-center justify-center transition-colors duration-300 hover:border-primary hover:text-primary cursor-pointer"
						>
							<span className="mdi mdi-close text-lg" />
						</button>
						{props.heading ? (
							<span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
								<span className="h-1.5 w-1.5 rounded-full bg-primary" />
								{props.heading}
							</span>
						) : null}
						<h3 className="mt-4 text-2xl sm:text-3xl font-light tracking-tight text-ink leading-tight">
							{props.active.title ?? props.active.label}
						</h3>
						<div className="mt-5 h-px w-full bg-ink/10" />
						<p className="mt-5 text-sm sm:text-[15px] text-on-surface/70 leading-relaxed">
							{props.active.popupContent}
						</p>
					</motion.div>
				</motion.div>
			) : null}
		</AnimatePresence>
	);
}

export default CardList;