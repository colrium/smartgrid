"use client";

import { useState, type ReactElement } from "react";
import { FadeUp } from "@/components/animations/Fade";

export interface FaqSectionItem {
	question: string;
	answer: string;
	/** Optional MDI icon name for the item badge (defaults to "help"). */
	icon?: string;
	/** Optional bullet points rendered as a check-list under the answer. */
	points?: string[];
}

export interface FaqSectionItemsProps {
	items: FaqSectionItem[];
	/** Item expanded on first render; null starts fully collapsed. Defaults to 0. */
	defaultOpenIndex?: number | null;
	className?: string;
}

/**
 * Builds FAQPage JSON-LD structured data for the given FAQ items.
 * Render it inside `<NextHead>` via an `application/ld+json` script tag.
 */
export function buildFaqSchema(items: FaqSectionItem[]): Record<string, unknown> {
	return {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: items.map((item) => ({
			"@type": "Question",
			name: item.question,
			acceptedAnswer: { "@type": "Answer", text: item.answer },
		})),
	};
}

/**
 * Reusable FAQ accordion list (extracted from GprFaqSection).
 * Renders one rounded card per item with a help-icon badge, chevron toggle,
 * and a grid-rows expand/collapse animation with staggered fade-up reveals.
 */
export function FaqSectionItems({
	items,
	defaultOpenIndex = 0,
	className = "",
}: FaqSectionItemsProps): ReactElement | null {
	const [open, setOpen] = useState<number | null>(defaultOpenIndex);

	if (items.length === 0) return null;

	return (
		<div className={`flex flex-col gap-3 ${className}`.trim()}>
			{items.map((item, index) => {
				const isOpen = open === index;
				const hasPoints = Array.isArray(item.points) && item.points.length > 0;

				return (
					<FadeUp key={index} delay={index * 0.04}>
						<article className="rounded-[16px] bg-surface hairline card-shadow overflow-hidden transition-all duration-300 hover:border-primary/40">
							<button
								type="button"
								onClick={() => setOpen(isOpen ? null : index)}
								aria-expanded={isOpen}
								className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4 text-left cursor-pointer"
							>
								<span className="flex items-center gap-3.5">
									<span
										className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
											isOpen ? "bg-primary text-surface" : "bg-primary-50 text-primary"
										}`}
									>
										<span className={`mdi mdi-${item.icon || "help"} text-sm`} />
									</span>
									<span className="text-sm font-semibold text-ink leading-snug">
										{item.question}
									</span>
								</span>
								<span
									className={`mdi ${
										isOpen ? "mdi-chevron-up" : "mdi-chevron-down"
									} text-xl text-on-surface/40 shrink-0 transition-transform duration-300`}
								/>
							</button>

							<div
								className={`grid transition-all duration-300 ease-out ${
									isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
								}`}
							>
								<div className="overflow-hidden">
									<p
										className={`px-5 sm:px-6 ${hasPoints ? "pb-3" : "pb-5"} pl-[3.75rem] text-[13px] text-on-surface/60 leading-relaxed whitespace-pre-line`}
									>
										{item.answer}
									</p>

									{Array.isArray(item.points) && item.points.length > 0 && (
										<ul className="px-5 sm:px-6 pb-5 pl-[3.75rem] space-y-2.5">
											{item.points.map((point, i) => (
												<li
													key={i}
													className="flex items-start gap-2.5 text-[13px] text-on-surface/70 leading-relaxed"
												>
													<span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary">
														<span className="mdi mdi-check text-xs" />
													</span>
													{point}
												</li>
											))}
										</ul>
									)}
								</div>
							</div>
						</article>
					</FadeUp>
				);
			})}
		</div>
	);
}

export default FaqSectionItems;
