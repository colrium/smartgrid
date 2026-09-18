import type { ReactElement, ReactNode } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared";

interface LandSurveyingItem {
	title?: string | null;
	description?: string | null;
}

interface LandSurveyingContent {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	items?: LandSurveyingItem[] | null;
}

export interface LandSurveyingData {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	items?: LandSurveyingItem[] | null;
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

export function LandSurveyingSection({ data }: { data?: LandSurveyingData | null } = {}): ReactElement | null {
	const { t } = useTranslation(["about"]);
	// Keystatic-owned content when `data` is provided (M11
	// `aboutLandSurveying` unique section); legacy `about:landSurveying`
	// locale strings otherwise. The `<primary>` pseudo-markup is parsed
	// from DATA by `renderPrimary` (page-owned wrapper). NOTE: the legacy
	// `itemsTitle` key is unrendered — intentionally not migrated.
	const section = (data ??
		(t("about:landSurveying", {
			returnObjects: true,
		}) as unknown as LandSurveyingContent)) as LandSurveyingContent;
	const items: CardItem[] = Array.isArray(section?.items)
		? section.items.map((item) => ({
				title: item.title ?? "",
				description: item.description ?? "",
				headerIcon: "check",
			}))
		: [];

	if (items.length === 0) return null;

	return (
		<CardGrid
			tag={section.tag ?? null}
			headline={section.headline ?? ""}
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