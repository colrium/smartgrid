import type { Lang } from "../types";

/**
 * Pure locale resolution for page-builder data (M2).
 *
 * Any `{ en, sw }`-shaped node resolves to the requested locale with an
 * English fallback; arrays and plain objects resolve recursively. This is
 * the shared semantic behind both the `withLocaleData` HOC and the
 * section renderer — reader values are used as-is (the reader does NOT
 * enforce editor `isRequired` validation; missing text arrives as `""`).
 */
export function resolveLocaleValue<T>(value: T, lang: Lang): T {
	if (Array.isArray(value)) {
		return value.map((entry) => resolveLocaleValue(entry, lang)) as T;
	}
	if (value !== null && typeof value === "object") {
		const record = value as Record<string, unknown>;
		if (typeof record.en === "string" || typeof record.sw === "string") {
			const preferred = record[lang];
			if (typeof preferred === "string" && preferred.length > 0) return preferred as T;
			return (typeof record.en === "string" ? record.en : record.sw) as T;
		}
		const resolved: Record<string, unknown> = {};
		for (const [key, entry] of Object.entries(record)) {
			resolved[key] = resolveLocaleValue(entry, lang);
		}
		return resolved as T;
	}
	return value;
}
