"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import {
    WorkflowSection,
    type WorkflowPhaseStyles,
    type WorkflowSectionProps,
} from "@/components/sections/shared/WorkflowSection";

/** Domain-specific chip styling preserved from the original section. */
const PHASE_STYLE_OVERRIDES: WorkflowPhaseStyles = {
    ACQUISITION: {
        chip: "border-accent/30 bg-accent-50 text-accent-700",
        icon: "drone",
    },
    PROCESSING: {
        chip: "border-purple-300/60 bg-purple-50 text-purple-700",
        icon: "layers-triple",
    },
    DELIVERY: {
        chip: "border-whatsapp/30 bg-whatsapp/10 text-green-700",
        icon: "download-box",
    },
};

export function ResourceMappingWorkflowSection(): ReactElement {
    const { t } = useTranslation(["surveying/resource-mapping"]);
    const section = t("surveying/resource-mapping:resourceMappingWorkflow", {
        returnObjects: true,
    }) as unknown as WorkflowSectionProps;

    return <WorkflowSection {...section} phaseStyles={PHASE_STYLE_OVERRIDES} />;
}

export default ResourceMappingWorkflowSection;
