"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface ServiceItem {
	title: string;
	description: string;
}

interface ServiceCta {
	icon?: string;
	label: string;
	href: string;
}

interface ServicesContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: ServiceItem[];
	ctaPrimary?: ServiceCta | null;
}

const FALLBACK_ICONS = [
	"video-outline",
	"office-building",
	"chart-line",
	"bullhorn-outline",
	"party-popper",
	"flash-outline",
	"rocket-launch-outline",
	"cellphone",
];

export function ServicesSection() {
	const { t } = useTranslation(["photography-video-marketing"]);
	const section = t("photography-video-marketing:services", {
		returnObjects: true,
	}) as unknown as ServicesContent;
	const items = Array.isArray(section.items) ? section.items : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden ">
			<Blob className="w-[28rem] h-[28rem] bg-brand-100/60 -bottom-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag}
					headline={section.headline}
					description={section.description || undefined}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % 4) * 0.06}>
							<article className="group relative h-full flex flex-col items-center gap-4 rounded-[20px] bg-surface hairline card-shadow p-7 text-center transition-all duration-500 hover:card-shadow-lift hover:border-primary">
								<span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
									<span
										className={`mdi mdi-${
											FALLBACK_ICONS[index % FALLBACK_ICONS.length]
										} text-2xl`}
									/>
								</span>

								<h3 className="text-base sm:text-lg font-medium tracking-tight text-ink leading-snug">
									{item.title}
								</h3>
								<p className="flex-1 text-sm text-on-surface/60 leading-relaxed">
									{item.description}
								</p>
							</article>
						</FadeUp>
					))}
				</div>

				{section.ctaPrimary?.href && (
					<FadeUp delay={0.1}>
						<div className="mt-12 flex justify-center">
							<Link
								href={section.ctaPrimary.href}
								className="group inline-flex items-center gap-3 h-14 rounded-full bg-primary px-8 text-surface font-medium text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-10px_rgba(1,55,61,0.55)]"
							>
								{section.ctaPrimary.icon && (
									<span className={`mdi mdi-${section.ctaPrimary.icon} text-xl`} />
								)}
								{section.ctaPrimary.label}
								<span className="mdi mdi-arrow-right text-xl transition-transform duration-300 group-hover:translate-x-1" />
							</Link>
						</div>
					</FadeUp>
				)}
			</div>
		</section>
	);
}

export default ServicesSection;