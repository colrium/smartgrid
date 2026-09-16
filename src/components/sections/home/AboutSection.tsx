"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { About, type AboutProps } from "@/components/sections/shared/About";

export function AboutSection(): ReactElement | null {
	const { t } = useTranslation(["common"]);
	const data = t("common:about", { returnObjects: true }) as unknown as AboutProps["data"];

	return <About data={data} id="about" />;
}

export default AboutSection;