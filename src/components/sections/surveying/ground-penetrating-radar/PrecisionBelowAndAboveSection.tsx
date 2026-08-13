"use client";

import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface PrecisionBelowAndAboveContent {
	tag?: string | null;
	headline: string;
	description?: string;
}

export function PrecisionBelowAndAboveSection() {
	const { t } = useTranslation(["ground-penetrating-radar"]);
	const section = t("ground-penetrating-radar:precisionBelowAndAbove", {
		returnObjects: true,
	}) as unknown as PrecisionBelowAndAboveContent;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<Blob className="w-[26rem] h-[26rem] bg-brand-100/60 -bottom-24 -right-24" opacity={0.5} />
			<Blob className="w-[22rem] h-[22rem] bg-brand-200/40 -top-24 -left-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp className="max-w-3xl mx-auto">
					<SectionHeader
						tag={section.tag}
						headline={section.headline}
						description={section.description}
						align="center"
					/>
				</FadeUp>
			</div>
		</section>
	);
}

export default PrecisionBelowAndAboveSection;