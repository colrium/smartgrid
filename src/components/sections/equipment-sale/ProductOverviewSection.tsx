"use client";

import { useTranslation } from "@/hooks";
import dynamic from "next/dynamic";
import Image from "next/image";
import { FadeUp } from "@/components/animations/Fade";
import { SectionTag } from "@/components/SectionTag";
import { Blob } from "@/components/sections/home/decor";
import DeferredMount from "@/components/ui/DeferredMount";

const MorphSlider = dynamic(() => import("@/components/ui/MorphSlider"), {
	ssr: false,
	loading: () => <div className="h-full bg-primary-50/50" />,
});

interface ImageEntry {
	url: string;
	label?: string;
	description?: string;
}
interface ProductOverviewContent {
	tag?: string | null;
	headline: string;
	description?: string;
	images?: ImageEntry[] | string[] | null;
}

interface ProductOverviewSectionProps {
	namespace: string;
}

export function ProductOverviewSection({ namespace }: ProductOverviewSectionProps) {
	const { t } = useTranslation([namespace]);
	const section = t(`${namespace}:productOverview`, {
		returnObjects: true,
	}) as unknown as ProductOverviewContent;
	const morphSliderItems = Array.isArray(section?.images)
			? section.images.map((image) => ({
					image: image?.url || image,
					caption: image?.label || undefined
				}))
			: [];

	if (!section?.headline) return null;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob
				className="w-[28rem] h-[28rem] bg-primary-200/40 -top-24 -right-24"
				opacity={0.5}
			/>

			<div className="relative z-10 max-w-7xl mx-auto flex flex-col justify-center items-center px-6 sm:px-8 lg:px-12">
				<div className="max-w-3xl ">
					<FadeUp className="flex flex-col justify-center items-center">
						{section.tag && <SectionTag>{section.tag}</SectionTag>}

						<h2 className="mt-5 text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight leading-[1.1] text-ink text-center max-w-2xl">
							{section.headline}
						</h2>

						{section.description && (
							<p className="mt-8 text-base text-center sm:text-lg leading-relaxed text-on-surface/60 whitespace-pre-line">
								{section.description}
							</p>
						)}
					</FadeUp>
				</div>
			</div>
			<div className="relative z-10 max-w-7xl  mx-auto px-6 sm:px-8 lg:px-12 mt-12">
				<FadeUp className="h-[60dvh]">
					<DeferredMount
						className="h-full"
						fallback={
							<div className="relative h-full overflow-hidden rounded-c bg-primary-50/50">
								{morphSliderItems[0]?.image && (
									<Image
										src={morphSliderItems[0].image}
										alt=""
										fill
										sizes="(min-width: 1280px) 80rem, 100vw"
										className="object-cover"
									/>
								)}
							</div>
						}
					>
						<MorphSlider items={morphSliderItems} />
					</DeferredMount>
				</FadeUp>
			</div>
		</section>
	);
}

export default ProductOverviewSection;
