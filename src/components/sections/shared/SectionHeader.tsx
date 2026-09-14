"use client";

import type { ReactElement, ReactNode } from "react";

import { SectionTag } from "@/components/SectionTag";

export interface SectionHeaderClassesProp {
	tag?: string;
	headline: string;
	description?: ReactNode;
}

export interface SectionHeaderProps {
	tag?: string;
	headline: string;
	description?: ReactNode;
	tone?: "light" | "dark";
	align?: "left" | "center";
	classes?: SectionHeaderClassesProp;
	className?: string;
}

export function SectionHeader({
	tag,
	headline,
	description,
	tone = "light",
	align = "left",
	className,
	classes = {
		tag: "",
		headline: "",
		description: "",
	},
}: SectionHeaderProps): ReactElement {
	const dark = tone === "dark";

	const descClass = dark ? "text-surface/65" : "text-on-surface/60";

	return (
		<div
			className={`flex flex-col gap-5 ${
				align === "center" ? "items-center text-center" : "items-start"
			} ${className ?? ""}`}
		>
			{tag && (
				<SectionTag
					// className={`inline-flex items-center gap-3 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em]`}
					dark={dark}
					className={`${classes?.tag ?? ""}`}
				>
					{tag}
				</SectionTag>
			)}
			<h2
				className={`font-light tracking-tight leading-[1.08] text-3xl sm:text-4xl lg:text-[2.85rem] ${
					dark ? "text-surface" : "text-ink"
				} ${classes?.headline ?? ""}`}
			>
				{headline}
			</h2>
			{description && (
				<p
					className={`text-base sm:text-lg leading-relaxed max-w-2xl ${descClass} ${
						align === "center" ? "mx-auto" : ""
					} ${classes?.description ?? ""}`}
				>
					{description}
				</p>
			)}
		</div>
	);
}

export default SectionHeader;
