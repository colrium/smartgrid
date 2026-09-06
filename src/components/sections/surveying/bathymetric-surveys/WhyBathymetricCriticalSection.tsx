"use client";

import type { ReactElement } from "react";

import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

interface WhyBathymetricCriticalContent {
	tag?: string | null;
	headline: string;
	description?: string;
	applications: string[];
}

export function WhyBathymetricCriticalSection(): ReactElement {
	const { t } = useTranslation(["surveying/bathymetric-surveys"]);
	const section = t("surveying/bathymetric-surveys:whyBathymetricCritical", {
		returnObjects: true,
	}) as unknown as WhyBathymetricCriticalContent;
	const applications = Array.isArray(section.applications) ? section.applications : [];

	if (applications.length === 0) return <></>;

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
					{applications.map((app, index) => (
						<FadeUp key={index} delay={index * 0.06} className="h-full">
							<article className="group relative h-full flex flex-col gap-4 rounded-c bg-paper hairline card-shadow p-7 transition-all duration-250 hover:card-shadow-lift hover:border-primary">
								<div className="flex items-start gap-3">
									<span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
										<span className="mdi mdi-check text-sm" />
									</span>
									<h3 className="flex-1 text-base font-semibold tracking-tight text-ink leading-snug">
										{app}
									</h3>
								</div>
							</article>
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default WhyBathymetricCriticalSection;