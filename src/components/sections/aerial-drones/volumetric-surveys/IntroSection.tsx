"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { IntroTextSection, type IntroTextCta } from "@/components/sections/shared";

const NS = "aerial-drones/volumetric-surveys";

interface IntroContent {
	tag?: string | null;
	headline: string;
	description?: string;
	ctaPrimary?: IntroTextCta | null;
}

export function IntroSection(): ReactElement {
	const { t } = useTranslation([NS]);
	const section = t(`${NS}:intro`, {
		returnObjects: true,
	}) as unknown as IntroContent;

	return (
		<IntroTextSection
			tone="surface"
			align="center"
			tag={section?.tag ?? null}
			headline={section?.headline ?? ""}
			description={section?.description ?? null}
			cta={
				section?.ctaPrimary?.href
					? {
							label: section.ctaPrimary.label,
							href: section.ctaPrimary.href,
							icon: section.ctaPrimary.icon,
						}
					: null
			}
		/>
	);
}

export default IntroSection;