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

export function ResourceMappingWorkflowSection({ data, id }: { data?: WorkflowSectionProps | null; id?: string } = {}): ReactElement {
    const { t } = useTranslation(["surveying/resource-mapping"]);
    // Keystatic-owned content when `data` is provided (M11 `rmWorkflow`
    // unique section); legacy locale strings otherwise. The domain
    // PHASE_STYLE_OVERRIDES stay hardcoded in the wrapper.
    const section = (data ??
        (t("surveying/resource-mapping:resourceMappingWorkflow", {
            returnObjects: true,
        }) as unknown as WorkflowSectionProps)) as WorkflowSectionProps;

    return <WorkflowSection {...section} phaseStyles={PHASE_STYLE_OVERRIDES} id={id} />;
}

export default ResourceMappingWorkflowSection;
