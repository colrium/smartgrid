"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface DeliverableItem {
	image?: string | null;
	title: string;
	description: string;
}

interface DeliverablesContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: DeliverableItem[];
}

export function AerialSurveyDeliverablesSection() {
	const { t } = useTranslation(["drone-imagery-surveys"]);
	const section = t("drone-imagery-surveys:aerialSurveyDeliverables", {
		returnObjects: true,
	}) as unknown as DeliverablesContent;
	const items = Array.isArray(section.items) ? section.items : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-[28rem] h-[28rem] bg-primary-200/40 -top-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag}
					headline={section.headline}
					description={section.description}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % 4) * 0.06}>
							<article className="group relative h-full flex flex-col overflow-hidden rounded-[20px] bg-surface hairline card-shadow transition-all duration-500 hover:card-shadow-lift hover:border-primary">
								{item.image && (
									<div className="relative h-48 overflow-hidden bg-slate-900">
										<Image
											src={item.image}
											alt={item.title}
											fill
											sizes="(min-width: 1024px) 25vw, 100vw"
											className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
									</div>
								)}

								<div className="flex flex-col flex-1 p-6">
									<h3 className="text-base sm:text-lg font-medium tracking-tight text-ink leading-snug">
										{item.title}
									</h3>
									<p className="mt-3 flex-1 text-sm text-on-surface/60 leading-relaxed">
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

export default AerialSurveyDeliverablesSection;