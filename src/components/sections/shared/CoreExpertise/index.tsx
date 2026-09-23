"use client";

import type { ReactElement } from "react";
import { CardGrid, type CardItem, type CardGridClassesProp } from "../CardGrid";
import type { SectionHeaderClassesProp } from "../SectionHeader";

export interface CoreExpertiseItem {
	icon?: string | null;
	label: string;
	description: string;
	href?: string;
}

export interface CoreExpertiseContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items?: CoreExpertiseItem[] | null;
}

export interface CoreExpertiseClassesProp {
	section?: string;
	header?: SectionHeaderClassesProp;
	subheading?: string;
	leadGrid?: string;
	leadImage?: string;
	grid?: string;
	actions?: string;
	card?: CardGridClassesProp["sectionHeader"];
}

export interface CoreExpertiseProps {
	data: CoreExpertiseContent;
	classes?: CoreExpertiseClassesProp;
	id?: string;
	className?: string;
}

export function CoreExpertise(props: CoreExpertiseProps): ReactElement | null {
	const data = props.data;
	const items: CardItem[] = Array.isArray(data?.items) ? data.items.map((item, index) => ({
		...item,
		index: index + 1,
	})) : [];

	if (items.length === 0) return null;

	return (
		<CardGrid
			id={props.id ?? "core-expertise"}
			tag={data.tag}
			headline={data.headline}
			description={data.description}
			items={items}
			columns={3}
			headerRow
			hoverArrow
			watermarkedIndexed
			classes={props.classes ? {
				sectionHeader: props.classes.header,
				subheading: props.classes.subheading,
				leadGrid: props.classes.leadGrid,
				leadImage: props.classes.leadImage,
				grid: props.classes.grid,
				actions: props.classes.actions,
			} : undefined}
			className={props.className}
		/>
	);
}

export default CoreExpertise;