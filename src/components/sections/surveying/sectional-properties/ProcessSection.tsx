"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface ProcessItem {
	label?: string;
	description?: string;
	phase?: string | null;
}

interface ProcessContent {
	tag?: string | null;
	headline?: string;
	description?: string;
	items?: ProcessItem[];
	outcome?: string;
}

const PHASE_STYLES: Record<string, { chip: string; icon: string }> = {
	FIELD: {
		chip: "border-primary-400/40 bg-primary-400/10 text-primary-200",
		icon: "map-marker-radius",
	},
	OFFICE: {
		chip: "border-accent-300/40 bg-accent-300/10 text-accent-300",
		icon: "desktop-mac-dashboard",
	},
	REGISTRY: {
		chip: "border-whatsapp/40 bg-whatsapp/10 text-whatsapp",
		icon: "office-building-marker",
	},
};

const PHASE_FALLBACK = PHASE_STYLES.FIELD;

export function ProcessSection(): ReactElement {
	const { t } = useTranslation(["surveying/sectional-properties"]);
	const section = t("surveying/sectional-properties:process", {
		returnObjects: true,
	}) as unknown as ProcessContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return <></>;

	return (
		<section className="ink-panel py-24 sm:py-28 relative overflow-hidden">
			<Blob
				className="w-[30rem] h-[30rem] bg-primary-400/15 -bottom-40 -left-40"
				opacity={0.35}
			/>

			<div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline ?? ""}
					description={section.description || undefined}
					tone="dark"
					align="center"
				/>

				<div className="relative mt-16 sm:mt-20">
					<div
						aria-hidden
						className="absolute left-4 lg:left-1/2 lg:-translate-x-1/2 top-2 bottom-2 w-px bg-gradient-to-b from-primary-400/0 via-primary-400/50 to-accent-400/70"
					/>
					<ol className="space-y-10 lg:space-y-14">
						{items.map((item, index) => {
							const phase =
								PHASE_STYLES[(item.phase ?? "").toUpperCase()] ?? PHASE_FALLBACK;
							const alignLeft = index % 2 === 0;

							return (
								<li key={index} className="relative">
									<FadeUp delay={Math.min(index * 0.05, 0.3)}>
										<div
											className={`relative flex items-start gap-5 pl-14 lg:pl-0 ${
												alignLeft
													? "lg:pr-[calc(50%+2.75rem)]"
													: "lg:pl-[calc(50%+2.75rem)]"
												}`}
										>
											<span className="absolute left-0 lg:left-1/2 lg:-translate-x-1/2 top-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-primary-400/50 bg-ink-soft text-[11px] font-semibold text-surface shadow-[0_0_0_6px_rgba(0,151,178,0.12)]">
												{String(index + 1).padStart(2, "0")}
											</span>

											<div className="flex-1 rounded-[18px] border border-surface/10 bg-surface/5 p-6 sm:p-7 backdrop-blur-sm transition-colors duration-300 hover:border-primary-400/30">
												<div className="flex flex-wrap items-center justify-between gap-3">
													{item.phase && (
														<span
															className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] ${phase.chip}`}
														>
															<span className={`mdi mdi-${phase.icon} text-xs`} />
															{item.phase}
														</span>
													)}
													<span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-surface/30">
														Step {String(index + 1).padStart(2, "0")}
													</span>
												</div>
												<h3 className="mt-4 text-lg sm:text-xl font-medium tracking-tight text-surface leading-snug">
													{item.label}
												</h3>
												<p className="mt-2.5 text-sm leading-relaxed text-surface/60">
													{item.description}
												</p>
											</div>
										</div>
									</FadeUp>
								</li>
							);
						})}
					</ol>
				</div>

				{section.outcome && (
					<FadeUp>
						<div className="relative mt-14 flex justify-center">
							<div className="inline-flex flex-wrap items-center justify-center gap-3 rounded-full border border-whatsapp/30 bg-whatsapp/10 px-7 py-3.5 text-sm sm:text-base font-medium text-surface text-center">
								<span className="mdi mdi-check-decagram text-xl text-whatsapp" />
								{section.outcome}
							</div>
						</div>
					</FadeUp>
				)}
			</div>
		</section>
	);
}

export default ProcessSection;
