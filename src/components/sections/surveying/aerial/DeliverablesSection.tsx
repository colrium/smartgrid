"use client";

import type { ReactElement } from "react";

import { Deliverables } from "@/components/sections/Deliverables";

/**
 * Aerial-surveys deliverables — thin wrapper around the global
 * reusable <Deliverables /> explorer (content: aerial-surveys:deliverables).
 */
export function DeliverablesSection(): ReactElement {
	return <Deliverables ns="surveying/aerial-surveys" className="bg-surface" />;
}

export default DeliverablesSection;