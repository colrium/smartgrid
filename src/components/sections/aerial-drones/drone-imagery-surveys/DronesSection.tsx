"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface DroneItem {
	icon?: string;
	img?: string | null;
	label: string;
	description: string;
}

interface DronesContent {
	tag?: string | null;
	headline: string;
	description?: string;
	subheadline?: string;
	items: DroneItem[];
}

export function DronesSection() {
	const { t } = useTranslation(["drone-imagery-surveys"]);
	const section = t("drone-imagery-surveys:drones", {
		returnObjects: true,
	}) as unknown as DronesContent;
	const items = Array.isArray(section.items) ? section.items : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<Blob className="w-[28rem] h-[28rem] bg-brand-100/60 -bottom-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag}
					headline={section.headline}
					description={section.description}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % 2) * 0.07}>
							<article className="group relative h-full flex flex-col overflow-hidden rounded-[20px] bg-surface hairline card-shadow transition-all duration-500 hover:card-shadow-lift hover:border-primary">
								{item.img && (
									<div className="relative h-64 overflow-hidden bg-slate-900">
										<Image
											src={item.img}
											alt={item.label}
											fill
											sizes="(min-width: 1024px) 50vw, 100vw"
											className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
										/>
									</div>
								)}

								<div className="flex flex-col flex-1 p-7">
									{item.icon && (
										<span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
											<span className={`mdi mdi-${item.icon} text-lg`} />
										</span>
									)}

									<h3 className="mt-4 text-lg sm:text-xl font-medium tracking-tight text-ink leading-snug">
										{item.label}
									</h3>
									<p className="mt-3 flex-1 text-sm text-on-surface/60 leading-relaxed">
										{item.description}
									</p>
								</div>
							</article>
						</FadeUp>
					))}
				</div>

				{section.subheadline && (
					<FadeUp delay={0.15} className="mt-14 sm:mt-16">
						<div className="relative rounded-[20px] ink-panel px-8 sm:px-12 py-12 sm:py-14 overflow-hidden">
							<Blob className="w-72 h-72 bg-primary/25 -top-20 -right-20" opacity={0.6} />
							<p className="relative z-10 max-w-3xl mx-auto text-center text-xl sm:text-2xl lg:text-[1.7rem] font-light leading-relaxed text-surface whitespace-pre-line">
								{section.subheadline}
							</p>
						</div>
					</FadeUp>
				)}
			</div>
		</section>
	);
}

export default DronesSection;