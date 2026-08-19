"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home/SectionHeader";
import { Blob } from "@/components/sections/home/decor";

interface OurStoryContent {
	tag?: string | null;
	headline: string;
	image?: string | null;
	description?: string;
}

export function OurStorySection() {
	const { t } = useTranslation(["about"]);
	const section = t("about:ourStory", {
		returnObjects: true,
	}) as unknown as OurStoryContent;
	const hasImage = typeof section.image === "string" && section.image.startsWith("/");

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-[28rem] h-[28rem] bg-primary-100/50 -top-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
					<FadeUp className="lg:col-span-5">
						{hasImage && (
							<div className="relative mx-auto max-w-sm">
								{/* <div className="absolute inset-6 bg-primary/15 rounded-full blur-3xl" /> */}
								<div className="relative p-8 sm:p-10">
									<div className="relative aspect-square rounded-[15px] overflow-hidden bg-primary-50/60">
										{/* <Image
											src={section.image as string}
											alt={section.headline}
											fill
											sizes="(min-width: 1024px) 40vw, 100vw"
											className="object-contain object-center"
										/> */}
									</div>
								</div>
							</div>
						)}
					</FadeUp>

					<FadeUp delay={0.1} className="lg:col-span-7">
						<SectionHeader
							tag={section.tag ?? undefined}
							headline={section.headline}
							description={section.description}
						/>
					</FadeUp>
				</div>
			</div>
		</section>
	);
}

export default OurStorySection;