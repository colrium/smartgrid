import type { ReactElement } from "react";
import type { GetServerSideProps } from "next";
import { makePage } from "@keystatic/next/ui/pages";
import type { NextPageWithLayout } from "@/types/next";
import keystaticConfig from "../../../keystatic.config";

// The Keystatic admin shell is request-time only. Exporting getServerSideProps
// opts this (locale-prefixed) catch-all out of static prerendering — during
// `next build` the shell crashes with "x.map is not a function" because the
// router has no params/client data at export time.
export const getServerSideProps: GetServerSideProps = async () => ({ props: {} });

const Page: NextPageWithLayout = makePage(keystaticConfig);

// The admin console is not a marketing page: render it without the landing
// site layout. The layout's Navbar reads `common:locales` from the i18n store,
// which this route never populates (no `serverSideTranslations`), so wrapping
// the console would crash with `locales.map is not a function`.
Page.getLayout = (page: ReactElement) => page;

export default Page;
