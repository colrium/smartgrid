"use client";

import { useTranslation } from "@/hooks";
import { FadeLeft, FadeRight } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home";
import { Blob } from "@/components/sections/home/decor";
import dynamic from "next/dynamic";

const ProjectsGlobe = dynamic(() => import("@/components/ui/Globe"), {
	ssr: false,
	loading: () => (
		<div className="text-center flex items-center  justify-center w-80 h-80 md:w-100 md:h-100 lg:w-130 lg:h-130">
			<div role="status">
				<svg
					aria-hidden="true"
					className="inline w-8 h-8  text-surface-300 animate-spin fill-primary"
					viewBox="0 0 100 101"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
						fill="currentColor"
					/>
					<path
						d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
						fill="currentFill"
					/>
				</svg>
				<span className="sr-only">Loading...</span>
			</div>
		</div>
	),
});
interface ProjectsContent {
	tag?: string | null;
	headline: string;
	description?: string;
	images?: string[] | null;
	items: string[];
}

export function AerialProjectsSection() {
	const { t } = useTranslation(["aerial-drones"]);
	const section = t("aerial-drones:projects", {
		returnObjects: true,
	}) as unknown as ProjectsContent;
	const items = Array.isArray(section?.items) ? section.items : [];
	const images = Array.isArray(section?.images) ? section.images : [];

	if (items.length === 0 && images.length === 0) return null;

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

				<div className="mt-14 sm:mt-20 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-start">
					<FadeLeft>
						<ul className="relative flex flex-col gap-2.5">
							{items.map((item, index) => (
								<li
									key={index}
									className="group flex items-start gap-4 rounded-[15px] bg-surface hairline card-shadow px-5 py-4 transition-all duration-500 hover:card-shadow-lift hover:border-primary"
								>
									<span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary text-xs font-semibold transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
										{String(index + 1).padStart(2, "0")}
									</span>
									<p className="text-sm sm:text-[15px] text-on-surface/75 leading-relaxed pt-1.5">
										{item}
									</p>
								</li>
							))}
						</ul>
					</FadeLeft>

					{images.length > 0 && (
						<FadeRight delay={0.08} className="lg:sticky lg:top-28">
							<div className="grid grid-cols-1 gap-5">
								{/* images.map((image, index) => (
									<div
										key={index}
										className="group relative aspect-[16/10] overflow-hidden rounded-[20px] bg-primary-50/60 hairline card-shadow"
									>
										<Image
											src={image}
											alt={`${section.headline} ${index + 1}`}
											fill
											sizes="(min-width: 1024px) 45vw, 100vw"
											className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
										/>
									</div>
								)) */}
                                <ProjectsGlobe />
							</div>
						</FadeRight>
					)}
				</div>
			</div>
		</section>
	);
}

export default AerialProjectsSection;
