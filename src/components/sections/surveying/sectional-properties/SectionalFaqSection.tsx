"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import { Faq as SharedFaq } from "@/components/sections/shared";
import type { FaqSectionItem } from "@/components/sections/FaqSectionItems";

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

export function SectionalFaqSection(): ReactElement | null {
	const { t } = useTranslation(["surveying/sectional-properties"]);
	const section = t("surveying/sectional-properties:faq", {
		returnObjects: true,
	}) as unknown as FaqContent;
	const items: FaqSectionItem[] = Array.isArray(section?.items)
		? section.items.map((item) => ({
				question: item.q,
				answer: item.a,
				points: Array.isArray(item.b) ? item.b : undefined,
			}))
		: [];

	if (items.length === 0) return null;

	return <SharedFaq tag={section.tag} headline={section.headline} items={items} />;
}

export default SectionalFaqSection;
