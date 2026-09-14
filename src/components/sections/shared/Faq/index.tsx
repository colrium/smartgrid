"use client";
import type { ReactElement } from "react";
import NextHead from "next/head";
import Link from "next/link";
import { SectionHeader, type SectionHeaderClassesProp } from "@/components/sections/shared/SectionHeader";
import { Blob } from "@/components/sections/shared/decor";
import { FadeUp } from "@/components/animations/Fade";
import { FaqSectionItems, buildFaqSchema, type FaqSectionItem } from "@/components/sections/FaqSectionItems";
export interface FaqClassesProp {
	sectionHeader?: SectionHeaderClassesProp;
	aside?: string;
	items?: string;
}
export interface FaqProps {
	tag?: string | null; headline: string; description?: string | null;
	items: FaqSectionItem[]; stillCurious?: { label?: string; description?: string; cta?: { label: string; href: string; icon?: string } | null } | null;
	id?: string; classes?: FaqClassesProp; className?: string;
}
export function Faq(props: FaqProps): ReactElement | null {
	const items = Array.isArray(props.items) ? props.items : [];
	if (items.length === 0) return null;
	return (
		<section id={props.id ?? "faq"} className={`py-24 sm:py-28 relative overflow-hidden ${props.className ?? ""}`.trim()}>
			<NextHead><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(buildFaqSchema(items)) }} /></NextHead>
			<Blob className="w-96 h-96 bg-primary-100/50 -left-24 top-1/3" opacity={0.5} />
			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
				<FadeUp className="lg:col-span-5 lg:sticky lg:top-28 self-start">
					<div className={`flex flex-col gap-8 ${props.classes?.aside ?? ""}`}>
						<SectionHeader tag={props.tag ?? undefined} headline={props.headline} description={props.description ?? undefined} classes={props.classes?.sectionHeader} />
						{props.stillCurious?.cta?.href ? (
							<div className="relative rounded-c ink-panel card-shadow overflow-hidden p-7">
								<span aria-hidden className={`mdi mdi-${props.stillCurious.cta.icon ?? "forum"} absolute -right-4 -bottom-6 text-[7rem] leading-none text-surface/[0.06] select-none pointer-events-none`} />
								<p className="relative text-lg font-medium tracking-tight text-surface">{props.stillCurious.label}</p>
								<p className="relative mt-1 text-sm text-surface/60 leading-relaxed">{props.stillCurious.description}</p>
								<Link href={props.stillCurious.cta.href} className="group relative mt-5 inline-flex items-center gap-2.5 h-12 rounded-full bg-surface px-6 text-ink text-sm font-medium transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:card-shadow-lift">
									<span className="h-1.5 w-1.5 rounded-full bg-primary" />{props.stillCurious.cta.label}
								</Link>
							</div>
						) : null}
					</div>
				</FadeUp>
				<div className={`lg:col-span-7 ${props.classes?.items ?? ""}`}><FaqSectionItems items={items} /></div>
			</div>
		</section>
	);
}
export default Faq;
