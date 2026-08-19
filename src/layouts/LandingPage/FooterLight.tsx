import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "@/hooks";

const columnKeys = ["company", "surveying", "drones", "civil"] as const;
const legalLinks = {
	privacy: "/privacy-policy",
	terms: "/terms-of-use",
} as const;

interface FooterLink {
	label: string;
	href: string;
}
interface ContactItem {
	icon?: string;
	label: string;
	href: string;
	note?: string;
}
interface SocialChannel {
	icon?: string;
	url: string;
	platform?: string;
}

const isExternal = (href: string) => href.startsWith("http");

export default function FooterLight() {
	const { t } = useTranslation(["common", "meta", "contact"]);
	const title = t("meta:site.title");
	const subtitle = t("meta:site.subtitle");
	const description = t("common:footer.description");
	const contacts = (t("contact:talkToUs.contacts", {
		returnObjects: true,
	}) as unknown) as ContactItem[];
	const social = (t("contact:social.channels", {
		returnObjects: true,
	}) as unknown) as SocialChannel[];

	return (
		<footer className="relative z-50 overflow-hidden border-t bg-surface hairline">
			<div
				aria-hidden
				className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary-100/60 blur-3xl"
			/>
			<div className="relative z-10 mx-auto max-w-7xl px-6 pt-20 pb-10 sm:px-8 lg:px-12">
				{/* Brand + link columns */}
				<div className="flex flex-col gap-12 pb-14 border-b border-ink/10 lg:flex-row lg:justify-between">
					<div className="shrink-0 lg:max-w-xs">
						<Link href="/" className="inline-flex items-center gap-2.5">
							<Image
								src={t("common:nav.logo")}
								alt={t("common:nav.logo_alt")}
								width={36}
								height={36}
							/>
							<span className="flex flex-col leading-tight">
								<span className="text-xl font-semibold tracking-wide text-ink uppercase">
									{title}
								</span>
								<span className="mt-0.5 text-[9px] uppercase tracking-[0.28em] text-primary">
									{subtitle}
								</span>
							</span>
						</Link>
						<p className="mt-5 text-sm leading-relaxed text-on-surface/55">
							{description}
						</p>
						<div className="mt-6 flex items-center gap-2.5">
							{Array.isArray(social) &&
								social.map((ch, i) => (
									<a
										key={i}
										href={ch.url}
										target="_blank"
										rel="noopener noreferrer"
										aria-label={ch.platform}
										className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 text-primary transition-all duration-300 hover:bg-primary hover:text-surface"
									>
										{ch.icon && (
											<span className={`mdi mdi-${ch.icon} text-lg`} />
										)}
									</a>
								))}
						</div>
					</div>

					<div className="grid grow grid-cols-2 gap-10 md:grid-cols-4 md:gap-8">
						{columnKeys.map((colKey) => {
							const links = t(`common:footer.columns.${colKey}.links`, {
								returnObjects: true,
							}) as unknown as FooterLink[];
							if (!Array.isArray(links) || links.length === 0) {
								return null;
							}
							return (
								<div key={colKey}>
									<h5 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
										{t(`common:footer.columns.${colKey}.heading`)}
									</h5>
									<ul className="flex flex-col gap-3">
										{links.map((link, j) => (
											<li key={j}>
												<Link
													href={link.href}
													className="text-sm text-on-surface/65 transition-colors hover:text-primary"
												>
													{link.label}
												</Link>
											</li>
										))}
									</ul>
								</div>
							);
						})}
					</div>
				</div>

				{/* Contact cards from contact.json */}
				<div className="grid grid-cols-1 gap-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
					{Array.isArray(contacts) &&
						contacts.map((c, i) => (
							<a
								key={i}
								href={c.href}
								{...(isExternal(c.href)
									? { target: "_blank", rel: "noopener noreferrer" }
									: {})}
								className="group flex items-center gap-4 rounded-2xl p-4 hairline card-shadow transition-all duration-300 hover:card-shadow-lift hover:border-primary"
							>
								<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-surface">
									{c.icon && <span className={`mdi mdi-${c.icon} text-xl`} />}
								</span>
								<span className="flex min-w-0 flex-col">
									{c.note && (
										<span className="text-[11px] uppercase tracking-wider text-on-surface/50">
											{c.note}
										</span>
									)}
									<span className="text-sm font-medium break-all text-ink transition-colors group-hover:text-primary">
										{c.label}
									</span>
								</span>
							</a>
						))}
				</div>

				{/* Bottom bar */}
				<div className="flex flex-col items-center justify-between gap-4 border-t border-ink/10 pt-8 md:flex-row">
					<span className="text-xs text-on-surface/60">
						{t("common:footer.copyright", {
							year: new Date().getFullYear(),
							organization: title,
						})}
					</span>
					<div className="flex items-center gap-6">
						{(["privacy", "terms"] as const).map((key) => (
							<Link
								key={key}
								href={legalLinks[key]}
								className="text-xs text-on-surface/60 transition-colors hover:text-primary"
							>
								{t(`common:footer.legal.${key}`)}
							</Link>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
}