/**
 * Cookie preference domain logic.
 *
 * Optional cookies (Google Analytics, Tawk.to live chat) are enabled by
 * default and disabled when a visitor opts out. This module owns the preference
 * record, its persistence
 * (localStorage + a mirrored cookie), the purge of previously-granted optional
 * cookies on withdrawal, and the Google Analytics Consent Mode loader.
 *
 * Strictly-necessary storage only: the consent record itself (this file) and
 * the locale cookie (NEXT_LOCALE, set on explicit user action in the navbar).
 */

export type ConsentCategory = "functional" | "analytics";

export interface ConsentCategories {
    functional: boolean;
    analytics: boolean;
}

/** "all" = everything on, "none" = rejected, "custom" = per-category. */
export type ConsentDecision = "all" | "custom" | "none";

export interface ConsentRecord extends ConsentCategories {
    /** Bump when the consent scope/policy changes so visitors are re-asked. */
    version: number;
    necessary: true;
    decision: ConsentDecision;
    /** ISO-8601 timestamp when these preferences were recorded. */
    timestamp: string;
}

/** Bump this when the site introduces a new optional cookie category. */
export const CONSENT_VERSION = 1;

export const CONSENT_STORAGE_KEY = "sg:cookie-consent";

export const CONSENT_COOKIE_NAME = "sg_consent";

/** One year, mirroring common CMP retention windows. */
const CONSENT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

type GtagWindow = Window & {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    gaConsentInitialized?: boolean;
    gaConfiguredMeasurementIds?: Set<string>;
};

/** Read and validate the stored consent record. SSR-safe. */
export function readConsent(): ConsentRecord | null {
    if (typeof window === "undefined") return null;
    try {
        const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
        if (!raw) return null;
        const parsed: unknown = JSON.parse(raw);
        if (!parsed || typeof parsed !== "object") return null;
        const record = parsed as Partial<ConsentRecord>;
        if (record.version !== CONSENT_VERSION) return null;
        if (
            record.decision !== "all" &&
            record.decision !== "custom" &&
            record.decision !== "none"
        ) {
            return null;
        }
        if (typeof record.functional !== "boolean" || typeof record.analytics !== "boolean") {
            return null;
        }
        return {
            version: CONSENT_VERSION,
            decision: record.decision,
            necessary: true,
            functional: record.functional,
            analytics: record.analytics,
            timestamp:
                typeof record.timestamp === "string"
                    ? record.timestamp
                    : new Date().toISOString(),
        };
    } catch {
        return null;
    }
}

export function buildConsent(
    categories: ConsentCategories,
    decision: ConsentDecision,
): ConsentRecord {
    return {
        version: CONSENT_VERSION,
        decision,
        necessary: true,
        functional: categories.functional,
        analytics: categories.analytics,
        timestamp: new Date().toISOString(),
    };
}

/** Persist the consent record (localStorage primary + mirrored cookie). */
export function persistConsent(record: ConsentRecord): void {
    if (typeof window === "undefined") return;
    try {
        window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
    } catch {
        // Storage may be unavailable (private mode) - the cookie mirror still applies.
    }
    document.cookie = `${CONSENT_COOKIE_NAME}=${encodeURIComponent(
        JSON.stringify(record),
    )}; path=/; max-age=${CONSENT_COOKIE_MAX_AGE}; SameSite=Lax`;
}

const isOptionalCookieName = (name: string): boolean =>
    /^_ga/.test(name) || /^_gid$/.test(name) || /^_gat/.test(name) || /^tawk/i.test(name);

/**
 * Delete previously-granted optional cookies (Google Analytics `_ga*`/`_gid`,
 * Tawk.to `Tawk*`). Called when a granted category is withdrawn, since those
 * cookies would otherwise outlive their revoked consent.
 */
export function purgeOptionalCookies(): void {
    if (typeof document === "undefined") return;
    const entries = document.cookie.split(";");
    const host = window.location.hostname;
    for (const entry of entries) {
        const name = entry.split("=")[0]?.trim();
        if (!name || !isOptionalCookieName(name)) continue;
        const expiry = "; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        document.cookie = `${name}=${expiry}; path=/`;
        document.cookie = `${name}=${expiry}; path=/; domain=${host}`;
        document.cookie = `${name}=${expiry}; path=/; domain=.${host}`;
    }
}

/**
 * Inject gtag.js using Consent Mode. Analytics storage remains denied when a
 * visitor opts out, while cookieless page-view pings can still be sent.
 */
export function loadGoogleAnalytics(
    measurementId: string,
    analyticsAllowed: boolean,
): void {
    if (typeof window === "undefined" || !measurementId) return;
    const dataWindow = window as GtagWindow;
    dataWindow.dataLayer = dataWindow.dataLayer || [];
    if (!dataWindow.gtag) {
        dataWindow.gtag = function gtag(...args: unknown[]) {
            dataWindow.dataLayer?.push(args);
        };
        dataWindow.gtag("js", new Date());
    }

    if (!dataWindow.gaConsentInitialized) {
        dataWindow.gtag("consent", "default", {
            analytics_storage: "denied",
            ad_storage: "denied",
            functionality_storage: "granted",
            security_storage: "granted",
        });
        dataWindow.gaConsentInitialized = true;
    }
    dataWindow.gtag("consent", "update", {
        analytics_storage: analyticsAllowed ? "granted" : "denied",
    });

    const scriptUrl = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    const scriptExists = Array.from(document.scripts).some(
        (script) => script.src === scriptUrl,
    );
    if (!scriptExists) {
        const script = document.createElement("script");
        script.src = scriptUrl;
        script.async = true;
        document.head.appendChild(script);
    }

    dataWindow.gaConfiguredMeasurementIds ??= new Set<string>();
    if (!dataWindow.gaConfiguredMeasurementIds.has(measurementId)) {
        dataWindow.gtag("config", measurementId, {
            anonymize_ip: true,
            send_page_view: false,
        });
        dataWindow.gaConfiguredMeasurementIds.add(measurementId);
    }
}

/** Send a page_view, including a cookieless ping when analytics is declined. */
export function trackPageView(
    url: string,
    title: string | undefined,
    measurementId: string,
): void {
    if (typeof window === "undefined") return;
    const dataWindow = window as GtagWindow;
    if (!dataWindow.gtag) return;
    dataWindow.gtag("event", "page_view", {
        page_path: url,
        page_title: title,
        send_to: measurementId,
    });
}
