/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";
import { useRouter } from "next/router";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation, useCookieConsent } from "@/hooks";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import Link from "@/components/Link";
import { loadGoogleAnalytics, trackPageView } from "@/lib/consent";
import type { ConsentCategories } from "@/lib/consent";

interface PreferenceRow {
    key: "necessary" | "functional" | "analytics";
    locked: boolean;
}

const PREFERENCE_ROWS: PreferenceRow[] = [
    { key: "necessary", locked: true },
    { key: "functional", locked: false },
    { key: "analytics", locked: false },
];

/**
 * Non-obtrusive GDPR cookie consent.
 *
 * Renders a small, non-blocking card in the bottom-left corner - no backdrop,
 * no scroll lock, the page stays fully interactive while the visitor decides.
 * Non-essential cookies (analytics, live chat) are never set until consent is
 * given, and can be reviewed or withdrawn at any time via the footer link.
 */
export default function CookieConsent(): ReactElement | null {
    const { t } = useTranslation("common");
    const router = useRouter();
    const { hydrated, consent, open, customizing, hydrate, close, setCustomizing, save } =
        useCookieConsent();
    const containerRef = useRef<HTMLElement>(null);
    const [draft, setDraft] = useState<ConsentCategories>({
		functional: true,
		analytics: true,
	});

    useEffect(() => {
        hydrate();
    }, [hydrate]);

    // Seed the draft from the stored decision whenever the dialog appears, so
    // re-opening preferences shows the current state (never pre-ticked opt-ins
    // on a first visit - GDPR requires unticked boxes by default).
    useEffect(() => {
        if (open) {
            
            setDraft({
                functional: consent?.functional ?? false,
                analytics: consent?.analytics ?? false,
            });
        }
    }, [open, consent]);

    // Move focus into the dialog when it appears (non-modal: no focus trap).
    useEffect(() => {
        if (open) containerRef.current?.focus({ preventScroll: true });
    }, [open, customizing]);

    // Google Analytics only ever loads once analytics consent is granted.
    useEffect(() => {
        const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
        if (consent?.analytics && measurementId) loadGoogleAnalytics(measurementId);
    }, [consent?.analytics]);

    // Mirror the @next/third-parties behaviour: page_view on client-side
    // navigation, but only while analytics consent is active.
    useEffect(() => {
        if (!consent?.analytics) return;
        const handler = (url: string) => trackPageView(url, document.title);
        router.events.on("routeChangeComplete", handler);
        return () => {
            router.events.off("routeChangeComplete", handler);
        };
    }, [consent?.analytics, router.events]);

    if (!hydrated || !open) return null;

    const canDismiss = Boolean(consent);

    const handleToggle = (key: PreferenceRow["key"], checked: boolean) => {
        if (key === "necessary") return; // always-on, cannot be toggled
        setDraft((current) => ({ ...current, [key]: checked }));
    };

    return (
		<motion.aside
			ref={containerRef}
			tabIndex={-1}
			role="dialog"
			aria-modal="false"
			aria-labelledby="cookie-consent-title"
			aria-describedby="cookie-consent-description"
			initial={{ opacity: 0, y: 24 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
			className="outline-none fixed inset-x-4 bottom-20 z-999990 overflow-hidden rounded-c border border-ink/10 bg-surface shadow-xl sm:inset-x-auto sm:bottom-6 sm:left-6 sm:w-96"
		>
			<header className="flex items-start gap-3 px-5 pt-5 pb-3">
				<span
					aria-hidden
					className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary"
				>
					<span className="mdi mdi-cookie-outline text-lg leading-none" />
				</span>
				<div className="min-w-0 flex-1">
					<h2
						id="cookie-consent-title"
						className="font-display text-base font-semibold text-ink"
					>
						{t("common:cookies.title")}
					</h2>
					<p
						id="cookie-consent-description"
						className="mt-1.5 text-xs leading-relaxed text-on-surface-700"
					>
						{t("common:cookies.description")}
					</p>
				</div>
				{canDismiss && (
					<button
						type="button"
						onClick={close}
						aria-label={t("common:cookies.back")}
						className="cursor-pointer rounded-full flex items-center justify-center w-8 h-8 p-1 text-red-500/50 transition-colors hover:bg-red-200 hover:text-red-500"
					>
						<span aria-hidden className="mdi mdi-close text-base leading-none" />
					</button>
				)}
			</header>
			<div className="px-5 pb-5">
				<AnimatePresence mode="wait" initial={false}>
					{customizing ? (
						<motion.div
							key="preferences"
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: "auto", opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
							className="overflow-hidden"
						>
							<p className="text-[11px] leading-relaxed text-on-surface-600">
								{t("common:cookies.preferencesDescription")}
							</p>
							<ul className="mt-2 flex flex-col divide-y divide-ink/5">
								{PREFERENCE_ROWS.map((row) => (
									<li key={row.key}>
										<label
											className={`flex items-start gap-3 py-3 ${
												row.locked ? "cursor-not-allowed" : "cursor-pointer"
											}`}
										>
											<Checkbox
												checked={
													row.locked ||
													draft[row.key as "functional" | "analytics"]
												}
												disabled={row.locked}
												onChange={(event) =>
													handleToggle(row.key, event.target.checked)
												}
											/>
											<span className="min-w-0 flex-1">
												<span className="flex flex-wrap items-center gap-2">
													<span className="text-xs font-semibold text-ink">
														{t(
															`common:cookies.categories.${row.key}.label`
														)}
													</span>
													{row.locked && (
														<span className="rounded-full bg-primary-50 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-primary-700">
															{t(
																"common:cookies.categories.necessary.alwaysActive"
															)}
														</span>
													)}
												</span>
												<span className="mt-0.5 block text-[11px] leading-snug text-on-surface-600">
													{t(
														`common:cookies.categories.${row.key}.description`
													)}
												</span>
											</span>
										</label>
									</li>
								))}
							</ul>
							<div className="mt-3 grid grid-cols-2 gap-2">
								<Button
									variant="text"
									color="secondary"
									size="small"
									rounded="full"
									onClick={() => setCustomizing(false)}
								>
									{t("common:cookies.back")}
								</Button>
								<Button
									variant="contained"
									color="primary"
									size="small"
									rounded="full"
									onClick={() => save(draft)}
								>
									{t("common:cookies.savePreferences")}
								</Button>
							</div>
						</motion.div>
					) : (
						<motion.div
							key="quick-actions"
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: "auto", opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
							className="overflow-hidden"
						>
							{/* Rejecting is as prominent as accepting (no dark patterns). */}
							<div className="grid grid-cols-2 gap-2">
								<Button
									variant="contained"
									color="primary"
									size="small"
									rounded="full"
									fullWidth
									onClick={() => save({ functional: true, analytics: true })}
								>
									{t("common:cookies.acceptAll")}
								</Button>
								<Button
									variant="outlined"
									color="secondary"
									size="small"
									rounded="full"
									fullWidth
									onClick={() => save({ functional: false, analytics: false })}
								>
									{t("common:cookies.rejectAll")}
								</Button>
							</div>
							<div className="mt-1 flex items-center justify-between">
								<Button
									variant="text"
									color="primary"
									size="small"
									rounded="full"
									aria-haspopup="dialog"
									startIcon={
										<span
											aria-hidden
											className="mdi mdi-tune-variant text-base leading-none"
										/>
									}
									onClick={() => setCustomizing(true)}
								>
									{t("common:cookies.customize")}
								</Button>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
				<p className="mt-2 text-center text-[11px] text-on-surface-600">
					<Link
						href="/privacy-policy"
						className="text-primary underline underline-offset-2 transition-colors hover:text-primary-700"
					>
						{t("common:cookies.privacyLink")}
					</Link>
				</p>
			</div>

			<span className="mdi mdi-cookie absolute -bottom-18 -right-12 text-[20rem] text-ink-50/30 -z-1" />
		</motion.aside>
	);
}
