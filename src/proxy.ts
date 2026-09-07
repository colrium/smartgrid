import { NextResponse, type NextRequest } from "next/server";

import {
	buildMediaPayload,
	getMediaSigningKey,
	isGatedMediaPath,
	MEDIA_PARAM_EXP,
	MEDIA_PARAM_SIG,
} from "@/lib/mediaShared";

/**
 * Edge gate for the protected media library (`public/media/**`).
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
 * Next.js 16 proxy convention (successor of middleware.ts). Runs before the
 * filesystem lookup, so it intercepts both direct media requests and the
 * internal `/_next/image` optimizer fetch of a signed href.
 */

const BASE64URL_PATTERN = /^[A-Za-z0-9\-_]+$/;

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
	if (!isGatedMediaPath(pathname)) return NextResponse.next();

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
	response.headers.set("Cache-Control", "private, max-age=3600");
	return response;
}

export const config = {
	matcher: ["/media", "/media/:path*"],
};
