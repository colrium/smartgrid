"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import {
	WorkflowSection,
	type WorkflowPhaseStyles,
	type WorkflowSectionProps,
} from "@/components/sections/shared/WorkflowSection";

/** Domain-specific chip styling preserved from the original section. */
const PHASE_STYLES: WorkflowPhaseStyles = {
	FIELD: {
		chip: "border-primary/30 bg-primary-50 text-primary-700",
		icon: "map-marker-radius",
	},
	OFFICE: {
		chip: "border-accent/30 bg-accent-50 text-accent-700",
		icon: "desktop-mac-dashboard",
	},
	REGISTRY: {
		chip: "border-whatsapp/30 bg-whatsapp/10 text-green-700",
		icon: "office-building-marker",
	},
};

export function ProcessSection(): ReactElement | null {
	const { t } = useTranslation(["surveying/sectional-properties"]);
	const section = t("surveying/sectional-properties:process", {
		returnObjects: true,
	}) as unknown as WorkflowSectionProps;

	if (!Array.isArray(section?.steps) || section.steps.length === 0) return null;

	return <WorkflowSection {...section} phaseStyles={PHASE_STYLES} />;
}

export default ProcessSection;
