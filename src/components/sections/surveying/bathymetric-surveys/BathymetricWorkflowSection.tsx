"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import {
    WorkflowSection,
    type WorkflowSectionProps,
} from "@/components/sections/shared/WorkflowSection";

export function BathymetricWorkflowSection({ data, id }: { data?: WorkflowSectionProps | null; id?: string } = {}): ReactElement {
    const { t } = useTranslation(["surveying/bathymetric-surveys"]);
    // Keystatic-owned content when `data` is provided (M11 `bathyWorkflow`
    // unique section); legacy locale strings otherwise.
    const section = (data ??
        (t("surveying/bathymetric-surveys:bathymetricWorkflow", {
            returnObjects: true,
        }) as unknown as WorkflowSectionProps)) as WorkflowSectionProps;

    return <WorkflowSection {...section} id={id} />;
}

export default BathymetricWorkflowSection;
