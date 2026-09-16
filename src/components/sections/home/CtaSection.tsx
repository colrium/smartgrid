"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CtaBand } from "@/components/sections/shared";

interface CtaLink {
	label: string;
	href: string;
	icon?: string;
}

export function CtaSection(): ReactElement {
	const { t } = useTranslation(["common"]);
	const primary = t("common:cta.primary", {
		returnObjects: true,
	}) as unknown as CtaLink;
	const secondary = t("common:cta.secondary", {
		returnObjects: true,
	}) as unknown as CtaLink;

	return (
		<CtaBand
			id="cta"
			className="pb-24 sm:pb-28 relative overflow-hidden"
			decor="masked"
			glyph="↗"
			tag={t("common:cta.tag")}
			headline={t("common:cta.headline")}
			description={t("common:cta.description")}
			primary={
				primary?.href
					? {
							label: primary.label,
							href: primary.href,
							icon: primary.icon,
							iconPosition: "end",
						}
					: null
			}
			secondary={
				secondary?.href
					? { label: secondary.label, href: secondary.href, icon: secondary.icon }
					: null
			}
		/>
	);
}

export default CtaSection;
