import { create } from "zustand";
import {
    CONSENT_STORAGE_KEY,
    type ConsentCategories,
    type ConsentDecision,
    type ConsentRecord,
    buildConsent,
    persistConsent,
    purgeOptionalCookies,
    readConsent,
} from "@/lib/consent";

interface CookieConsentState {
    /** True once the persisted consent record has been read on the client. */
    hydrated: boolean;
    consent: ConsentRecord | null;
    /** Whether the consent dialog is currently visible. */
    open: boolean;
    /** Whether the granular preferences panel is expanded. */
    customizing: boolean;
    hydrate: () => void;
    openPreferences: (options?: { customizing?: boolean }) => void;
    close: () => void;
    setCustomizing: (customizing: boolean) => void;
    save: (categories: ConsentCategories) => void;
}

export const useCookieConsentStore = create<CookieConsentState>()((set, get) => ({
    hydrated: false,
    consent: null,
    open: false,
    customizing: false,

    hydrate: () => {
        if (get().hydrated || typeof window === "undefined") return;
        const consent = readConsent();
        set({ hydrated: true, consent, open: !consent });

        // Keep tabs in sync: a decision made in another tab closes (or reopens)
        // the banner here too.
        window.addEventListener("storage", (event: StorageEvent) => {
            if (event.key !== null && event.key !== CONSENT_STORAGE_KEY) return;
            const next = readConsent();
            set({ consent: next, open: !next });
        });
    },

    openPreferences: (options) => {
        set({ open: true, customizing: options?.customizing ?? true });
    },

    close: () => {
        // The banner cannot be dismissed before a decision (GDPR); after one,
        // re-opened preferences may simply be closed again.
        if (get().consent) set({ open: false });
    },

    setCustomizing: (customizing) => {
        set({ customizing });
    },

    save: (categories) => {
        const previous = get().consent;
        const decision: ConsentDecision =
            categories.functional && categories.analytics
                ? "all"
                : !categories.functional && !categories.analytics
                  ? "none"
                  : "custom";
        const record = buildConsent(categories, decision);
        set({ consent: record, open: false, customizing: false });
        persistConsent(record);

        // A previously-granted optional category was withdrawn: purge its
        // cookies and reload so the corresponding scripts fully unload.
        if (previous) {
            const revoked =
                (previous.analytics && !record.analytics) ||
                (previous.functional && !record.functional);
            if (revoked && typeof window !== "undefined") {
                purgeOptionalCookies();
                window.setTimeout(() => window.location.reload(), 80);
            }
        }
    },
}));

/** Hook over the shared cookie-consent store. */
export function useCookieConsent(): CookieConsentState;
export function useCookieConsent<T>(selector: (state: CookieConsentState) => T): T;
export function useCookieConsent<T>(selector?: (state: CookieConsentState) => T) {
    return useCookieConsentStore(selector ?? ((state: CookieConsentState) => state as unknown as T));
}

export default useCookieConsent;
