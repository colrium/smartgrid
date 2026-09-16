"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CoreExpertise, type CoreExpertiseProps } from "@/components/sections/shared/CoreExpertise";

export function CoreExpertiseSection(): ReactElement | null {
	const { t } = useTranslation(["common"]);
	const data = t("common:coreExpertise", { returnObjects: true }) as unknown as CoreExpertiseProps["data"];

	return <CoreExpertise data={data} id="core-expertise" />;
}

export default CoreExpertiseSection;