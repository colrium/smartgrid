import { useTranslation } from "@/hooks";
import { Process } from "@/components/sections/shared";
import type { ReactElement } from "react";

interface ProcessContent {
	tag?: string | null;
	headline: string;
	items: { label: string; description: string }[];
}

export function ProcessSection(): ReactElement | null {
	const { t } = useTranslation(["surveying/building-site-surveys"]);
	const section = t("surveying/building-site-surveys:process", {
		returnObjects: true,
	}) as unknown as ProcessContent;
	const steps = Array.isArray(section?.items) ? section.items : [];

	if (steps.length === 0) return null;

	const items = steps.map((step) => ({ title: step.label, description: step.description }));

	return (
		<Process
			tag={section.tag}
			headline={section.headline}
			items={items}
			layout="grid"
			columns={3}
			tone="surface"
		/>
	);
}

export default ProcessSection;