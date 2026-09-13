"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import {
    WorkflowSection,
    type WorkflowPhaseStyles,
    type WorkflowSectionProps,
} from "@/components/sections/shared/WorkflowSection";

/** Domain-specific chip styling: the default ACQUISITION icon is hydrographic (boat). */
const PHASE_STYLE_OVERRIDES: WorkflowPhaseStyles = {
    ACQUISITION: {
        chip: "border-purple-300/60 bg-purple-50 text-purple-700",
        icon: "satellite-variant",
    },
};

export function ProcessFlowSection(): ReactElement {
    const { t } = useTranslation(["surveying/cadastral-surveys"]);
    const section = t("surveying/cadastral-surveys:process", {
        returnObjects: true,
    }) as unknown as WorkflowSectionProps;

    return <WorkflowSection {...section} phaseStyles={PHASE_STYLE_OVERRIDES} />;
}

export default ProcessFlowSection;
