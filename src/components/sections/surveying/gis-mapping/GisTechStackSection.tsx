"use client";

import Image from "next/image";
import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface TechLogo {
	image?: string | null;
	label?: string | null;
	tone?: "dark" | "light" | string | null;
}

interface TechStackContent {
	tag?: string | null;
	headline: string;
	description?: string;
	tools?: string[] | null;
	logos?: TechLogo[] | null;
}

export function GisTechStackSection(): ReactElement {
	const { t } = useTranslation(["surveying/gis-mapping"]);
	const section = t("surveying/gis-mapping:techStack", {
		returnObjects: true,
	}) as unknown as TechStackContent;
	const tools = Array.isArray(section?.tools) ? section.tools : [];
	const logos = Array.isArray(section?.logos) ? section.logos : [];

	if (tools.length === 0 && logos.length === 0) return <></>;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<Blob className="w-[28rem] h-[28rem] bg-primary-200/40 -top-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					description={section.description || undefined}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-10 items-stretch">
					{/* Tools checklist */}
					{tools.length > 0 && (
						<FadeUp className="lg:col-span-2 h-full">
							<article className="relative h-full flex flex-col rounded-[20px] bg-paper hairline card-shadow p-7 sm:p-8">
								<span
									aria-hidden
									className="pointer-events-none absolute -right-6 -bottom-10 select-none text-[9rem] leading-none text-primary/5 mdi mdi-tools"
								/>
								<ul className="relative flex flex-col gap-4">
									{tools.map((tool, index) => (
										<li
											key={index}
											className="flex items-start gap-3 rounded-xl bg-surface/70 hairline px-4 py-3 transition-colors duration-300 hover:border-primary/40"
										>
											<span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
												<span className="mdi mdi-check-circle-outline text-sm" />
											</span>
											<span className="text-sm sm:text-base font-medium text-ink/85 leading-snug">
												{tool}
											</span>
										</li>
									))}
								</ul>
							</article>
						</FadeUp>
					)}

					{/* Logo wall */}
					{logos.length > 0 && (
						<div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
							{logos.map((logo, index) => {
								const src = typeof logo.image === "string" ? logo.image : "";
								if (!src) return null;
								const isDark = logo.tone !== "light";

								return (
									<FadeUp key={src} delay={(index % 4) * 0.06} className="h-full">
										<article
											className={`group relative h-full flex flex-col items-center justify-center gap-3 rounded-2xl overflow-hidden p-4 aspect-[4/3] transition-all duration-500 hover:-translate-y-1 ${
												isDark
													? "ink-panel hairline-dark card-shadow hover:card-shadow-lift"
													: "bg-surface hairline card-shadow hover:card-shadow-lift hover:border-primary"
											}`}
										>
											<span className="relative flex-1 w-full flex items-center justify-center">
												<Image
													src={src}
													alt={logo.label || "Geospatial tool"}
													fill
													sizes="(min-width: 640px) 20vw, 40vw"
													className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
												/>
											</span>
											<span
												className={`text-[10px] font-semibold uppercase tracking-[0.16em] text-center leading-tight ${
													isDark ? "text-surface/50" : "text-on-surface/40"
												}`}
											>
												{logo.label}
											</span>
										</article>
									</FadeUp>
								);
							})}
						</div>
					)}
				</div>
			</div>
		</section>
	);
}

export default GisTechStackSection;