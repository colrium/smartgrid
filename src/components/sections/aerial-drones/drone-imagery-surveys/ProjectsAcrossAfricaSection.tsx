"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks";
import { SectionHeader } from "@/components/sections/home";
import { FadeUp } from "@/components/animations/Fade";
import { Blob } from "@/components/sections/home/decor";

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
	const { t } = useTranslation(["drone-imagery-surveys"]);
	const section = t("drone-imagery-surveys:projectsAcrossAfrica", {
		returnObjects: true,
	}) as unknown as ProjectsContent;
	const items = Array.isArray(section.items) ? section.items : [];
	const images = Array.isArray(section.images) ? section.images : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-[28rem] h-[28rem] bg-brand-200/40 -top-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag}
					headline={section.headline}
					description={section.description}
					align="center"
				/>

				{images.length > 0 && (
					<FadeUp delay={0.05} className="mt-14 sm:mt-20">
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
							{images.slice(0, 2).map((src, index) => (
								<div
									key={index}
									className="relative overflow-hidden rounded-[20px] hairline bg-surface card-shadow"
								>
									<div className="relative aspect-[16/10] bg-slate-900">
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

				<div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % 3) * 0.07}>
							<article className="group relative h-full flex flex-col gap-4 rounded-[20px] bg-surface hairline card-shadow p-7 transition-all duration-500 hover:card-shadow-lift hover:border-primary">
								{item.icon && (
									<span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
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
			</div>
		</section>
	);
}

export default ProjectsAcrossAfricaSection;