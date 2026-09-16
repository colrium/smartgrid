"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { Trustees, type TrusteesProps } from "@/components/sections/shared/Trustees";

export function TrusteesSection(): ReactElement | null {
	const { t } = useTranslation(["common"]);
	const data = t("common:trustees", { returnObjects: true }) as unknown as TrusteesProps["data"];

	return <Trustees data={data} id="trustees" />;
}

export default TrusteesSection;