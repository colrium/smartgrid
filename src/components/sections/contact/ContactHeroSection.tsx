"use client";

import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionTag } from "@/components/SectionTag";
import { Blob } from "@/components/sections/home/decor";

interface HeroBadge {
	text: string;
	status: string;
}

interface ContactHeroContent {
	tag: string;
	headline: string;
	description?: string;
	badge?: HeroBadge | null;
}

export function ContactHeroSection() {
	const { t } = useTranslation(["contact"]);
	const hero = t("contact:hero", { returnObjects: true }) as unknown as ContactHeroContent;
	const active = hero.badge?.status === "active";

	return (
		<section className="relative overflow-hidden bg-surface pt-40 sm:pt-44 pb-20 sm:pb-24">
			
			<Blob className="w-[30rem] h-[30rem] bg-primary-100/60 -top-32 -left-24" opacity={0.5} />
			<Blob className="w-[26rem] h-[26rem] bg-primary/10 -bottom-24 -right-20" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-10 sm:pt-16 pb-8 sm:pb-12">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
					<FadeUp className="lg:col-span-7">
						<SectionTag>{hero.tag}</SectionTag>

						<h1 className="mt-6 font-light tracking-tight leading-[1.05] text-4xl sm:text-5xl lg:text-6xl text-ink">
							{hero.headline}
						</h1>

						{hero.description && (
							<p className="mt-7 max-w-xl text-base sm:text-lg text-on-surface/60 leading-relaxed">
								{hero.description}
							</p>
						)}
					</FadeUp>

					<FadeUp className="lg:col-span-5" delay={0.12}>
						<div className="relative">
							<span
								className="absolute -inset-5 rounded-[26px] border-2 border-dashed border-primary/25 pointer-events-none"
								aria-hidden
							/>
							<div className="relative rounded-[24px] ink-panel card-shadow overflow-hidden p-8 sm:p-10">
								<span className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-primary-300/25 blur-[80px] pointer-events-none" />

								{hero.badge && (
									<div className="relative flex flex-col gap-7">
										<div className="flex items-center gap-3">
											<span className="relative flex h-3 w-3">
												{active && (
													<span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
												)}
												<span
													className={`relative inline-flex h-3 w-3 rounded-full ${
														active ? "bg-green-400" : "bg-amber-400"
													}`}
												/>
											</span>
											<span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-surface/60">
												{hero.badge.status}
											</span>
										</div>

										<span className="text-3xl sm:text-4xl font-light tracking-tight leading-tight text-surface">
											{hero.badge.text}
										</span>

										<div className="h-px w-full bg-surface/10" />

										<div className="flex items-center gap-3">
											<span className="h-10 w-10 rounded-xl bg-surface/10 text-primary-300 flex items-center justify-center">
												<span className="mdi mdi-headset text-xl" />
											</span>
											<span className="text-sm text-surface/65 leading-relaxed">
												SmartGrid Surveying &amp; Civil Engineering Ltd
											</span>
										</div>
									</div>
								)}

								<span
									className="absolute -bottom-8 -right-12 text-surface/6 pointer-events-none"
									aria-hidden
								>
									<span className="mdi mdi-map-marker-radius-outline text-[16rem] leading-none" />
								</span>
							</div>
						</div>
					</FadeUp>
				</div>
			</div>
		</section>
	);
}

export default ContactHeroSection;