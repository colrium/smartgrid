"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { SectionHeader } from "./SectionHeader";
import { FadeUp } from "@/components/animations/Fade";

interface DroneItem {
	icon?: string | null;
	img: string;
	label: string;
	description: string;
}

export function DronesSection() {
	const { t } = useTranslation(["home"]);
	const items = t("home:drones.items", { returnObjects: true }) as unknown as DroneItem[];

	return (
		<section id="drones" className="py-24 sm:py-28 relative overflow-hidden">
			<div className="absolute top-1/3 -left-24 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

			<div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={t("home:drones.tag") as string}
					headline={t("home:drones.headline") as string}
					description={t("home:drones.description") as string}
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
					{Array.isArray(items) &&
						items.map((item, index) => (
							<FadeUp key={index} delay={(index % 2) * 0.12}>
								<article className="h-full group relative rounded-3xl bg-surface border border-slate-200/70 shadow-sm hover:shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-1">
									<div className="relative h-56 sm:h-64 overflow-hidden">
										{item.img && (
											<Image
												src={item.img}
												alt={item.label}
												fill
												sizes="(min-width: 768px) 50vw, 100vw"
												className="object-cover transition-transform duration-500 group-hover:scale-105"
											/>
										)}
										<div className="absolute inset-0 bg-gradient-to-t from-on-surface/50 to-transparent opacity-60" />
										{item.icon && (
											<span className="absolute top-4 left-4 w-12 h-12 rounded-2xl bg-surface/85 backdrop-blur-sm flex items-center justify-center text-primary shadow-sm">
												<span className={`mdi mdi-${item.icon} text-2xl`} />
											</span>
										)}
									</div>

									<div className="p-6 sm:p-8">
										<h3 className="text-xl sm:text-2xl font-bold text-on-surface leading-tight mb-3">
											{item.label}
										</h3>
										<p className="text-sm sm:text-base text-on-surface/70 leading-relaxed">
											{item.description}
										</p>
									</div>
								</article>
							</FadeUp>
						))}
				</div>
			</div>
		</section>
	);
}

export default DronesSection;