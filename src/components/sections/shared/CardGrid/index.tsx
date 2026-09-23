"use client";
import type { ReactElement, ReactNode } from "react";
import Image from "next/image";
import { FadeUp } from "@/components/animations/Fade";
import { SectionShell, type SectionShellClassesProp } from "@/components/sections/shared/SectionShell";
import { CtaPill, type CtaAction } from "@/components/sections/shared/CtaPill";
import { CardList, cardGridCols, type CardItem } from "@/components/sections/shared/CardList";
import type { CardProps } from "@/components/ui/Card";

export type { CardItem } from "@/components/sections/shared/CardList";

export interface CardGridClassesProp {
	sectionHeader?: SectionShellClassesProp["sectionHeader"];
	subheading?: string;
	leadGrid?: string;
	leadImage?: string;
	grid?: string;
	actions?: string;
}

export interface CardGridAction extends CtaAction {
	/** `primary` = solid brand pill, `surface` = light hairline pill (light backgrounds). */
	variant?: "primary" | "surface";
}
export interface CardGridProps {
	tag?: string | null;
	headline: string;
	description?: ReactNode;
	subheading?: string | null;
	items: CardItem[];
	columns?: 2 | 3 | 4 | 5;
	tone?: "default" | "surface";
	align?: "left" | "center";
	headerAlign?: "left" | "center";
	headerRow?: boolean;
	hoverArrow?: boolean;
	watermarkedIndexed?: boolean;
	indexed?: boolean;
	/** Auto-numbers the `mediaBadge` glass chip on media cards ("01", …). */
	mediaBadged?: boolean;
	id?: string;
	kicker?: string | null;
	card?: Partial<CardProps>;
	fallbackIcons?: string[] | null;
	popupTrigger?: string;
	/** Lead images rendered as a strip between header and cards. */
	leadImages?: string[] | null;
	leadAspect?: string;
	/** Action pills rendered centred below the grid (light backgrounds). */
	actions?: CardGridAction[] | null;
	classes?: CardGridClassesProp;
	className?: string;
}
export function CardGrid(props: CardGridProps): ReactElement | null {
	const items = Array.isArray(props.items) ? props.items : [];
	if (items.length === 0) return null;
	const columns = props.columns ?? 3;
	const leadImages = Array.isArray(props.leadImages) ? props.leadImages : [];
	const actions = Array.isArray(props.actions) ? props.actions : [];
	const leadClass = props.subheading ? "mt-8" : "mt-12";
	const gridMargin = leadImages.length > 0 ? "mt-12 sm:mt-14" : props.subheading ? "mt-8" : "mt-14 sm:mt-16";
	return (
		<SectionShell id={props.id} tag={props.tag} headline={props.headline} description={props.description} align={props.headerAlign ?? "center"} tone={props.tone} className={props.className} classes={props.classes ? { sectionHeader: props.classes.sectionHeader } : undefined}>
			{props.subheading ? (
				<p className={`mt-10 font-mono text-xs uppercase tracking-widest font-semibold text-primary ${props.classes?.subheading ?? ""}`}>
					{props.subheading}
				</p>
			) : null}
			{leadImages.length > 0 ? (
				<FadeUp>
					<div className={`${leadClass} grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 ${props.classes?.leadGrid ?? ""}`}>
						{leadImages.map((src, index) => (
							<div key={index} className={`relative rounded-c overflow-hidden hairline ${props.leadAspect ?? "h-64 sm:h-80"} ${props.classes?.leadImage ?? ""}`}>
								<Image src={src} alt="" fill sizes="(min-width: 640px) 50vw, 100vw" className="object-fill object-center transition-transform duration-700 hover:scale-105" />
							</div>
						))}
					</div>
				</FadeUp>
			) : null}
			<CardList
				items={items}
				columns={columns}
				align={props.align}
				card={props.card}
				headerRow={props.headerRow}
				hoverArrow={props.hoverArrow}
				watermarkedIndexed={props.watermarkedIndexed}
				indexed={props.indexed}
				mediaBadged={props.mediaBadged}
				kicker={props.kicker}
				fallbackIcons={props.fallbackIcons}
				popupHeading={props.headline}
				popupTrigger={props.popupTrigger}
				classes={props.classes?.grid ? { grid: props.classes.grid } : undefined}
				className={`${gridMargin} grid grid-cols-1 sm:grid-cols-2 ${cardGridCols(columns)} gap-5 sm:gap-6`}
			/>
			{actions.length > 0 ? (
				<FadeUp delay={0.1}>
					<div className={`mt-12 flex flex-wrap items-center justify-center gap-4 ${props.classes?.actions ?? ""}`}>
						{actions.map((action, index) => (
							action.href ? (
								<CtaPill
									key={index}
									action={action}
									variant={action.variant === "surface" ? "surface" : "primary"}
								/>
							) : null
						))}
					</div>
				</FadeUp>
			) : null}
		</SectionShell>
	);
}

export default CardGrid;
