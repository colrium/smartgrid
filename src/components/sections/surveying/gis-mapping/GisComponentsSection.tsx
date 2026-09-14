"use client";

import { motion } from "framer-motion";
import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/shared/decor";

interface GisComponentItem {
	title: string;
	description: string;
}

interface GisComponentsContent {
	tag?: string | null;
	headline: string;
	description?: string;
	lifecycle?: {
		title?: string | null;
		subtitle?: string | null;
	} | null;
	list: GisComponentItem[];
}

/** Percentage position on the lifecycle ring for node index i of n. */
function nodePosition(index: number, total: number, radius = 40): { left: number; top: number } {
	const angle = (-90 + (360 / total) * index) * (Math.PI / 180);
	return {
		left: 50 + radius * Math.cos(angle),
		top: 50 + radius * Math.sin(angle),
	};
}

export function GisComponentsSection() {
	const { t } = useTranslation(["surveying/gis-mapping"]);
	const section = t("surveying/gis-mapping:gisComponents", {
		returnObjects: true,
	}) as unknown as GisComponentsContent;
	const list = Array.isArray(section.list) ? section.list : [];
	const lifecycleTitle = section.lifecycle?.title || "GIS";
	const lifecycleSubtitle = section.lifecycle?.subtitle || "Lifecycle";

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<Blob className="w-[28rem] h-[28rem] bg-primary-100/60 -bottom-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag}
					headline={section.headline}
					description={section.description}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
					{/* Circular lifecycle chart */}
					<FadeUp className="order-1">
						<div className="relative mx-auto w-full max-w-[420px] aspect-square">
							{/* Rotating dashed ring */}
							<motion.svg
								aria-hidden
								viewBox="0 0 100 100"
								className="absolute inset-0 h-full w-full text-primary/30"
								animate={{ rotate: 360 }}
								transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
							>
								<circle
									cx="50"
									cy="50"
									r="40"
									fill="none"
									stroke="currentColor"
									strokeWidth="0.6"
									strokeDasharray="1.6 2.6"
									strokeLinecap="round"
								/>
							</motion.svg>

							{/* Static hairline ring */}
							<span
								aria-hidden
								className="absolute rounded-full hairline"
								style={{
									left: "10%",
									top: "10%",
									width: "80%",
									height: "80%",
								}}
							/>

							{/* Center hub */}
							<div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center h-24 w-24 sm:h-28 sm:w-28 rounded-full bg-primary text-surface card-shadow">
								<span className="mdi mdi-sync text-xl sm:text-2xl text-surface/80" aria-hidden />
								<span className="mt-1 text-lg sm:text-xl font-semibold tracking-tight leading-none">
									{lifecycleTitle}
								</span>
								<span className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-surface/75">
									{lifecycleSubtitle}
								</span>
							</div>

							{/* Directional arrows between nodes */}
							{list.map((_, index) => {
								const midAngle = -90 + (360 / list.length) * (index + 0.5);
								const position = nodePosition(index + 0.5, list.length);
								return (
									<span
										key={`arrow-${index}`}
										aria-hidden
										className="absolute mdi mdi-arrow-right text-lg text-primary/50"
										style={{
											left: `${position.left}%`,
											top: `${position.top}%`,
											transform: `translate(-50%, -50%) rotate(${midAngle + 90}deg)`,
										}}
									/>
								);
							})}

							{/* Nodes */}
							{list.map((item, index) => {
								const position = nodePosition(index, list.length);
								return (
									<div
										key={`node-${index}`}
										className="group absolute flex flex-col items-center"
										style={{
											left: `${position.left}%`,
											top: `${position.top}%`,
											transform: "translate(-50%, -50%)",
										}}
									>
										<span className="inline-flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-surface hairline card-shadow text-sm sm:text-base font-semibold text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
											{String(index + 1).padStart(2, "0")}
										</span>
										<span className="mt-2 max-w-[7.5rem] text-center text-[11px] sm:text-xs font-medium leading-tight text-on-surface/70">
											{item.title}
										</span>
									</div>
								);
							})}
						</div>
					</FadeUp>

					{/* Component list */}
					<div className="order-2 flex flex-col gap-4">
						{list.map((item, index) => (
							<FadeUp key={index} delay={index * 0.06}>
								<article className="group relative flex items-start gap-5 rounded-c bg-paper hairline card-shadow p-5 sm:p-6 transition-all duration-250 hover:card-shadow-lift hover:border-primary">
									<span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 font-semibold text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
										{String(index + 1).padStart(2, "0")}
									</span>
									<div className="min-w-0">
										<h3 className="text-base sm:text-lg font-medium tracking-tight text-ink leading-snug">
											{item.title}
										</h3>
										<p className="mt-1.5 text-sm text-on-surface/60 leading-relaxed">
											{item.description}
										</p>
									</div>
								</article>
							</FadeUp>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

export default GisComponentsSection;