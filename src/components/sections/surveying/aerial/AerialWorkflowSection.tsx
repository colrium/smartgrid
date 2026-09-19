"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import {
    WorkflowSection,
    type WorkflowCta,
    type WorkflowStep,
} from "@/components/sections/shared/WorkflowSection";

interface AerialWorkflowContent {
    tag?: string | null;
    headline: string;
    description?: string;
    outcomeLabel?: string | null;
    steps?: WorkflowStep[] | null;
    ctaNote?: string | null;
    cta?: WorkflowCta | null;
}

export function AerialWorkflowSection({ data, id }: { data?: AerialWorkflowContent | null; id?: string } = {}): ReactElement {
    const { t } = useTranslation(["surveying/aerial-surveys"]);
    // Keystatic-owned content when `data` is provided (M11 `aerialWorkflow`
    // unique section); legacy locale strings otherwise.
    const section = (data ??
        (t("surveying/aerial-surveys:workflow", {
            returnObjects: true,
        }) as unknown as AerialWorkflowContent)) as AerialWorkflowContent;

    return (
        <WorkflowSection
            tag={section.tag}
            headline={section.headline}
            description={section.description}
            steps={section.steps}
            outcome={section.outcomeLabel}
            ctaNote={section.ctaNote}
            cta={section.cta}
            id={id}
        />
    );
}

export default AerialWorkflowSection;
