"use client";

import type { ReactElement } from "react";

import { Deliverables } from "@/components/sections/Deliverables";

/**
 * Topographical-surveys "What You Get" - thin wrapper around the global
 * reusable <Deliverables /> explorer
 * (content: surveying/topographical-surveys:whatYouGet).
 */
export function WhatYouGetSection(): ReactElement {
	return <Deliverables ns="surveying/topographical-surveys" baseKey="whatYouGet" />;
}

export default WhatYouGetSection;
