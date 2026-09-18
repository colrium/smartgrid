"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home";
import { Blob } from "@/components/sections/shared/decor";
import { BeforeAfterFlipCard, type FlipSide } from "@/components/sections/shared/BeforeAfterFlipCard";

interface BeforeAfterContent {
	tag?: string | null;
	headline?: string | null;
	flipHint?: string | null;
	before?: FlipSide | null;
	after?: FlipSide | null;
}

export interface BathyBeforeAfterData {
	tag?: string | null;
	headline?: string | null;
	flipHint?: string | null;
	before?: FlipSide | null;
	after?: FlipSide | null;
}

export function BathymetricBeforeAfterSection({ data, id }: { data?: BathyBeforeAfterData | null; id?: string } = {}): ReactElement {
	const { t } = useTranslation(["surveying/bathymetric-surveys"]);
	// Keystatic-owned content when `data` is provided (M11 `bathyBeforeAfter`
	// unique section); legacy locale strings otherwise. Presentation (flip
	// card, ferry icon, watermark) stays in the wrapper.
	const section = (data ??
		(t("surveying/bathymetric-surveys:beforeAfter", {
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
							before={section.before ?? {}}
							after={section.after ?? {}}
							flipHint={section.flipHint ?? undefined}
						layoutId="bathymetric-before-after-toggle"
						afterIcon="ferry"
						afterWatermarkClass="text-green-50/10"
					/>
				</FadeUp>
			</div>
		</section>
	);
}

export default BathymetricBeforeAfterSection;