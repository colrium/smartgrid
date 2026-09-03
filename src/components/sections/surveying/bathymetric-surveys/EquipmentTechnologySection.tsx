"use client";

import type { ReactElement } from "react";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp, FadeLeft } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface EquipmentTechnologyContent {
	tag?: string | null;
	headline: string;
	description?: string;
	images?: string[];
}

export function EquipmentTechnologySection(): ReactElement {
	const { t } = useTranslation(["surveying/bathymetric-surveys"]);
	const section = t("surveying/bathymetric-surveys:equipmentTechnology", {
		returnObjects: true,
	}) as unknown as EquipmentTechnologyContent;
	const images = Array.isArray(section.images) ? section.images : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob
				className="w-[28rem] h-[28rem] bg-primary-100/60 -bottom-24 -left-24"
				opacity={0.5}
			/>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
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

					<FadeLeft delay={0.1} className="lg:col-span-6">
						{images.length > 0 && (
							<div className="grid grid-cols-2 gap-4 sm:gap-5">
								{images.slice(0, 4).map((src, index) => (
									<div
										key={index}
										className={`relative overflow-hidden aspect-3/4 rounded-c!  card-shadow bg-slate-900 ${
											index % 2 === 0 ? "mt-6" : "-mt-6"
										}`}
									>
										<div className="relative aspect-3/4 rounded-c!  card-shadow bg-slate-900">
											<Image
												src={src}
												alt={`${section.headline} ${index + 1}`}
												fill
												sizes="(min-width: 1024px) 25vw, 50vw"
												className="object-fill object-center transition-transform duration-700 hover:scale-105"
											/>
										</div>
									</div>
								))}
							</div>
						)}
					</FadeLeft>
				</div>
			</div>
		</section>
	);
}

export default EquipmentTechnologySection;