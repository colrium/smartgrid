"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { SplitMedia } from "@/components/sections/shared/SplitMedia";

interface AboutContent {
	tag?: string | null;
	headline: string;
	image?: string | null;
	description?: string | null;
	points?: string[] | null;
}

/**
 * Company about — shared split-media section; the check-bullet points render
 * under the framed image (content: company-profile:about).
 */
export function CompanyAboutSection(): ReactElement | null {
	const { t } = useTranslation(["company-profile"]);
	const section = t("company-profile:about", { returnObjects: true }) as unknown as AboutContent;

	if (!section?.headline) return null;

	return (
		<SplitMedia
			data={{
				tag: section.tag ?? null,
				headline: section.headline,
				description: section.description ?? null,
				image: section.image ?? null,
				points: section.points ?? null,
			}}
			imagePosition="right"
			mediaAspect="aspect-square"
			classes={{
				mediaWrapper: "bg-transparent p-8",
				mediaCard: "bg-surface shadow-none! border-0! bg-transparent",
			}}
		/>
	);
}

export default CompanyAboutSection;

