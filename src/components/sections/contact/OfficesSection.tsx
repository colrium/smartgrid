"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home/SectionHeader";
import { Blob } from "@/components/sections/home/decor";

interface Office {
	id?: string;
	label: string;
	city: string;
	country: string;
	flag?: string;
	address_lines?: string[] | null;
	phone?: string;
	email?: string;
	hours?: string;
	type?: string;
	note?: string;
}

interface OfficesContent {
	tag?: string | null;
	headline: string;
	description?: string;
	items: Office[];
	cta?: { label: string; href: string } | null;
}

function typeLabel(type?: string): string {
	switch (type) {
		case "hq":
			return "HQ";
		case "field":
			return "Field Office";
		case "regional":
			return "Regional";
		default:
			return type ? type.toUpperCase() : "Office";
	}
}

export function OfficesSection() {
	const { t } = useTranslation(["contact"]);
	const section = t("contact:offices", {
		returnObjects: true,
	}) as unknown as OfficesContent;
	const offices = Array.isArray(section.items) ? section.items : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden bg-surface">
			<Blob className="w-[28rem] h-[28rem] bg-primary-100/60 -top-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<SectionHeader
						tag={section.tag ?? undefined}
						headline={section.headline}
						description={section.description}
						align="center"
					/>
				</FadeUp>

				<div className="mt-12 sm:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
					{offices.map((office, index) => (
						<FadeUp key={index} delay={(index % 2) * 0.08} className="h-full">
							<article className="h-full flex flex-col rounded-[20px] bg-surface hairline card-shadow overflow-hidden transition-all duration-500 hover:card-shadow-lift hover:border-primary">
								<div className="relative flex items-center gap-4 px-7 sm:px-9 pt-8 sm:pt-10 pb-7 border-b border-primary/10">
									<span className="h-14 w-14 shrink-0 rounded-2xl bg-primary-50 flex items-center justify-center text-3xl">
										{office.flag}
									</span>
									<div className="flex flex-col gap-1 min-w-0">
										<h3 className="text-lg sm:text-xl font-semibold tracking-tight text-ink leading-snug">
											{office.label}
										</h3>
										<span className="text-sm text-on-surface/55">
											{office.city}, {office.country}
										</span>
									</div>
									<span className="ml-auto shrink-0 inline-flex items-center gap-1.5 rounded-full bg-primary-50 text-primary px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest">
										<span className="h-1.5 w-1.5 rounded-full bg-primary" />
										{typeLabel(office.type)}
									</span>
								</div>

								<div className="flex flex-col gap-4 px-7 sm:px-9 py-7 sm:py-8 flex-1">
									{office.address_lines && office.address_lines.length > 0 && (
										<div className="flex flex-col gap-1.5">
											{office.address_lines.map((line, i) => (
												<span key={i} className="flex items-start gap-3 text-sm text-on-surface/70 leading-relaxed">
													<span className="mt-0.5 mdi mdi-map-marker-outline text-primary text-lg shrink-0" />
													{line}
												</span>
											))}
										</div>
									)}

									{office.phone && (
										<a
											href={`tel:${office.phone.replace(/[^+\d]/g, "")}`}
											className="flex items-center gap-3 text-sm text-on-surface/70 leading-relaxed transition-colors duration-300 hover:text-primary"
										>
											<span className="mdi mdi-phone-outline text-primary text-lg shrink-0" />
											{office.phone}
										</a>
									)}

									{office.email && (
										<a
											href={`mailto:${office.email}`}
											className="flex items-center gap-3 text-sm text-on-surface/70 leading-relaxed transition-colors duration-300 hover:text-primary break-all"
										>
											<span className="mdi mdi-email-outline text-primary text-lg shrink-0" />
											{office.email}
										</a>
									)}

									{office.hours && (
										<span className="flex items-center gap-3 text-sm text-on-surface/70 leading-relaxed">
											<span className="mdi mdi-clock-outline text-primary text-lg shrink-0" />
											{office.hours}
										</span>
									)}
								</div>

								{office.note && (
									<div className="px-7 sm:px-9 pb-8 sm:pb-10">
										<p className="rounded-[14px] bg-primary-50/60 px-4 py-3.5 text-sm text-on-surface/70 leading-relaxed">
											{office.note}
										</p>
									</div>
								)}
							</article>
						</FadeUp>
					))}
				</div>

				{section.cta?.href && (
					<FadeUp className="mt-14 sm:mt-16 flex justify-center">
						<Link
							href={section.cta.href}
							className="group inline-flex items-center gap-3 h-14 rounded-full bg-ink px-9 text-surface text-base font-medium transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary hover:shadow-[0_18px_42px_-10px_rgba(1,55,61,0.45)]"
						>
							{section.cta.label}
							<span className="mdi mdi-arrow-right text-xl transition-transform duration-300 group-hover:translate-x-1" />
						</Link>
					</FadeUp>
				)}
			</div>
		</section>
	);
}

export default OfficesSection;