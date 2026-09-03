import FooterInk from "./FooterInk";
import FooterLight from "./FooterLight";

export type FooterVariant = "ink" | "light";

export const FOOTER_VARIANT: FooterVariant = "light";

export interface FooterProps {
    variant?: FooterVariant
}
export default function Footer({ variant = FOOTER_VARIANT }: FooterProps) {
	return variant === "ink" ? <FooterInk /> : <FooterLight />;
}