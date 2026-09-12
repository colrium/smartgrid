import { useTranslation } from "@/hooks";
import { Process } from "@/components/sections/shared";
import type { ReactElement } from "react";

interface ProcessContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: { title: string; description: string }[];
}

export function ProcessSection(): ReactElement | null {
	const { t } = useTranslation(["aerial-drones/agricultural-ndvi-mapping"]);
	const section = t("aerial-drones/agricultural-ndvi-mapping:process", {
		returnObjects: true,
	}) as unknown as ProcessContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<Process
			tag={section.tag}
			headline={section.headline}
			description={section.description}
			items={items}
			layout="grid"
			columns={3}
		/>
	);
}

export default ProcessSection;