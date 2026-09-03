"use client";

import type { ReactElement } from "react";

import { Deliverables } from "@/components/sections/Deliverables";

/**
 * Resource Mapping deliverables — thin wrapper around the global
 * reusable <Deliverables /> explorer (content: surveying/resource-mapping:deliverables).
 */
export function ResourceMappingDeliverablesSection(): ReactElement {
	return <Deliverables ns="surveying/resource-mapping" className="bg-surface" />;
}

export default ResourceMappingDeliverablesSection;