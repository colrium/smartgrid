"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import {
    WorkflowSection,
    type WorkflowSectionProps,
} from "@/components/sections/shared/WorkflowSection";

export function BathymetricWorkflowSection(): ReactElement {
    const { t } = useTranslation(["surveying/bathymetric-surveys"]);
    const section = t("surveying/bathymetric-surveys:bathymetricWorkflow", {
        returnObjects: true,
    }) as unknown as WorkflowSectionProps;

    return <WorkflowSection {...section} />;
}

export default BathymetricWorkflowSection;
