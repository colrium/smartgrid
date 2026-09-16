"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CoverageArea, type CoverageAreaProps } from "@/components/sections/shared/CoverageArea";

export function CoverageAreaSection(): ReactElement | null {
	const { t } = useTranslation(["common"]);
	const data = t("common:coverageArea", { returnObjects: true }) as unknown as CoverageAreaProps["data"];

	return <CoverageArea data={data} id="coverage-area" />;
}

export default CoverageAreaSection;