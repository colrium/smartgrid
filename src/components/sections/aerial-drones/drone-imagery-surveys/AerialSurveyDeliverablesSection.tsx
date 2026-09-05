"use client";

import type { ReactElement } from "react";

import { Deliverables } from "@/components/sections/Deliverables";

/**
 * Drone-imagery-surveys deliverables — thin wrapper around the global
 * reusable <Deliverables /> explorer
 * (content: aerial-drones/drone-imagery-surveys:aerialSurveyDeliverables).
 */
export function AerialSurveyDeliverablesSection(): ReactElement {
	return (
		<Deliverables ns="aerial-drones/drone-imagery-surveys" baseKey="aerialSurveyDeliverables" />
	);
}

export default AerialSurveyDeliverablesSection;
