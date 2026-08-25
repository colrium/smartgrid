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

export function CompanyServicesSection() {
	const { t } = useTranslation(["company-profile"]);
	const section = t("company-profile:services", {
		returnObjects: true,
	}) as unknown as ServicesContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-[28rem] h-[28rem] bg-primary-200/40 -bottom-24 -left-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					description={section.description || undefined}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % 3) * 0.07} className="h-full">
							<article className="group relative h-full flex flex-col gap-4 rounded-[20px] bg-surface hairline card-shadow p-7 transition-all duration-500 hover:card-shadow-lift hover:border-primary overflow-hidden">
								<div className="flex items-start justify-between gap-4">
									<span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
										{item.icon && <span className={`mdi mdi-${item.icon} text-2xl`} />}
									</span>

									{item.href && (
										<span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-surface">
											<span className="mdi mdi-arrow-right text-base transition-transform duration-300 group-hover:translate-x-0.5" />
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

								{item.href && (
									<Link
										href={item.href}
										className="absolute inset-0"
										aria-label={item.title}
									/>
								)}
							</article>
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default CompanyServicesSection;
