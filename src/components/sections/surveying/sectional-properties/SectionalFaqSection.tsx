"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";
import { SectionTag } from "@/components/SectionTag";
import { FaqSectionItems, type FaqSectionItem } from "@/components/sections/FaqSectionItems";

interface FaqItem {
	q: string;
	a: string;
	b?: string[];
}

interface FaqContent {
	tag?: string | null;
	headline: string;
	items: FaqItem[];
}

export function SectionalFaqSection(): ReactElement {
	const { t } = useTranslation(["surveying/sectional-properties"]);
	const section = t("surveying/sectional-properties:faq", {
		returnObjects: true,
	}) as unknown as FaqContent;
	const items: FaqSectionItem[] = Array.isArray(section.items)
		? section.items.map((item) => ({
				question: item.q,
				answer: item.a,
				points: Array.isArray(item.b) ? item.b : undefined,
			}))
		: [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-[26rem] h-[26rem] bg-primary-100/60 -top-20 right-0" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<div className="max-w-3xl mx-auto text-center">
					{section.tag && <SectionTag>{section.tag}</SectionTag>}
					<h2 className="mt-5 font-light tracking-tight leading-[1.08] text-3xl sm:text-4xl lg:text-[2.85rem] text-ink">
						{section.headline}
					</h2>
				</div>

				<FadeUp className="mt-14 sm:mt-20 max-w-4xl mx-auto">
					<FaqSectionItems items={items} />
				</FadeUp>
			</div>
		</section>
	);
}

export default SectionalFaqSection;