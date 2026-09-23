"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { useTranslation } from "@/hooks";
import { FadeUp } from "@/components/animations/Fade";
import { SectionHeader } from "@/components/sections/shared/SectionHeader";
import { Blob } from "@/components/sections/shared/decor";

interface Deadline {
	label?: string | null;
	value?: string | null;
}

interface OpeningAction {
	icon?: string | null;
	label?: string | null;
	href?: string | null;
}

interface TorData {
	positionSummary?: string | null;
	duties?: (string | null)[] | null;
	qualifications?: (string | null)[] | null;
	engagement?: string | null;
}

interface TorLabels {
	button?: string | null;
	modalTitle?: string | null;
	summaryTitle?: string | null;
	dutiesTitle?: string | null;
	qualificationsTitle?: string | null;
	engagementTitle?: string | null;
}

interface Opening {
	icon?: string | null;
	title?: string | null;
	applicationDeadline?: Deadline | null;
	description?: string | null;
	actions?: OpeningAction[] | null;
	tor?: TorData | null;
}

export interface CurrentOpeningsContent {
	tag?: string | null;
	headline?: string | null;
	description?: string | null;
	torLabels?: TorLabels | null;
	featuredOpenings?: Opening[] | null;
	items?: Opening[] | null;
}

function parseDeadline(value: string): Date | null {
	const date = new Date(value);
	return isNaN(date.getTime()) ? null : date;
}

function formatDeadline(value: string | null | undefined, mounted: boolean): string {
	if (!mounted || !value) return value ?? "";
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

function isPast(value: string | null | undefined, mounted: boolean): boolean {
	if (!mounted || !value) return false;
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
		<a href={action.href ?? "#"} aria-disabled={disabled} className={classes}>
			{action.icon && <span className={`mdi mdi-${action.icon} text-base`} />}
			{action.label}
		</a>
	);
}

