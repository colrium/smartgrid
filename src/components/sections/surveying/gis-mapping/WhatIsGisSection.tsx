"use client";

import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";
import type { ReactNode } from "react";

interface WhatIsGisItem {
	icon?: string | null;
	title: string;
}

interface WhatIsGisContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items?: WhatIsGisItem[] | null;
	closingStatement?: string | null;
}

/** Render inline <bold> segments on a dark panel. */
function renderClosing(text: string): ReactNode[] {
	const nodes: ReactNode[] = [];
	const parts = text.split(/(<bold>|<\/bold>)/g);
	let bold = false;

	for (const part of parts) {
		if (part === "<bold>") {
			bold = true;
			continue;
		}
		if (part === "</bold>") {
			bold = false;
			continue;
		}
		nodes.push(
			bold ? (
				<strong key={nodes.length} className="font-semibold">
					{part}
				</strong>
			) : (
				part
			),
		);
	}
	return nodes;
}

export function WhatIsGisSection() {
	const { t } = useTranslation(["surveying/gis-mapping"]);
	const section = t("surveying/gis-mapping:whatIsGis", {
		returnObjects: true,
	}) as unknown as WhatIsGisContent;
	const items = Array.isArray(section.items) ? section.items : [];
	const closingLines = (section.closingStatement || "").split(/\n+/).filter(Boolean);

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-[28rem] h-[28rem] bg-primary-100/60 -top-24 -right-24" opacity={0.5} />
			<Blob className="w-[22rem] h-[22rem] bg-primary-200/40 -bottom-24 -left-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp className="max-w-4xl mx-auto">
					<SectionHeader
						tag={section.tag}
						headline={section.headline}
						description={section.description}
						align="center"
					/>
				</FadeUp>

				{items.length > 0 && (
					<div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
						{items.map((item, index) => (
							<FadeUp key={index} delay={(index % 4) * 0.07}>
								<article className="group relative h-full flex flex-col gap-4 rounded-c bg-paper hairline card-shadow p-6 transition-all duration-500 hover:card-shadow-lift hover:border-primary">
									<span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
										<span className={`mdi mdi-${item.icon || "map-marker"} text-2xl`} />
									</span>
									<h3 className="text-base font-medium tracking-tight text-ink leading-snug">
										{item.title}
									</h3>
								</article>
							</FadeUp>
						))}
					</div>
				)}

				{closingLines.length > 0 && (
					<FadeUp delay={0.12}>
						<div className="mt-12 sm:mt-16 relative overflow-hidden rounded-c pale-panel card-shadow px-8 py-10 sm:px-12 sm:py-12 text-center shimmer-t shimmer-gold-200">
							<span
								aria-hidden
								className="mdi mdi-lightbulb-on-outline pointer-events-none absolute -right-6 -top-8 select-none text-[9rem] leading-none text-ink-400/6"
							/>
							{closingLines.map((line, index) =>
								index === 0 ? (
									<p
										key={index}
										className="text-xs font-semibold uppercase tracking-[0.22em] text-ink-400"
									>
										{line}
									</p>
								) : (
									<p
										key={index}
										className="mt-4 font-light tracking-tight leading-snug text-2xl sm:text-3xl text-ink/85"
									>
										{renderClosing(line)}
									</p>
								),
							)}
						</div>
					</FadeUp>
				)}
			</div>
		</section>
	);
}

export default WhatIsGisSection;