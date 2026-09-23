"use client";

import type { ReactElement } from "react";
import Image from "next/image";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionShell } from "@/components/sections/shared/SectionShell";
import { CheckList } from "@/components/sections/shared/Pricing";

interface SampleMapContent {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	map?: {
		title?: string | null;
		description?: string | null;
		image?: string | null;
		items?: (string | null)[] | null;
	} | null;
}

export interface SampleMapData {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	map?: {
		title?: string | null;
		description?: string | null;
		image?: string | null;
		items?: (string | null)[] | null;
	} | null;
}

/**
 * Sample topographical map — header over a split info card / framed map
 * image (content:
 * surveying/topographical-surveys:sampleTopographicalMap).
 */
export function SampleMapSection({ data, id }: { data?: SampleMapData | null; id?: string } = {}): ReactElement {
	const { t } = useTranslation(["surveying/topographical-surveys"]);
	// Keystatic-owned content when `data` is provided (M11 `topoSampleMap`
	// unique section); legacy locale strings otherwise.
	const section = (data ??
		(t("surveying/topographical-surveys:sampleTopographicalMap", {
			returnObjects: true,
		}) as unknown as SampleMapContent)) as SampleMapContent;
	const highlights = (Array.isArray(section.map?.items) ? section.map.items : []).filter(
		(highlight): highlight is string => typeof highlight === "string" && highlight.length > 0
	);
	const image = section.map?.image;

	return (
		<SectionShell
			id={id}
			tag={section.tag ?? null}
			headline={section.headline ?? ""}
			description={section.description ?? undefined}
		>
			<div className="mt-14 sm:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
				<FadeUp className="lg:col-span-5">
					<div className="relative rounded-c card-shadow border-primary bg-surface p-8 sm:p-10">
						<span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
							<span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
							{section.map?.title}
						</span>

						<p className="mt-4 text-sm sm:text-[15px] text-on-surface/60 leading-relaxed">
							{section.map?.description}
						</p>

						<CheckList items={highlights} className="mt-8" />
					</div>
				</FadeUp>

				<FadeUp delay={0.1} className="lg:col-span-7">
					{image ? (
						<div className="relative">
							<div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl" aria-hidden />
							<div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl" aria-hidden />

							<figure className="relative bg-surface p-4 rounded-c hairline card-shadow overflow-hidden">
								<div className="relative h-[28rem] rounded-xl overflow-hidden bg-slate-900">
									<Image
										src={image}
										alt={section.map?.title ?? section.headline}
										fill
										sizes="(min-width: 1024px) 58vw, 100vw"
										className="object-cover object-center"
									/>
								</div>
							</figure>
						</div>
					) : null}
				</FadeUp>
			</div>
		</SectionShell>
	);
}

export default SampleMapSection;
