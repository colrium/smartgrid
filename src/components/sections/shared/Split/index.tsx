"use client";
import type { ReactElement, ReactNode } from "react";
import { SectionHeader } from "@/components/sections/home/SectionHeader";
import { Blob } from "@/components/sections/home/decor";
import { FadeUp } from "@/components/animations/Fade";
export interface SplitProps {
	id?: string; tag?: string | null; headline: string; description?: string | null;
	itemsTitle?: string | null; media?: ReactNode; children?: ReactNode;
	reverse?: boolean; stickyHeader?: boolean; className?: string;
}
export function Split(props: SplitProps): ReactElement {
	const header = (
		<div className="flex flex-col">
			<SectionHeader tag={props.tag ?? undefined} headline={props.headline} />
			{props.description ? (<p className="mt-5 max-w-3xl text-base sm:text-lg text-on-surface/60 leading-relaxed whitespace-pre-line">{props.description}</p>) : null}
		</div>
	);
	return (
		<section id={props.id} className={`py-24 sm:py-28 relative overflow-hidden ${props.className ?? ""}`.trim()}>
			<Blob className="w-[28rem] h-[28rem] bg-primary-100/50 -top-24 -right-24" opacity={0.5} />
			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
					<FadeUp className={`lg:col-span-5 self-start ${props.stickyHeader === false ? "" : "lg:sticky lg:top-28"}`}>
						{header}
						{props.itemsTitle ? (<h3 className="mt-10 font-mono text-xs uppercase tracking-widest font-semibold text-primary">{props.itemsTitle}</h3>) : null}
						{props.media}
					</FadeUp>
					<FadeUp className="lg:col-span-7">{props.children}</FadeUp>
				</div>
			</div>
		</section>
	);
}
export default Split;
