"use client";
import type { ReactElement, ReactNode } from "react";
import Link from "@/components/Link";
import Image from "next/image";
export type CardVariant = "outlined" | "filled" | "plain" | "paper" | "image";
export type CardElevation = 0 | 1 | 2 | 3;
export type CardIconShape = "rounded" | "xl" | "circle" | "square" | "none";
export type CardIconSize = "sm" | "md" | "lg";
export type CardDensity = "comfortable" | "roomy";
export interface CardAction { label: string; href: string; icon?: string | null }
export interface CardSubItem { title?: string; description?: string | null }
export interface CardProps {
	variant?: CardVariant; elevation?: CardElevation; align?: "left" | "center";
	header?: string | ReactNode; headerIcon?: string | null;
	iconShape?: CardIconShape; iconClassName?: string; iconSize?: CardIconSize;
	density?: CardDensity;
	body?: string | ReactNode; media?: string | null; mediaAlt?: string;
	mediaPosition?: "top" | "background"; mediaAspect?: string;
	badge?: string | ReactNode; indexBadge?: number | string | null;
	indexBadgePosition?: "top" | "end"; indexBadgeClassName?: string;
	watermark?: string | number | null; headerRow?: boolean; headerEnd?: ReactNode;
	hoverArrow?: boolean; kicker?: string | null; footer?: ReactNode; tags?: string[] | null;
	subItems?: CardSubItem[] | null; mediaBadge?: string | number | null;
	tagIcon?: string; link?: CardAction | null; href?: string | null;
	className?: string; children?: ReactNode;
}
const SHADOW: Record<CardElevation, string> = {
	0: "", 1: "card-shadow", 2: "card-shadow hover:card-shadow-lift", 3: "card-shadow-lift",
};
const SKIN: Record<CardVariant, string> = {
	outlined: "bg-surface hairline", filled: "pale-panel hairline",
	paper: "bg-paper hairline",
	plain: "bg-transparent border border-transparent", image: "bg-ink hairline overflow-hidden",
};
const ICON_SHAPE: Record<CardIconShape, string> = {
	rounded: "rounded-2xl", xl: "rounded-xl", circle: "rounded-full", square: "rounded-none", none: "",
};
const ICON_CHIP: Record<CardIconSize, string> = { sm: "h-11 w-11", md: "h-12 w-12", lg: "h-14 w-14" };
const ICON_GLYPH: Record<CardIconSize, string> = { sm: "text-lg", md: "text-2xl", lg: "text-3xl" };
const PADDING: Record<CardDensity, string> = { comfortable: "p-7", roomy: "p-8" };
const BADGE_CHIP = "inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 font-semibold text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface";
export function Card(props: CardProps): ReactElement {
	const { variant = "outlined", elevation = 1, align = "left" } = props;
	const centered = align === "center";
	const title = typeof props.header === "string" ? props.header : null;
	const headerNode = typeof props.header === "string" || props.header === undefined ? null : props.header;
	const tags = Array.isArray(props.tags) ? props.tags : [];
	const subItems = Array.isArray(props.subItems) ? props.subItems : [];
	const isBackground = props.mediaPosition === "background" && Boolean(props.media);
	const isTopMedia = props.mediaPosition !== "background" && Boolean(props.media);
	const density = props.density ?? "comfortable";
	const shell = ["group relative h-full flex flex-col gap-4 rounded-c transition-all duration-250",
		SKIN[isBackground ? "image" : variant],
		SHADOW[elevation], elevation > 0 ? "hover:card-shadow-lift hover:border-primary" : "",
		centered ? "items-center text-center" : "",
		isBackground ? (props.mediaAspect ?? "aspect-[3/4]") : isTopMedia ? "overflow-hidden p-0!" : PADDING[density], props.className ?? ""].join(" ");
	const icon = props.headerIcon && variant !== "image" && props.iconShape !== "none" ? (
		<span className={`inline-flex ${ICON_CHIP[props.iconSize ?? "md"]} items-center justify-center ${ICON_SHAPE[props.iconShape ?? "rounded"]} bg-primary-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface ${props.iconClassName ?? ""}`}>
			<span className={`mdi mdi-${props.headerIcon} ${ICON_GLYPH[props.iconSize ?? "md"]}`} aria-hidden />
		</span>
	) : null;
	const badgeValue = props.indexBadge === null || props.indexBadge === undefined
		? null
		: typeof props.indexBadge === "number" ? String(props.indexBadge + 1).padStart(2, "0") : props.indexBadge;
	const badgeChip = badgeValue ? (
		props.indexBadgeClassName ? (
			<span className={`inline-flex items-center justify-center font-semibold ${props.indexBadgeClassName}`}>{badgeValue}</span>
		) : (
			<span className={BADGE_CHIP}>{badgeValue}</span>
		)
	) : null;
	const headerEndNode = props.headerEnd ?? (props.hoverArrow ? (<span className="mdi mdi-arrow-up-right text-xl text-on-surface/25 transition-[color,transform,opacity] duration-300 group-hover:text-primary -translate-x-2 translate-y-2 opacity-0 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" aria-hidden />) : null);
	const inner = (
		<>
			{props.watermark !== null && props.watermark !== undefined ? (<span className="absolute right-4 top-2 font-light text-5xl tracking-tight text-ink/[0.05] select-none pointer-events-none" aria-hidden>{props.watermark}</span>) : null}
			{props.badge ? (<span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary"><span className="h-1.5 w-1.5 rounded-full bg-primary" />{props.badge}</span>) : null}
			{badgeChip && props.indexBadgePosition !== "end" ? badgeChip : null}
			{props.headerRow ? (
				<span className="flex items-center justify-between mb-4">
					{icon}
					{props.indexBadgePosition === "end" && badgeChip ? badgeChip : headerEndNode}
				</span>
			) : icon}
			{title ? (<h3 className="tracking-tight text-ink leading-snug text-base sm:text-lg font-medium">{title}</h3>) : null}{headerNode}
			{typeof props.body === "string" ? (<p className="flex-1 text-sm text-on-surface/60 leading-relaxed">{props.body}</p>) : props.body ? (<div className="flex-1">{props.body}</div>) : null}
			{tags.length > 0 ? (<ul className="mt-auto flex flex-wrap gap-2 pt-2">{tags.map((t) => (<li key={t} className="inline-flex items-center gap-1.5 rounded-full hairline bg-surface px-3.5 py-1.5 text-xs font-medium text-ink/75"><span className={`mdi mdi-${props.tagIcon ?? "map-marker"} text-primary text-sm`} aria-hidden />{t}</li>))}</ul>) : null}
			{subItems.length > 0 ? (<ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 border-t border-ink/10 pt-5">{subItems.map((child, childIndex) => (<li key={childIndex} className="flex flex-col gap-1.5 rounded-cmd bg-primary-50/40 p-4"><span className="flex items-start gap-2 text-[13px] font-semibold text-ink leading-snug"><span className="mdi mdi-subdirectory-arrow-right text-primary text-base shrink-0 mt-0.5" aria-hidden />{child.title}</span>{child.description ? (<p className="text-xs text-on-surface/60 leading-relaxed pl-6">{child.description}</p>) : null}</li>))}</ul>) : null}
			{props.kicker ? (<span className="mt-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary">{props.kicker}</span>) : null}
			{props.link?.href ? (<Link href={props.link.href} className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-primary"><span className="uppercase tracking-[0.14em] text-xs">{props.link.label}</span><span className={`mdi mdi-${props.link.icon ?? "arrow-right"} transition-transform duration-300 group-hover:translate-x-1`} aria-hidden /></Link>) : null}
			{props.footer}{props.children}
		</>
	);
	if (props.href) return (<Link href={props.href} aria-label={title ?? undefined} className={shell}>{inner}</Link>);
	if (isTopMedia && props.media) {
		return (
			<article className={shell}>
				<span className={`relative block ${props.mediaAspect ?? "aspect-[16/10]"} overflow-hidden bg-ink`}>
					<Image src={props.media} alt={props.mediaAlt ?? title ?? "Card image"} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover object-center transition-transform duration-700 group-hover:scale-105" />
					<span className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" aria-hidden />
					{props.mediaBadge ? (<span className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 glass rounded-full text-sm font-semibold uppercase tracking-[0.18em] text-ink px-3 py-1.5"><span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />{props.mediaBadge}</span>) : null}
				</span>
				<span className="flex flex-col flex-1 gap-4 p-6">{inner}</span>
			</article>
		);
	}
	if (isBackground && props.media) {
		return (
			<article className={shell}>
				<Image src={props.media} alt={props.mediaAlt ?? title ?? "Card image"} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover object-center transition-transform duration-700 group-hover:scale-105" />
				<span className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" aria-hidden />
				{props.mediaBadge ? (<span className="absolute top-4 left-4 z-10 inline-flex items-center gap-2 glass rounded-full text-sm font-semibold uppercase tracking-[0.18em] text-ink px-3 py-1.5"><span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />{props.mediaBadge}</span>) : null}
				<span className="absolute inset-x-0 bottom-0 p-6">{inner}</span>
			</article>
		);
	}
	return <article className={shell}>{inner}</article>;
}
export default Card;
