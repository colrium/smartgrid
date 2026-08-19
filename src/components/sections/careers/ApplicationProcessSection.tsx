"use client";

import type { ReactNode } from "react";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";

interface ApplicationProcessContent {
	subtitle?: string;
	description?: string;
}

function renderBold(text: string): ReactNode[] {
	const nodes: ReactNode[] = [];
	const parts = text.split(/(<bold>|<\/bold>)/g);
	let bold = false;
	for (const part of parts) {
		if (part === "<bold>" || part === "</bold>") {
			bold = !bold;
			continue;
		}
		nodes.push(
			bold ? (
				<strong key={nodes.length} className="font-semibold text-white">
					{part}
				</strong>
			) : (
				part
			)
		);
	}
	return nodes;
}

export function ApplicationProcessSection() {
	const { t } = useTranslation(["careers"]);
	const section = t("careers:applicationProcess", {
		returnObjects: true,
	}) as unknown as ApplicationProcessContent;

	if (!section.subtitle && !section.description) return null;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<div className="relative rounded-[20px] ink-panel card-shadow overflow-hidden px-8 py-16 sm:px-12 sm:py-24 text-center">
						<span className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-primary-300/30 blur-[90px] pointer-events-none" />
						<span className="absolute -bottom-28 -left-20 w-72 h-72 rounded-full bg-primary/30 blur-[90px] pointer-events-none" />
						<span className="absolute inset-3 rounded-[15px] hairline-dark pointer-events-none" aria-hidden />

						<div className="relative flex flex-col items-center gap-6">
							{section.subtitle && (
								<h2 className="font-light tracking-tight leading-[1.08] text-3xl sm:text-5xl text-white">
									{section.subtitle}
								</h2>
							)}

							{section.description && (
								<p className="text-base sm:text-lg text-white/65 leading-relaxed max-w-3xl mx-auto whitespace-pre-line">
									{renderBold(section.description)}
								</p>
							)}
						</div>
					</div>
				</FadeUp>
			</div>
		</section>
	);
}

export default ApplicationProcessSection;