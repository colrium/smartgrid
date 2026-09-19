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

export function ProcessFlowSection({ data, id }: { data?: WorkflowSectionProps | null; id?: string } = {}): ReactElement {
    const { t } = useTranslation(["surveying/cadastral-surveys"]);
    // Keystatic-owned content when `data` is provided (M11 `cadastralProcess`
    // unique section); legacy locale strings otherwise. The
    // ACQUISITION phase-style override stays in the renderer.
    const section = (data ??
        (t("surveying/cadastral-surveys:process", {
            returnObjects: true,
        }) as unknown as WorkflowSectionProps)) as WorkflowSectionProps;

    return <WorkflowSection {...section} phaseStyles={PHASE_STYLE_OVERRIDES} id={id} />;
}

export default ProcessFlowSection;
