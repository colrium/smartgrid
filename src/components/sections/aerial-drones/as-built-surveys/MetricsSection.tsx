"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { Stats, type StatItem } from "@/components/sections/shared";

const NS = "aerial-drones/aerial-drones-as-built-surveys";

interface MetricsContent {
	items?: StatItem[] | null;
}

export function MetricsSection(): ReactElement | null {
	const { t } = useTranslation([NS]);
	const section = t(`${NS}:metrics`, {
		returnObjects: true,
	}) as unknown as MetricsContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return <Stats items={items} columns={3} />;
}

export default MetricsSection;