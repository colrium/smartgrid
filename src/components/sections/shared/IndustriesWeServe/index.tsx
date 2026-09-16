"use client";

import type { ReactElement } from "react";
import { CardGrid, type CardItem } from "../CardGrid";
import type { SectionHeaderClassesProp } from "../SectionHeader";

export interface IndustryItem {
	icon?: string | null;
	label: string;
	description?: string;
}

export interface IndustriesWeServeContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items?: IndustryItem[] | null;
}

export interface IndustriesWeServeClassesProp {
	section?: string;
	header?: SectionHeaderClassesProp;
	subheading?: string;
	leadGrid?: string;
	leadImage?: string;
	grid?: string;
	actions?: string;
}

export interface IndustriesWeServeProps {
	data: IndustriesWeServeContent;
	classes?: IndustriesWeServeClassesProp;
	id?: string;
	className?: string;
}

export function IndustriesWeServe(props: IndustriesWeServeProps): ReactElement | null {
	const data = props.data;
	const items: CardItem[] = Array.isArray(data?.items) ? data.items : [];

	if (items.length === 0) return null;

	return (
		<CardGrid
			id={props.id ?? "industries-we-serve"}
			tag={data.tag}
			headline={data.headline}
			description={data.description}
			items={items}
			columns={3}
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

export default IndustriesWeServe;