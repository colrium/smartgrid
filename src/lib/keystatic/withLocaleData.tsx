// src/lib/keystatic/withLocaleData.tsx
import type { ComponentType } from "react";
import { useRouter } from "next/router";
import type { Lang } from "../types";
import { resolveLocaleValue } from "./localize";

export function withLocaleData<P extends { data: any }>(Component: ComponentType<P>) {
	return function Wrapped(props: Omit<P, "data"> & { raw: any }) {
		const { locale } = useRouter();
		const lang = (locale ?? "en") as Lang;
		const data = resolveLocaleValue(props.raw, lang);
		return <Component {...(props as any)} data={data} />;
	};
}
