"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home";
import { Blob } from "@/components/sections/home/decor";

interface ServiceItem {
	icon?: string | null;
	title: string;
	description?: string;
	href?: string | null;
}

interface ServicesContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: ServiceItem[];
}

export function CivilServicesSection() {
	const { t } = useTranslation(["civil/landing"]);
	const section = t("civil/landing:services", { returnObjects: true }) as unknown as ServicesContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<Blob className="w-[28rem] h-[28rem] bg-primary-100/60 -top-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					description={section.description || undefined}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
					{items.map((item, index) => {
						const card = (
							<article className="group h-full flex flex-col gap-4 rounded-[20px] bg-surface hairline card-shadow p-7 transition-all duration-500 hover:card-shadow-lift hover:border-primary">
								<div className="flex items-start justify-between gap-4">
									<span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-mute transition-colors duration-300 group-hover:bg-surface group-hover:text-primary">
										{item.icon && (
											<span className={`mdi mdi-${item.icon} text-xl`} />
										)}
									</span>

									{item.href && (
										<span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50/50 text-mute/50 transition-all duration-300 group-hover:bg-primary-100 group-hover:text-primary">
											<span className="mdi mdi-arrow-right text-sm " />
										</span>
									)}
								</div>

								<h3 className="text-base sm:text-lg font-medium tracking-tight text-ink leading-snug">
									{item.title}
								</h3>

								{item.description && (
									<p className="flex-1 text-sm text-on-surface/60 leading-relaxed">
										{item.description}
									</p>
								)}
							</article>
						);

						return (
							<FadeUp key={index} delay={(index % 3) * 0.07} className="h-full">
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

export default CivilServicesSection;
