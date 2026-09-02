"use client";

import type { ReactElement } from "react";

import { Deliverables } from "@/components/sections/Deliverables";

/**
 * Sectional-properties deliverables — thin wrapper around the global
 * reusable <Deliverables /> explorer (content: sectional-properties:deliverables).
 */
export function SectionalDeliverablesSection(): ReactElement {
	return <Deliverables ns="surveying/sectional-properties" className="bg-surface" />;
}

export default SectionalDeliverablesSection;