import crypto from "node:crypto";

import {
	buildMediaPayload,
	getMediaSigningKey,
	getMediaTtlSeconds,
	MEDIA_PARAM_EXP,
	MEDIA_PARAM_SIG,
	signDeepMediaPaths,
} from "./mediaShared";

/**
 * Display-only media protection — Node signer (server-side only).
 *
 * Converts a raw `/media/...` path into a short-lived signed URL that the
 * Edge proxy (`src/proxy.ts`) accepts until it expires. The signing key never
 * reaches the browser, so signed URLs cannot be minted or forged client-side.
 */

/**
 * Signs a `/media/...` path: `/media/x.jpg?e=<unix-seconds>&s=<base64url-mac>`.
 * Idempotent by construction — pass only raw paths (already-signed values are
 * rejected by the shared tokenizer before they ever reach here).
 */
export function signMediaPath(mediaPath: string, now: number = Date.now()): string {
	const exp = Math.floor(now / 1000) + getMediaTtlSeconds();
	const payload = buildMediaPayload(mediaPath, exp);
	const signature = crypto
		.createHmac("sha256", getMediaSigningKey())
		.update(payload)
		.digest()
		.toString("base64url");
	return `${mediaPath}?${MEDIA_PARAM_EXP}=${exp}&${MEDIA_PARAM_SIG}=${signature}`;
}

/**
 * Rewrites every `/media/...` URL inside an arbitrary server-side props tree
 * (i18n stores, catalogue cards, related products, …) into signed URLs.
 * Idempotent: values that are already signed are left untouched.
 */
export function signMediaDeep<T>(value: T): T {
	return signDeepMediaPaths(value, signMediaPath);
}
