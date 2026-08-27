"use client";

import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home";
import { Blob } from "@/components/sections/home/decor";
import { Trans } from "react-i18next";

interface PlanningContentBenefit {
    icon: string;
    label: string;
    description?: string;
}
interface PlanningContent {
	tag?: string | null;
	headline: string;
	description?: string;
	benefits: PlanningContentBenefit[];
	closingStatement?: string;
}

export function PlanningInfographicSection() {
	const { t } = useTranslation(["home"]);
	const section = t("home:planningInfographic", {
		returnObjects: true,
	}) as unknown as PlanningContent;
	const benefits = Array.isArray(section?.benefits) ? section.benefits : [];

	if (!section.headline) return null;

	return (
		<section className="py-20 sm:py-24 relative overflow-hidden ">
			<Blob
				className="w-[28rem] h-[28rem] bg-primary-100/60 -top-24 -right-24"
				opacity={0.5}
			/>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					description={section.description || undefined}
					align="center"
				/>

				<div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 sm:gap-6">
					{Array.isArray(section.benefits) &&
						section.benefits.map((benefit, index) => (
							<FadeUp key={index} delay={index * 0.07} className="h-full ">
								<div className="group h-full p-6 inline-block bg-surface rounded-[20px]  hairline card-shadow hover:card-shadow-lift hover:border-primary transition-all duration-500 relative overflow-clip">
									<div className="relative h-full flex flex-col gap-3 z-10 ">
										<span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
											<span className={`mdi mdi-${benefit.icon} text-2xl`} />
										</span>

										<p className="flex-1 text-sm text-on-surface/70 leading-relaxed">
											{benefit.label}
										</p>
										{/* <span
										className={`mdi mdi-check-circle-outline text-mute/10 text-[9rem] absolute bottom-6 -right-6 z-10`}
									/> */}
									</div>
									<div
										className={`absolute -bottom-6 -right-8`}
									>
										<span
											className={`mdi mdi-check-circle text-9xl text-on-surface/3 `}
										/>
									</div>
								</div>
							</FadeUp>
						))}
				</div>

				{section.closingStatement && (
					<FadeUp delay={0.1}>
						<div className="mt-10 text-center">
							<p className="text-base sm:text-lg text-on-surface/70 leading-relaxed max-w-2xl mx-auto font-medium">
								<Trans
									// @ts-expect-error
									i18nKey={["home:planningInfographic.closingStatement"]}
									defaults=""
									components={{
										accent: <span className="text-accent" />,
										primary: <span className="text-primary" />,
										bold: <b />,
									}}
								/>
							</p>
						</div>
					</FadeUp>
				)}
			</div>
		</section>
	);
}

export default PlanningInfographicSection;