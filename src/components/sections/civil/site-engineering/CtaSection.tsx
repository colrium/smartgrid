import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CtaBand } from "@/components/sections/shared";

interface CtaContent {
	tag?: string | null;
	headline: string;
	description?: string;
	ctaPrimary?: { icon?: string; label: string; href: string } | null;
}

export function CtaSection(): ReactElement {
	const { t } = useTranslation(["civil/site-engineering"]);
	const section = t("civil/site-engineering:cta", {
		returnObjects: true,
	}) as unknown as CtaContent;

	return (
		<CtaBand
			tag={section.tag}
			headline={section.headline}
			description={section.description}
			primary={
				section.ctaPrimary
					? {
							label: section.ctaPrimary.label,
							href: section.ctaPrimary.href,
							icon: section.ctaPrimary.icon ?? null,
						}
					: null
			}
		/>
	);
}

export default CtaSection;