import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { Faq as SharedFaq } from "@/components/sections/shared";
import type { FaqSectionItem } from "@/components/sections/FaqSectionItems";

interface FaqCta {
	label: string;
	href: string;
	icon?: string;
}

interface FaqContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items?: FaqSectionItem[];
	stillCurious?: {
		label?: string;
		description?: string;
		cta?: FaqCta;
	};
}

export function FaqSection(): ReactElement | null {
	const { t } = useTranslation(["common"]);
	const content = t("common:faq", {
		returnObjects: true,
	}) as unknown as FaqContent;

	const items = Array.isArray(content?.items) ? content.items : [];

	if (items.length === 0) return null;

	return (
		<SharedFaq
			tag={content.tag}
			headline={content.headline}
			description={content.description}
			items={items}
			stillCurious={content.stillCurious}
		/>
	);
}

export default FaqSection;
