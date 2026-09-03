"use client";

import Image from "next/image";
import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob, ParallaxDecor } from "@/components/sections/home/decor";

interface TechLogo {
	image?: string | null;
	label?: string | null;
}

interface TechStackContent {
	tag?: string | null;
	headline: string;
	description?: string;
	tools?: string[] | null;
	logos?: TechLogo[] | null;
}

/** Icons paired with the tool list order (component-side fallbacks keep the locale JSON lean). */
const TOOL_ICONS = [
	"layers-triple",
	"database-outline",
	"quadcopter",
	"crosshairs-gps",
	"satellite-variant",
	"robot-outline",
];

export function GisTechStackSection(): ReactElement {
	const { t } = useTranslation(["surveying/gis-mapping"]);
	const section = t("surveying/gis-mapping:techStack", {
		returnObjects: true,
	}) as unknown as TechStackContent;
	const tools = Array.isArray(section?.tools) ? section.tools : [];
	const logos = Array.isArray(section?.logos) ? section.logos : [];

	if (tools.length === 0 && logos.length === 0) return <></>;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-[28rem] h-[28rem] bg-primary-200/40 -top-24 -right-24" opacity={0.5} />
			<ParallaxDecor speed={-0.06} className="absolute bottom-16 -left-24 z-0">
				<Blob className="w-72 h-72 bg-primary-100/80" opacity={0.6} />
			</ParallaxDecor>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					description={section.description || undefined}
					align="center"
				/>

				{/* Tool capability pills */}
				{tools.length > 0 && (
					<ul className="mt-12 sm:mt-14 flex flex-wrap items-center justify-center gap-3 sm:gap-3.5">
						{tools.map((tool, index) => (
							<li key={index}>
								<FadeUp delay={Math.min(index * 0.05, 0.25)}>
									<span className="group inline-flex items-center gap-3 rounded-full bg-paper hairline card-shadow py-2 pl-2 pr-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:card-shadow-lift">
										<span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
											<span
												className={`mdi mdi-${TOOL_ICONS[index % TOOL_ICONS.length]} text-lg`}
											/>
										</span>
										<span className="text-sm font-medium text-ink/85 leading-snug">
											{tool}
										</span>
									</span>
								</FadeUp>
							</li>
						))}
					</ul>
				)}

				{/* Software & hardware logo bento */}
				{logos.length > 0 && (
					<div className="mt-10 sm:mt-12 grid grid-cols-2 lg:grid-cols-4 auto-rows-[7rem] sm:auto-rows-[8.5rem] lg:auto-rows-[9.5rem] gap-4">
						{logos.map((logo, index) => {
							const src = typeof logo.image === "string" ? logo.image : "";
							if (!src) return null;
							const isFeature = index === 0;
							const isWide = index === logos.length - 1 && logos.length > 4;

							return (
								<FadeUp
									key={src}
									delay={(index % 4) * 0.06}
									className={
										isFeature ? "col-span-2 row-span-2" : isWide ? "col-span-2" : ""
									}
								>
									<article
										className={`group relative h-full w-full flex flex-col items-center justify-center gap-2.5 rounded-2xl overflow-hidden p-4 sm:p-5 transition-all duration-500 hover:-translate-y-1 ${
											isFeature
												? "pale-panel hairline card-shadow hover:card-shadow-lift hover:border-primary/40"
												: "bg-surface hairline card-shadow hover:card-shadow-lift hover:border-primary"
										}`}
									>
										<span className="relative flex-1 w-full flex items-center justify-center">
											<Image
												src={src}
												alt={logo.label || "Geospatial tool"}
												fill
												sizes="(min-width: 1024px) 25vw, 50vw"
												className="object-contain p-3 transition-transform duration-500 group-hover:scale-105"
											/>
										</span>
										<span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-center leading-tight text-on-surface/40 transition-colors duration-300 group-hover:text-primary">
											{logo.label}
										</span>
									</article>
								</FadeUp>
							);
						})}
					</div>
				)}
			</div>
		</section>
	);
}

export default GisTechStackSection;