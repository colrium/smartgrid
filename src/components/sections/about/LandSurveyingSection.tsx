"use client";

import type { ReactNode } from "react";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home/SectionHeader";
import { Blob } from "@/components/sections/home/decor";

interface LandSurveyingItem {
	title: string;
	description: string;
}

interface LandSurveyingContent {
	tag?: string | null;
	headline: string;
	description?: string;
	itemsTitle?: string;
	items: LandSurveyingItem[];
}

function renderPrimary(text: string): ReactNode[] {
	const nodes: ReactNode[] = [];
	const parts = text.split(/(<primary>|<\/primary>)/g);
	let primary = false;
	for (const part of parts) {
		if (part === "<primary>") {
			primary = true;
			continue;
		}
		if (part === "</primary>") {
			primary = false;
			continue;
		}
		nodes.push(
			primary ? (
				<span key={nodes.length} className="text-primary font-medium">
					{part}
				</span>
			) : (
				part
			)
		);
	}
	return nodes;
}

export function LandSurveyingSection() {
	const { t } = useTranslation(["about"]);
	const section = t("about:landSurveying", {
		returnObjects: true,
	}) as unknown as LandSurveyingContent;
	const items = Array.isArray(section.items) ? section.items : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-[28rem] h-[28rem] bg-primary-100/50 -top-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<SectionHeader
						tag={section.tag ?? undefined}
						headline={section.headline}
					/>

					{section.description && (
						<p className="mt-5 max-w-3xl text-base sm:text-lg text-on-surface/60 leading-relaxed whitespace-pre-line">
							{renderPrimary(section.description)}
						</p>
					)}
				</FadeUp>

				{section.itemsTitle && (
					<FadeUp delay={0.05}>
						<h3 className="mt-14 font-mono text-xs uppercase tracking-widest font-semibold text-primary">
							{section.itemsTitle}
						</h3>
					</FadeUp>
				)}

				<div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % 3) * 0.07}>
							<article className="h-full flex flex-col gap-3 rounded-[20px] bg-surface hairline card-shadow p-7 sm:p-8 transition-all duration-500 hover:card-shadow-lift">
								<span className="h-10 w-10 rounded-xl bg-primary-50 text-primary flex items-center justify-center">
									<span className="mdi mdi-check text-lg" />
								</span>
								<h4 className="text-lg font-semibold tracking-tight text-ink">
									{item.title}
								</h4>
								<p className="text-sm text-on-surface/70 leading-relaxed">
									{item.description}
								</p>
							</article>
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default LandSurveyingSection;