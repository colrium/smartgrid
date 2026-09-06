"use client";

import type { ReactElement } from "react";

import { Deliverables } from "@/components/sections/Deliverables";

/**
 * Bathymetric Surveys deliverables - thin wrapper around the global
 * reusable <Deliverables /> explorer (content: surveying/bathymetric-surveys:deliverables).
 */
export function BathymetricDeliverablesSection(): ReactElement {
	return <Deliverables ns="surveying/bathymetric-surveys" className="bg-surface" />;
}

export default BathymetricDeliverablesSection;