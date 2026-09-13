"use client";

import type { ReactElement } from "react";
import { FadeLeft, FadeRight, FadeUp } from "@/components/animations/Fade";
import { SectionShell } from "@/components/sections/shared/SectionShell";

export interface PricingCard {
	/** Card heading (e.g. "What drives the cost"). */
	title?: string | null;
	/** Check-bullet lines rendered inside the card. */
	items?: string[] | null;
}

export interface PricingProps {
	id?: string;
	tag?: string | null;
	headline: string;
	description?: string | null;
	/** Checklist cards (usually two: cost drivers vs inclusions). */
	cards?: PricingCard[] | null;
	/** Optional centred price band rendered below the cards. */
	price?: {
		label?: string | null;
		value?: string | null;
		note?: string | null;
	} | null;
	className?: string;
}

/** Shared check-bullet list (also reused by split info cards). */
export function CheckList(props: { items: string[]; className?: string }): ReactElement {
	return (
		<ul className={`grid grid-cols-1 gap-3 ${props.className ?? ""}`.trim()}>
			{props.items.map((item, index) => (
				<li
					key={index}
					className="flex items-start gap-3 text-sm text-on-surface/70 leading-relaxed"
				>
					<span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary">
						<span className="mdi mdi-check text-xs" aria-hidden />
					</span>
					{item}
				</li>
			))}
		</ul>
	);
}

/**
 * Shared pricing / cost-guidance section: centred header over the light
 * surface token, checklist cards and an optional price band. Consolidates the
 * per-page cost sections (topographical, cadastral, …) behind one
 * implementation driven entirely by locale data.
 */
export function Pricing(props: PricingProps): ReactElement | null {
	const cards = (Array.isArray(props.cards) ? props.cards : []).filter(
		(card) => card && Array.isArray(card.items) && card.items.length > 0,
	);
	const price = props.price?.value ? props.price : null;
	if (cards.length === 0 && !price) return null;

	return (
		<SectionShell
			id={props.id}
			tag={props.tag ?? null}
			headline={props.headline}
			description={props.description ?? undefined}
			align="center"
			tone="surface"
			className={props.className}
		>
			{cards.length > 0 ? (
				<div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
					{cards.map((card, index) =>
						index % 2 === 0 ? (
							<FadeLeft key={index} className="h-full">
								<article className="h-full flex flex-col gap-6 rounded-c bg-surface hairline card-shadow p-8">
									{card.title ? (
										<h3 className="text-lg font-semibold tracking-tight text-ink">
											{card.title}
										</h3>
									) : null}
									<CheckList items={card.items as string[]} />
								</article>
							</FadeLeft>
						) : (
							<FadeRight key={index} delay={0.08} className="h-full">
								<article className="h-full flex flex-col gap-6 rounded-c bg-surface hairline card-shadow p-8">
									{card.title ? (
										<h3 className="text-lg font-semibold tracking-tight text-ink">
											{card.title}
										</h3>
									) : null}
									<CheckList items={card.items as string[]} />
								</article>
							</FadeRight>
						),
					)}
				</div>
			) : null}

			{price ? (
				<FadeUp delay={0.1}>
					<div className="mt-8 relative rounded-c bg-surface hairline card-shadow overflow-hidden px-8 py-12 sm:px-12 text-center">
						<span
							className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-primary-100/60 blur-[90px] pointer-events-none"
							aria-hidden
						/>
						<span
							className="absolute -bottom-24 -left-16 w-56 h-56 rounded-full bg-primary-200/40 blur-[90px] pointer-events-none"
							aria-hidden
						/>

						<div className="relative flex flex-col items-center gap-4">
							{price.label ? (
								<p className="text-[11px] uppercase tracking-widest text-primary">
									{price.label}
								</p>
							) : null}
							<p className="font-light tracking-tight text-3xl sm:text-5xl text-ink">
								{price.value}
							</p>
							{price.note ? (
								<p className="text-sm text-on-surface/60 leading-relaxed max-w-2xl">
									{price.note}
								</p>
							) : null}
						</div>
					</div>
				</FadeUp>
			) : null}
		</SectionShell>
	);
}

export default Pricing;
