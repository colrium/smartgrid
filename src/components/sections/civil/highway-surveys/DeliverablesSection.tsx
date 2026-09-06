"use client";

import type { ReactElement } from "react";

import { Deliverables } from "@/components/sections/Deliverables";

/**
 * Highway-surveys deliverables - thin wrapper around the global
 * reusable <Deliverables /> explorer
 * (content: civil/highway-surveys:highwaySurveyDeliverables).
 */
export function DeliverablesSection(): ReactElement {
	return <Deliverables ns="civil/highway-surveys" baseKey="highwaySurveyDeliverables" />;
}

export default DeliverablesSection;
