"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import { Faq as SharedFaq } from "@/components/sections/shared";
import type { FaqSectionItem } from "@/components/sections/FaqSectionItems";

interface FaqCta {
	headline?: string;
	description?: string;
	label?: string;
	href?: string;
}

interface FaqsContent {
	tag?: string | null;
	headline: string;
	items: FaqSectionItem[];
	cta?: FaqCta | null;
}

export function GprFaqSection(): ReactElement | null {
	const { t } = useTranslation(["surveying/ground-penetrating-radar"]);
	const section = t("surveying/ground-penetrating-radar:faqs", {
		returnObjects: true,
	}) as unknown as FaqsContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	const stillCurious = section.cta?.href
		? {
				label: section.cta.headline ?? "",
				description: section.cta.description ?? "",
				cta: { label: section.cta.label ?? "", href: section.cta.href },
			}
		: null;

	return (
		<SharedFaq
			id="faqs"
			tag={section.tag}
			headline={section.headline}
			items={items}
			stillCurious={stillCurious}
		/>
	);
}

export default GprFaqSection;
