"use client";

import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";
import { SectionTag } from "@/components/SectionTag";
import { ProductCard } from "../ProductCard";

interface RelatedItem {
	image?: string | null;
	label: string;
	href: string;
}

interface RelatedProductsContent {
	tag?: string | null;
	headline: string;
	items: RelatedItem[];
}

export function RelatedProductsSection() {
	const { t } = useTranslation(["foif-a90-rtk-gnss"]);
	const section = t("foif-a90-rtk-gnss:relatedProducts", {
		returnObjects: true,
	}) as unknown as RelatedProductsContent;
	const items = Array.isArray(section.items) ? section.items : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-[28rem] h-[28rem] bg-primary-200/40 -bottom-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<div className="flex flex-col items-center text-center gap-4">
						{section.tag && <SectionTag>{section.tag}</SectionTag>}
						<h2 className="font-light tracking-tight leading-[1.08] text-3xl sm:text-4xl lg:text-[2.85rem] text-ink">
							{section.headline}
						</h2>
					</div>
				</FadeUp>

				<div className="mt-14 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % 4) * 0.07} className="h-full">
							<ProductCard image={item.image} label={item.label} href={item.href} />
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default RelatedProductsSection;