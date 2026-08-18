"use client";

import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface TextSectionContent {
	tag?: string | null;
	headline: string;
	description?: string;
}

interface TextSectionProps {
	sectionKey: string;
	tone?: "default" | "surface";
}

export function TextSection({ sectionKey, tone = "default" }: TextSectionProps) {
	const { t } = useTranslation(["monitoring-and-evaluation"]);
	const section = t(`monitoring-and-evaluation:${sectionKey}`, {
		returnObjects: true,
	}) as unknown as TextSectionContent;

	return (
		<section
			className={`py-24 sm:py-28 relative overflow-hidden ${tone === "surface" ? "bg-surface" : ""}`}
		>
			<Blob className="w-[28rem] h-[28rem] bg-primary-100/60 -bottom-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<div className="max-w-3xl">
					<FadeUp>
						<SectionHeader tag={section.tag} headline={section.headline} />

						{section.description && (
							<p className="mt-8 text-base sm:text-lg leading-relaxed text-on-surface/60 whitespace-pre-line">
								{section.description}
							</p>
						)}
					</FadeUp>
				</div>
			</div>
		</section>
	);
}

export default TextSection;