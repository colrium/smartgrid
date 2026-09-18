"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface ApplicationItem {
	icon?: string | null;
	image?: string | null;
	title?: string | null;
	description?: string | null;
}

interface ApplicationsContent {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	items?: ApplicationItem[] | null;
}

export interface BathyApplicationsData {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	items?: ApplicationItem[] | null;
}

/**
 * Bathymetric applications — shared media-top card grid with numbered glass
 * chips (content: surveying/bathymetric-surveys:applications).
 */
export function ApplicationsSection({ data, id }: { data?: BathyApplicationsData | null; id?: string } = {}): ReactElement | null {
	const { t } = useTranslation(["surveying/bathymetric-surveys"]);
	// Keystatic-owned content when `data` is provided (M11 `bathyApplications`
	// unique section); legacy locale strings otherwise. Presentation (media
	// badges) stays in the wrapper — only strings and image paths are data.
	const section = (data ??
		(t("surveying/bathymetric-surveys:applications", {
			returnObjects: true,
		}) as unknown as ApplicationsContent)) as ApplicationsContent;
	const items = (Array.isArray(section?.items) ? section.items : []) as CardItem[];

	if (items.length === 0) return null;

	return (
		<CardGrid
			id={id}
			tag={section.tag ?? null}
			headline={section.headline ?? ""}
			description={section.description ?? undefined}
			items={items}
			columns={4}
			tone="surface"
			mediaBadged
		/>
	);
}

export default ApplicationsSection;
