"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home";
import { Blob } from "@/components/sections/home/decor";

interface ServiceItem {
	title: string;
	description?: string;
	popupContent?: string;
}

interface ServicesContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: ServiceItem[];
}

export function AerialDronesServicesSection() {
	const { t } = useTranslation(["aerial-drones/landing"]);
	const section = t("aerial-drones/landing:services", {
		returnObjects: true,
	}) as unknown as ServicesContent;
	const items = Array.isArray(section?.items) ? section.items : [];

	const [open, setOpen] = useState<number | null>(null);

	useEffect(() => {
		if (open === null) return;
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(null);
		};
		document.addEventListener("keydown", onKey);
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.style.overflow = "";
		};
	}, [open]);

	if (items.length === 0) return null;

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

				<div className="mt-14 sm:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
					{items.map((item, index) => (
						<FadeUp key={index} delay={(index % 3) * 0.07} className="h-full">
							<article
								className="group h-full flex flex-col gap-4 rounded-[20px] bg-surface hairline card-shadow p-7 transition-all duration-500 hover:card-shadow-lift hover:border-primary"
								onClick={() => item.popupContent && setOpen(index)}
							>
								<div className="flex items-start justify-between gap-4">
									<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary text-sm font-semibold">
										{String(index + 1).padStart(2, "0")}
									</span>

									{item.popupContent && (
										<span className="inline-flex items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
											<span className="mdi mdi-open-in-new text-xs" />
											Details
										</span>
									)}
								</div>

								<h3 className="text-base sm:text-lg font-medium tracking-tight text-ink leading-snug">
									{item.title}
								</h3>

								{item.description && (
									<p className="text-sm text-on-surface/60 leading-relaxed">
										{item.description}
									</p>
								)}
							</article>
						</FadeUp>
					))}
				</div>
			</div>

			{open !== null && items[open]?.popupContent && (
				<div
					className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-ink/70 backdrop-blur-sm"
					onClick={() => setOpen(null)}
					role="dialog"
					aria-modal="true"
					aria-label={items[open].title}
				>
					<div
						className="relative w-full max-w-xl rounded-[20px] bg-surface hairline card-shadow p-8 sm:p-10 max-h-[85vh] overflow-y-auto"
						onClick={(e) => e.stopPropagation()}
					>
						<button
							type="button"
							aria-label="Close"
							onClick={() => setOpen(null)}
							className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-surface hairline text-on-surface/60 transition-colors duration-300 hover:bg-primary hover:text-surface cursor-pointer"
						>
							<span className="mdi mdi-close text-lg" />
						</button>

						<span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50 text-primary text-sm font-semibold mb-5">
							{String(open + 1).padStart(2, "0")}
						</span>

						<h3 className="pr-10 text-xl sm:text-2xl font-medium tracking-tight text-ink leading-snug">
							{items[open].title}
						</h3>

						{items[open].description && (
							<p className="mt-3 text-sm text-primary font-medium">{items[open].description}</p>
						)}

						<p className="mt-5 text-sm sm:text-base text-on-surface/70 leading-relaxed">
							{items[open].popupContent}
						</p>
					</div>
				</div>
			)}
		</section>
	);
}

export default AerialDronesServicesSection;
