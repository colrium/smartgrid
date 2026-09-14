import { NextResponse, type NextRequest } from "next/server";

import {
	buildMediaPayload,
	getMediaSigningKey,
	getMediaTtlSeconds,
	isGatedMediaPath,
	MEDIA_PARAM_EXP,
	MEDIA_PARAM_SIG,
} from "@/lib/mediaShared";

/**
 * Edge gate: protected media library + Keystatic admin access (M5).
 *
 * Next.js 16 renamed the `middleware.ts` convention to `proxy.ts` — this
 * module is the ONLY active edge gate. (`middleware.ts` was removed so there
 * is exactly one gate to audit; see the M5 status log.)
 *
 * Order matters: media signatures are verified first so hotlinked image
 * guesses can never reach the admin check, then admin routes are gated.
 * Everything else passes through untouched.
 *
 * Keystatic admin access:
 * - Local development (`NODE_ENV === "development"`) is unrestricted so
 *   editors can work credential-free against local-filesystem storage.
 * - Everywhere else, `/keystatic/*` (including the `/en|sw` locale-prefixed
 *   variants Next.js i18n routing also serves) and `/api/keystatic/*`
 *   require HTTP Basic Auth against `KEYSTATIC_ADMIN_USER` /
 *   `KEYSTATIC_ADMIN_PASSWORD`. Missing credentials fail CLOSED (every
 *   request rejected) — never open. Rejections are bare 401s with a
 *   `WWW-Authenticate` challenge; authorization values are never logged.
 *
 * Media protection (`public/media/**`).
 *
 * Media URLs are only served with a valid HMAC signature that the Node signer
 * (`src/lib/media.ts`) minted while rendering the page:
 *
 *   /media/x.jpg?e=<unix-seconds>&s=<base64url-HMAC-SHA256(path|exp)>
 *
 * Any request without a valid, unexpired signature — direct guesses, copied
 * links past their TTL, hotlinks from other sites, scraped URL lists — gets a
 * bare 404. Because the signature covers the pathname and expiry with a
 * server-side secret, query parameters cannot be tampered with and URLs
 * cannot be minted without the deployment's MEDIA_SIGNING_KEY.
 *
 * Runs before the filesystem lookup, so it intercepts both direct media
 * requests and the internal `/_next/image` optimizer fetch of a signed href.
 */

const BASE64URL_PATTERN = /^[A-Za-z0-9\-_]+$/;

/** Locale prefixes served by `next-i18next.config.js` (`en` default, `sw`). */
const LOCALE_PREFIX_PATTERN = /^\/(en|sw)(\/|$)/;

/** Admin UI + admin API paths (after stripping an optional locale prefix). */
const KEYSTATIC_PATH_PATTERN = /^(\/keystatic|\/api\/keystatic)(\/|$)/;

function base64UrlToBytes(value: string): Uint8Array | null {
	if (!BASE64URL_PATTERN.test(value)) return null;
	const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
	const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
	try {
		const binary = atob(padded);
		const bytes = new Uint8Array(binary.length);
		for (let i = 0; i < binary.length; i += 1) {
			bytes[i] = binary.charCodeAt(i);
		}
		return bytes;
	} catch {
		return null;
	}
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
	if (a.length !== b.length) return false;
	let diff = 0;
	for (let i = 0; i < a.length; i += 1) {
		diff |= a[i] ^ b[i];
	}
	return diff === 0;
}

/** Constant-time string comparison (Edge-safe: no Node built-ins). */
function credentialsEqual(a: string, b: string): boolean {
	const encoder = new TextEncoder();
	return timingSafeEqual(encoder.encode(a), encoder.encode(b));
}

/**
 * Expected admin credentials, or `null` when either variable is missing or
 * empty. `null` fails every admin request closed — the gate never degrades
 * to open access because a secret was forgotten.
 */
function expectedAdminCredentials(): { user: string; pass: string } | null {
	const user = process.env.KEYSTATIC_ADMIN_USER;
	const pass = process.env.KEYSTATIC_ADMIN_PASSWORD;
	if (!user || !pass) return null;
	return { user, pass };
}

