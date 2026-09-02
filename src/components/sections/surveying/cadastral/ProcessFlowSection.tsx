"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface ProcessStep {
	icon?: string | null;
	label: string;
	description?: string;
}

interface ProcessContent {
	tag?: string | null;
	headline: string;
	description?: string;
	outcomeLabel?: string | null;
	steps: ProcessStep[];
}

export function ProcessFlowSection(): ReactElement {
	const { t } = useTranslation(["surveying/cadastral-surveys"]);
	const section = t("surveying/cadastral-surveys:process", {
		returnObjects: true,
	}) as unknown as ProcessContent;
	const steps = Array.isArray(section?.steps) ? section.steps : [];

	if (steps.length === 0) return <></>;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-[26rem] h-[26rem] bg-primary-100/60 -top-24 left-0" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					description={section.description || undefined}
					align="center"
				/>

				<div className="relative mt-14 sm:mt-20 max-w-5xl mx-auto">
					{/* Central spine (desktop) / left spine (mobile) */}
					<span
						aria-hidden
						className="absolute left-[23px] lg:left-1/2 lg:-translate-x-1/2 top-2 bottom-2 w-px border-l-2 border-dashed border-primary/25"
					/>

					<ol className="relative space-y-8 lg:space-y-12">
						{steps.map((step, index) => {
							const isLeft = index % 2 === 0;

							return (
								<li
									key={index}
									className="relative flex items-start gap-5 sm:gap-6 lg:grid lg:grid-cols-2 lg:gap-0"
								>
									{/* Node */}
									<span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink-soft text-surface card-shadow ring-4 ring-background lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
										<span className={`mdi mdi-${step.icon || "vector-square"} text-xl`} />
									</span>

									<FadeUp
										className={`flex-1 min-w-0 ${
											isLeft
												? "lg:col-start-1 lg:row-start-1 lg:pr-16"
												: "lg:col-start-2 lg:row-start-1 lg:pl-16"
										}`}
									>
										<article className="group relative h-full overflow-hidden rounded-[20px] bg-surface hairline card-shadow p-6 sm:p-7 transition-all duration-500 hover:card-shadow-lift hover:border-primary">
											<span
												aria-hidden
												className={`absolute -top-5 font-light tracking-tighter text-[5.5rem] leading-none text-primary/[0.06] select-none pointer-events-none ${
													isLeft ? "-right-2" : "-left-2"
												}`}
											>
												{String(index + 1).padStart(2, "0")}
											</span>

											<div className="relative">
												<p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
													Step {String(index + 1).padStart(2, "0")}
												</p>
												<h3 className="mt-2 text-lg sm:text-xl font-medium tracking-tight text-ink leading-snug">
													{step.label}
												</h3>
												{step.description && (
													<p className="mt-3 text-sm text-on-surface/60 leading-relaxed">
														{step.description}
													</p>
												)}
											</div>
										</article>
									</FadeUp>
								</li>
							);
						})}
					</ol>

					{section.outcomeLabel && (
						<FadeUp delay={0.1}>
							<div className="relative flex items-center gap-5 sm:gap-6 mt-8 lg:mt-12 lg:justify-center lg:gap-0">
								<span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink text-surface card-shadow ring-4 ring-background lg:absolute lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2">
									<span className="mdi mdi-flag-checkered text-xl text-primary-200" />
								</span>
								<div className="flex-1 lg:flex-none">
									<div className="inline-flex items-center gap-3 rounded-full bg-ink px-6 py-3.5 text-sm font-medium text-surface card-shadow">
										<span className="h-1.5 w-1.5 rounded-full bg-primary-300" />
										{section.outcomeLabel}
									</div>
								</div>
							</div>
						</FadeUp>
					)}
				</div>
			</div>
		</section>
	);
}

export default ProcessFlowSection;