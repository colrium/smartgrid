"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface PrecisionContent {
	tag?: string | null;
	headline: string;
	description: string;
	image?: string | null;
}

export function PrecisionSection() {
	const { t } = useTranslation(["aerial-surveys"]);
	const section = t("aerial-surveys:precision", {
		returnObjects: true,
	}) as unknown as PrecisionContent;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<Blob className="w-[26rem] h-[26rem] bg-brand-100/60 -bottom-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
					<FadeUp className="lg:col-span-6">
						<SectionHeader tag={section.tag} headline={section.headline} />

						<div className="mt-8">
							<p className="text-base sm:text-lg leading-relaxed text-on-surface/60 whitespace-pre-line">
								{section.description}
							</p>
						</div>
					</FadeUp>

					<FadeUp delay={0.1} className="lg:col-span-6">
						{section.image && (
							<div className="relative mx-auto max-w-lg lg:max-w-none">
								<div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
								<div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />

								<div className="relative bg-surface p-4 rounded-[20px] hairline card-shadow">
									<div className="relative h-96 rounded-xl overflow-hidden bg-slate-900">
										<Image
											src={section.image}
											alt={section.headline}
											fill
											sizes="(min-width: 1024px) 50vw, 100vw"
											className="object-cover object-center transition-transform duration-700 hover:scale-105"
										/>
									</div>
								</div>
							</div>
						)}
					</FadeUp>
				</div>
			</div>
		</section>
	);
}

export default PrecisionSection;