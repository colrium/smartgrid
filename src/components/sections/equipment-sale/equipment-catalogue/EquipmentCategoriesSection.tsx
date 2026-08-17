"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home/SectionHeader";
import { Blob } from "@/components/sections/home/decor";

interface CategoryCta {
	icon?: string;
	label: string;
	href: string;
}

interface CategoryItem {
	icon?: string | null;
	title: string;
	description: string;
	badge?: string | null;
	ctaPrimary?: CategoryCta | null;
}

interface EquipmentCategoriesContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: CategoryItem[];
}

export function EquipmentCategoriesSection() {
	const { t } = useTranslation(["equipment-catalogue"]);
	const section = t("equipment-catalogue:equipmentCategories", {
		returnObjects: true,
	}) as unknown as EquipmentCategoriesContent;
	const items = Array.isArray(section.items) ? section.items : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<Blob className="w-[28rem] h-[28rem] bg-brand-100/60 -top-24 -right-24" opacity={0.5} />
			<Blob className="w-[26rem] h-[26rem] bg-primary/5 -bottom-24 -left-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<SectionHeader
						tag={section.tag ?? undefined}
						headline={section.headline}
						description={section.description}
						align="center"
					/>
				</FadeUp>

				<div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % 3) * 0.07}>
							<article className="group h-full flex flex-col rounded-[20px] bg-surface hairline card-shadow p-7 sm:p-8 transition-all duration-500 hover:card-shadow-lift hover:border-primary">
								<div className="flex items-start justify-between gap-4">
									<div className="h-14 w-14 rounded-2xl bg-brand-50 text-primary flex items-center justify-center transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
										{item.icon && (
											<span className={`mdi mdi-${item.icon} text-2xl`} />
										)}
									</div>

									{item.badge && (
										<span className="inline-flex items-center rounded-full bg-primary/10 text-primary-700 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest">
											{item.badge}
										</span>
									)}
								</div>

								<h3 className="mt-6 text-lg sm:text-xl font-semibold tracking-tight text-ink">
									{item.title}
								</h3>

								<p className="mt-3 flex-1 text-sm leading-relaxed text-on-surface/70">
									{item.description}
								</p>

								{item.ctaPrimary?.href && (
									<Link
										href={item.ctaPrimary.href}
										className="group/cta mt-7 inline-flex items-center gap-2 self-start rounded-full bg-ink px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-surface transition-colors duration-300 hover:bg-primary"
									>
										{item.ctaPrimary.icon && (
											<span className={`mdi mdi-${item.ctaPrimary.icon} text-base`} />
										)}
										{item.ctaPrimary.label}
									</Link>
								)}
							</article>
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default EquipmentCategoriesSection;