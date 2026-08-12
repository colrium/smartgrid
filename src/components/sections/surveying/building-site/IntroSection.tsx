"use client";

import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface IntroContent {
	tag?: string | null;
	headline: string;
	description: string;
}

export function IntroSection() {
	const { t } = useTranslation(["building-site-surveys"]);
	const section = t("building-site-surveys:section1", {
		returnObjects: true,
	}) as unknown as IntroContent;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-[26rem] h-[26rem] bg-brand-100/70 -top-24 -left-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
					<FadeUp className="lg:col-span-7">
						<SectionHeader tag={section.tag} headline={section.headline} />
					</FadeUp>

					<FadeUp delay={0.1} className="lg:col-span-5">
						<p className="text-base sm:text-lg leading-relaxed text-on-surface/60">
							{section.description}
						</p>
					</FadeUp>
				</div>
			</div>
		</section>
	);
}

export default IntroSection;