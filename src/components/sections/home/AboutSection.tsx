// components/sections/AboutSection.tsx

"use client";

import React from "react";
import ShieldIcon from "@mui/icons-material/Shield";
import MemoryIcon from "@mui/icons-material/Memory";
import useTranslation from "@/hooks/useTranslation";
import { SectionTag } from "@/components/SectionTag";
export const AboutSection: React.FC = () => {
    const { t } = useTranslation(["home"]);
	return (
		<section id="about" className="py-28 relative  overflow-hidden">
			<div className="max-w-7xl mx-auto px-6">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
					{/* Left Narrative */}
					<div className="lg:col-span-6 space-y-6">
						<SectionTag className="text-primary">{t("home:about.tag")}</SectionTag>

						<h2 className="text-3xl sm:text-5xl font-light tracking-tight text-ink leading-tight">
							{t("home:about.headline")}
						</h2>

						<p className="text-on-surface/60 leading-relaxed text-base sm:text-lg">
							{t("home:about.description")}
						</p>

						<h3 className="text-xl sm:text-2xl font-medium tracking-tight text-primary leading-tight pt-2">
							{t("home:about.whoWeAre.title")}
						</h3>

						<p className="text-on-surface/60 leading-relaxed text-sm sm:text-base">
							{t("home:about.whoWeAre.description")}
						</p>

						<h3 className="text-xl sm:text-2xl font-medium tracking-tight text-primary leading-tight pt-2">
							{t("home:about.mission.title")}
						</h3>

						<p className="text-on-surface/60 leading-relaxed text-sm sm:text-base">
							{t("home:about.mission.description")}
						</p>

						<div className="pt-4 grid grid-cols-2 gap-4">
							<div className="p-4 rounded-[15px] bg-surface hairline hover:border-primary cursor-default transition-all duration-300 hover:-translate-y-0.5 hover:card-shadow-lift flex items-start gap-3">
								<div className="p-2.5 rounded-lg bg-brand-50 text-primary">
									<ShieldIcon className="w-5 h-5" />
								</div>
								<div>
									<h4 className="font-semibold text-sm text-ink">
										Licensed Experts
									</h4>
									<p className="text-xs text-on-surface/60 mt-1 leading-relaxed">
										Full Institution of Surveyors certification.
									</p>
								</div>
							</div>

							<div className="p-4 rounded-[15px] bg-surface hairline hover:border-primary cursor-default transition-all duration-300 hover:-translate-y-0.5 hover:card-shadow-lift flex items-start gap-3">
								<div className="p-2.5 rounded-lg bg-brand-50 text-primary">
									<MemoryIcon className="w-5 h-5" />
								</div>
								<div>
									<h4 className="font-semibold text-sm text-ink">
										Drone & LiDAR
									</h4>
									<p className="text-xs text-on-surface/60 mt-1 leading-relaxed">
										Automated high-density spatial capture.
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Right Kinetic Visual Frame */}
					<div className="lg:col-span-6">
						<div className="relative mx-auto max-w-md lg:max-w-none">
							{/* Decorative Backdrop Elements */}
							<div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
							<div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl" />

							<div className="relative bg-surface p-4 rounded-[20px] hairline card-shadow">
								<div className="relative h-96 rounded-xl overflow-hidden bg-slate-900 group">
									{/* Abstract Representation of Pointcloud / Surveying Mesh */}
									<div
										className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-80"
										style={{
											backgroundImage: `url("${t("home:about.featureImg.url")}")`,
										}}
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />

									<div className="absolute bottom-6 left-6 right-6 text-surface">
										<span className="text-xs font-mono text-brand-200 uppercase font-bold tracking-wider">
											{t("home:about.featureImg.caption")}
										</span>
										<h3 className="text-xl font-light mt-1">
											{t("home:about.featureImg.title")}
										</h3>
										<p className="text-xs text-surface/70 mt-2 leading-relaxed">
											{t("home:about.featureImg.description")}
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};