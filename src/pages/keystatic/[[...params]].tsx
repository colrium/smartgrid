import type { GetServerSideProps } from "next";
import { makePage } from "@keystatic/next/ui/pages";
import keystaticConfig from "../../../keystatic.config";

// The Keystatic admin shell is request-time only. Exporting getServerSideProps
// opts this (locale-prefixed) catch-all out of static prerendering — during
// `next build` the shell crashes with "x.map is not a function" because the
// router has no params/client data at export time.
export const getServerSideProps: GetServerSideProps = async () => ({ props: {} });

export default makePage(keystaticConfig);

