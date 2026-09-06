"use client";

import type { ReactElement } from "react";
import { SectionHeader } from "@/components/sections/home/SectionHeader";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface IntroTextSectionProps {
	tag?: string | null;
	headline: string;
	description?: string | null;
	/** `surface` paints the section with the light `bg-surface` token. */
	tone?: "default" | "surface";
	className?: string;
}

/**
 * Shared intro/text section: kicker tag, headline and an optional lede
 * paragraph over a soft radial blob. Replaces the per-page `TextSection`
 * copies that only differed by i18n namespace.
 */
export function IntroTextSection({
	tag,
	headline,
	description,
	tone = "default",
	className = "",
}: IntroTextSectionProps): ReactElement {
	return (
		<section
			className={`py-24 sm:py-28 relative overflow-hidden ${
				tone === "surface" ? "bg-surface" : ""
			} ${className}`.trim()}
		>
			<Blob
				className="w-[28rem] h-[28rem] bg-primary-100/60 -bottom-24 -right-24"
				opacity={0.5}
			/>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<div className="max-w-3xl">
					<FadeUp>
						<SectionHeader tag={tag ?? undefined} headline={headline} />

						{description && (
							<p className="mt-8 text-base sm:text-lg leading-relaxed text-on-surface/60 whitespace-pre-line">
								{description}
							</p>
						)}
					</FadeUp>
				</div>
			</div>
		</section>
	);
}

export default IntroTextSection;
