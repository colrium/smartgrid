"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { Stats } from "@/components/sections/shared/Stats";

interface StatsContent {
	items?: { icon?: string | null; value?: string; label?: string }[] | null;
}

/** Company metric strip — shared ink-panel stat cards overlapping the hero
 * (content: company-profile:stats). */
export function CompanyStatsStrip(): ReactElement | null {
	const { t } = useTranslation(["company-profile"]);
	const section = t("company-profile:stats", { returnObjects: true }) as unknown as StatsContent;

	return <Stats items={section?.items ?? null} metrics={section?.items ?? null} layout="panel" />;
}

export default CompanyStatsStrip;

