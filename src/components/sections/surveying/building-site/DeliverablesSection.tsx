"use client";

import type { ReactElement } from "react";

import { Deliverables } from "@/components/sections/Deliverables";

/**
 * Building-site-surveys deliverables — thin wrapper around the global
 * reusable <Deliverables /> explorer (content: building-site-surveys:deliverables).
 */
export function DeliverablesSection(): ReactElement {
	return <Deliverables ns="surveying/building-site-surveys" />;
}

export default DeliverablesSection;
