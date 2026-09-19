"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home";
import { Blob } from "@/components/sections/shared/decor";
import { BeforeAfterFlipCard, type FlipSide } from "@/components/sections/shared/BeforeAfterFlipCard";

interface BeforeAfterContent {
	tag?: string | null;
	headline: string;
	flipHint?: string | null;
	before: FlipSide;
	after: FlipSide;
}

export interface GisBeforeAfterData {
	tag?: string | null;
	headline: string;
	flipHint?: string | null;
	before: FlipSide;
	after: FlipSide;
}

export function GisBeforeAfterSection({ data, id }: { data?: GisBeforeAfterData | null; id?: string } = {}): ReactElement {
	const { t } = useTranslation(["surveying/gis-mapping"]);
	// Keystatic-owned content when `data` is provided (M11 `gisBeforeAfter`
	// unique section); legacy locale strings otherwise. Flip behavior,
	// layoutId and icons stay in the renderer.
	const section = (data ??
		(t("surveying/gis-mapping:beforeAfter", {
			returnObjects: true,
		}) as unknown as BeforeAfterContent)) as BeforeAfterContent;

	if (!section?.headline) return <></>;

	return (
		<section
			id={id ?? "before-after"}
			className="scroll-mt-36 py-20 sm:py-24 relative overflow-hidden"
		>
			<Blob
				className="w-[26rem] h-[26rem] bg-primary-100/60 -top-24 -left-24"
				opacity={0.5}
			/>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					align="center"
				/>

				<FadeUp delay={0.1}>
					<BeforeAfterFlipCard
						before={section.before}
						after={section.after}
						flipHint={section.flipHint}
						layoutId="gis-before-after-toggle"
						beforeIcon="map-marker-radius"
						afterIcon="map-check"
					/>
				</FadeUp>
			</div>
		</section>
	);
}

export default GisBeforeAfterSection;