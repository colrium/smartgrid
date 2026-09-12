"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardGridAction, type CardItem } from "@/components/sections/shared";

const NS = "aerial-drones/monitoring-and-evaluation";

interface SmartLink {
	icon?: string;
	label: string;
	href: string;
}

interface SmartMonitoringContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items?: CardItem[] | null;
	ctaPrimary?: SmartLink | null;
	ctaSecondary?: SmartLink | null;
}

export function SmartMonitoringSection(): ReactElement | null {
	const { t } = useTranslation([NS]);
	const section = t(`${NS}:smartMonitoringAndEval`, {
		returnObjects: true,
	}) as unknown as SmartMonitoringContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	const rawActions: (CardGridAction | null)[] = [
		section?.ctaPrimary?.href ? { ...section.ctaPrimary, variant: "primary" } : null,
		section?.ctaSecondary?.href ? { ...section.ctaSecondary, variant: "surface" } : null,
	];
	const actions = rawActions.filter((action): action is CardGridAction => action !== null);

	return (
		<CardGrid
			tag={section.tag}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={4}
			tone="surface"
			card={{ iconShape: "xl", iconSize: "sm" }}
			actions={actions}
		/>
	);
}

export default SmartMonitoringSection;