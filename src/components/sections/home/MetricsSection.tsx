"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { Metrics, type MetricsProps } from "@/components/sections/shared/Metrics";

export function MetricsSection(): ReactElement | null {
	const { t } = useTranslation(["home", "common"]);
	const data = t("common:metrics", { returnObjects: true }) as unknown as MetricsProps["data"];

	return <Metrics data={data} id="metrics" />;
}

export default MetricsSection;