"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CtaBand } from "@/components/sections/shared";

const NS = "aerial-drones/aerial-drones-as-built-surveys";

interface CtaLink {
	label: string;
	href: string;
}

interface CtaContent {
	tag?: string | null;
	headline: string;
	description?: string;
	/** `panel` (default) renders the framed band; `bleed` the full-bleed primary section. */
	variant?: string | null;
	ctaPrimary?: CtaLink | null;
	images?: string[] | null;
}

export function CtaSection(): ReactElement {
	const { t } = useTranslation([NS]);
	const section = t(`${NS}:ctaSection`, {
		returnObjects: true,
	}) as unknown as CtaContent;
	const images = Array.isArray(section?.images) ? section.images : [];

	return (
		<CtaBand
			variant={section?.variant === "bleed" ? "bleed" : "panel"}
			images={images.length > 0 ? images : null}
			tag={section?.tag ?? null}
			headline={section?.headline ?? ""}
			description={section?.description ?? null}
			primary={
				section?.ctaPrimary?.href
					? {
							label: section.ctaPrimary.label,
							href: section.ctaPrimary.href,
							icon: "arrow-right",
							iconPosition: "end",
						}
					: null
			}
		/>
	);
}

export default CtaSection;