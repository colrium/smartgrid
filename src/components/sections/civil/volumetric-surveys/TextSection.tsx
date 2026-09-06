"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { IntroTextSection } from "@/components/sections/shared";

interface TextSectionContent {
	tag?: string | null;
	headline: string;
	description?: string;
}

interface TextSectionProps {
	sectionKey: string;
	tone?: "default" | "surface";
}

export function TextSection({ sectionKey, tone = "default" }: TextSectionProps): ReactElement {
	const { t } = useTranslation(["civil/volumetric-surveys"]);
	const section = t(`civil/volumetric-surveys:${sectionKey}`, {
		returnObjects: true,
	}) as unknown as TextSectionContent;

	return (
		<IntroTextSection
			tone={tone}
			tag={section?.tag}
			headline={section?.headline}
			description={section?.description}
		/>
	);
}

export default TextSection;
