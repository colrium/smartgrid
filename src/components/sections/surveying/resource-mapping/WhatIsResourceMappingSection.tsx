"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/shared/decor";

interface WhatIsItem {
	icon?: string | null;
	title?: string | null;
	description?: string | null;
}

interface WhatIsResourceMappingContent {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	items?: WhatIsItem[] | null;
	closingStatement?: string | null;
}

export interface RmWhatIsData {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	items?: WhatIsItem[] | null;
	closingStatement?: string | null;
}

export function WhatIsResourceMappingSection({ data, id }: { data?: RmWhatIsData | null; id?: string } = {}): ReactElement {
	const { t } = useTranslation(["surveying/resource-mapping"]);
	// Keystatic-owned content when `data` is provided (M11 `rmWhatIs`
	// unique section); legacy locale strings otherwise.
	const section = (data ??
		(t("surveying/resource-mapping:whatIsResourceMapping", {
			returnObjects: true,
		}) as unknown as WhatIsResourceMappingContent)) as WhatIsResourceMappingContent;
	const items = Array.isArray(section.items) ? section.items : [];

	if (items.length === 0) return <></>;

	return (
		<section id={id} className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<Blob className="w-[28rem] h-[28rem] bg-primary-100/60 -top-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline ?? ""}
					description={section.description || undefined}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
					{items.map((item, index) => (
						<FadeUp key={index} delay={index * 0.08} className="h-full">
							<article className="group relative h-full flex flex-col gap-4 rounded-c bg-paper hairline card-shadow p-7 transition-all duration-250 hover:card-shadow-lift hover:border-primary">
								{item.icon && (
									<span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
										<span className={`mdi mdi-${item.icon} text-2xl`} />
									</span>
								)}

								<h3 className="text-lg font-semibold tracking-tight text-ink leading-snug">
									{item.title}
								</h3>
								<p className="flex-1 text-sm text-on-surface/60 leading-relaxed">
									{item.description}
								</p>
							</article>
						</FadeUp>
					))}
				</div>

				{section.closingStatement && (
					<FadeUp delay={0.2} className="mt-16">
						<div className="relative max-w-3xl mx-auto text-center">
							<span className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
							<p className="text-lg sm:text-xl text-primary-600 font-medium leading-relaxed">
								{section.closingStatement}
							</p>
						</div>
					</FadeUp>
				)}
			</div>
		</section>
	);
}

export default WhatIsResourceMappingSection;