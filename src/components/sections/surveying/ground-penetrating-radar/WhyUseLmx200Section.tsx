"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface WhyUseItem {
	icon?: string;
	image?: string | null;
	title: string;
	description: string;
}

interface WhyUseContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: WhyUseItem[];
}

export function WhyUseLmx200Section() {
	const { t } = useTranslation(["ground-penetrating-radar"]);
	const section = t("ground-penetrating-radar:whyUseLmx200", {
		returnObjects: true,
	}) as unknown as WhyUseContent;
	const items = Array.isArray(section.items) ? section.items : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<Blob className="w-[28rem] h-[28rem] bg-primary-100/60 -bottom-24 -left-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag}
					headline={section.headline}
					description={section.description}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % 4) * 0.07}>
							<article className="group relative h-full flex flex-col overflow-hidden rounded-[20px] bg-surface hairline card-shadow transition-all duration-500 hover:card-shadow-lift hover:border-primary">
								{item.image && (
									<div className="relative h-72 overflow-hidden bg-slate-900">
										<Image
											src={item.image}
											alt={item.title}
											fill
											sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
											className="object-fill object-center transition-transform duration-700 ease-out group-hover:scale-105"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-ink/50 to-transparent" />
									</div>
								)}

								<div className="flex flex-col flex-1 p-6">
									{item.icon && (
										<span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
											<span className={`mdi mdi-${item.icon} text-lg`} />
										</span>
									)}

									<h3 className="mt-5 text-base font-semibold tracking-tight text-ink uppercase leading-snug">
										{item.title}
									</h3>
									<p className="mt-2 flex-1 text-sm text-on-surface/60 leading-relaxed">
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

export default WhyUseLmx200Section;