"use client";

import type { ReactElement } from "react";
import Image from "next/image";
import { SectionTag } from "@/components/SectionTag";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "../decor";

export interface TrusteeItem {
	label: string;
	logoUrl: string;
}

export interface TrusteesContent {
	tag?: string | null;
	headline?: string | null;
	items?: TrusteeItem[] | null;
}

export interface TrusteesClassesProp {
	section?: string;
	blob?: string;
	header?: string;
	tag?: string;
	headline?: string;
	grid?: string;
	card?: string;
	logo?: string;
}

export interface TrusteesProps {
	data: TrusteesContent;
	classes?: TrusteesClassesProp;
	id?: string;
	className?: string;
}

export function Trustees(props: TrusteesProps): ReactElement | null {
	const data = props.data;
	const items = Array.isArray(data?.items) ? data.items : [];

	if (items.length === 0) return null;

	return (
		<section
			id={props.id ?? "trustees"}
			className={`py-24 sm:py-28 relative overflow-hidden ${props.classes?.section ?? ""} ${props.className ?? ""}`.trim()}
		>
			<Blob className={`w-72 h-72 bg-primary-200/50 -right-16 top-10 ${props.classes?.blob ?? ""}`} opacity={0.4} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<div className={`mb-12 flex flex-col items-center gap-4 text-center ${props.classes?.header ?? ""}`}>
						<SectionTag>
							{data?.tag ?? "Trusted Partners"}
						</SectionTag>
						<p className={`text-3xl sm:text-4xl font-light tracking-tight text-ink leading-tight ${props.classes?.headline ?? ""}`}>
							{data?.headline ?? ""}
						</p>
					</div>
				</FadeUp>

				<div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5 ${props.classes?.grid ?? ""}`}>
					{items.map((item, index) => (
						<FadeUp key={item.logoUrl} delay={(index % 5) * 0.08}>
							<div className={`group h-20 sm:h-24 rounded-cmd hairline bg-surface card-shadow px-6 sm:px-8 flex items-center justify-center transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:card-shadow-lift hover:border-primary ${props.classes?.card ?? ""}`}>
								<div className="relative w-full h-full max-w-full">
									<Image
										src={item.logoUrl}
										alt={item.label}
										fill
										sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
										className={`object-contain grayscale opacity-75 transition-[filter,opacity] duration-300 group-hover:grayscale-0 group-hover:opacity-100 ${props.classes?.logo ?? ""}`}
									/>
								</div>
							</div>
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default Trustees;