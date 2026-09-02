"use client";

import type { ReactElement } from "react";

import { Deliverables } from "@/components/sections/Deliverables";

/**
 * GPR deliverables — thin wrapper around the global reusable <Deliverables />
 * explorer (content: ground-penetrating-radar:deliverables).
 */
export function GprDeliverablesSection(): ReactElement {
	return (
		<Deliverables
			ns="surveying/ground-penetrating-radar"
			id="deliverables"
			className="bg-surface scroll-mt-36"
		/>
	);
}

export default GprDeliverablesSection;
