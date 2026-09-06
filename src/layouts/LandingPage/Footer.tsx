import FooterInk from "./FooterInk";
import FooterLight from "./FooterLight";

const isWeekend = (date = new Date()) => {
    const day = date.getDay();
    return day === 0 || day === 6;
};

export type FooterVariant = "ink" | "light";

export const FOOTER_VARIANT: FooterVariant = isWeekend() ? "ink" : "light";

export interface FooterProps {
    variant?: FooterVariant
}
export default function Footer({ variant = FOOTER_VARIANT }: FooterProps) {
	return variant === "ink" ? <FooterInk /> : <FooterLight />;
}