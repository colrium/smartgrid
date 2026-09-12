import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { IntroTextSection } from "@/components/sections/shared";

interface OverviewContent {
	tag?: string | null;
	headline: string;
	description?: string;
}

export function OverviewSection(): ReactElement {
	const { t } = useTranslation(["civil/highway-surveys"]);
	const section = t("civil/highway-surveys:overview", {
		returnObjects: true,
	}) as unknown as OverviewContent;

	return (
		<IntroTextSection
			tag={section.tag}
			headline={section.headline}
			description={section.description}
			tone="surface"
		/>
	);
}

export default OverviewSection;