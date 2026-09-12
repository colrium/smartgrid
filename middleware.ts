import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
	matcher: ["/keystatic/:path*", "/api/keystatic/:path*"],
};

export function middleware(req: NextRequest) {
	// allow local dev unrestricted
	if (process.env.NODE_ENV === "development") return NextResponse.next();

	const auth = req.headers.get("authorization");
	const expectedUser = process.env.KEYSTATIC_ADMIN_USER;
	const expectedPass = process.env.KEYSTATIC_ADMIN_PASSWORD;

	if (auth) {
		const [scheme, encoded] = auth.split(" ");
		if (scheme === "Basic" && encoded) {
			const [user, pass] = Buffer.from(encoded, "base64").toString().split(":");
			if (user === expectedUser && pass === expectedPass) {
				return NextResponse.next();
			}
		}
	}

	return new NextResponse("Authentication required", {
		status: 401,
		headers: { "WWW-Authenticate": 'Basic realm="Keystatic Admin"' },
	});
}
