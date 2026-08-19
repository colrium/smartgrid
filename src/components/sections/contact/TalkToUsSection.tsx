"use client";

import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home/SectionHeader";
import { Blob } from "@/components/sections/home/decor";

interface TalkContact {
	icon?: string;
	label: string;
	href: string;
	note?: string;
    color?: string;
    target?: string;
}

interface TalkToUsContent {
	tag?: string | null;
	headline: string;
	description?: string;
	contacts: TalkContact[];
}

export function TalkToUsSection() {
	const { t } = useTranslation(["contact"]);
	const section = t("contact:talkToUs", {
		returnObjects: true,
	}) as unknown as TalkToUsContent;
	const contacts = Array.isArray(section.contacts) ? section.contacts : [];

	return (
		<section className="py-24 sm:py-28 relative overflow-hidden">
			<Blob
				className="w-[28rem] h-[28rem] bg-primary-100/60 -top-24 -right-24"
				opacity={0.5}
			/>
			<div className="group">
				<div className="bg-primary-500 text-primary-500 group-hover:bg-primary-500"></div>
				<div className="bg-primary-700 text-primary-700 group-hover:bg-primary-700"></div>
				<div className="bg-whatsapp text-whatsapp group-hover:bg-whatsapp"></div>
				<div className="bg-gmail text-gmail group-hover:bg-gmail"></div>
				<div className="bg-calendly text-calendly group-hover:bg-calendly"></div>
			</div>
			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<SectionHeader
						tag={section.tag ?? undefined}
						headline={section.headline}
						description={section.description}
						align="center"
					/>
				</FadeUp>

				<div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
					{contacts.map((contact, index) => (
						<FadeUp key={index} delay={(index % 3) * 0.07}>
							<a
								href={contact.href}
								className="relative group flex flex-col gap-6 h-full rounded-[20px] bg-surface overflow-hidden hairline card-shadow p-7 sm:p-8 transition-all duration-500 hover:card-shadow-lift hover:border-primary"
								target="_blank"
							>
								<div className="flex items-center justify-between">
									<span
										className={`h-12 w-12 rounded-2xl bg-primary-50 text-${contact.color || "primary"} flex items-center justify-center transition-colors duration-300 group-hover:bg-${contact.color || "primary"} group-hover:text-surface`}
									>
										{contact.icon && (
											<span className={`mdi mdi-${contact.icon} text-2xl`} />
										)}
									</span>
									<span
										className={`mdi mdi-arrow-up-right text-xl text-${contact.color || "on-surface"} opacity-0 -translate-x-1 translate-y-1 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0`}
									/>
								</div>

								<div className="flex flex-col gap-1.5">
									<span className="text-base font-semibold tracking-tight text-ink break-all">
										{contact.label}
									</span>
									{contact.note && (
										<span className="text-sm text-on-surface/55">
											{contact.note}
										</span>
									)}
								</div>
								{contact.icon && (
									<span
										className={`absolute -bottom-10 -right-8 text-on-surface opacity-5 pointer-events-none`}
										aria-hidden
									>
										<span
											className={`mdi mdi-${contact.icon} text-[13rem] leading-none`}
										/>
									</span>
								)}
							</a>
						</FadeUp>
					))}
				</div>
			</div>
		</section>
	);
}

export default TalkToUsSection;