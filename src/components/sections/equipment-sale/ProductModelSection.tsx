"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home";
import { Blob } from "@/components/sections/home/decor";
import ModelViewer from "@/components/ui/ModelViewer";
import Dock from "@/components/ui/Dock";

/* const ModelViewer = dynamic(() => import("@/components/ui/ModelViewer/index"), {
	ssr: false,
	loading: () => (
		<div className="h-full w-full flex items-center justify-center bg-surface">
			<span className="mdi mdi-cube-outline animate-pulse text-4xl text-primary/50" />
		</div>
	),
}); */

interface Model3d {
	url: string;
	icon?: string;
	label?: string;
	placeholderUrl?: string;
}
interface Model3dContent {
	tag?: string | null;
	headline?: string;
	description?: string;
	models?: Model3d[] | string[] | null;
}

interface ProductModelSectionProps {
	namespace: string;
	placeholderSrc?: string | null;
}

export function ProductModelSection({ namespace, placeholderSrc }: ProductModelSectionProps) {
	const { t } = useTranslation([namespace]);
	const section = t(`${namespace}:model3d`, {
		returnObjects: true,
	}) as unknown as Model3dContent;
	const models = Array.isArray(section?.models)
		? section.models.map(model => model?.src || model).filter(
				(src): src is string  => typeof src === "string" && src.startsWith("/"),
			)
		: [];

	const [active, setActive] = useState(0);

	if (models.length === 0) return null;

    const current = models[active] ?? models[0];
    
    const dockItems = section.models.map((model, index) => ({
		icon: model?.icon || "rotate-3d",
		label: model?.label || String(index + 1).padStart(2, "0"),
		className: index === active? "text-primary": "",
		onClick: () => setActive(index),
	}));

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-[28rem] h-[28rem] bg-primary-100/50 -bottom-24 -left-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline || undefined}
					description={section.description || undefined}
					align="center"
				/>

				<FadeUp delay={0.05}>
					<div className="mt-12 sm:mt-16 relative rounded-[20px]  p-4 sm:p-6">
						<div className="relative overflow-hidden rounded-[15px] hairline">
							<ModelViewer
								url={current}								
							/>
						</div>

						{models.length > 1 && (
                            <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
                                
								{models.map((model, index) => (
									<button
										key={model + index}
										type="button"
										onClick={() => setActive(index)}
										aria-label={`View model ${index + 1}`}
										className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 cursor-pointer border ${
											index === active
												? "bg-primary border-primary text-surface"
												: "bg-surface hairline border-transparent text-on-surface/70 hover:border-primary/40"
										}`}
									>
										<span className="mdi mdi-rotate-3d text-sm" />
										{String(index + 1).padStart(2, "0")}
									</button>
								))}
							</div>
						)}
					</div>
				</FadeUp>
			</div>
		</section>
	);
}

export default ProductModelSection;
