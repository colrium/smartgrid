"use client";

import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home";
import { Blob } from "@/components/sections/home/decor";

interface ChildItem {
	title: string;
	description?: string;
}

interface NeedItem {
	icon?: string | null;
	title: string;
	description?: string;
	children?: ChildItem[] | null;
}

interface WhenYouNeedContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: NeedItem[];
}

export function WhenYouNeedSection() {
	const { t } = useTranslation(["surveying/topographical-surveys"]);
	const section = t("surveying/topographical-surveys:whenYouNeed", {
		returnObjects: true,
	}) as unknown as WhenYouNeedContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	if (items.length === 0) return null;

	return (
		<section className="py-20 sm:py-24 relative overflow-hidden bg-surface">
			<Blob className="w-[28rem] h-[28rem] bg-primary-100/60 -bottom-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<SectionHeader
					tag={section.tag || undefined}
					headline={section.headline}
					description={section.description || undefined}
					align="center"
				/>

				<div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
					{items.map((item, index) => (
						<FadeUp
							key={index}
							delay={(index % 2) * 0.07}
							className={`h-full ${item.children ? "md:col-span-2" : ""}`}
						>
							<article className="h-full flex flex-col gap-4 rounded-[20px] bg-surface hairline card-shadow p-7 transition-all duration-500 hover:card-shadow-lift hover:border-primary">
								<div className="flex items-start gap-4">
									<span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary">
										{item.icon && <span className={`mdi mdi-${item.icon} text-xl`} />}
									</span>
									<div className="flex flex-col gap-1.5">
										<h3 className="text-base font-semibold tracking-tight text-ink leading-snug">
											{item.title}
										</h3>
										{item.description && (
											<p className="text-sm text-on-surface/60 leading-relaxed">
												{item.description}
											</p>
										)}
									</div>
								</div>

								{item.children && item.children.length > 0 && (
									<ul className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-3.5 border-t border-ink/10 pt-5">
										{item.children.map((child, childIndex) => (
											<li
												key={childIndex}
												className="flex flex-col gap-1.5 rounded-[14px] bg-primary-50/40 p-4"
											>
												<span className="flex items-start gap-2 text-[13px] font-semibold text-ink leading-snug">
													<span className="mdi mdi-subdirectory-arrow-right text-primary text-base shrink-0 mt-0.5" />
													{child.title}
												</span>
												{child.description && (
													<p className="text-xs text-on-surface/60 leading-relaxed pl-6">
														{child.description}
													</p>
												)}
											</li>
										))}
									</ul>
								)}
							</article>
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default WhenYouNeedSection;
