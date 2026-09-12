import type { ReactElement, ReactNode } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared";

interface LandSurveyingItem {
	title: string;
	description: string;
}

interface LandSurveyingContent {
	tag?: string | null;
	headline: string;
	description?: string;
	itemsTitle?: string;
	items: LandSurveyingItem[];
}

function renderPrimary(text: string): ReactNode[] {
	const nodes: ReactNode[] = [];
	const parts = text.split(/(<primary>|<\/primary>)/g);
	let primary = false;
	for (const part of parts) {
		if (part === "<primary>") {
			primary = true;
			continue;
		}
		if (part === "</primary>") {
			primary = false;
			continue;
		}
		nodes.push(
			primary ? (
				<span key={nodes.length} className="text-primary font-medium">
					{part}
				</span>
			) : (
				part
			)
		);
	}
	return nodes;
}

export function LandSurveyingSection(): ReactElement | null {
	const { t } = useTranslation(["about"]);
	const section = t("about:landSurveying", {
		returnObjects: true,
	}) as unknown as LandSurveyingContent;
	const items: CardItem[] = Array.isArray(section?.items)
		? section.items.map((item) => ({
				title: item.title,
				description: item.description,
				headerIcon: "check",
			}))
		: [];

	if (items.length === 0) return null;

	return (
		<CardGrid
			tag={section.tag}
			headline={section.headline}
			description={
				section.description ? (
					<>{renderPrimary(section.description)}</>
				) : undefined
			}
			items={items}
			columns={3}
		/>
	);
}

export default LandSurveyingSection;