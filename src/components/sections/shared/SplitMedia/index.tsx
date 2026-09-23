"use client";

import type { ReactElement } from "react";
import Image from "next/image";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader, type SectionHeaderClassesProp } from "@/components/sections/shared/SectionHeader";
import { Blob } from "@/components/sections/shared/decor";
import { CardList, cardGridCols, type CardItem } from "@/components/sections/shared/CardList";
import { CheckList } from "@/components/sections/shared/Pricing";
import type { CardProps } from "@/components/ui/Card";

export interface SplitMediaContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	image?: string | null;
	/** Check-bullet points rendered under the media frame. */
	points?: string[] | null;
}
export interface SplitMediaClassesProp{
    mediaCard?: string;
    mediaWrapper?: string;
    media?: string;
    description?: string;
    sectionHeader?: SectionHeaderClassesProp
}
export interface SplitMediaProps {
	/** Section content object, usually `t("<ns>:<key>", { returnObjects: true })`. */
	data: SplitMediaContent;
	/** Side the framed image sits on (text takes the opposite side). */
	imagePosition?: "left" | "right";
	tone?: "default" | "surface";
	/** Inner media frame classes, e.g. `h-96` (default) or `aspect-16/10`. */
	mediaAspect?: string;
	/** Media object fit — `cover` (default) or `contain` (logos/diagrams). */
	mediaFit?: "cover" | "contain";
    mediaWrapperClass?: string;
    classes?: SplitMediaClassesProp;
	id?: string;
	className?: string;
	/** Optional card row rendered below the split, inside the same section. */
	items?: CardItem[] | null;
	columns?: 2 | 3 | 4;
	align?: "left" | "center";
	card?: Partial<CardProps>;
	fallbackIcons?: string[] | null;
	popupTrigger?: string;
}

/**
 * Shared split-media section: text column (kicker + headline + lede) beside a
 * framed image with soft blurred glows. Consolidates the per-page split copies
 * (agricultural-ndvi WhyUse, volumetric DroneTechLeverage, lidar Powerline/
 * Forestry/Construction). With `items`, the same section also carries a card
 * row below the split (agricultural-ndvi pattern).
 */
export function SplitMedia(props: SplitMediaProps): ReactElement | null {
	const data = props.data;
	if (!data?.headline) return null;
	const imagePosition = props.imagePosition ?? "right";
	const items = Array.isArray(props.items) ? props.items : [];

	const text = (
		<FadeUp className="lg:col-span-6">
			<SectionHeader tag={data.tag ?? undefined} headline={data.headline} classes={props.classes?.sectionHeader} />

			{data.description ? (
				<div className="mt-8">
					<p className={`text-base sm:text-lg leading-relaxed text-on-surface/60 whitespace-pre-line ${props.classes?.description ?? ""}`}>
						{data.description}
					</p>
				</div>
			) : null}
		</FadeUp>
	);

	const media = (
		<FadeUp delay={0.1} className="lg:col-span-6">
			{data.image ? (
				<div className="relative mx-auto max-w-lg lg:max-w-none">
					<div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
					<div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />

					<div className={`relative bg-surface p-4 rounded-c hairline card-shadow ${props.classes?.mediaCard ?? ""}`}>
						<div
							className={`relative ${props.mediaAspect ?? "h-96"} rounded-xl overflow-hidden bg-slate-900 ${props.mediaWrapperClass ?? ""} ${props.classes?.mediaWrapper ?? ""}`}
						>
							<Image
								src={data.image}
								alt={data.headline}
								fill
								sizes="(min-width: 1024px) 50vw, 100vw"
								className={`${
									props.mediaFit === "contain"
										? "object-contain object-center p-8 sm:p-10"
										: "object-cover object-center transition-transform duration-700 hover:scale-105"
								}  ${props.classes?.media ?? ""}`}
							/>
						</div>
					</div>
					{data.points && data.points.length > 0 ? (
						<CheckList items={data.points} className="mt-8 items-center" />
					) : null}
				</div>
			) : null}
		</FadeUp>
	);

	return (
		<section
			id={props.id}
			className={`py-24 sm:py-28 relative overflow-hidden ${
				props.tone === "surface" ? "bg-surface" : ""
			} ${props.className ?? ""}`.trim()}
		>
			<Blob
				className={`w-[28rem] h-[28rem] bg-primary-100/60 -bottom-24 ${
					imagePosition === "left" ? "-left-24" : "-right-24"
				}`}
				opacity={0.5}
			/>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
					{imagePosition === "left" ? (
						<>
							{media}
							{text}
						</>
					) : (
						<>
							{text}
							{media}
						</>
					)}
				</div>

				{items.length > 0 ? (
					<CardList
						items={items}
						columns={props.columns ?? 4}
						align={props.align}
						card={props.card}
						fallbackIcons={props.fallbackIcons}
						popupHeading={data.headline}
						popupTrigger={props.popupTrigger}
						className={`mt-14 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 ${cardGridCols(props.columns ?? 4)} gap-5 sm:gap-6`}
					/>
				) : null}
			</div>
		</section>
	);
}

export default SplitMedia;