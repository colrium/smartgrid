"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { PlanningInfographic, type PlanningInfographicProps } from "@/components/sections/shared/PlanningInfographic";

export function PlanningInfographicSection(): ReactElement | null {
	const { t } = useTranslation(["home", "common"]);
	const data = t("common:planningInfographic", { returnObjects: true }) as unknown as PlanningInfographicProps["data"];

	return <PlanningInfographic data={data} />;
}

export default PlanningInfographicSection;