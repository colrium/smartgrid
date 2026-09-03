"use client";

import { useState, type ReactElement } from "react";
import { AnimatePresence, motion } from "framer-motion";

export interface FlipSide {
	label?: string;
	tagline?: string | null;
	items?: string[] | null;
}

interface BeforeAfterFlipCardProps {
	before: FlipSide;
	after: FlipSide;
	flipHint?: string | null;
	/** Unique layoutId for the toggle pill animation (per page to avoid clashes). */
	layoutId?: string;
	/** MDI icon name for the "AFTER" watermark + corner glyph (e.g. "map-check", "mower", "ferry"). */
	afterIcon?: string;
	/** MDI icon name for the "BEFORE" watermark glyph (defaults to "alert-circle"). */
	beforeIcon?: string;
	/** Tailwind classes for the "AFTER" watermark glyph. */
	afterWatermarkClass?: string;
	/** Tailwind classes for the "AFTER" corner glyph. */
	afterCornerClass?: string;
}

export function BeforeAfterFlipCard({
	before,
	after,
	flipHint,
	layoutId = "before-after-toggle",
	afterIcon = "check-circle",
	beforeIcon = "alert-circle",
    afterCornerClass = "text-success-700/70",
    afterWatermarkClass
}: BeforeAfterFlipCardProps): ReactElement {
	const [showAfter, setShowAfter] = useState(false);

	const sides: Array<{ key: "before" | "after"; side: FlipSide }> = [
		{ key: "before", side: before },
		{ key: "after", side: after },
	];
	const active = showAfter ? after : before;
	const isAfter = showAfter;
	const list = Array.isArray(active?.items) ? active.items : [];
	const isBefore = !isAfter;

	return (
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
										? "text-success-700"
										: "text-warning-700"
									: "text-on-surface/45"
							}
                                    ${
										key === "after"
											? " hover:text-success-700"
											: " hover:text-warning-700"
									}`}
						>
							{isActive && (
								<motion.span
									layoutId={layoutId}
									transition={{
										duration: 0.35,
										ease: [0.16, 1, 0.3, 1],
									}}
									className={`absolute inset-0 rounded-full ${isAfter ? "bg-success-100" : "bg-yellow-100"}`}
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
						aria-label={flipHint ?? "Toggle before / after"}
						className={`relative w-full cursor-pointer overflow-hidden select-none rounded-c p-8 sm:p-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background bg-surface`}
					>
						<span
							aria-hidden
							className={`absolute z-0 -right-8 -bottom-24 mdi text-[16rem] ${
								isBefore
									? `mdi-${beforeIcon} text-warning-200/10`
									: `mdi-${afterIcon}  text-success-300/10 ${afterWatermarkClass ?? ""}`
							}
							}`}
						/>
						<div className="flex flex-col">
							<div className="flex items-center justify-between gap-4">
								<span
									className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] ${
										isBefore
											? "bg-warning-300/15 text-warning-700"
											: "bg-success-300/20 text-success-700"
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
								<div className={`w-12 h-12 ${isBefore? "bg-warning-300/20" : "bg-success-300/20"} p-2 rounded-full flex items-center justify-center`}>
									<span
										aria-hidden
										className={`mdi text-2xl ${
											isBefore
												? "mdi-alert-circle text-warning-700"
												: `mdi-${afterIcon} text-success-700 ${afterCornerClass}`
										}`}
									/>
								</div>
							</div>

							{active?.tagline && (
								<p className={`mt-5 text-sm font-medium text-ink/80`}>
									{active.tagline}
								</p>
							)}

							<ul className="mt-6 flex flex-col gap-3.5">
								{list.map((item, index) => (
									<li
										key={index}
										className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm leading-snug ${
											isBefore
												? "bg-warning-50/70 text-ink/80"
												: "bg-success-100/70 text-ink "
										}`}
									>
										<span
											className={`mdi ${
												isBefore
													? "mdi-alert-circle text-warning-600"
													: "mdi-check-bold text-success-300"
											} text-base shrink-0 mt-0.5`}
										/>
										{item}
									</li>
								))}
							</ul>

							<span
								aria-hidden
								className={`mt-auto pt-6 text-[11px] font-semibold uppercase tracking-[0.22em] ${
									isBefore ? "text-warning-700" : "text-success-700"
								}`}
							>
								{active?.label ?? (isBefore ? "BEFORE" : "AFTER")} ·{" "}
								{String(list.length).padStart(2, "0")}
							</span>
						</div>
					</motion.div>
				</AnimatePresence>
			</div>

			{flipHint && (
				<p className="mt-8 flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-on-surface/40">
					<span className="mdi mdi-swap-horizontal text-base" />
					{flipHint}
				</p>
			)}
		</div>
	);
}

export default BeforeAfterFlipCard;
