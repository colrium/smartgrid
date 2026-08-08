import type { NextPage } from "next";
import type { AppProps } from "next/app";
import type { ReactElement, ReactNode } from "react";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
	getLayout?: (page: ReactElement) => ReactNode;
};

export type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
};

export interface Service {
	id: string;
	icon: string;
	title: string;
	description: string;
	label: string;
}

export interface Project {
	id: string;
	title: string;
	subtitle: string;
	description: string;
	image: string;
	type: string;
	date: string;
}

export interface Metric {
	label: string;
	value: string;
	suffix?: string;
}