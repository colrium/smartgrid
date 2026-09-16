"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { SurveyingInstruments, type SurveyingInstrumentsProps } from "@/components/sections/shared/SurveyingInstruments";

export function SurveyingInstrumentsSection(): ReactElement | null {
	const { t } = useTranslation(["common"]);
	const data = t("common:surveyingInstruments", { returnObjects: true }) as unknown as SurveyingInstrumentsProps["data"];

	return <SurveyingInstruments data={data} id="surveying-instruments" />;
}

export default SurveyingInstrumentsSection;