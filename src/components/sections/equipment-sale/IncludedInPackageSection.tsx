"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared";

interface PackageContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: { label: string; description?: string; icon?: string | null }[];
}

interface IncludedInPackageSectionProps {
	namespace: string;
}

/**
 * Included-in-package contents — shared card grid with a package fallback
 * icon for entries without one (content: `<ns>:includedInPackage`).
 */
export function IncludedInPackageSection({ namespace }: IncludedInPackageSectionProps): ReactElement | null {
	const { t } = useTranslation([namespace]);
	const section = t(`${namespace}:includedInPackage`, {
		returnObjects: true,
	}) as unknown as PackageContent;
	const items: CardItem[] = Array.isArray(section?.items)
		? section.items.map((item) => ({
				icon: item.icon ?? null,
				title: item.label,
				description: item.description,
			}))
		: [];

	if (items.length === 0) return null;

	return (
		<CardGrid
			tag={section.tag}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={3}
			fallbackIcons={["package-variant-closed"]}
		/>
	);
}

export default IncludedInPackageSection;
