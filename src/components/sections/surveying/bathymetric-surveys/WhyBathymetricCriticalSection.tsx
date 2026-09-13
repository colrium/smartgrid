"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

/**
 * Why-bathymetric-critical applications — shared check-card grid (content:
 * surveying/bathymetric-surveys:whyBathymetricCritical).
 */
export function WhyBathymetricCriticalSection(): ReactElement | null {
	const { t } = useTranslation(["surveying/bathymetric-surveys"]);
	const section = t("surveying/bathymetric-surveys:whyBathymetricCritical", {
		returnObjects: true,
	}) as unknown as { tag?: string | null; headline: string; description?: string | null; applications?: string[] | null };
	const applications = Array.isArray(section?.applications) ? section.applications : [];

	if (applications.length === 0) return null;

	const items: CardItem[] = applications.map((app) => ({ icon: "check", title: app }));

	return (
		<CardGrid
			tag={section.tag ?? null}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={3}
			tone="surface"
		/>
	);
}

export default WhyBathymetricCriticalSection;
