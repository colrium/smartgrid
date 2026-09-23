"use client";

import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home";
import Image from "next/image";
interface OverviewContent {
	tag?: string | null;
	headline: string;
	paragraphs?: string[] | null;
	image?: string | null;
}

export interface GprOverviewData {
	tag?: string | null;
	headline: string;
	paragraphs?: string[] | null;
	image?: string | null;
}

export function GprOverviewSection({ data, id }: { data?: GprOverviewData | null; id?: string } = {}) {
	const { t } = useTranslation(["surveying/ground-penetrating-radar"]);
	// Keystatic-owned content when `data` is provided (M11 `gprOverview`
	// unique section); legacy locale strings otherwise. The sw locale has no
	// `image` key — the schema carries it per-locale so sw renders imageless
	// exactly like legacy.
	const section = (data ??
		(t("surveying/ground-penetrating-radar:overview", {
			returnObjects: true,
		}) as unknown as OverviewContent)) as OverviewContent;
	const paragraphs = Array.isArray(section?.paragraphs) ? section.paragraphs : [];
	const hasImage = typeof section.image === "string" && section.image.startsWith("/");
	if (paragraphs.length === 0) return null;

	return (
		<section id={id ?? "overview"} className="scroll-mt-36 py-20 sm:py-24 relative overflow-hidden">
			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				{hasImage && (
					<FadeUp delay={0.08}>
						<div className="relative rounded-3xl overflow-hidden bg-primary-50/60 hairline card-shadow">
							<div className="relative aspect-5/3">
								<Image
									src={section.image as string}
									alt={section.headline}
									fill
									priority
									sizes="(min-width: 720px) 50vw, 100vw"
									className="object-fill object-center"
								/>
							</div>
						</div>
					</FadeUp>
				)}
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					align="center"
				/>

				<div className="mt-10 max-w-3xl mx-auto flex flex-col gap-5">
					{paragraphs.map((paragraph, index) => (
						<FadeUp key={index} delay={index * 0.06}>
							<p className="text-sm sm:text-base text-on-surface/65 leading-relaxed text-center">
								{paragraph}
							</p>
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default GprOverviewSection;
