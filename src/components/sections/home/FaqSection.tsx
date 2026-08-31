"use client";

import { useState, type ReactElement } from "react";
import Link from "next/link";

import { useTranslation } from "@/hooks";
import { SectionHeader } from "./SectionHeader";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "./decor";

interface FaqItem {
	question: string;
	answer: string;
}

interface FaqCta {
	label: string;
	href: string;
	icon?: string;
}

interface FaqContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items?: FaqItem[];
	stillCurious?: {
		label?: string;
		description?: string;
		cta?: FaqCta;
	};
}

export function FaqSection(): ReactElement | null {
	const { t } = useTranslation(["home"]);
	const content = t("home:faq", {
		returnObjects: true,
	}) as unknown as FaqContent;

	const items = Array.isArray(content?.items) ? content.items : [];
	const [openIndex, setOpenIndex] = useState<number | null>(0);

	if (items.length === 0) return null;

	return (
		<section id="faq" className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-96 h-96 bg-primary-100/50 -left-24 top-1/3" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
				{/* Sticky header + conversion card */}
				<FadeUp className="lg:col-span-5 lg:sticky lg:top-28 self-start">
					<div className="flex flex-col gap-8">
						<SectionHeader
							tag={(content.tag || undefined) as string | undefined}
							headline={content.headline}
							description={(content.description || undefined) as string | undefined}
						/>

						{content.stillCurious?.cta?.href && (
							<div className="relative rounded-[20px] ink-panel card-shadow overflow-hidden p-7">
								<span
									aria-hidden
									className={`mdi mdi-${
										content.stillCurious.cta.icon || "forum"
									} absolute -right-4 -bottom-6 text-[7rem] leading-none text-surface/[0.06] select-none pointer-events-none`}
								/>
								<p className="relative text-lg font-medium tracking-tight text-surface">
									{content.stillCurious.label}
								</p>
								<p className="relative mt-1 text-sm text-surface/60 leading-relaxed">
									{content.stillCurious.description}
								</p>
								<Link
									href={content.stillCurious.cta.href}
									className="group relative mt-5 inline-flex items-center gap-2.5 h-12 rounded-full bg-surface px-6 text-ink text-sm font-medium transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:card-shadow-lift"
								>
									<span className="h-1.5 w-1.5 rounded-full bg-primary transition-transform duration-300 group-hover:scale-125" />
									{content.stillCurious.cta.label}
									{content.stillCurious.cta.icon && (
										<span
											className={`mdi mdi-${content.stillCurious.cta.icon} text-lg transition-transform duration-300 group-hover:translate-x-1`}
										/>
									)}
								</Link>
							</div>
						)}
					</div>
				</FadeUp>

				{/* Accordion */}
				<div className="lg:col-span-7">
					<ul className="flex flex-col">
						{items.map((item, index) => {
							const isOpen = openIndex === index;
							return (
								<li key={item.question} className="border-t border-ink/10 last:border-b">
									<button
										type="button"
										aria-expanded={isOpen}
										onClick={() => setOpenIndex(isOpen ? null : index)}
										className="group flex w-full items-start justify-between gap-6 py-6 text-left"
									>
										<span className="flex items-start gap-4">
											<span className="pt-1 text-sm font-semibold tabular-nums tracking-[0.14em] text-primary">
												{String(index + 1).padStart(2, "0")}
											</span>
											<span
												className={`text-lg sm:text-xl font-medium tracking-tight leading-snug transition-colors duration-300 ${
													isOpen ? "text-primary" : "text-ink group-hover:text-primary"
												}`}
											>
												{item.question}
											</span>
										</span>
										<span
											className={`mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
												isOpen
													? "bg-primary text-surface rotate-180"
													: "hairline text-primary group-hover:border-primary"
											}`}
										>
											<span className="mdi mdi-chevron-down text-xl" />
										</span>
									</button>
									<div
										className={`grid transition-[grid-template-rows] duration-500 ease-out ${
											isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
										}`}
									>
										<div className="overflow-hidden">
											<p className="pb-7 pl-9 pr-4 sm:pl-11 text-sm sm:text-[15px] text-on-surface/60 leading-relaxed">
												{item.answer}
											</p>
										</div>
									</div>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
		</section>
	);
}

export default FaqSection;