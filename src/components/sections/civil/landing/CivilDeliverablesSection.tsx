"use client";

import type { ReactElement } from "react";

import { Deliverables } from "@/components/sections/Deliverables";

/**
 * Civil-engineering landing deliverables — thin wrapper around the global
 * reusable <Deliverables /> explorer (content: civil/landing:deliverables).
 */
export function CivilDeliverablesSection(): ReactElement {
	return <Deliverables ns="civil/landing" className="bg-surface" />;
}

export default CivilDeliverablesSection;
