"use client";

import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home";
import { Blob } from "@/components/sections/home/decor";

interface PackageItem {
	label: string;
	description?: string;
    icon?: string;
}

interface PackageContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: PackageItem[];
}

interface IncludedInPackageSectionProps {
	namespace: string;
}

export function IncludedInPackageSection({ namespace }: IncludedInPackageSectionProps) {
	const { t } = useTranslation([namespace]);
	const section = t(`${namespace}:includedInPackage`, {
		returnObjects: true,
	}) as unknown as PackageContent;
	const items = Array.isArray(section.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob className="w-[28rem] h-[28rem] bg-primary-200/40 -top-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					description={section.description || undefined}
					align="center"
				/>

				<div className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
					{items.map((item, index) => (
						<FadeUp className="h-full" key={index} delay={(index % 3) * 0.07}>
							<article className="group relative h-full flex flex-col gap-4 rounded-[20px] bg-surface hairline card-shadow p-7 sm:p-8 transition-all duration-500 hover:card-shadow-lift hover:border-primary">
								<span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
									<span className={`mdi mdi-${item.icon || "package-variant-closed"} text-3xl`} />
								</span>

								<h3 className="text-base sm:text-lg font-medium tracking-tight text-ink leading-snug">
									{item.label}
								</h3>

								{item.description && (
									<p className="flex-1 text-sm text-on-surface/60 leading-relaxed">
										{item.description}
									</p>
								)}
							</article>
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default IncludedInPackageSection;