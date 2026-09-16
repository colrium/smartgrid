"use client";

import type { ReactElement } from "react";
import { SectionHeader, type SectionHeaderClassesProp } from "../SectionHeader";
import { FadeUp } from "@/components/animations/Fade";

export interface WhyChooseUsItem {
	icon?: string | null;
	name: string;
	label: string;
	description: string;
}

export interface WhyChooseUsContent {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	items?: WhyChooseUsItem[] | null;
}

export interface WhyChooseUsClassesProp {
	section?: string;
	grid?: string;
	leftColumn?: string;
	header?: SectionHeaderClassesProp;
	listWrapper?: string;
	listItem?: string;
	itemNumber?: string;
	itemName?: string;
	itemLabel?: string;
	itemDescription?: string;
}

export interface WhyChooseUsProps {
	data: WhyChooseUsContent;
	classes?: WhyChooseUsClassesProp;
	id?: string;
	className?: string;
}

export function WhyChooseUs(props: WhyChooseUsProps): ReactElement | null {
	const data = props.data;
	const items = Array.isArray(data?.items) ? data.items : [];

	if (items.length === 0) return null;

	return (
		<section
			id={props.id ?? "why-choose-us"}
			className={`py-24 sm:py-28 relative overflow-hidden ${props.classes?.section ?? ""} ${props.className ?? ""}`.trim()}
		>
			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<div className={`grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 ${props.classes?.grid ?? ""}`}>
					<FadeUp className={`lg:col-span-4 lg:sticky lg:top-28 self-start ${props.classes?.leftColumn ?? ""}`}>
						<SectionHeader
							tag={data?.tag ?? ""}
							headline={data?.headline ?? ""}
							description={data?.description ?? ""}
							classes={props.classes?.header}
						/>
					</FadeUp>

					<div className={`lg:col-span-8 rounded-c bg-surface hairline card-shadow py-8 ${props.classes?.listWrapper ?? ""}`}>
						{items.map((item, index) => (
							<FadeUp key={index} delay={index * 0.05}>
								<div className={`group py-7 sm:py-8 flex items-start gap-6 sm:gap-8 transition-colors duration-300 hover:bg-surface/60 px-1 sm:px-9 ${props.classes?.listItem ?? ""}`}>
									<span className={`pt-1 text-sm font-semibold tabular-nums tracking-[0.14em] text-primary ${props.classes?.itemNumber ?? ""}`}>
										{String(index + 1).padStart(2, "0")}
									</span>

									<div className="flex-1 min-w-0">
										<span className={`flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-on-surface/45 ${props.classes?.itemName ?? ""}`}>
											{item.name}
										</span>
										<h3 className={`mt-2 text-xl sm:text-2xl font-medium tracking-tight text-ink leading-snug transition-colors duration-300 group-hover:text-primary ${props.classes?.itemLabel ?? ""}`}>
											{item.label}
										</h3>
										<p className={`mt-3 text-sm sm:text-[15px] text-on-surface/60 leading-relaxed ${props.classes?.itemDescription ?? ""}`}>
											{item.description}
										</p>
									</div>
								</div>
							</FadeUp>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

export default WhyChooseUs;