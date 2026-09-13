"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import { Faq as SharedFaq } from "@/components/sections/shared";
import type { FaqSectionItem } from "@/components/sections/FaqSectionItems";

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

export function FaqSection(): ReactElement | null {
	const { t } = useTranslation(["civil/site-setting-out"]);
	const section = t("civil/site-setting-out:faq", {
		returnObjects: true,
	}) as unknown as FaqContent;
	const items: FaqSectionItem[] = Array.isArray(section.items)
		? section.items.map((item) => ({
				question: item.title,
				answer: item.description,
				icon: item.icon,
			}))
		: [];

	if (items.length === 0) return null;

	return (
		<SharedFaq
			tag={section.tag}
			headline={section.headline}
			description={section.description ?? null}
			items={items}
		/>
	);
}

export default FaqSection;
