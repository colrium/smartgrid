"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface LidarSplitContent {
	tag?: string | null;
	headline: string;
	description?: string;
	image?: string | null;
}

interface LidarSplitSectionProps {
	sectionKey: string;
	imagePosition?: "left" | "right";
	tone?: "default" | "surface";
}

export function LidarSplitSection({
	sectionKey,
	imagePosition = "right",
	tone = "default",
}: LidarSplitSectionProps) {
	const { t } = useTranslation(["lidar-mapping"]);
	const section = t(`lidar-mapping:${sectionKey}`, {
		returnObjects: true,
	}) as unknown as LidarSplitContent;

	const text = (
		<FadeUp className="lg:col-span-6">
			<SectionHeader tag={section.tag} headline={section.headline} />

			{section.description && (
				<div className="mt-8">
					<p className="text-base sm:text-lg leading-relaxed text-on-surface/60 whitespace-pre-line">
						{section.description}
					</p>
				</div>
			)}
		</FadeUp>
	);

	const media = (
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
	);

	return (
		<section
			className={`py-24 sm:py-28 relative overflow-hidden ${
				tone === "surface" ? "bg-surface" : ""
			}`}
		>
			<Blob
				className={`w-[26rem] h-[26rem] bg-brand-100/60 ${
					imagePosition === "left" ? "-bottom-24 -left-24" : "-bottom-24 -right-24"
				}`}
				opacity={0.5}
			/>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
					{imagePosition === "left" ? (
						<>
							{media}
							{text}
						</>
					) : (
						<>
							{text}
							{media}
						</>
					)}
				</div>
			</div>
		</section>
	);
}

export default LidarSplitSection;