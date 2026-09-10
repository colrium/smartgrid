"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home";
import { Blob } from "@/components/sections/home/decor";

interface FleetItem {
	icon?: string | null;
	image?: string | null;
	href?: string | null;
	label: string;
}

interface FleetContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: FleetItem[];
}

export function DroneFleetSection() {
	const { t } = useTranslation(["aerial-drones/landing"]);
	const section = t("aerial-drones/landing:droneFleet", {
		returnObjects: true,
	}) as unknown as FleetContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-[28rem] h-[28rem] bg-primary-200/40 -top-24 -left-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					description={section.description || undefined}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
					{items.map((item, index) => {
						const hasImage = typeof item.image === "string" && item.image.startsWith("/");
						const card = (
							<article className="group h-full flex flex-col rounded-c bg-surface hairline card-shadow p-5 transition-all duration-250 hover:card-shadow-lift hover:border-primary">
								<div className="relative aspect-square rounded-cmd overflow-hidden bg-primary-50/60">
									{hasImage && (
										<Image
											src={item.image as string}
											alt={item.label}
											fill
											sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
											className="object-contain object-center p-3 transition-transform duration-700 group-hover:scale-105"
										/>
									)}
									<span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-surface/85 text-primary shadow-sm backdrop-blur transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
										<span className={`mdi ${item.href ? "mdi-arrow-top-right" : `mdi-${item.icon ?? "quadcopter"}`} text-base`} />
									</span>
								</div>

								<div className="mt-5 flex items-center justify-between gap-3">
									<h3 className="text-sm font-semibold tracking-wide text-ink">{item.label}</h3>
									{item.href && (
										<span className="text-[11px] font-medium uppercase tracking-wider text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
											View
										</span>
									)}
								</div>
							</article>
						);

						return (
							<FadeUp key={index} delay={(index % 4) * 0.07} className="h-full">
								{item.href ? (
									<Link href={item.href} className="block h-full">
										{card}
									</Link>
								) : (
									card
								)}
							</FadeUp>
						);
					})}
				</div>
			</div>
		</section>
	);
}

export default DroneFleetSection;
