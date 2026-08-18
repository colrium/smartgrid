"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface RelatedItem {
	image?: string | null;
	label: string;
	href: string;
}

interface RelatedProductsContent {
	headline: string;
	items: RelatedItem[];
}

export function RelatedProductsSection() {
	const { t } = useTranslation(["automatic-level-bosch"]);
	const section = t("automatic-level-bosch:relatedProducts", {
		returnObjects: true,
	}) as unknown as RelatedProductsContent;
	const items = Array.isArray(section.items) ? section.items : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<Blob className="w-[28rem] h-[28rem] bg-primary-100/60 -bottom-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<h2 className="font-mono text-xs uppercase tracking-widest font-semibold text-primary">
						{section.headline}
					</h2>
				</FadeUp>

				<div className="mt-12 sm:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % 4) * 0.07}>
							<Link
								href={item.href}
								className="group block h-full rounded-[20px] bg-surface hairline card-shadow p-5 transition-all duration-500 hover:card-shadow-lift hover:border-primary"
							>
								<div className="relative aspect-square rounded-[15px] overflow-hidden bg-primary-50/60">
									{item.image && (
										<Image
											src={item.image}
											alt={item.label}
											fill
											sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
											className="object-contain object-center transition-transform duration-700 group-hover:scale-105"
										/>
									)}
								</div>

								<div className="mt-5 flex items-center justify-between gap-3">
									<h3 className="text-sm font-semibold tracking-wide text-ink">
										{item.label}
									</h3>
									<span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
										<span className="mdi mdi-arrow-right text-sm" />
									</span>
								</div>
							</Link>
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default RelatedProductsSection;