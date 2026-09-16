"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { Certifications, type CertificationsProps } from "@/components/sections/shared/Certifications";

export function CertificationsSection(): ReactElement | null {
	const { t } = useTranslation(["common"]);
	const data = t("common:certifications", { returnObjects: true }) as unknown as CertificationsProps["data"];

	return <Certifications data={data} id="certifications" />;
}

export default CertificationsSection;