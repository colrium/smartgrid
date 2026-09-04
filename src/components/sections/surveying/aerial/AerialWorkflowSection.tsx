"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import {
    WorkflowSection,
    type WorkflowCta,
    type WorkflowStep,
} from "@/components/sections/WorkflowSection";

interface AerialWorkflowContent {
    tag?: string | null;
    headline: string;
    description?: string;
    outcomeLabel?: string | null;
    steps?: WorkflowStep[] | null;
    ctaNote?: string | null;
    cta?: WorkflowCta | null;
}

export function AerialWorkflowSection(): ReactElement {
    const { t } = useTranslation(["surveying/aerial-surveys"]);
    const section = t("surveying/aerial-surveys:workflow", {
        returnObjects: true,
    }) as unknown as AerialWorkflowContent;

    return (
        <WorkflowSection
            tag={section.tag}
            headline={section.headline}
            description={section.description}
            steps={section.steps}
            outcome={section.outcomeLabel}
            ctaNote={section.ctaNote}
            cta={section.cta}
        />
    );
}

export default AerialWorkflowSection;
