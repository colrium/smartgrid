"use client";

import type { ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import { FadeUp } from "@/components/animations/Fade";
import { Blob, ParallaxDecor } from "../decor";
import { SectionHeader, type SectionHeaderClassesProp } from "../SectionHeader";

export interface InstrumentItem {
	label: string;
	img: string;
	href?: string;
}

export interface SurveyingInstrumentsContent {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	items?: InstrumentItem[] | null;
}

export interface SurveyingInstrumentsClassesProp {
	section?: string;
	blob?: string;
	parallaxBlob?: string;
	header?: SectionHeaderClassesProp;
	grid?: string;
	card?: string;
	cardImage?: string;
	cardOverlay?: string;
	cardContent?: string;
	cardCategory?: string;
	cardLabel?: string;
	cardArrow?: string;
}

export interface SurveyingInstrumentsProps {
	data: SurveyingInstrumentsContent;
	classes?: SurveyingInstrumentsClassesProp;
	id?: string;
	className?: string;
}

function InstrumentCardBody({ item, wide = false, classes }: { item: InstrumentItem; wide?: boolean; classes?: SurveyingInstrumentsClassesProp }) {
	return (
		<>
			{item.img && (
				<Image
					src={item.img}
					alt={item.label}
					fill
					sizes={
						wide
							? "(min-width: 1024px) 50vw, calc(100vw - 3rem)"
							: "(min-width: 1024px) 25vw, (min-width: 640px) calc(50vw - 3rem), calc(100vw - 3rem)"
					}
					quality={60}
					className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${classes?.cardImage ?? ""}`}
				/>
			)}
			<div className={`absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent ${classes?.cardOverlay ?? ""}`} />
			<div className={`absolute inset-x-5 bottom-5 ${classes?.cardContent ?? ""}`}>
				<span className={`block text-[10px] font-semibold uppercase tracking-[0.22em] text-primary-200 mb-1.5 ${classes?.cardCategory ?? ""}`}>
					Instrument
				</span>
				<h3 className={`flex items-end justify-between gap-3 text-xl sm:text-2xl font-light uppercase tracking-tight text-surface leading-none ${classes?.cardLabel ?? ""}`}>
					{item.label}
					{item.href && (
						<span className={`mdi mdi-arrow-right shrink-0 text-primary-200 text-lg -translate-x-2 opacity-0 transition-[transform,opacity] duration-300 group-hover:translate-x-0 group-hover:opacity-100 ${classes?.cardArrow ?? ""}`} />
					)}
				</h3>
			</div>
		</>
	);
}

export function SurveyingInstruments(props: SurveyingInstrumentsProps): ReactElement | null {
	const data = props.data;
	const items = Array.isArray(data?.items) ? data.items : [];

	if (items.length === 0) return null;

	return (
		<section
			id={props.id ?? "surveying-instruments"}
			className={`py-24 sm:py-28 relative overflow-hidden ${props.classes?.section ?? ""} ${props.className ?? ""}`.trim()}
		>
			<Blob className={`w-[28rem] h-[28rem] bg-primary-200/40 top-1/2 right-8 ${props.classes?.blob ?? ""}`} opacity={0.55} />
			<ParallaxDecor speed={-0.06} className="absolute top-1/2 left-1/4 z-0">
				<Blob className={`w-64 h-64 bg-primary-100/70 ${props.classes?.parallaxBlob ?? ""}`} opacity={0.6} />
			</ParallaxDecor>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={data?.tag ?? ""}
					headline={data?.headline ?? ""}
					description={data?.description ?? ""}
					classes={props.classes?.header}
				/>

				<div className={`mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 ${props.classes?.grid ?? ""}`}>
					{items.map((item, index) => (
						<FadeUp
							key={index}
							delay={(index % 4) * 0.08}
							className={index === 0 ? "sm:col-span-2 lg:col-span-2" : ""}
						>
							{item.href ? (
								<Link
									href={item.href}
									className={`group relative block h-64 sm:h-80 overflow-hidden rounded-2xl hairline bg-surface card-shadow transition-[transform,box-shadow,border-color] duration-250 hover:-translate-y-1.5 hover:card-shadow-lift hover:border-primary-300 ${props.classes?.card ?? ""}`}
								>
									<InstrumentCardBody item={item} wide={index === 0} classes={props.classes} />
								</Link>
							) : (
								<article className={`group relative h-64 sm:h-80 overflow-hidden rounded-2xl hairline bg-surface card-shadow transition-[transform,box-shadow,border-color] duration-250 hover:-translate-y-1.5 hover:card-shadow-lift hover:border-primary-300 ${props.classes?.card ?? ""}`}>
									<InstrumentCardBody item={item} wide={index === 0} classes={props.classes} />
								</article>
							)}
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default SurveyingInstruments;