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

export default function FooterInk() {
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
		<footer className="relative z-50 overflow-hidden bg-ink text-surface">
			{/* Decorative grid + glows */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0"
				style={{
					backgroundImage:
						"radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)",
					backgroundSize: "30px 30px",
				}}
			/>
			<div
				aria-hidden
				className="pointer-events-none absolute -top-28 -right-28 h-96 w-96 rounded-full bg-primary/25 blur-3xl"
			/>
			<div
				aria-hidden
				className="pointer-events-none absolute -bottom-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-primary-700/20 blur-3xl"
			/>
			<span
				aria-hidden
				className="pointer-events-none absolute -right-10 bottom-10 mdi mdi-map-marker-radius text-[20rem] leading-none text-surface opacity-[0.03]"
			/>

			<div className="relative z-10 mx-auto max-w-7xl px-6 pt-20 pb-10 sm:px-8 lg:px-12">
				{/* Brand + link columns */}
				<div className="grid grid-cols-1 gap-12 pb-14 border-b border-surface/10 lg:grid-cols-12 lg:gap-10">
					<div className="lg:col-span-4">
						<Link href="/" className="inline-flex items-center gap-3">
							<Image
								src={t("common:nav.logo")}
								alt={t("common:nav.logo_alt")}
								width={40}
								height={40}
							/>
							<span className="flex flex-col leading-tight">
								<span className="text-xl font-semibold tracking-wide text-surface uppercase">
									{title}
								</span>
								<span className="mt-0.5 text-[9px] uppercase tracking-[0.28em] text-primary-300">
									{subtitle}
								</span>
							</span>
						</Link>
						<p className="mt-6 max-w-sm text-sm leading-relaxed text-surface/60">
							{description}
						</p>
						<div className="mt-7 flex items-center gap-2.5">
							{Array.isArray(social) &&
								social.map((ch, i) => (
									<a
										key={i}
										href={ch.url}
										target="_blank"
										rel="noopener noreferrer"
										aria-label={ch.platform}
										className="flex h-10 w-10 items-center justify-center rounded-xl border border-surface/10 bg-surface/5 text-surface/70 transition-all duration-300 hover:border-primary hover:bg-primary hover:text-surface"
									>
										{ch.icon && <span className={`mdi mdi-${ch.icon}`} />}
									</a>
								))}
						</div>
					</div>

					<div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6 lg:col-span-8">
						{columnKeys.map((colKey) => {
							const links = t(`common:footer.columns.${colKey}.links`, {
								returnObjects: true,
							}) as unknown as FooterLink[];
							if (!Array.isArray(links) || links.length === 0) {
								return null;
							}
							return (
								<div key={colKey}>
									<h5 className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary-300">
										{t(`common:footer.columns.${colKey}.heading`)}
									</h5>
									<ul className="flex flex-col gap-3">
										{links.map((link, j) => (
											<li key={j}>
												<Link
													href={link.href}
													className="text-sm text-surface/60 transition-colors hover:text-surface"
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

				{/* Contact strip from contact.json */}
				<div className="grid grid-cols-1 gap-5 py-12 border-b border-surface/10 sm:grid-cols-2 lg:grid-cols-3">
					{Array.isArray(contacts) &&
						contacts.map((c, i) => (
							<a
								key={i}
								href={c.href}
								{...(isExternal(c.href)
									? { target: "_blank", rel: "noopener noreferrer" }
									: {})}
								className="group flex items-center gap-3.5"
							>
								<span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-surface/10 bg-surface/5 text-primary-300 transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-surface">
									{c.icon && <span className={`mdi mdi-${c.icon}`} />}
								</span>
								<span className="flex min-w-0 flex-col">
									{c.note && (
										<span className="text-[11px] uppercase tracking-wider text-surface/40">
											{c.note}
										</span>
									)}
									<span className="text-sm break-all text-surface/80 transition-colors group-hover:text-surface">
										{c.label}
									</span>
								</span>
							</a>
						))}
				</div>

				{/* Bottom bar */}
				<div className="flex flex-col items-center justify-between gap-4 pt-8 md:flex-row">
					<span className="text-xs text-surface/50">
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
								className="text-xs text-surface/50 transition-colors hover:text-primary-300"
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