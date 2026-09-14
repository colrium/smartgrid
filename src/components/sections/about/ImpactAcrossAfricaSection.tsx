"use client";

import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/shared/SectionHeader";
import { Blob } from "@/components/sections/shared/decor";
import dynamic from "next/dynamic";
const ProjectsGlobe = dynamic(() => import("@/components/ui/ProjectsGlobe"), {
	ssr: false,
	loading: () => (
		<div className="text-center flex items-center text-primary justify-center w-80 h-80 md:w-100 md:h-100 lg:w-130 lg:h-130">
			<div role="status">
				<svg
					className="h-5 w-5 animate-spin"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle
						className="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						strokeWidth="4"
					></circle>
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
			</div>
		</div>
	),
});
interface WhyChooseUsContent {
	icon?: string | null;
	title: string;
	items: string[];
}

interface ImpactAcrossAfricaContent {
	tag?: string | null;
	headline: string;
	image?: string | null;
	description?: string;
	whyChooseUs?: WhyChooseUsContent | null;
}

export function ImpactAcrossAfricaSection() {
	const { t } = useTranslation(["about"]);
	const section = t("about:impactAcrossAfrica", {
		returnObjects: true,
	}) as unknown as ImpactAcrossAfricaContent;
	const hasImage = typeof section.image === "string" && section.image.startsWith("/");
	const whyChooseUs = section.whyChooseUs;
	const whyItems = Array.isArray(whyChooseUs?.items) ? whyChooseUs.items : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<Blob
				className="w-[28rem] h-[28rem] bg-primary-100/60 -top-24 -right-24"
				opacity={0.5}
			/>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
					<FadeUp className="lg:col-span-6">
						{hasImage && (
							<div className="relative">
								<div className="absolute -inset-4 bg-primary/10 rounded-clg blur-2xl" />
								<div className="relative aspect-square rounded-c overflow-hidden hairline card-shadow">
									{/* <Image
										src={section.image as string}
										alt={section.headline}
										fill
										sizes="(min-width: 1024px) 50vw, 100vw"
										className="object-scale-down object-center"
									/> */}
                                    <ProjectsGlobe />
                                    
								</div>
							</div>
						)}
					</FadeUp>

					<FadeUp delay={0.1} className="lg:col-span-6">
						<SectionHeader
							tag={section.tag ?? undefined}
							headline={section.headline}
							description={section.description}
						/>

						{whyChooseUs && (
							<div className="mt-10 rounded-c bg-surface hairline card-shadow p-7 sm:p-8">
								<div className="flex items-center gap-4">
									{whyChooseUs.icon && (
										<span className="h-12 w-12 rounded-2xl bg-primary-50 text-primary flex items-center justify-center">
											<span
												className={`mdi mdi-${whyChooseUs.icon} text-2xl`}
											/>
										</span>
									)}
									<h3 className="text-lg sm:text-xl font-semibold tracking-tight text-ink leading-snug">
										{whyChooseUs.title}
									</h3>
								</div>

								<ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
									{whyItems.map((item, index) => (
										<li
											key={index}
											className="flex items-start gap-3 text-sm text-on-surface/70 leading-relaxed"
										>
											<span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-primary-50 text-primary flex items-center justify-center">
												<span className="mdi mdi-check text-xs" />
											</span>
											{item}
										</li>
									))}
								</ul>
							</div>
						)}
					</FadeUp>
				</div>
			</div>
		</section>
	);
}

export default ImpactAcrossAfricaSection;