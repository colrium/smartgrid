"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface IntroCta {
	label: string;
	href: string;
}

interface IntroContent {
	tag?: string | null;
	headline: string;
	description: string;
	ctaPrimary?: IntroCta | null;
}

export function IntroSection() {
	const { t } = useTranslation(["sectional-properties"]);
	const section = t("sectional-properties:section1", {
		returnObjects: true,
	}) as unknown as IntroContent;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-[26rem] h-[26rem] bg-brand-100/70 -top-24 -left-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
					<FadeUp className="lg:col-span-7">
						<SectionHeader tag={section.tag} headline={section.headline} />
					</FadeUp>

					<FadeUp delay={0.1} className="lg:col-span-5">
						<p className="text-base sm:text-lg leading-relaxed text-on-surface/60 whitespace-pre-line">
							{section.description}
						</p>

						{section.ctaPrimary?.href && (
							<div className="mt-8">
								<Link
									href={section.ctaPrimary.href}
									className="group inline-flex items-center gap-3 h-14 rounded-full bg-primary text-white px-8 font-medium text-base transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_42px_-10px_rgba(1,55,61,0.45)]"
								>
									<span className="h-1.5 w-1.5 rounded-full bg-white transition-transform duration-300 group-hover:scale-125" />
									<span className="flex-1">{section.ctaPrimary.label}</span>
									<span className="mdi mdi-arrow-right text-xl transition-transform duration-300 group-hover:translate-x-1" />
								</Link>
							</div>
						)}
					</FadeUp>
				</div>
			</div>
		</section>
	);
}

export default IntroSection;