// src/lib/keystatic/withLocaleData.tsx
import type { ComponentType } from "react";
import { useRouter } from "next/router";
import { Lang } from "../types";


function resolve(value: unknown, lang: Lang): unknown {
	if (value && typeof value === "object" && "en" in (value as any)) {
		const obj = value as Record<Lang, unknown>;
		return obj[lang] || obj.en;
	}
	if (Array.isArray(value)) return value.map((v) => resolve(v, lang));
	if (value && typeof value === "object") {
		return Object.fromEntries(
			Object.entries(value as Record<string, unknown>).map(([k, v]) => [k, resolve(v, lang)])
		);
	}
	return value;
}

export function withLocaleData<P extends { data: any }>(Component: ComponentType<P>) {
	return function Wrapped(props: Omit<P, "data"> & { raw: any }) {
		const { locale } = useRouter();
		const lang = (locale ?? "en") as Lang;
		const data = resolve(props.raw, lang);
		return <Component {...(props as any)} data={data} />;
	};
}
