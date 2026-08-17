"use client";

import { useState } from "react";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";
import { SectionTag } from "@/components/SectionTag";

interface FaqItem {
	icon?: string;
	title: string;
	description: string;
}

interface FaqContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: FaqItem[];
}

export function FaqSection() {
	const { t } = useTranslation(["civil-site-setting-out"]);
	const section = t("civil-site-setting-out:faq", {
		returnObjects: true,
	}) as unknown as FaqContent;
	const [openIndex, setOpenIndex] = useState<number | null>(0);
	const items = Array.isArray(section.items) ? section.items : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-[26rem] h-[26rem] bg-brand-100/60 -top-20 right-0" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<div className="max-w-3xl mx-auto text-center">
					{section.tag && <SectionTag>{section.tag}</SectionTag>}

					<h2 className="mt-5 font-light tracking-tight leading-[1.08] text-3xl sm:text-4xl lg:text-[2.85rem] text-ink">
						{section.headline}
					</h2>
				</div>

				<FadeUp className="mt-14 sm:mt-20 max-w-4xl mx-auto">
					<div className="rounded-[20px] bg-surface hairline card-shadow overflow-hidden">
						{items.map((item, index) => {
							const isOpen = openIndex === index;
							return (
								<div key={index} className={index > 0 ? "border-t border-ink/10" : ""}>
									<button
										type="button"
										onClick={() => setOpenIndex(isOpen ? null : index)}
										className="w-full flex items-center justify-between gap-6 py-6 px-6 sm:px-8 text-left cursor-pointer"
									>
										<span className="flex items-center gap-3 sm:gap-4">
											{item.icon && (
												<span className="hidden sm:inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-primary">
													<span className={`mdi mdi-${item.icon} text-xl`} />
												</span>
											)}

											<span
												className={`text-sm sm:text-base font-medium leading-snug transition-colors duration-300 ${
													isOpen ? "text-primary" : "text-ink"
												}`}
											>
												{item.title}
											</span>
										</span>

										<span
											className={`w-8 h-8 shrink-0 rounded-full border flex items-center justify-center transition-all duration-300 ${
												isOpen
													? "border-primary bg-primary text-surface rotate-45"
													: "border-ink/15 text-primary"
											}`}
										>
											<span className="mdi mdi-plus text-lg leading-none" />
										</span>
									</button>

									<div
										className={`grid transition-all duration-500 ease-out ${
											isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
										}`}
									>
										<div className="overflow-hidden">
											<div className="px-6 sm:px-8 pb-8">
												<p className="text-sm sm:text-[15px] text-on-surface/60 leading-relaxed whitespace-pre-line">
													{item.description}
												</p>
											</div>
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</FadeUp>
			</div>
		</section>
	);
}

export default FaqSection;