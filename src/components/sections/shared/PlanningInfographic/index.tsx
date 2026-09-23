"use client";

import type { ReactElement } from "react";
import { Blob } from "../decor";
import { FadeUp } from "@/components/animations/Fade";
import { Trans } from "react-i18next";
import { SectionHeader, type SectionHeaderClassesProp } from "../SectionHeader";

export interface PlanningBenefit {
	icon: string;
	label: string;
	description?: string;
}

export interface PlanningInfographicContent {
	tag?: string | null;
	headline: string;
	description?: string;
	benefits?: PlanningBenefit[] | null;
	closingStatement?: string;
}

export interface PlanningInfographicClassesProp {
	section?: string;
	blob?: string;
	header?: SectionHeaderClassesProp;
	list?: string;
	item?: string;
	itemIndex?: string;
	itemCheck?: string;
	itemLabel?: string;
	watermark?: string;
	closingStatement?: string;
}

export interface PlanningInfographicProps {
	data: PlanningInfographicContent;
	classes?: PlanningInfographicClassesProp;
	id?: string;
	className?: string;
}

export function PlanningInfographic(props: PlanningInfographicProps): ReactElement | null {
	const data = props.data;
	const benefits = Array.isArray(data?.benefits) ? data.benefits : [];

	if (!data?.headline) return null;

	return (
		<section
			className={`py-20 sm:py-24 relative overflow-hidden ${props.classes?.section ?? ""} ${props.className ?? ""}`.trim()}
			id={props.id}
		>
			<Blob
				className={`w-[28rem] h-[28rem] bg-primary-100/60 -top-24 -right-24 ${props.classes?.blob ?? ""}`}
				opacity={0.5}
			/>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={data.tag || undefined}
					headline={data.headline}
					description={data.description || undefined}
					align="center"
					classes={props.classes?.header}
				/>

				{benefits.length > 0 && (
					<ol className={`mt-14 sm:mt-16 relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-6 lg:gap-4 ${props.classes?.list ?? ""}`}>
						{benefits.map((benefit, index) => (
							<li key={index} className="relative h-full min-h-50">
								<FadeUp delay={index * 0.07} className="h-full">
									<div className={`group relative h-full p-6 pt-9 bg-surface rounded-c hairline card-shadow hover:card-shadow-lift hover:border-primary transition-[box-shadow,border-color,transform] duration-250 overflow-clip ${props.classes?.item ?? ""}`}>
										<span className={`absolute top-4 right-5 text-4xl font-light tracking-tight text-primary/15 tabular-nums transition-colors duration-250 group-hover:text-primary/30 ${props.classes?.itemIndex ?? ""}`}>
											{String(index + 1).padStart(2, "0")}
										</span>

										<span className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-2xl bg-primary-50 text-ink transition-colors duration-300 group-hover:bg-primary group-hover:text-surface ${props.classes?.itemCheck ?? ""}`}>
											<span className="mdi mdi-check text-md" />
										</span>

										<p className={`relative z-10 mt-5 text-sm text-on-surface/75 leading-relaxed ${props.classes?.itemLabel ?? ""}`}>
											{benefit.label}
										</p>

										<span
											aria-hidden
											className={`absolute -bottom-3 -right-2 mdi mdi-${benefit.icon} text-8xl text-ink-50/30 select-none pointer-events-none ${props.classes?.watermark ?? ""}`}
										/>
									</div>
								</FadeUp>
							</li>
						))}
					</ol>
				)}

				{data.closingStatement && (
					<FadeUp delay={0.1}>
						<div className={`mt-10 sm:mt-12 flex justify-center ${props.classes?.closingStatement ?? ""}`}>
							<p className="inline-block max-w-3xl text-center px-8 py-6 text-base text-on-surface/80 leading-relaxed font-medium">
								<Trans
									// @ts-expect-error
									i18nKey={["common:planningInfographic.closingStatement"]}
									defaultValue=""
									components={{
										accent: <span className="text-accent" />,
										primary: <span className="text-primary" />,
										bold: <b />,
									}}
								/>
							</p>
						</div>
					</FadeUp>
				)}
			</div>
		</section>
	);
}

export default PlanningInfographic;