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
	/** Keystatic-owned shape (lidCta normalize): pre-normalized href + label. */
	ctaHref?: string;
	ctaLabel?: string;
}

function normalizeHref(href?: string): string | undefined {
	if (!href) return href;
	if (/^[a-z]+:/i.test(href)) return href;
	if (href.includes("@")) return `mailto:${href}`;
	return href;
}

/**
 * LiDAR closing CTA — kept through M13 (its `normalizeHref` bare-email
 * transform is real shaping, outside the shared `ctaBand` contract) and
 * refactored per the M9 additive-`data` precedent to serve as the
 * `lidCta` unique renderer (M11 batch 19): `data` is the Keystatic-owned
 * content (with `ctaHref` already mailto-normalized by the registry
 * normalize — identical transform); omitted = legacy `t()` render.
 */
export function LidarCtaSection({ data }: { data?: LidarCtaContent | null }): ReactElement {
	const { t } = useTranslation([NS]);
	const section =
		data ??
		(t(`${NS}:ctaSection`, {
			returnObjects: true,
		}) as unknown as LidarCtaContent);
	const ctaHref = data ? (data.ctaHref ?? "") : normalizeHref(section?.ctaPrimary?.href);

	return (
		<CtaBand
			className="pb-24 sm:pb-28 relative overflow-hidden"
			tag={section?.tag ?? null}
			headline={section?.headline ?? ""}
			description={section?.description ?? null}
			primary={
				ctaHref
					? {
							label: section?.ctaLabel ?? section?.ctaPrimary?.label ?? "",
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
