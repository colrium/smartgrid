// components/sections/AboutSection.tsx

"use client";

import React from "react";
import Image from "next/image";
import useTranslation from "@/hooks/useTranslation";
import { SectionTag } from "@/components/SectionTag";
import Link from "next/link";
import { FadeUp, FadeLeft } from "@/components/animations/Fade";

interface AboutCardLink {
	icon?: string | null;
	href: string;
    label: string;
    description: string;
}
export const AboutSection: React.FC = () => {
    const { t } = useTranslation(["common"]);
    const cards = t("common:about.cards", {
		returnObjects: true,
	}) as unknown as AboutCardLink[];
	return (
		<section id="about" className="py-28 relative  overflow-hidden">
			<div className="max-w-7xl mx-auto px-6">
				<div className="grid lg:grid-cols-12 gap-16 items-center">
					{/* Left Narrative */}

					<div className="lg:col-span-6 space-y-6">
						<FadeUp>
							<SectionTag className="text-primary">{t("common:about.tag")}</SectionTag>

							<h2 className="text-3xl sm:text-5xl font-light tracking-tight text-ink leading-tight">
								{t("common:about.headline")}
							</h2>

							<p className="text-on-surface/60 leading-relaxed text-base sm:text-lg">
								{t("common:about.description")}
							</p>
						</FadeUp>
						<FadeUp>
							<h3 className="text-xl sm:text-2xl font-medium tracking-tight text-primary leading-tight pt-2">
								{t("common:about.whoWeAre.title")}
							</h3>

							<p className="text-on-surface/60 leading-relaxed text-sm sm:text-base">
								{t("common:about.whoWeAre.description")}
							</p>
						</FadeUp>
						<FadeUp>
							<h3 className="text-xl sm:text-2xl font-medium tracking-tight text-primary leading-tight pt-2">
								{t("common:about.mission.title")}
							</h3>

							<p className="text-on-surface/60 leading-relaxed text-sm sm:text-base">
								{t("common:about.mission.description")}
							</p>
						</FadeUp>

						<div className="pt-4 grid  grid grid-cols-1 md:grid-cols-2 gap-4">
							{cards.map((card, index) => (
								<FadeUp key={`about-card-${index}`} delay={(index % 3) * 0.1}>
									<Link href={card.href}>
										<div className="p-4 rounded-cmd bg-surface hairline hover:border-primary cursor-pointer transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 h-full hover:card-shadow-lift flex items-start gap-3">
											<div className="p-2.5 rounded-lg bg-primary-50 text-primary">
												<span className={`mdi mdi-${card.icon}`} />
											</div>
											<div>
												<h4 className="font-semibold text-sm text-ink">
													{card.label}
												</h4>
												<p className="text-xs text-on-surface/60 mt-1 leading-relaxed">
													{card.description}
												</p>
											</div>
										</div>
									</Link>
								</FadeUp>
							))}
						</div>
					</div>

					{/* Right Kinetic Visual Frame */}
					<div className="lg:col-span-6 -order-1 lg:order-2">
						<div className="relative mx-auto max-w-md lg:max-w-none">
							{/* Decorative Backdrop Elements */}
							<div
								className="absolute -top-6 -left-6 w-32 h-32"
								style={{
									background:
										"radial-gradient(closest-side, rgba(0,151,178,0.10), transparent 70%)",
								}}
							/>
							<div
								className="absolute -bottom-6 -right-6 w-32 h-32"
								style={{
									background:
										"radial-gradient(closest-side, rgba(0,151,178,0.20), transparent 70%)",
								}}
							/>
							<FadeLeft>
								<div className="relative bg-surface p-4 rounded-c hairline card-shadow">
									<div className="relative aspect-4/5 rounded-xl overflow-hidden bg-slate-900 group">
										{/* Abstract Representation of Pointcloud / Surveying Mesh */}
										<Image
											src={t("common:about.featureImg.url")}
											alt={t("common:about.featureImg.alt")}
											fill
											sizes="(min-width: 1024px) 384px, min(100vw, 448px)"
											className="object-cover object-top transition-transform duration-700 group-hover:scale-105 opacity-80"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />

										<div className="absolute bottom-6 left-6 right-6 text-surface">
											<span className="text-xs font-mono text-primary-200 uppercase font-bold tracking-wider">
												{t("common:about.featureImg.caption")}
											</span>
											<h3 className="text-xl font-light mt-1">
												{t("common:about.featureImg.title")}
											</h3>
											<p className="text-xs text-surface/70 mt-2 leading-relaxed">
												{t("common:about.featureImg.description")}
											</p>
										</div>
									</div>
								</div>
							</FadeLeft>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};