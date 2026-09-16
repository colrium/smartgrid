"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { WhyChooseUs, type WhyChooseUsProps } from "@/components/sections/shared/WhyChooseUs";

export function WhyChooseUsSection(): ReactElement | null {
	const { t } = useTranslation(["common", "home"]);
	const data = t("common:whyChooseUs", { returnObjects: true }) as unknown as WhyChooseUsProps["data"];

	return <WhyChooseUs data={data} id="why-choose-us" />;
}

export default WhyChooseUsSection;