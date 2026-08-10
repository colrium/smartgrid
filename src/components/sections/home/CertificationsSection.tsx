"use client";

import { useTranslation } from "@/hooks";
import { SectionTag } from "@/components/SectionTag";
import { FadeUp } from "@/components/animations/Fade";
import { ParallaxDecor, Blob } from "./decor";

interface CertificationItem {
	icon?: string | null;
	name: string;
	label: string;
}

export function CertificationsSection() {
	const { t } = useTranslation(["home"]);
	const items = t("home:certifications.items", {
		returnObjects: true,
	}) as unknown as CertificationItem[];

	return (
		<section id="certifications" className="py-24 sm:py-28 relative overflow-hidden">
			<ParallaxDecor speed={0.05} className="absolute top-16 left-1/3 z-0">
				<Blob className="w-64 h-64 bg-brand-200/50" opacity={0.5} />
			</ParallaxDecor>

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<div className="mb-12 flex flex-col items-center gap-4 text-center">
						<SectionTag>{t("home:certifications.tag") as string}</SectionTag>
						<span className="inline-flex items-center gap-3">
							<span className="h-px w-10 bg-primary/40" />
							<span className="h-1.5 w-1.5 rounded-full bg-primary" />
							<span className="h-px w-10 bg-primary/40" />
						</span>
					</div>
				</FadeUp>

				<div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
					{Array.isArray(items) &&
						items.map((item, index) => (
							<FadeUp key={index} delay={(index % 4) * 0.08}>
								<div className="group flex flex-col h-full min-h-56 rounded-[20px] hairline bg-surface card-shadow p-6 sm:p-7 transition-all duration-500 hover:border-4 hover:border-primary hover:-translate-y-1.5 hover:card-shadow-lift">
									<div className="flex items-center justify-between">
										<span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink">
											<span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
												<span className="mdi mdi-check text-[11px]" />
											</span>
											{item.name}
										</span>
										<span className="text-[11px] font-semibold tabular-nums tracking-[0.14em] text-on-surface/35">
											{String(index + 1).padStart(2, "0")}
										</span>
									</div>

									<div className="my-5 border-t border-ink/10" />

									<span className="font-light leading-none tracking-tight text-ink/80 text-6xl select-none">
										{item.name.charAt(0)}
									</span>

									<p className="mt-auto pt-5 text-[13px] leading-snug text-on-surface/60">
										{item.label}
									</p>
								</div>
							</FadeUp>
						))}
				</div>
			</div>
		</section>
	);
}

export default CertificationsSection;