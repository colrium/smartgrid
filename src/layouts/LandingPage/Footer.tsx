import FooterInk from "./FooterInk";
import FooterLight from "./FooterLight";

export type FooterVariant = "ink" | "light";

export const FOOTER_VARIANT: FooterVariant = "light";

export default function Footer() {
	return FOOTER_VARIANT === "ink" ? <FooterInk /> : <FooterLight />;
}