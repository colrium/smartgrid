"use client";
import type { ReactElement, ReactNode } from "react";
import { FadeUp } from "@/components/animations/Fade";
import { SectionShell } from "@/components/sections/shared/SectionShell";
import { Card, type CardProps } from "@/components/ui/Card";
export interface CardItem extends Omit<CardProps, "children"> { title?: string; label?: string; description?: string; icon?: string | null; image?: string | null; items?: string[] | null }
export interface CardGridProps {
	tag?: string | null; headline: string; description?: ReactNode;
	subheading?: string | null; items: CardItem[]; columns?: 2 | 3 | 4 | 5; tone?: "default" | "surface";
	align?: "left" | "center"; headerAlign?: "left" | "center"; headerRow?: boolean;
	hoverArrow?: boolean; watermarkedIndexed?: boolean; indexed?: boolean; id?: string;
	kicker?: string | null; card?: Partial<CardProps>; className?: string;
}
const COLS: Record<number, string> = {
	2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-5",
};
export function CardGrid(props: CardGridProps): ReactElement | null {
	const items = Array.isArray(props.items) ? props.items : [];
	if (items.length === 0) return null;
	const columns = props.columns ?? 3;
	return (
		<SectionShell id={props.id} tag={props.tag} headline={props.headline} description={props.description} align={props.headerAlign ?? "center"} tone={props.tone} className={props.className}>
			{props.subheading ? (
				<p className="mt-10 font-mono text-xs uppercase tracking-widest font-semibold text-primary">
					{props.subheading}
				</p>
			) : null}
			<div className={`${props.subheading ? "mt-8" : "mt-14 sm:mt-16"} grid grid-cols-1 sm:grid-cols-2 ${COLS[columns]} gap-5 sm:gap-6`}>
				{items.map((raw, index) => {
					const item = raw as CardItem;
					const title = item.title ?? item.label ?? "";
					const itemCard: Partial<CardProps> = { ...(props.card ?? {}) };
					if (props.headerRow !== undefined && itemCard.headerRow === undefined) itemCard.headerRow = props.headerRow;
					if (props.hoverArrow !== undefined && itemCard.hoverArrow === undefined) itemCard.hoverArrow = props.hoverArrow;
					if (props.watermarkedIndexed && itemCard.watermark === undefined) itemCard.watermark = String(index + 1).padStart(2, "0");
					return (
						<FadeUp key={index} delay={(index % columns) * 0.07} className="h-full">
							<Card variant={itemCard.variant ?? "outlined"} elevation={itemCard.elevation ?? 1} align={props.align ?? (itemCard.align ?? "left")} header={title} headerIcon={item.icon ?? item.headerIcon ?? null} iconShape={itemCard.iconShape} body={item.description ?? item.body} media={item.image ?? item.media ?? null} mediaPosition={item.image || item.media ? (itemCard.mediaPosition ?? "top") : undefined} tags={item.items ?? item.tags ?? null} indexBadge={props.indexed ? indexBadgeValue(item, index) : (item.indexBadge ?? null)} watermark={item.watermark ?? itemCard.watermark} headerRow={item.headerRow ?? itemCard.headerRow} hoverArrow={item.hoverArrow ?? itemCard.hoverArrow ?? Boolean(item.href)} link={item.link ?? null} href={item.href ?? null} kicker={item.kicker ?? props.kicker ?? null} className={itemCard.className} />
						</FadeUp>
					);
				})}
			</div>
		</SectionShell>
	);
}
function indexBadgeValue(item: CardItem, index: number): number | string | null {
	if (item.indexBadge !== undefined) return item.indexBadge;
	return index;
}
export default CardGrid;
