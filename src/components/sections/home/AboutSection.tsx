// components/sections/AboutSection.tsx

"use client";

import React from "react";
import ShieldIcon from "@mui/icons-material/Shield";
import MemoryIcon from "@mui/icons-material/Memory";
export const AboutSection: React.FC = () => {
	return (
		<section id="about" className="py-28 relative  overflow-hidden">
			<div className="max-w-7xl mx-auto px-6">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
					{/* Left Narrative */}
					<div className="lg:col-span-6 space-y-6">
						<div className="inline-flex items-center gap-2 font-mono text-xs text-primary uppercase tracking-widest font-semibold">
							<span className="w-6 h-[2px] bg-primary" />
							<span>01 // About Smartgrid</span>
						</div>

						<h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-textMain leading-tight">
							Bridging Physical Reality & Digital Precision.
						</h2>

						<p className="text-textMain/70 leading-relaxed text-base sm:text-lg">
							Smartgrid Surveying & Engineering Ltd is a premier geospatial
							consultancy based in Nairobi, Kenya. We redefine site intelligence by
							merging classic land surveying fundamentals with futuristic scanning
							technology.
						</p>

						<p className="text-textMain/70 leading-relaxed text-sm sm:text-base">
							From complex infrastructure layout and cadastral mapping to aerial
							photogrammetry and subsurface utility exploration, our
							multi-disciplinary engineering approach minimizes project risk,
							accelerates timelines, and guarantees regulatory compliance.
						</p>

						<div className="pt-4 grid grid-cols-2 gap-4">
							<div className="p-4 rounded-2xl bg-surface border border-slate-200/80 shadow-sm flex items-start gap-3">
								<div className="p-2 rounded-xl bg-primary-light text-primary">
									<ShieldIcon className="w-5 h-5" />
								</div>
								<div>
									<h4 className="font-bold text-sm text-textMain">
										Licensed Experts
									</h4>
									<p className="text-xs text-textMain/60 mt-1">
										Full Institution of Surveyors certification.
									</p>
								</div>
							</div>

							<div className="p-4 rounded-2xl bg-surface border border-slate-200/80 shadow-sm flex items-start gap-3">
								<div className="p-2 rounded-xl bg-primary-light text-primary">
									<MemoryIcon className="w-5 h-5" />
								</div>
								<div>
									<h4 className="font-bold text-sm text-textMain">
										Drone & LiDAR
									</h4>
									<p className="text-xs text-textMain/60 mt-1">
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

							<div className="relative bg-surface p-4 rounded-3xl border border-on-surface-300/10 shadow-premium">
								<div className="relative h-96 rounded-2xl overflow-hidden bg-slate-900 group">
									{/* Abstract Representation of Pointcloud / Surveying Mesh */}
									<div
										className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-80"
										style={{
											backgroundImage:
												'url("https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80")',
										}}
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-on-surface via-on-surface/20 to-transparent" />

									<div className="absolute bottom-6 left-6 right-6 text-surface">
										<span className="text-xs font-mono text-primary uppercase font-bold tracking-wider">
											Field Operations
										</span>
										<h3 className="text-xl font-bold mt-1">
											High-Density Terrestrial Laser Scanning
										</h3>
										<p className="text-xs text-surface/70 mt-2">
											Capture 2,000,000 points per second for millimetric 3D
											structural analysis.
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
