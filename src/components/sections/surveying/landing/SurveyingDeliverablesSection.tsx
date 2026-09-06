"use client";

import type { ReactElement } from "react";

import { Deliverables } from "@/components/sections/Deliverables";

/**
 * Land-surveying landing deliverables - thin wrapper around the global
 * reusable <Deliverables /> explorer (content: surveying/landing:deliverables).
 */
export function SurveyingDeliverablesSection(): ReactElement {
	return <Deliverables ns="surveying/landing" className="bg-surface" />;
}

export default SurveyingDeliverablesSection;
