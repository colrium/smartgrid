"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { SurveyCost, type SurveyCostProps } from "@/components/sections/shared/SurveyCost";

export function SurveyCostSection(): ReactElement | null {
	const { t } = useTranslation(["common", "home"]);
	const data = t("common:surveyCostInKenya", { returnObjects: true }) as unknown as SurveyCostProps["data"];

	return <SurveyCost data={data} id="survey-cost" />;
}

export default SurveyCostSection;