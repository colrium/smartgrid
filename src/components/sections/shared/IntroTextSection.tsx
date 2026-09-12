"use client";

import type { ReactElement } from "react";
import Link from "@/components/Link";
import { SectionHeader } from "@/components/sections/home/SectionHeader";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

export interface IntroTextCta {
	label: string;
	href: string;
	icon?: string | null;
}

interface IntroTextSectionProps {
	tag?: string | null;
	headline: string;
	description?: string | null;
	/** `surface` paints the section with the light `bg-surface` token. */
	tone?: "default" | "surface";
	/** `center` centres the copy block (max-w-3xl, centred header). */
	align?: "left" | "center";
	/** Optional solid brand pill rendered below the description. */
	cta?: IntroTextCta | null;
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
	align = "left",
	cta,
	className = "",
}: IntroTextSectionProps): ReactElement {
	const centered = align === "center";
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
				<div className={`max-w-3xl ${centered ? "mx-auto text-center" : ""}`}>
					<FadeUp>
						<SectionHeader
							tag={tag ?? undefined}
							headline={headline}
							align={centered ? "center" : "left"}
						/>

						{description && (
							<p className="mt-8 text-base sm:text-lg leading-relaxed text-on-surface/60 whitespace-pre-line">
								{description}
							</p>
						)}

						{cta?.href ? (
							<div className="mt-10">
								<Link
									href={cta.href}
									className="group inline-flex items-center gap-3 h-14 rounded-full bg-primary px-8 text-surface font-medium text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-10px_rgba(1,55,61,0.55)]"
								>
									<span className="h-1.5 w-1.5 rounded-full bg-surface transition-transform duration-300 group-hover:scale-125" />
									{cta.label}
									{cta.icon ? (
										<span
											className={`mdi mdi-${cta.icon} text-xl transition-transform duration-300 group-hover:translate-x-1`}
											aria-hidden
										/>
									) : null}
								</Link>
							</div>
						) : null}
					</FadeUp>
				</div>
			</div>
		</section>
	);
}

export default IntroTextSection;
