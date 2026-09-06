"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";
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
interface ProjectItem {
	icon?: string;
	title: string;
	description: string;
}

interface ProjectsContent {
	tag?: string | null;
	headline: string;
	description?: string;
	images?: string[];
	items: ProjectItem[];
}

export function ProjectsAcrossAfricaSection() {
	const { t } = useTranslation(["aerial-drones/drone-imagery-surveys"]);
	const section = t("aerial-drones/drone-imagery-surveys:projectsAcrossAfrica", {
		returnObjects: true,
	}) as unknown as ProjectsContent;
	const items = Array.isArray(section.items) ? section.items : [];
	const images = Array.isArray(section.images) ? section.images : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob
				className="w-[28rem] h-[28rem] bg-primary-200/40 -top-24 -right-24"
				opacity={0.5}
			/>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag}
					headline={section.headline}
					description={section.description}
					align="center"
				/>

				<div className="w-full block relative">
					<div className="mx-auto w-120">
						<ProjectsGlobe />
					</div>
				</div>
				<div className="-mt-10 sm:-mt-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % 3) * 0.07}>
							<article className="group relative h-full flex flex-col gap-4 rounded-c bg-surface hairline card-shadow p-7 transition-all duration-250 hover:card-shadow-lift hover:border-primary">
								{item.icon && (
									<span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
										<span className={`mdi mdi-${item.icon} text-lg`} />
									</span>
								)}

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

				{images.length > 0 && (
					<FadeUp delay={0.05} className="mt-8">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
							{images.slice(0, 2).map((src, index) => (
								<div
									key={index}
									className="relative overflow-hidden rounded-c hairline bg-surface card-shadow"
								>
									<div className="relative aspect-16/10 bg-slate-900">
										<Image
											src={src}
											alt={`${section.headline} ${index + 1}`}
											fill
											sizes="(min-width: 640px) 50vw, 100vw"
											className="object-cover object-center transition-transform duration-700 hover:scale-105"
										/>
									</div>
								</div>
							))}
						</div>
					</FadeUp>
				)}
			</div>
		</section>
	);
}

export default ProjectsAcrossAfricaSection;