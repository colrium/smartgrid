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

	const actions: CardGridAction[] = [];
	if (section?.ctaPrimary?.href) {
		actions.push({
			label: section.ctaPrimary.label,
			href: section.ctaPrimary.href,
			icon: section.ctaPrimary.icon ?? null,
			variant: "primary",
		});
	}
	if (section?.ctaSecondary?.href) {
		actions.push({
			label: section.ctaSecondary.label,
			href: section.ctaSecondary.href,
			icon: section.ctaSecondary.icon ?? null,
			variant: "surface",
		});
	}

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