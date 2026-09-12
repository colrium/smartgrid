"use client";
import type { ReactElement, ReactNode } from "react";
import { SectionHeader } from "@/components/sections/home/SectionHeader";
import { Blob } from "@/components/sections/home/decor";
import { FadeUp } from "@/components/animations/Fade";
export interface SectionShellProps {
	id?: string; tag?: string | null; headline?: string; description?: ReactNode;
	align?: "left" | "center"; tone?: "default" | "surface"; width?: "wide" | "narrow";
	decor?: boolean; className?: string; children: ReactNode;
}
export function SectionShell(props: SectionShellProps): ReactElement {
	const { id, tag, headline, description, align = "left" } = props;
	const tone = props.tone ?? "default";
	const width = props.width ?? "wide";
	return (
		<section id={id} className={`py-24 sm:py-28 relative overflow-hidden ${tone === "surface" ? "bg-surface" : ""} ${props.className ?? ""}`.trim()}>
			{props.decor !== false ? (<Blob className="w-[28rem] h-[28rem] bg-primary-100/50 -top-24 -right-24" opacity={0.5} />) : null}
			<div className={`relative z-10 ${width === "narrow" ? "max-w-6xl" : "max-w-7xl"} mx-auto px-6 sm:px-8 lg:px-12`}>
				{headline ? (<FadeUp><SectionHeader tag={tag ?? undefined} headline={headline} description={description ?? undefined} align={align} /></FadeUp>) : null}
				{props.children}
			</div>
		</section>
	);
}
export default SectionShell;
