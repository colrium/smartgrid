"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import { CardGrid, type CardItem } from "@/components/sections/shared/CardGrid";

interface TalkContact {
	icon?: string | null;
	label?: string;
	note?: string | null;
	href?: string | null;
	color?: string | null;
}

interface TalkToUsContent {
	tag?: string | null;
	headline: string;
	description?: string | null;
	contacts?: TalkContact[] | null;
}

/**
 * Contact channels — shared accent card grid; each card's brand color comes
 * from the locale `color` token (content: contact:talkToUs).
 */
export function TalkToUsSection(): ReactElement | null {
	const { t } = useTranslation(["contact"]);
	const section = t("contact:talkToUs", { returnObjects: true }) as unknown as TalkToUsContent;
	const contacts = Array.isArray(section?.contacts) ? section.contacts : [];

	if (contacts.length === 0) return null;

	const items: CardItem[] = contacts.map((contact) => ({
		title: contact.label,
		description: contact.note ?? undefined,
		href: contact.href ?? null,
		icon: contact.icon ?? null,
		accent: contact.color ?? null,
	}));

	return (
		<CardGrid
			tag={section.tag ?? null}
			headline={section.headline}
			description={section.description}
			items={items}
			columns={3}
			headerRow
		/>
	);
}

export default TalkToUsSection;
