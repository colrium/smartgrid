"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CtaBand } from "@/components/sections/shared";

const NS = "aerial-drones/monitoring-and-evaluation";

interface CtaLink {
	icon?: string;
	label: string;
	href: string;
}

interface CtaContent {
	tag?: string | null;
	headline: string;
	description?: string;
	ctaPrimary?: CtaLink | null;
}

export function CtaSection(): ReactElement {
	const { t } = useTranslation([NS]);
	const section = t(`${NS}:cta`, {
		returnObjects: true,
	}) as unknown as CtaContent;

	return (
		<CtaBand
			className="pb-24 sm:pb-28 relative overflow-hidden"
			tag={section?.tag ?? null}
			headline={section?.headline ?? ""}
			description={section?.description ?? null}
			primary={
				section?.ctaPrimary?.href
					? {
							label: section.ctaPrimary.label,
							href: section.ctaPrimary.href,
							icon: section.ctaPrimary.icon ?? undefined,
							iconPosition: "end",
						}
					: null
			}
		/>
	);
}

export default CtaSection;