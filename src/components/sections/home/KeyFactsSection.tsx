"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { KeyFacts, type KeyFactsProps } from "@/components/sections/shared/KeyFacts";

export function KeyFactsSection(): ReactElement | null {
	const { t } = useTranslation(["home", "common"]);
	const data = t("common:keyFacts", { returnObjects: true }) as unknown as KeyFactsProps["data"];

	return <KeyFacts data={data} id="key-facts" />;
}

export default KeyFactsSection;