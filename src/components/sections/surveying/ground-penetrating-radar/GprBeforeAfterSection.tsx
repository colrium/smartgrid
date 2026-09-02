"use client";

import { useState, type ReactElement } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home";
import { Blob } from "@/components/sections/home/decor";

interface FlipSide {
	label?: string;
	tagline?: string | null;
	items?: string[] | null;
}

interface BeforeAfterContent {
	tag?: string | null;
	headline: string;
	flipHint?: string | null;
	before: FlipSide;
	after: FlipSide;
}

export function GprBeforeAfterSection(): ReactElement {
	const { t } = useTranslation(["surveying/ground-penetrating-radar"]);
	const section = t("surveying/ground-penetrating-radar:beforeAfter", {
		returnObjects: true,
	}) as unknown as BeforeAfterContent;
	const [showAfter, setShowAfter] = useState(false);

	if (!section?.headline) return <></>;

	const sides: Array<{ key: "before" | "after"; side: FlipSide }> = [
		{ key: "before", side: section.before },
		{ key: "after", side: section.after },
	];
	const active = showAfter ? section.after : section.before;
	const isAfter = showAfter;
	const list = Array.isArray(active?.items) ? active.items : [];
	const isBefore = !isAfter;

	return (
		<section id="before-after" className="scroll-mt-36 py-20 sm:py-24 relative overflow-hidden">
			<Blob
				className="w-[26rem] h-[26rem] bg-primary-100/60 -top-24 -left-24"
				opacity={0.5}
			/>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					align="center"
				/>

				<FadeUp delay={0.1}>
					<div className="mt-12 sm:mt-14 mx-auto max-w-2xl flex flex-col items-center">
						{/* Segmented BEFORE / AFTER toggle */}
						<div
							role="tablist"
							className="inline-flex rounded-full bg-surface hairline card-shadow p-1.5"
						>
							{sides.map(({ key, side }) => {
								const isActive = (key === "after") === showAfter;

								return (
									<button
										key={key}
										type="button"
										role="tab"
										aria-selected={isActive}
										onClick={() => setShowAfter(key === "after")}
										className={`relative rounded-full px-6 sm:px-8 py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] transition-colors duration-300 cursor-pointer ${
											isActive
												? isAfter
													? "text-green-700"
													: "text-yellow-700"
												: "text-on-surface/45 hover:text-ink"
										}`}
									>
										{isActive && (
											<motion.span
												layoutId="gpr-before-after-toggle"
												transition={{
													duration: 0.35,
													ease: [0.16, 1, 0.3, 1],
												}}
												className={`absolute inset-0 rounded-full ${isAfter ? "bg-green-100" : "bg-yellow-100"}`}
											/>
										)}
										<span className="relative z-10">{side.label ?? key}</span>
									</button>
								);
							})}
						</div>
						{/* Swapping card */}
						<div className="relative mt-8 w-full">
							<AnimatePresence mode="wait" initial={false}>
								<motion.div
									key={isAfter ? "after" : "before"}
									initial={{ opacity: 0, x: isAfter ? 56 : -56 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: isAfter ? -56 : 56 }}
									transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
									onClick={() => setShowAfter((v) => !v)}
									onKeyDown={(e) => {
										if (e.key === "Enter" || e.key === " ") {
											e.preventDefault();
											setShowAfter((v) => !v);
										}
									}}
									role="button"
									tabIndex={0}
									aria-pressed={isAfter}
									aria-label={section.flipHint ?? "Toggle before / after"}
									className={`relative w-full cursor-pointer overflow-hidden select-none rounded-[20px] p-8 sm:p-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
										isBefore
											? "bg-paper hairline card-shadow"
											: "ink-panel card-shadow"
									}`}
                                >
                                    
									<span
										aria-hidden
										className={`absolute z-0 -right-8 -bottom-24 mdi text-[16rem] ${
											isBefore
												? "mdi-alert-circle text-amber-200/10"
												: "mdi-mower text-green-50/10"
										}`}
									/>
									<div className="flex flex-col">
										<div className="flex items-center justify-between gap-4">
											<span
												className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] ${
													isBefore
														? "bg-accent/15 text-accent-700"
														: "bg-primary/20 text-primary-200"
												}`}
											>
												<span
													className={`mdi ${
														isBefore
															? "mdi-alert-circle-outline"
															: "mdi-check-circle-outline"
													} text-sm`}
												/>
												{active?.label ?? (isBefore ? "BEFORE" : "AFTER")}
											</span>
											<span
												aria-hidden
												className={`mdi text-2xl ${
													isBefore
														? "mdi-alert-circle text-yellow-500/60"
														: "mdi-mower text-surface-300/70"
												}`}
											/>
										</div>

										{active?.tagline && (
											<p
												className={`mt-5 text-sm font-medium ${
													isBefore
														? "text-on-surface/50"
														: "text-surface/60"
												}`}
											>
												{active.tagline}
											</p>
										)}

										<ul className="mt-6 flex flex-col gap-3.5">
											{list.map((item, index) => (
												<li
													key={index}
													className={`flex items-start gap-3 rounded-xl px-4 py-3 text-sm leading-snug ${
														isBefore
															? "bg-accent-50/70 text-ink/80"
															: "bg-surface/[0.06] text-surface/85 hairline-dark"
													}`}
												>
													<span
														className={`mdi ${
															isBefore
																? "mdi-close-thick text-accent-600"
																: "mdi-check-bold text-primary-300"
														} text-base shrink-0 mt-0.5`}
													/>
													{item}
												</li>
											))}
										</ul>

										<span
											aria-hidden
											className={`mt-auto pt-6 text-[11px] font-semibold uppercase tracking-[0.22em] ${
												isBefore
													? "text-on-surface/30"
													: "text-primary-200/70"
											}`}
										>
											{active?.label ?? (isBefore ? "BEFORE" : "AFTER")} ·{" "}
											{String(list.length).padStart(2, "0")}
										</span>
									</div>
								</motion.div>
							</AnimatePresence>
						</div>

						{section.flipHint && (
							<p className="mt-8 flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-on-surface/40">
								<span className="mdi mdi-swap-horizontal text-base" />
								{section.flipHint}
							</p>
						)}
					</div>
				</FadeUp>
			</div>
		</section>
	);
}

export default GprBeforeAfterSection;
