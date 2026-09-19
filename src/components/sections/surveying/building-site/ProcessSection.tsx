import { useTranslation } from "@/hooks";
import { Process } from "@/components/sections/shared";
import type { ReactElement } from "react";

interface ProcessContent {
	tag?: string | null;
	headline: string;
	image?: string | null;
	steps: { label: string; description: string; icon?: string | null }[];
}

interface ProcessSectionProps {
	/** Locale key suffix (legacy lookup). Unused when `data` is provided. */
	sectionKey?: string;
	data?: ProcessContent | null;
	id?: string;
}

/**
 * Land surveying process — grid of steps (content:
 * surveying/building-site-surveys:process). M11: additive `data` prop for
 * Keystatic-owned content (omitted = legacy `t()`).
 */
export function ProcessSection({ sectionKey, data, id }: ProcessSectionProps): ReactElement | null {
	const { t } = useTranslation(["surveying/building-site-surveys"]);
	const legacy = sectionKey
		? (t(`surveying/building-site-surveys:${sectionKey}`, {
				returnObjects: true,
			}) as unknown as ProcessContent)
		: null;
	const section = (data ?? legacy) as ProcessContent | null;
	const steps = Array.isArray(section?.steps) ? section.steps : [];

	if (steps.length === 0) return null;

	const items = steps.map((step) => ({ title: step.label, description: step.description }));

	return (
		<Process
			id={id}
			tag={section?.tag}
			headline={section?.headline}
			items={items}
			layout="grid"
			columns={3}
			tone="surface"
		/>
	);
}

export default ProcessSection;