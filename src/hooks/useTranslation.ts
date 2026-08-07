// @ts-nocheck

import { useTranslation as useI18nTranslation } from "next-i18next/pages";

type TOptionsBase = Record<string, unknown>;
type TOptionsWithReturnObjects = TOptionsBase & { returnObjects: true };
type TOptionsWithoutReturnObjects = TOptionsBase & { returnObjects?: false };
const useTranslation = (ns?: string | string[]) => {
	const { t: originalT, ...rest } = useI18nTranslation(ns);

	function t(key: string, options: TOptionsWithReturnObjects): unknown;
	function t(key: string, options?: TOptionsWithoutReturnObjects): string;
	function t(key: string, options?: TOptionsBase): unknown {
		return originalT(key, options as any) as unknown;
	}

	function tObject<T>(key: string, options?: TOptionsBase): T {
		return originalT(key, { ...options, returnObjects: true }) as unknown as T;
	}

	return { t, tObject, ...rest };
}
export default useTranslation;