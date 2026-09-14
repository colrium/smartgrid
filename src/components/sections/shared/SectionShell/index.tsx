"use client";
import type { ReactElement, ReactNode } from "react";
import { SectionHeader, type SectionHeaderClassesProp } from "@/components/sections/shared/SectionHeader";
import { Blob } from "@/components/sections/shared/decor";
import { FadeUp } from "@/components/animations/Fade";
export interface SectionShellClassesProp {
	sectionHeader?: SectionHeaderClassesProp;
	content?: string;
}
export interface SectionShellProps {
	id?: string; tag?: string | null; headline?: string; description?: ReactNode;
	align?: "left" | "center"; tone?: "default" | "surface"; width?: "wide" | "narrow";
	decor?: boolean; className?: string; classes?: SectionShellClassesProp; children: ReactNode;
}
export function SectionShell(props: SectionShellProps): ReactElement {
	const { id, tag, headline, description, align = "left" } = props;
	const tone = props.tone ?? "default";
	const width = props.width ?? "wide";
	return (
		<section id={id} className={`py-24 sm:py-28 relative overflow-hidden ${tone === "surface" ? "bg-surface" : ""} ${props.className ?? ""}`.trim()}>
			{props.decor !== false ? (<Blob className="w-[28rem] h-[28rem] bg-primary-100/50 -top-24 -right-24" opacity={0.5} />) : null}
			<div className={`relative z-10 ${width === "narrow" ? "max-w-6xl" : "max-w-7xl"} mx-auto px-6 sm:px-8 lg:px-12 ${props.classes?.content ?? ""}`}>
				{headline ? (<FadeUp><SectionHeader tag={tag ?? undefined} headline={headline} description={description ?? undefined} align={align} classes={props.classes?.sectionHeader} /></FadeUp>) : null}
				{props.children}
			</div>
		</section>
	);
}
export default SectionShell;
