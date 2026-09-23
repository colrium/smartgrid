"use client";

import type { ReactElement } from "react";
import { SectionTag } from "@/components/SectionTag";
import { FadeUp } from "@/components/animations/Fade";
import { ParallaxDecor, Blob } from "../decor";

export interface KeyFactItem {
	icon?: string | null;
	label: string;
	description: string;
}

export interface KeyFactsContent {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	items?: KeyFactItem[] | null;
}

export interface KeyFactsClassesProp {
	section?: string;
	panel?: string;
	watermark?: string;
	header?: string;
	headline?: string;
	description?: string;
	grid?: string;
	card?: string;
	medallion?: string;
	medallionInner?: string;
	cardLabel?: string;
	divider?: string;
	cardDescription?: string;
}

export interface KeyFactsProps {
	/** Section content object, usually `t("<ns>:keyFacts", { returnObjects: true })`. */
	data: KeyFactsContent;
	classes?: KeyFactsClassesProp;
	id?: string;
}

const FACT_ICONS: string[] = [
	"map-marker-radius",
	"satellite-variant",
	"clock-check-outline",
	"shield-check-outline",
];

export function KeyFacts(props: KeyFactsProps): ReactElement | null {
	const data = props.data;
	const items = Array.isArray(data?.items) ? data.items : [];

	if (items.length === 0) return null;

	return (
		<section id={props.id ?? "key-facts"} className={`py-24 sm:py-28 relative overflow-hidden ${props.classes?.section ?? ""}`}>
			<ParallaxDecor speed={0.05} className="absolute top-10 right-1/4 z-0">
				<Blob className="w-72 h-72 bg-primary-200/50" opacity={0.5} />
			</ParallaxDecor>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp delay={0.08}>
					<div className={`relative rounded-c pale-panel hairline card-shadow overflow-hidden ${props.classes?.panel ?? ""}`}>
						<ParallaxDecor speed={0.06} className="absolute -top-16 -right-16 z-0">
							<Blob className="w-72 h-72 bg-primary-100/90" opacity={0.7} />
						</ParallaxDecor>
						<span
							className={`absolute -right-2 top-1/2 -translate-y-1/2 font-light tracking-tighter text-[11rem] leading-none text-ink/[0.04] select-none pointer-events-none ${props.classes?.watermark ?? ""}`}
							aria-hidden
						>
							{String(items.length).padStart(2, "0")}
						</span>

						<div className={`relative px-4 pt-12 sm:pt-14 flex flex-col items-center gap-4 text-center ${props.classes?.header ?? ""}`}>
							<SectionTag>{data?.tag ?? ""}</SectionTag>
							{data?.headline ? (
								<h2 className={`font-light tracking-tight leading-[1.08] text-3xl sm:text-4xl text-ink ${props.classes?.headline ?? ""}`}>
									{data.headline}
								</h2>
							) : null}
							<p className={`text-base sm:text-lg leading-relaxed max-w-2xl mx-auto text-on-surface/60 ${props.classes?.description ?? ""}`}>
								{data?.description ?? ""}
							</p>
						</div>

						<div className={`relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 p-6 sm:p-8 lg:p-10 mt-6 ${props.classes?.grid ?? ""}`}>
							{items.map((item, index) => (
								<article
									key={index}
									className={`group glass rounded-2xl p-7 flex flex-col items-center text-center transition-[transform,box-shadow] duration-250 hover:card-shadow-lift ${props.classes?.card ?? ""}`}
								>
									<span className={`relative mb-6 flex h-16 w-16 items-center justify-center ${props.classes?.medallion ?? ""}`}>
										
										<span className={`relative flex items-center justify-center  text-mute transition-colors duration-300  group-hover:text-primary ${props.classes?.medallionInner ?? ""}`}>
											<span
												className={`mdi mdi-${
													item.icon || FACT_ICONS[index % FACT_ICONS.length]
												} text-5xl`}
											/>
										</span>
									</span>

									<h3 className={`text-[13px] font-semibold text-ink uppercase tracking-[0.14em] mb-2.5 ${props.classes?.cardLabel ?? ""}`}>
										{item.label}
									</h3>
									<span aria-hidden className={`h-px w-8 bg-primary/40 mb-3 ${props.classes?.divider ?? ""}`} />
									<p className={`text-sm text-ink/60 leading-relaxed ${props.classes?.cardDescription ?? ""}`}>
										{item.description}
									</p>
								</article>
							))}
						</div>
					</div>
				</FadeUp>
			</div>
		</section>
	);
}

export default KeyFacts;
