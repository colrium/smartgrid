"use client";

import type { ReactElement } from "react";
import { SectionTag } from "@/components/SectionTag";
import { FadeUp } from "@/components/animations/Fade";
import { ParallaxDecor, Blob } from "../decor";

export interface CertificationItem {
	icon?: string | null;
	name: string;
	label: string;
}

export interface CertificationsContent {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	items?: CertificationItem[] | null;
}

export interface CertificationsClassesProp {
	section?: string;
	header?: string;
	description?: string;
	grid?: string;
	card?: string;
	index?: string;
	divider?: string;
	name?: string;
	label?: string;
}

export interface CertificationsProps {
	/** Section content object, usually `t("<ns>:certifications", { returnObjects: true })`. */
	data: CertificationsContent;
	classes?: CertificationsClassesProp;
	id?: string;
}

export function Certifications(props: CertificationsProps): ReactElement {
	const data = props.data;
	const items = Array.isArray(data?.items) ? data.items : [];

	return (
		<section id={props.id ?? "certifications"} className={`py-24 sm:py-28 relative overflow-hidden ${props.classes?.section ?? ""}`}>
			<ParallaxDecor speed={0.05} className="absolute top-16 left-1/3 z-0">
				<Blob className="w-64 h-64 bg-primary-200/50" opacity={0.5} />
			</ParallaxDecor>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<div className={`mb-12 flex flex-col items-center gap-4 text-center ${props.classes?.header ?? ""}`}>
						<SectionTag>{data?.tag ?? ""}</SectionTag>
						<p
							className={`text-base sm:text-lg leading-relaxed max-w-2xl mx-auto text-on-surface/60 ${props.classes?.description ?? ""}`}
						>
							{data?.description ?? ""}
						</p>
					</div>
				</FadeUp>

				<div className={`grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 ${props.classes?.grid ?? ""}`}>
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % 4) * 0.08}>
							<div className={`group flex flex-col h-full min-h-56 rounded-c hairline bg-surface card-shadow p-6 sm:p-7 transition-colors duration-250 hover:border-primary ${props.classes?.card ?? ""}`}>
								<div className="flex items-center justify-between">
									<span className={`text-[11px] font-semibold tabular-nums tracking-[0.14em] text-on-surface/35 ${props.classes?.index ?? ""}`}>
										{String(index + 1).padStart(2, "0")}
									</span>
								</div>

								<div className={`my-5 border-t border-ink/10 ${props.classes?.divider ?? ""}`} />

								<span className={`font-light leading-none tracking-tight text-ink/80 text-6xl select-none ${props.classes?.name ?? ""}`}>
									{item.name}
								</span>

								<p className={`mt-auto pt-5 text-[13px] leading-snug text-on-surface/60 ${props.classes?.label ?? ""}`}>
									{item.label}
								</p>
							</div>
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default Certifications;
