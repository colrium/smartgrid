"use client";

import type { ReactNode } from "react";
import { SectionTag } from "@/components/SectionTag";
import { FadeUp } from "@/components/animations/Fade";

interface SectionHeaderProps {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	align?: "left" | "center";
	dark?: boolean;
	className?: string;
	startElement?: ReactNode;
	endElement?: ReactNode;
}

export function SectionHeader({
	tag,
	headline,
	description,
	align = "center",
	dark = false,
	className = "",
	startElement,
	endElement,
}: SectionHeaderProps) {
	const centered = align === "center";
	return (
		<FadeUp
			className={`flex flex-col gap-4 max-w-3xl ${centered ? "mx-auto text-center items-center" : "text-left items-start"} ${className}`}
		>
			{tag && (
				<SectionTag startElement={startElement} endElement={endElement} className={dark ? "text-primary" : "text-primary"}>
					{tag}
				</SectionTag>
			)}
			{headline && (
				<h2
					className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.15] ${
						dark ? "text-white" : "text-on-surface"
					}`}
				>
					{headline}
				</h2>
			)}
			{description && (
				<p
					className={`text-base sm:text-lg leading-relaxed whitespace-pre-line ${
						dark ? "text-white/70" : "text-on-surface/70"
					}`}
				>
					{description}
				</p>
			)}
		</FadeUp>
	);
}