"use client";

import { SectionTag } from "@/components/SectionTag";

interface SectionHeaderProps {
	tag?: string;
	headline: string;
	description?: string;
	tone?: "light" | "dark";
	align?: "left" | "center";
}

export function SectionHeader({
	tag,
	headline,
	description,
	tone = "light",
	align = "left",
}: SectionHeaderProps) {
	const dark = tone === "dark";

	const descClass = dark
		? "text-surface/65"
		: "text-on-surface/60";
    
	return (
		<div
			className={`flex flex-col gap-5 ${
				align === "center" ? "items-center text-center" : "items-start"
			}`}
		>
			{tag && (
				<SectionTag
					// className={`inline-flex items-center gap-3 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.22em]`}					
					dark={dark}
				>
					{tag}
				</SectionTag>
			)}
			<h2
				className={`font-light tracking-tight leading-[1.08] text-3xl sm:text-4xl lg:text-[2.85rem] ${
					dark ? "text-surface" : "text-ink"
				}`}
			>
				{headline}
			</h2>
			{description && (
				<p
					className={`text-base sm:text-lg leading-relaxed max-w-2xl ${descClass} ${
						align === "center" ? "mx-auto" : ""
					}`}
				>
					{description}
				</p>
			)}
		</div>
	);
}

export default SectionHeader;