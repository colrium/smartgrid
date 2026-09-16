"use client";

import type { ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import { FadeUp, FadeLeft } from "@/components/animations/Fade";
import { SectionTag } from "@/components/SectionTag";

export interface AboutCardLink {
	icon?: string | null;
	href: string;
	label: string;
	description: string;
}

export interface AboutFeatureImage {
	url: string;
	alt: string;
	caption: string;
	title: string;
	description: string;
}

export interface AboutWhoWeAre {
	title: string;
	description: string;
}

export interface AboutMission {
	title: string;
	description: string;
}

export interface AboutContent {
	tag?: string | null;
	headline: string;
	description?: string;
	whoWeAre?: AboutWhoWeAre;
	mission?: AboutMission;
	featureImg?: AboutFeatureImage;
	cards?: AboutCardLink[] | null;
}

export interface AboutClassesProp {
	section?: string;
	narrative?: string;
	tag?: string;
	headline?: string;
	description?: string;
	whoWeAreTitle?: string;
	whoWeAreDescription?: string;
	missionTitle?: string;
	missionDescription?: string;
	cardsGrid?: string;
	card?: string;
	cardIcon?: string;
	cardLabel?: string;
	cardDescription?: string;
	mediaWrapper?: string;
	mediaCard?: string;
	mediaFrame?: string;
	mediaImage?: string;
	mediaCaption?: string;
	mediaCaptionLabel?: string;
	mediaTitle?: string;
	mediaDescription?: string;
}

export interface AboutProps {
	data: AboutContent;
	classes?: AboutClassesProp;
	id?: string;
	className?: string;
}

export function About(props: AboutProps): ReactElement | null {
	const data = props.data;
	const cards = Array.isArray(data?.cards) ? data.cards : [];

	if (!data?.headline) return null;

	return (
		<section
			id={props.id ?? "about"}
			className={`py-28 relative overflow-hidden ${props.classes?.section ?? ""} ${props.className ?? ""}`.trim()}
		>
			<div className="max-w-7xl mx-auto px-6">
				<div className="grid lg:grid-cols-12 gap-16 items-center">
					<div className={`lg:col-span-6 space-y-6 ${props.classes?.narrative ?? ""}`}>
						<FadeUp>
							<SectionTag className={`text-primary ${props.classes?.tag ?? ""}`}>
								{data.tag ?? ""}
							</SectionTag>

							<h2 className={`text-3xl sm:text-5xl font-light tracking-tight text-ink leading-tight ${props.classes?.headline ?? ""}`}>
								{data.headline}
							</h2>

							<p className={`text-on-surface/60 leading-relaxed text-base sm:text-lg ${props.classes?.description ?? ""}`}>
								{data.description ?? ""}
							</p>
						</FadeUp>
						<FadeUp>
							<h3 className={`text-xl sm:text-2xl font-medium tracking-tight text-primary leading-tight pt-2 ${props.classes?.whoWeAreTitle ?? ""}`}>
								{data.whoWeAre?.title ?? ""}
							</h3>

							<p className={`text-on-surface/60 leading-relaxed text-sm sm:text-base ${props.classes?.whoWeAreDescription ?? ""}`}>
								{data.whoWeAre?.description ?? ""}
							</p>
						</FadeUp>
						<FadeUp>
							<h3 className={`text-xl sm:text-2xl font-medium tracking-tight text-primary leading-tight pt-2 ${props.classes?.missionTitle ?? ""}`}>
								{data.mission?.title ?? ""}
							</h3>

							<p className={`text-on-surface/60 leading-relaxed text-sm sm:text-base ${props.classes?.missionDescription ?? ""}`}>
								{data.mission?.description ?? ""}
							</p>
						</FadeUp>

						{cards.length > 0 && (
							<div className={`pt-4 grid grid-cols-1 md:grid-cols-2 gap-4 ${props.classes?.cardsGrid ?? ""}`}>
								{cards.map((card, index) => (
									<FadeUp key={`about-card-${index}`} delay={(index % 3) * 0.1}>
										<Link href={card.href}>
											<div className={`p-4 rounded-cmd bg-surface hairline hover:border-primary cursor-pointer transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 h-full hover:card-shadow-lift flex items-start gap-3 ${props.classes?.card ?? ""}`}>
												<div className={`p-2.5 rounded-lg bg-primary-50 text-primary ${props.classes?.cardIcon ?? ""}`}>
													<span className={`mdi mdi-${card.icon}`} />
												</div>
												<div>
													<h4 className={`font-semibold text-sm text-ink ${props.classes?.cardLabel ?? ""}`}>
														{card.label}
													</h4>
													<p className={`text-xs text-on-surface/60 mt-1 leading-relaxed ${props.classes?.cardDescription ?? ""}`}>
														{card.description}
													</p>
												</div>
											</div>
										</Link>
									</FadeUp>
								))}
							</div>
						)}
					</div>

					<div className="lg:col-span-6 -order-1 lg:order-2">
						<div className="relative mx-auto max-w-md lg:max-w-none">
							<div
								className="absolute -top-6 -left-6 w-32 h-32"
								style={{
									background:
										"radial-gradient(closest-side, rgba(0,151,178,0.10), transparent 70%)",
								}}
							/>
							<div
								className="absolute -bottom-6 -right-6 w-32 h-32"
								style={{
									background:
										"radial-gradient(closest-side, rgba(0,151,178,0.20), transparent 70%)",
								}}
							/>
							<FadeLeft>
								<div className={`relative bg-surface p-4 rounded-c hairline card-shadow ${props.classes?.mediaCard ?? ""}`}>
									<div className={`relative aspect-4/5 rounded-xl overflow-hidden bg-slate-900 group ${props.classes?.mediaFrame ?? ""}`}>
										{data.featureImg?.url ? (
											<Image
												src={data.featureImg.url}
												alt={data.featureImg.alt ?? data.headline}
												fill
												sizes="(min-width: 1024px) 384px, min(100vw, 448px)"
												className={`object-cover object-top transition-transform duration-700 group-hover:scale-105 opacity-80 ${props.classes?.mediaImage ?? ""}`}
											/>
										) : null}
										<div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />

										<div className={`absolute bottom-6 left-6 right-6 text-surface ${props.classes?.mediaCaption ?? ""}`}>
											<span className={`text-xs font-mono text-primary-200 uppercase font-bold tracking-wider ${props.classes?.mediaCaptionLabel ?? ""}`}>
												{data.featureImg?.caption ?? ""}
											</span>
											<h3 className={`text-xl font-light mt-1 ${props.classes?.mediaTitle ?? ""}`}>
												{data.featureImg?.title ?? ""}
											</h3>
											<p className={`text-xs text-surface/70 mt-2 leading-relaxed ${props.classes?.mediaDescription ?? ""}`}>
												{data.featureImg?.description ?? ""}
											</p>
										</div>
									</div>
								</div>
							</FadeLeft>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default About;