"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface DeliverablesContent {
	tag?: string | null;
	headline: string;
	image?: string | null;
	items: string[];
}

export function DeliverablesSection() {
	const { t } = useTranslation(["aerial-surveys"]);
	const section = t("aerial-surveys:deliverables", {
		returnObjects: true,
	}) as unknown as DeliverablesContent;
	const items = Array.isArray(section.items) ? section.items : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<Blob className="w-[26rem] h-[26rem] bg-brand-100/60 -bottom-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag}
					headline={section.headline}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
					<FadeUp className="lg:col-span-5">
						{section.image && (
							<div className="relative mx-auto max-w-lg lg:max-w-none">
								<div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
								<div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />

								<div className="relative bg-surface p-4 rounded-[20px] hairline card-shadow">
									<div className="relative h-96 rounded-xl overflow-hidden bg-slate-900">
										<Image
											src={section.image}
											alt={section.headline}
											fill
											sizes="(min-width: 1024px) 42vw, 100vw"
											className="object-cover object-center"
										/>
									</div>
								</div>
							</div>
						)}
					</FadeUp>

					<FadeUp delay={0.1} className="lg:col-span-7">
						<ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
							{items.map((item, index) => (
								<li
									key={index}
									className="flex items-start gap-3.5 rounded-[16px] border border-ink/10 bg-paper px-5 py-4 text-sm text-on-surface/80 leading-relaxed transition-colors duration-300 hover:border-primary"
								>
									<span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-brand-50 text-primary flex items-center justify-center">
										<span className="mdi mdi-check text-xs" />
									</span>
									<span className="flex-1">{item}</span>
								</li>
							))}
						</ul>
					</FadeUp>
				</div>
			</div>
		</section>
	);
}

export default DeliverablesSection;