"use client";

import Link from "next/link";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionTag } from "@/components/SectionTag";

interface SocialItem {
	name?: string;
	mane?: string;
	url: string;
}

function socialMeta(url: string): { label: string; icon: string } {
	if (/facebook/i.test(url)) return { label: "Facebook", icon: "mdi-facebook" };
	if (/wa\.me|whatsapp/i.test(url)) return { label: "WhatsApp", icon: "mdi-whatsapp" };
	if (/linkedin/i.test(url)) return { label: "LinkedIn", icon: "mdi-linkedin" };
	return { label: "Follow us", icon: "mdi-web" };
}

export function SocialsSection() {
	const { t } = useTranslation(["sectional-properties"]);
	const socials = t("sectional-properties:socials.items", {
		returnObjects: true,
	}) as unknown as SocialItem[];
	const items = Array.isArray(socials) ? socials : [];

	return (
		<section className="pb-24 sm:pb-28 relative overflow-hidden">
			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<div className="relative rounded-[20px] ink-panel card-shadow overflow-hidden px-8 py-16 sm:px-12 text-center">
						<span className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-primary-300/30 blur-[90px] pointer-events-none" />
						<span className="absolute -bottom-28 -left-20 w-72 h-72 rounded-full bg-primary/30 blur-[90px] pointer-events-none" />
						<span
							className="absolute inset-3 rounded-[15px] hairline-dark pointer-events-none"
							aria-hidden
						/>

						<div className="relative flex flex-col items-center gap-8">
							<SectionTag dark>
								Sectional Properties
							</SectionTag>

							<div className="flex flex-wrap items-center justify-center gap-4">
								{items.map((item, index) => {
									const meta = socialMeta(item.url || "");
									const label = (item.name || item.mane || meta.label).trim();
									return (
										<Link
											key={index}
											href={item.url}
											target="_blank"
											rel="noopener noreferrer"
											className="group inline-flex items-center gap-3 h-14 rounded-full border border-surface/30 px-8 text-surface text-base transition-all duration-300 hover:border-surface hover:bg-surface/10"
										>
											<span
												className={`mdi ${meta.icon} text-lg text-primary-200`}
											/>
											{label}
										</Link>
									);
								})}
							</div>
						</div>
					</div>
				</FadeUp>
			</div>
		</section>
	);
}

export default SocialsSection;