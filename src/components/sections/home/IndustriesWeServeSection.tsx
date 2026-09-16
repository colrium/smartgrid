"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { IndustriesWeServe, type IndustriesWeServeProps } from "@/components/sections/shared/IndustriesWeServe";

export function IndustriesWeServeSection(): ReactElement | null {
	const { t } = useTranslation(["common"]);
	const data = t("common:industriesWeServe", { returnObjects: true }) as unknown as IndustriesWeServeProps["data"];

	return <IndustriesWeServe data={data} id="industries-we-serve" />;
}

export default IndustriesWeServeSection;