"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";

interface ServicesByImageItem {
	label?: string;
	title?: string;
	image?: string | null;
}

interface ServicesByImagesContent {
	items: ServicesByImageItem[];
}

export function ServicesByImagesSection() {
	const { t } = useTranslation(["about"]);
	const section = t("about:servicesByImages", {
		returnObjects: true,
	}) as unknown as ServicesByImagesContent;
	const items = Array.isArray(section.items) ? section.items : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % 4) * 0.07}>
							<article className="group relative aspect-[3/4] rounded-[20px] overflow-hidden bg-ink hairline card-shadow">
								{item.image && (
									<Image
										src={item.image}
										alt={item.title ?? item.label ?? ""}
										fill
										sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
										className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
									/>
								)}
								<div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />

								<div className="absolute inset-x-0 bottom-0 p-6">
									<h3 className="text-lg font-semibold tracking-tight text-surface leading-snug">
										{item.title ?? item.label ?? ""}
									</h3>
								</div>
							</article>
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default ServicesByImagesSection;