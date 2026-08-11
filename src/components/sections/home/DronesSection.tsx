"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { SectionHeader } from "./SectionHeader";
import { FadeUp } from "@/components/animations/Fade";
import { ParallaxDecor, Blob } from "./decor";

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
			{/* Soft institutional background shapes */}
			<Blob className="w-[26rem] h-[26rem] bg-brand-200/40 -bottom-24 -left-24" opacity={0.5} />
			<ParallaxDecor speed={0.06} className="absolute top-24 right-1/4 z-0">
				<Blob className="w-72 h-72 bg-brand-100/70" opacity={0.6} />
			</ParallaxDecor>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={t("home:drones.tag") as string}
					headline={t("home:drones.headline") as string}
					description={t("home:drones.description") as string}
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 md:grid-cols-2 gap-7 sm:gap-8">
					{Array.isArray(items) &&
						items.map((item, index) => (
							<FadeUp key={index} delay={(index % 2) * 0.1}>
								<article className="group overflow-hidden bg-surface rounded-[15px] hairline card-shadow transition-all duration-500 hover:-translate-x-1 hover:-translate-y-1 hover:card-shadow-lift hover:border-brand-300">
									{/* Image */}
									<div className="relative h-52 sm:h-60 overflow-hidden">
										{item.img && (
											<Image
												src={item.img}
												alt={item.label}
												fill
												sizes="(min-width: 768px) 50vw, 100vw"
												className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
											/>
										)}
										<div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/5 to-transparent" />

										
										<span className="absolute top-4 right-4 glass rounded-lg text-[11px] font-semibold uppercase tracking-[0.18em] text-ink px-3 py-1.5">
											{String(index + 1).padStart(2, "0")}
										</span>
									</div>

									{/* Content */}
									<div className="p-6 sm:p-7">
										<div className="flex items-center justify-between gap-3 mb-3">
											{item.icon ? (
												<span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-primary">
													<span className={`mdi mdi-${item.icon} text-lg`} />
												</span>
											) : (
												<span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
													{t("home:drones.label", {
														defaultValue: "Aerial capability",
													}) as string}
												</span>
											)}
											<span className="mdi mdi-arrow-right text-on-surface/30 group-hover:text-primary transition-colors duration-300" />
										</div>

										<h3 className="text-lg sm:text-xl font-medium text-ink leading-snug transition-colors duration-300 group-hover:text-primary">
											{item.label}
										</h3>
										<p className="mt-3 border-t border-ink/10 pt-4 text-sm sm:text-[15px] text-on-surface/60 leading-relaxed">
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