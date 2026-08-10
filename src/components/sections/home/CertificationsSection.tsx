"use client";

import { useTranslation } from "@/hooks";
import { SectionTag } from "@/components/SectionTag";
import { FadeUp } from "@/components/animations/Fade";

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
			<div className="absolute -bottom-24 -left-24 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

			<div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<div className="mt-4 mb-12 flex flex-col items-center gap-4 text-center">
						<SectionTag>{t("home:certifications.tag") as string}</SectionTag>
					</div>
				</FadeUp>

				<div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-7">
					{Array.isArray(items) &&
						items.map((item, index) => (
							<FadeUp key={index} delay={index * 0.1}>
								<div className="group h-full relative flex flex-col items-center justify-center text-center gap-4 rounded-3xl bg-surface border border-slate-200/70 shadow-sm hover:shadow-lg hover:border-primary/40 p-8 sm:p-10 transition-all duration-300 hover:-translate-y-1">
									<div className="relative">
										<span className="absolute -inset-3 rounded-full bg-primary/5 scale-90 group-hover:scale-110 transition-transform duration-300" />
										<span className="relative w-16 h-16 rounded-full border-2 border-primary/30 bg-brand-100 text-primary flex items-center justify-center transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-white">
											<span className="font-display font-bold text-xl leading-none">
												{item.name}
											</span>
										</span>
									</div>

									<div>
										<h3 className="text-base font-bold text-on-surface uppercase tracking-wide mb-1">
											{item.name}
										</h3>
										<p className="text-sm text-on-surface/70 leading-relaxed">
											{item.label}
										</p>
									</div>

									<span className="inline-flex items-center gap-1.5 text-primary">
										<span className="mdi mdi-shield-check text-xl" />
									</span>
								</div>
							</FadeUp>
						))}
				</div>
			</div>
		</section>
	);
}

export default CertificationsSection;