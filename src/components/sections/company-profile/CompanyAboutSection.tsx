"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { FadeLeft, FadeRight } from "@/components/animations/Fade";
import { SectionTag } from "@/components/SectionTag";
import { Blob } from "@/components/sections/home/decor";

interface AboutContent {
	tag?: string | null;
	headline: string;
	image?: string | null;
	description?: string;
	points?: string[] | null;
}

export function CompanyAboutSection() {
	const { t } = useTranslation(["company-profile"]);
	const section = t("company-profile:about", {
		returnObjects: true,
	}) as unknown as AboutContent;
	const points = Array.isArray(section?.points) ? section.points : [];
	const hasImage = typeof section.image === "string" && section.image.startsWith("/");

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-[28rem] h-[28rem] bg-primary-200/40 -bottom-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
				<FadeLeft className="lg:col-span-8">
					<div className="flex flex-col gap-6">
						<SectionTag className="justify-start">{section.tag}</SectionTag>

						<h2 className="text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight leading-[1.1] text-ink max-w-xl">
							{section.headline}
						</h2>

						{section.description && (
							<p className="text-base sm:text-lg text-on-surface/60 leading-relaxed whitespace-pre-line max-w-xl">
								{section.description}
							</p>
						)}
					</div>
				</FadeLeft>

				<FadeRight delay={0.08} className="lg:col-span-4">
					{hasImage && (
						<div className="relative rounded-c overflow-hidden   mb-8">
							<div className="relative aspect-square">
								<Image
									src={section.image as string}
									alt={section.headline}
									fill
									sizes="(min-width: 1024px) 50vw, 100vw"
									className="object-cover object-center"
								/>
							</div>
						</div>
					)}

					<ul className="grid grid-cols-1 gap-3.5">
						{points.map((point, index) => (
							<li
								key={index}
								className="flex items-start gap-3 rounded-[15px] bg-surface hairline card-shadow px-5 py-4 text-sm text-on-surface/75 leading-relaxed transition-all duration-250 hover:card-shadow-lift hover:border-primary"
							>
								<span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary">
									<span className="mdi mdi-check-decagram text-sm" />
								</span>
								{point}
							</li>
						))}
					</ul>
				</FadeRight>
			</div>
		</section>
	);
}

export default CompanyAboutSection;
