/**
 * Display-only media protection — shared primitives.
 *
 * Serves the `public/media/**` photography library through short-lived,
 * HMAC-signed URLs instead of permanent, directly fetchable paths:
 *
 *   /media/aerial-drones/01.jpeg
 *     → /media/aerial-drones/01.jpeg?e=1735689600&s=<base64url-HMAC-SHA256>
 *
 * - `src/lib/media.ts` (Node) signs URLs server-side while building page props.
 * - `src/proxy.ts` (Edge) verifies signatures at the edge and 404s anything
 *   unsigned, expired, or forged. Without the server-side secret nobody can
 *   mint, share, or hotlink a working media URL once it expires.
 *
 * This module is imported by BOTH the Node signer and the Edge proxy, so it
 * must never depend on Node built-ins (only on Web-standard APIs).
 */

/** Expiry query parameter (unix seconds). */
export const MEDIA_PARAM_EXP = "e";

/** HMAC-SHA256 signature query parameter (base64url). */
export const MEDIA_PARAM_SIG = "s";

/**
 * Development fallback signing key. Signatures minted with it are forgeable by
 * anyone who reads this repository — always set MEDIA_SIGNING_KEY in production.
 */
export const MEDIA_SIGNING_KEY_FALLBACK =
	"smartgrid-dev-media-signing-key-do-not-use-in-production";

/** Default signed-URL lifetime: 24 hours. */
export const MEDIA_TTL_SECONDS_DEFAULT = 60 * 60 * 24;

const MEDIA_PREFIX = "/media/";

/**
 * Matches a `/media/...` path (optionally embedded in a longer string such as
 * `url("/media/x.jpg")`). The trailing lookahead refuses to end a match right
 * before `?`, so values that are ALREADY signed (`/media/x.jpg?e=…&s=…`) are
 * never re-matched — signing stays idempotent.
 */
const MEDIA_PATH_PATTERN = /\/media\/[A-Za-z0-9_\-./]+(?![A-Za-z0-9_\-./?])/g;

export function isGatedMediaPath(pathname: string): boolean {
	return pathname === "/media" || pathname.startsWith(MEDIA_PREFIX);
}

/** Signed-URL lifetime in seconds (MEDIA_TTL_SECONDS env, default 24h). */
export function getMediaTtlSeconds(): number {
	const raw = process.env.MEDIA_TTL_SECONDS;
	if (!raw) return MEDIA_TTL_SECONDS_DEFAULT;
	const seconds = Number(raw);
	return Number.isFinite(seconds) && seconds > 0
		? Math.round(seconds)
		: MEDIA_TTL_SECONDS_DEFAULT;
}

/** Server-side signing key (MEDIA_SIGNING_KEY env, dev fallback otherwise). */
export function getMediaSigningKey(): string {
	return process.env.MEDIA_SIGNING_KEY || MEDIA_SIGNING_KEY_FALLBACK;
}

/** Canonical HMAC payload — must stay byte-identical on both runtimes. */
export function buildMediaPayload(pathname: string, exp: number): string {
	return `${pathname}|${exp}`;
}

/** Rewrites every embedded `/media/...` path in a string via `replaceMediaPath`. */
export function replaceMediaPathsInString(
	value: string,
	replaceMediaPath: (path: string) => string,
): string {
	return value.replace(MEDIA_PATH_PATTERN, (match) => replaceMediaPath(match));
}

/**
 * Deep-walks an arbitrary server-side props tree and rewrites every string
 * containing a `/media/...` path through `replaceMediaPath`. Returns the
 * original reference untouched when nothing changed (keeps identity stable).
 */
export function signDeepMediaPaths<T>(
	value: T,
	replaceMediaPath: (path: string) => string,
): T {
	if (typeof value === "string") {
		return value.includes(MEDIA_PREFIX)
			? (replaceMediaPathsInString(value, replaceMediaPath) as unknown as T)
			: value;
	}
	if (Array.isArray(value)) {
		return value.map((item) => signDeepMediaPaths(item, replaceMediaPath)) as unknown as T;
	}
	if (value && typeof value === "object") {
		const source = value as Record<string, unknown>;
		const target: Record<string, unknown> = {};
		let mutated = false;
		for (const key of Object.keys(source)) {
			const next = signDeepMediaPaths(source[key], replaceMediaPath);
			target[key] = next;
			if (next !== source[key]) mutated = true;
		}
		return (mutated ? target : value) as unknown as T;
	}
	return value;
}
