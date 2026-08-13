"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface Lmx200FeaturesContent {
	tag?: string | null;
	headline: string;
	description?: string;
	image?: string | null;
}

export function Lmx200FeaturesSection() {
	const { t } = useTranslation(["ground-penetrating-radar"]);
	const section = t("ground-penetrating-radar:lmx200Features", {
		returnObjects: true,
	}) as unknown as Lmx200FeaturesContent;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-[26rem] h-[26rem] bg-brand-200/40 -top-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag}
					headline={section.headline}
					description={section.description}
					align="center"
				/>

				{section.image && (
					<FadeUp delay={0.1} className="mt-12 sm:mt-16">
						<div className="relative mx-auto max-w-4xl">
							<div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
							<div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />

							<div className="relative bg-surface p-4 rounded-[20px] hairline card-shadow">
								<div className="relative aspect-[16/12] rounded-xl overflow-hidden bg-slate-900">
									<Image
										src={section.image}
										alt={section.headline}
										fill
										sizes="(min-width: 1024px) 65vw, 100vw"
										className="object-fill object-center"
									/>
								</div>
							</div>
						</div>
					</FadeUp>
				)}
			</div>
		</section>
	);
}

export default Lmx200FeaturesSection;