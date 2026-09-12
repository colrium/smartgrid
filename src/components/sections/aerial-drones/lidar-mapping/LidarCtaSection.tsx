"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CtaBand } from "@/components/sections/shared";

const NS = "aerial-drones/lidar-mapping";

interface LidarCtaLink {
	label: string;
	href: string;
}

interface LidarCtaContent {
	tag?: string | null;
	headline: string;
	description?: string;
	ctaPrimary?: LidarCtaLink | null;
}

function normalizeHref(href?: string): string | undefined {
	if (!href) return href;
	if (/^[a-z]+:/i.test(href)) return href;
	if (href.includes("@")) return `mailto:${href}`;
	return href;
}

export function LidarCtaSection(): ReactElement {
	const { t } = useTranslation([NS]);
	const section = t(`${NS}:ctaSection`, {
		returnObjects: true,
	}) as unknown as LidarCtaContent;
	const ctaHref = normalizeHref(section?.ctaPrimary?.href);

	return (
		<CtaBand
			className="pb-24 sm:pb-28 relative overflow-hidden"
			tag={section?.tag ?? null}
			headline={section?.headline ?? ""}
			description={section?.description ?? null}
			primary={
				ctaHref
					? {
							label: section?.ctaPrimary?.label ?? "",
							href: ctaHref,
							icon: "email-outline",
							iconPosition: "end",
						}
					: null
			}
		/>
	);
}

export default LidarCtaSection;