function TorButton({
	label,
	onOpen,
	disabled,
	tone = "light",
}: {
	label: string | null | undefined;
	onOpen: () => void;
	disabled: boolean;
	tone?: "light" | "dark";
}) {
	const classes =
		tone === "dark"
			? "inline-flex items-center gap-2.5 rounded-full border border-surface/40 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-surface transition-colors duration-300 hover:bg-surface hover:text-ink cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
			: "inline-flex items-center gap-2.5 rounded-full border border-ink/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-ink transition-colors duration-300 hover:border-primary hover:text-primary cursor-pointer disabled:opacity-40 disabled:pointer-events-none";

	return (
		<button type="button" onClick={onOpen} disabled={disabled} className={classes}>
			<span className="mdi mdi-text-box-search-outline text-base" />
			{label}
		</button>
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

interface OpeningCardProps {
	opening: Opening;
	mounted: boolean;
	labels?: TorLabels | null;
	onViewTor?: (opening: Opening) => void;
	featured?: boolean;
}

function OpeningCard({
	opening,
	mounted,
	labels,
	onViewTor,
	featured = false,
}: OpeningCardProps) {
	const disabled = opening.applicationDeadline
		? isPast(opening.applicationDeadline.value, mounted)
		: false;

	const torButton =
		opening.tor && labels?.button && onViewTor ? (
			<TorButton
				label={labels.button}
				onOpen={() => onViewTor(opening)}
				disabled={false}
				tone={featured ? "dark" : "light"}
			/>
		) : null;

	if (featured) {
		return (
			<FadeUp>
				<article className="relative rounded-c ink-panel card-shadow overflow-hidden p-8 sm:p-10 lg:p-12">
					<span className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-primary-300/30 blur-[90px] pointer-events-none" />

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
								{torButton}
								{(opening.actions ?? []).map((action, index) => (
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
			<article className="group h-full flex flex-col rounded-c bg-surface hairline card-shadow p-7 sm:p-8 transition-all duration-250 hover:card-shadow-lift hover:border-primary">
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
					{torButton}
					{(opening.actions ?? []).map((action, index) => (
						<OpeningActionButton key={index} action={action} disabled={disabled} />
					))}
				</div>
			</article>
		</FadeUp>
	);
}

interface TorModalProps {
	opening: Opening;
	labels: TorLabels;
	onClose: () => void;
}

function TorModal({ opening, labels, onClose }: TorModalProps) {
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", onKey);
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.style.overflow = "";
		};
	}, [onClose]);

	return (
		<div
			className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-8 bg-ink/70 overflow-hidden backdrop-blur-sm"
			onClick={onClose}
			role="dialog"
			aria-modal="true"
			aria-label={`${labels.modalTitle}: ${opening.title}`}
		>
			<div
				className="relative w-full max-w-2xl rounded-c bg-surface hairline card-shadow max-h-[85vh] flex flex-col overflow-hidden"
				onClick={(e) => e.stopPropagation()}
			>
				<button
					type="button"
					aria-label="Close"
					onClick={onClose}
					className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-surface hairline text-on-surface/60 transition-colors duration-300 hover:bg-primary hover:text-surface cursor-pointer"
				>
					<span className="mdi mdi-close text-lg" />
				</button>

				<div className="shrink-0 px-8 sm:px-10 pt-8 sm:pt-10 pb-5">
					<p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
						{labels.modalTitle}
					</p>
					<h3 className="mt-2 pr-12 text-xl sm:text-2xl font-medium tracking-tight text-ink leading-snug">
						{opening.title}
					</h3>
				</div>

				<div className="flex-1 min-h-0 overflow-y-auto px-8 sm:px-10 pb-8 sm:pb-10">
					<section>
						<h4 className="text-xs font-semibold uppercase tracking-widest text-primary">
							{labels.summaryTitle}
						</h4>
						<p className="mt-3 text-sm text-on-surface/70 leading-relaxed">
							{opening.tor!.positionSummary}
						</p>
					</section>

				<section className="mt-7">
					<h4 className="text-xs font-semibold uppercase tracking-widest text-primary">
						{labels.dutiesTitle}
					</h4>
					<ul className="mt-3 grid grid-cols-1 gap-2.5">
						{(opening.tor!.duties ?? []).map((duty, index) => (
							<li
								key={index}
								className="flex items-start gap-3 text-sm text-on-surface/70 leading-relaxed"
							>
								<span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-primary-50 text-primary flex items-center justify-center">
									<span className="mdi mdi-check text-xs" />
								</span>
								{duty}
							</li>
						))}
					</ul>
				</section>

				<section className="mt-7">
					<h4 className="text-xs font-semibold uppercase tracking-widest text-primary">
						{labels.qualificationsTitle}
					</h4>
					<ul className="mt-3 grid grid-cols-1 gap-2.5">
						{(opening.tor!.qualifications ?? []).map((qualification, index) => (
							<li
								key={index}
								className="flex items-start gap-3 text-sm text-on-surface/70 leading-relaxed"
							>
								<span className="mt-0.5 h-5 w-5 shrink-0 rounded-full bg-primary-50 text-primary flex items-center justify-center">
									<span className="mdi mdi-school-outline text-xs" />
								</span>
								{qualification}
							</li>
						))}
					</ul>
				</section>

				{opening.tor!.engagement && (
					<section className="mt-7 border-t border-ink/10 pt-6">
						<h4 className="text-xs font-semibold uppercase tracking-widest text-primary">
							{labels.engagementTitle}
						</h4>
						<p className="mt-3 text-sm text-on-surface/70 leading-relaxed">
							{opening.tor!.engagement}
						</p>
					</section>
				)}
				</div>
			</div>
		</div>
	);
}

export function CurrentOpeningsSection({ data, id }: { data?: CurrentOpeningsContent | null; id?: string } = {}) {
	const { t } = useTranslation(["careers"]);
	// Keystatic-owned content when `data` is provided (M11
	// `careersOpenings` unique section); legacy `careers:currentOpenings`
	// locale strings otherwise. Deadline math, the TOR modal and the
	// mounted flag stay in the renderer — only strings and dates are data.
	const section = (data ??
		(t("careers:currentOpenings", {
			returnObjects: true,
		}) as unknown as CurrentOpeningsContent)) as CurrentOpeningsContent;

	// Hydration-safe "mounted" flag: false during SSR + hydration, true after.
	// Lets date formatting / "deadline passed" checks render stable markup on
	// the server and only specialize on the client after mount.
	const mounted = useSyncExternalStore(
		() => () => undefined,
		() => true,
		() => false,
	);

	const [activeTor, setActiveTor] = useState<Opening | null>(null);

	const featured = Array.isArray(section.featuredOpenings) ? section.featuredOpenings : [];
	const items = Array.isArray(section.items) ? section.items : [];

	return (
		<section id={id ?? "openings"} className="py-24 sm:py-28 relative overflow-hidden ">
			<Blob className="w-[28rem] h-[28rem] bg-primary-100/60 -top-24 -right-24" opacity={0.5} />

			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<SectionHeader
						tag={section.tag ?? undefined}
						headline={section.headline ?? ""}
						description={section.description ?? undefined}
						align="center"
					/>
				</FadeUp>

				{featured.length > 0 && (
					<div className="mt-14 sm:mt-20 space-y-5">
						{featured.map((opening, index) => (
							<OpeningCard
								key={index}
								opening={opening}
								mounted={mounted}
								labels={section.torLabels}
								onViewTor={setActiveTor}
								featured
							/>
						))}
					</div>
				)}

				{items.length > 0 && (
					<div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 items-start">
						{items.map((opening, index) => (
							<OpeningCard
								key={index}
								opening={opening}
								mounted={mounted}
								labels={section.torLabels}
								onViewTor={setActiveTor}
							/>
						))}
					</div>
				)}
			</div>

			{activeTor && section.torLabels && (
				<TorModal
					opening={activeTor}
					labels={section.torLabels}
					onClose={() => setActiveTor(null)}
				/>
			)}
		</section>
	);
}

export default CurrentOpeningsSection;
