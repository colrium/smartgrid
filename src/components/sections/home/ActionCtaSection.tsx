"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CtaBand } from "@/components/sections/shared";

interface ActionCtaLink {
	label: string;
	href: string;
	icon?: string;
}

interface ActionCtaContent {
	tag?: string | null;
	headline: string;
	description?: string;
	watermark?: string | null;
	primary?: ActionCtaLink | null;
	secondary?: ActionCtaLink | null;
}

interface ActionCtaSectionProps {
	/** Key of the content node inside the `home` namespace (e.g. "actionCtaSurveyor"). */
	contentKey: string;
	className?: string;
}

export function ActionCtaSection({
	contentKey,
	className = "",
}: ActionCtaSectionProps): ReactElement | null {
	const { t } = useTranslation(["home"]);
	const content = t(`home:${contentKey}`, {
		returnObjects: true,
	}) as unknown as ActionCtaContent;

	if (!content?.headline) return null;

	return (
		<CtaBand
			className={`relative overflow-hidden ${className}`.trim()}
			layout="split"
			shimmer
			watermark={content.watermark}
			tag={content.tag}
			headline={content.headline}
			description={content.description}
			primary={
				content.primary?.href
					? {
							label: content.primary.label,
							href: content.primary.href,
							icon: content.primary.icon,
							iconPosition: "end",
						}
					: null
			}
			secondary={
				content.secondary?.href
					? {
							label: content.secondary.label,
							href: content.secondary.href,
							icon: content.secondary.icon,
						}
					: null
			}
		/>
	);
}

export default ActionCtaSection;