/**
 * Parse a `Basic base64(user:pass)` header without throwing. Returns `null`
 * for any malformed value (wrong scheme, bad base64, missing colon).
 * Callers compare the result in constant time and never log it.
 */
function parseBasicCredentials(auth: string | null): { user: string; pass: string } | null {
	if (!auth) return null;
	const space = auth.indexOf(" ");
	if (space === -1) return null;
	if (auth.slice(0, space) !== "Basic") return null;
	const encoded = auth.slice(space + 1).trim();
	if (!encoded) return null;
	let decoded: string;
	try {
		decoded = atob(encoded);
	} catch {
		return null;
	}
	const colon = decoded.indexOf(":");
	if (colon === -1) return null;
	return { user: decoded.slice(0, colon), pass: decoded.slice(colon + 1) };
}

function isKeystaticPath(pathname: string): boolean {
	const withoutLocale = pathname.replace(LOCALE_PREFIX_PATTERN, "/");
	return KEYSTATIC_PATH_PATTERN.test(withoutLocale);
}

/** Authorized only when expected credentials exist AND match in constant time. */
function isAuthorizedAdmin(req: NextRequest): boolean {
	const expected = expectedAdminCredentials();
	if (!expected) return false;
	const provided = parseBasicCredentials(req.headers.get("authorization"));
	if (!provided) return false;
	return credentialsEqual(provided.user, expected.user) && credentialsEqual(provided.pass, expected.pass);
}

function unauthorizedAdmin(): NextResponse {
	return new NextResponse("Authentication required", {
		status: 401,
		headers: { "WWW-Authenticate": 'Basic realm="Keystatic Admin"' },
	});
}

async function verifyMediaSignature(
	pathname: string,
	exp: string | null,
	signature: string | null,
): Promise<boolean> {
	if (!exp || !signature) return false;
	const expiry = Number(exp);
	if (!Number.isSafeInteger(expiry) || expiry <= 0) return false;
	if (expiry * 1000 <= Date.now()) return false;
	const expectedBytes = base64UrlToBytes(signature);
	if (!expectedBytes) return false;

	const encoder = new TextEncoder();
	const key = await crypto.subtle.importKey(
		"raw",
		encoder.encode(getMediaSigningKey()),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"],
	);

	// Compare against the raw and percent-decoded pathname so filenames that
	// only differ in encoding still verify against the signed payload.
	const candidates = [pathname, decodeURI(pathname)];
	for (const candidate of candidates) {
		const mac = await crypto.subtle.sign(
			"HMAC",
			key,
			encoder.encode(buildMediaPayload(candidate, expiry)),
		);
		if (timingSafeEqual(new Uint8Array(mac), expectedBytes)) return true;
	}
	return false;
}

export default async function proxy(request: NextRequest) {
	const { pathname } = request.nextUrl;
	if (isGatedMediaPath(pathname)) {
		const verified = await verifyMediaSignature(
			pathname,
			request.nextUrl.searchParams.get(MEDIA_PARAM_EXP),
			request.nextUrl.searchParams.get(MEDIA_PARAM_SIG),
		);
		if (!verified) {
			return new NextResponse(null, { status: 404 });
		}

		const response = NextResponse.next();
		response.headers.set("X-Robots-Tag", "noindex");
		// Keep the browser cache aligned with the signature lifetime: once the URL
		// expires, a cached copy only ever serves the same visitor session that
		// legitimately fetched it.
		response.headers.set("Cache-Control", `private, max-age=${getMediaTtlSeconds()}`);
		return response;
	}

	if (isKeystaticPath(pathname)) {
		// Local development stays credential-free (local-filesystem storage).
		if (process.env.NODE_ENV === "development") return NextResponse.next();
		if (!isAuthorizedAdmin(request)) return unauthorizedAdmin();
		const response = NextResponse.next();
		// The admin console must never be indexed or cached by intermediaries.
		response.headers.set("X-Robots-Tag", "noindex, nofollow");
		response.headers.set("Cache-Control", "no-store");
		return response;
	}

	return NextResponse.next();
}

export const config = {
	matcher: [
		"/media",
		"/media/:path*",
		"/keystatic/:path*",
		"/en/keystatic/:path*",
		"/sw/keystatic/:path*",
		"/api/keystatic/:path*",
	],
};
