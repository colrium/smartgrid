"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/home/SectionHeader";
import { Blob } from "@/components/sections/home/decor";

interface Deadline {
	label: string;
	value: string;
}

interface OpeningAction {
	icon?: string;
	label: string;
	href: string;
}

interface Opening {
	icon?: string;
	title: string;
	applicationDeadline?: Deadline | null;
	description: string;
	actions: OpeningAction[];
}

interface CurrentOpeningsContent {
	tag?: string | null;
	headline: string;
	description?: string;
	featuredOpenings?: Opening[] | null;
	items: Opening[];
}

function parseDeadline(value: string): Date | null {
	const date = new Date(value);
	return isNaN(date.getTime()) ? null : date;
}

function formatDeadline(value: string, mounted: boolean): string {
	if (!mounted) return value;
	const date = parseDeadline(value);
	if (!date) return value;

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const threeMonthsFromNow = new Date(today);
	threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);

	const showYear = date.getTime() >= threeMonthsFromNow.getTime();

	return date.toLocaleDateString(
		"en-GB",
		showYear
			? { day: "numeric", month: "long", year: "numeric" }
			: { day: "numeric", month: "long" }
	);
}

function isPast(value: string, mounted: boolean): boolean {
	if (!mounted) return false;
	const date = parseDeadline(value);
	if (!date) return false;

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	return date.getTime() < today.getTime();
}

interface OpeningActionButtonProps {
	action: OpeningAction;
	disabled: boolean;
	tone?: "light" | "dark";
}

function OpeningActionButton({
	action,
	disabled,
	tone = "light",
}: OpeningActionButtonProps) {
	const classes = disabled
		? tone === "dark"
			? "inline-flex items-center gap-2.5 rounded-full bg-surface/10 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-surface/40 cursor-not-allowed pointer-events-none"
			: "inline-flex items-center gap-2.5 rounded-full bg-ink/5 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-on-surface/40 cursor-not-allowed pointer-events-none"
		: tone === "dark"
		? "inline-flex items-center gap-2.5 rounded-full bg-surface px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-ink transition-colors duration-300 hover:bg-primary hover:text-surface"
		: "inline-flex items-center gap-2.5 rounded-full bg-ink px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-surface transition-colors duration-300 hover:bg-primary";

	return (
		<a href={action.href} aria-disabled={disabled} className={classes}>
			{action.icon && <span className={`mdi mdi-${action.icon} text-base`} />}
			{action.label}
		</a>
	);
}

function DeadlinePill({ deadline, mounted }: { deadline: Deadline; mounted: boolean }) {
	const closed = isPast(deadline.value, mounted);

	return (
		<div className="flex items-center gap-3">
			<div className="flex flex-col gap-0.5">
				<span className="text-[10px] uppercase tracking-[0.18em] text-on-surface/45">
					{deadline.label}
				</span>
				<span className="text-sm font-semibold text-ink">
					{formatDeadline(deadline.value, mounted)}
				</span>
			</div>
			{closed && (
				<span className="inline-flex items-center gap-1 rounded-full bg-red-50 text-red-600 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest">
					<span className="h-1.5 w-1.5 rounded-full bg-red-500" />
					Closed
				</span>
			)}
		</div>
	);
}

function OpeningCard({ opening, mounted, featured = false }: { opening: Opening; mounted: boolean; featured?: boolean }) {
	const disabled = opening.applicationDeadline
		? isPast(opening.applicationDeadline.value, mounted)
		: false;

	if (featured) {
		return (
			<FadeUp>
				<article className="relative rounded-[20px] ink-panel card-shadow overflow-hidden p-8 sm:p-10 lg:p-12">
					<span className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-primary-300/30 blur-[90px] pointer-events-none" />
					<span className="absolute inset-3 rounded-[15px] hairline-dark pointer-events-none" aria-hidden />

					<div className="relative grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
						<div className="lg:col-span-8">
							<div className="flex items-center gap-4">
								<span className="h-14 w-14 rounded-2xl bg-surface/10 text-primary-300 flex items-center justify-center">
									{opening.icon && (
										<span className={`mdi mdi-${opening.icon} text-2xl`} />
									)}
								</span>
								<h3 className="text-2xl sm:text-3xl font-light tracking-tight text-white">
									{opening.title}
								</h3>
							</div>

							<p className="mt-6 max-w-2xl text-base text-white/65 leading-relaxed">
								{opening.description}
							</p>
						</div>

						<div className="lg:col-span-4 flex flex-col gap-7">
							{opening.applicationDeadline && (
								<div className="flex items-center gap-3">
									<div className="flex flex-col gap-0.5">
										<span className="text-[10px] uppercase tracking-[0.18em] text-surface/50">
											{opening.applicationDeadline.label}
										</span>
										<span className="text-lg font-semibold text-surface">
											{formatDeadline(opening.applicationDeadline.value, mounted)}
										</span>
									</div>
									{disabled && (
										<span className="inline-flex items-center gap-1 rounded-full bg-red-500/20 text-red-300 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest">
											<span className="h-1.5 w-1.5 rounded-full bg-red-400" />
											Closed
										</span>
									)}
								</div>
							)}

							<div className="flex flex-wrap gap-3">
								{opening.actions.map((action, index) => (
									<OpeningActionButton key={index} action={action} disabled={disabled} tone="dark" />
								))}
							</div>
						</div>
					</div>
				</article>
			</FadeUp>
		);
	}

	return (
		<FadeUp>
			<article className="group h-full flex flex-col rounded-[20px] bg-surface hairline card-shadow p-7 sm:p-8 transition-all duration-500 hover:card-shadow-lift hover:border-primary">
				<div className="flex items-start justify-between gap-4">
					<span className="h-14 w-14 rounded-2xl bg-primary-50 text-primary flex items-center justify-center transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
						{opening.icon && <span className={`mdi mdi-${opening.icon} text-2xl`} />}
					</span>

					{opening.applicationDeadline && (
						<DeadlinePill deadline={opening.applicationDeadline} mounted={mounted} />
					)}
				</div>

				<h3 className="mt-6 text-lg sm:text-xl font-semibold tracking-tight text-ink leading-snug">
					{opening.title}
				</h3>

				<p className="mt-3 flex-1 text-sm text-on-surface/70 leading-relaxed">
					{opening.description}
				</p>

				<div className="mt-7 flex flex-wrap gap-3">
					{opening.actions.map((action, index) => (
						<OpeningActionButton key={index} action={action} disabled={disabled} />
					))}
				</div>
			</article>
		</FadeUp>
	);
}

export function CurrentOpeningsSection() {
	const { t } = useTranslation(["careers"]);
	const section = t("careers:currentOpenings", {
		returnObjects: true,
	}) as unknown as CurrentOpeningsContent;

	const [mounted, setMounted] = useState(false);
	useEffect(() => setMounted(true), []);

	const featured = Array.isArray(section.featuredOpenings) ? section.featuredOpenings : [];
	const items = Array.isArray(section.items) ? section.items : [];

	return (
		<section id="openings" className="py-24 sm:py-28 relative overflow-hidden bg-surface">
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

				{featured.length > 0 && (
					<div className="mt-14 sm:mt-20 space-y-5">
						{featured.map((opening, index) => (
							<OpeningCard key={index} opening={opening} mounted={mounted} featured />
						))}
					</div>
				)}

				{items.length > 0 && (
					<div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 items-start">
						{items.map((opening, index) => (
							<OpeningCard key={index} opening={opening} mounted={mounted} />
						))}
					</div>
				)}
			</div>
		</section>
	);
}

export default CurrentOpeningsSection;