"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home";

interface FaqItem {
	question: string;
	answer: string;
}

interface FaqCta {
	headline?: string;
	description?: string;
	label?: string;
	href?: string;
}

interface FaqsContent {
	tag?: string | null;
	headline: string;
	items: FaqItem[];
	cta?: FaqCta | null;
}

export function GprFaqSection() {
	const { t } = useTranslation(["surveying/ground-penetrating-radar"]);
	const section = t("surveying/ground-penetrating-radar:faqs", {
		returnObjects: true,
	}) as unknown as FaqsContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	const [open, setOpen] = useState<number | null>(0);

	if (items.length === 0) return null;

	return (
		<section id="faqs" className="scroll-mt-36 py-20 sm:py-24 relative overflow-hidden bg-surface">
			<div className="relative z-10 max-w-3xl mx-auto px-6 sm:px-8">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					align="center"
				/>

				<div className="mt-12 flex flex-col gap-3">
					{items.map((item, index) => {
						const isOpen = open === index;

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
												<span className="mdi mdi-help text-sm" />
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
											<p className="px-5 sm:px-6 pb-5 pl-[3.75rem] text-[13px] text-on-surface/60 leading-relaxed">
												{item.answer}
											</p>
										</div>
									</div>
								</article>
							</FadeUp>
						);
					})}
				</div>

				{section.cta?.href && (
					<FadeUp delay={0.1}>
						<div className="mt-14 relative rounded-[20px] ink-panel card-shadow overflow-hidden px-8 py-12 sm:px-12 text-center">
							<span className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary-300/30 blur-[90px] pointer-events-none" />
							<span className="absolute -bottom-24 -left-16 w-56 h-56 rounded-full bg-primary/30 blur-[90px] pointer-events-none" />

							<div className="relative flex flex-col items-center gap-4">
								<h3 className="font-light tracking-tight text-2xl sm:text-3xl text-white">
									{section.cta.headline}
								</h3>

								{section.cta.description && (
									<p className="text-sm text-white/65 leading-relaxed max-w-md">
										{section.cta.description}
									</p>
								)}

								<Link
									href={section.cta.href}
									className="mt-2 inline-flex items-center gap-2.5 h-12 rounded-full bg-surface px-8 text-ink text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-10px_rgba(1,55,61,0.55)]"
								>
									{section.cta.label}
									<span className="mdi mdi-arrow-right text-lg" />
								</Link>
							</div>
						</div>
					</FadeUp>
				)}
			</div>
		</section>
	);
}

export default GprFaqSection;
