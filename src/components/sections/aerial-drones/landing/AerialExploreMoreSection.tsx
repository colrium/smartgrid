"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home";

interface ExploreItem {
	label: string;
	image?: string | null;
	href?: string | null;
}

interface ExploreContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: ExploreItem[];
}

export function AerialExploreMoreSection() {
	const { t } = useTranslation(["aerial-drones/landing"]);
	const section = t("aerial-drones/landing:exploreMore", {
		returnObjects: true,
	}) as unknown as ExploreContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					description={section.description || undefined}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % 4) * 0.07} className="h-full">
							{item.href ? (
								<Link
									href={item.href}
									className="group relative block aspect-[4/5] overflow-hidden rounded-[20px] bg-primary-50/60 hairline card-shadow transition-all duration-500 hover:card-shadow-lift"
								>
									<TileContent item={item} linked />
								</Link>
							) : (
								<article className="group relative aspect-[4/5] overflow-hidden rounded-[20px] bg-primary-50/60 hairline card-shadow transition-all duration-500 hover:card-shadow-lift">
									<TileContent item={item} />
								</article>
							)}
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default AerialExploreMoreSection;

function TileContent({ item, linked = false }: { item: ExploreItem; linked?: boolean }) {
	return (
		<>
			{typeof item.image === "string" && item.image.startsWith("/") && (
				<Image
					src={item.image}
					alt={item.label}
					fill
					sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
					className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
				/>
			)}

			<span
				className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent transition-opacity duration-500 group-hover:from-ink/95"
				aria-hidden
			/>

			<div className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between gap-3">
				<h3 className="text-sm font-medium leading-snug text-white drop-shadow-sm">
					{item.label}
				</h3>
                {linked && <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface/15 text-white backdrop-blur transition-colors duration-300 group-hover:bg-primary">
                    <span
                        className={`mdi mdi-arrow-right text-sm `}
                    />
                </span>}
			</div>
		</>
	);
}
