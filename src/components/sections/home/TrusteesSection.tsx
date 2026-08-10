"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "@/hooks";
import { SectionTag } from "@/components/SectionTag";
import { FadeUp } from "@/components/animations/Fade";

interface TrusteeItem {
	label: string;
	logoUrl?: string;
}

const TRUSTEE_ASSETS: Record<string, string> = {
	dji: "/media/trustees/dji.png",
	esri: "/media/trustees/esri.png",
	trimble: "/media/trustees/trimble.png",
	foif: "/media/trustees/foif.jpg",
	gok: "/media/trustees/gok.png",
	autocad: "/media/trustees/autocad.png",
	kcaa: "/media/trustees/kcaa.png",
	pix4d: "/media/trustees/pix4d.jpg",
	bluegeog: "/media/trustees/blue-geog.png",
	arcgis: "/media/trustees/arcgis.png",
	bosch: "/media/trustees/bosch.jpg",
	agisoft: "/media/trustees/agisoft-metashape.png",
	"agisoft metashape": "/media/trustees/agisoft-metashape.png",
};

const resolveAsset = (item: TrusteeItem) => {
	const key = item.label.trim().toLowerCase();
	return TRUSTEE_ASSETS[key] || item.logoUrl || "";
};

const marqueeVariants = {
	animate: (reverse: boolean) => ({
		x: reverse ? ["-50%", "0%"] : ["0%", "-50%"],
		transition: {
			x: {
				repeat: Infinity,
				repeatType: "loop" as const,
				duration: 42,
				ease: "linear" as const,
			},
		},
	}),
};

function MarqueeRow({
	items,
	reverse = false,
}: {
	items: TrusteeItem[];
	reverse?: boolean;
}) {
	const reduceMotion = useReducedMotion();

	return (
		<div
			className="group relative overflow-hidden rounded-[20px] hairline bg-white py-6 sm:py-7"
			aria-label={items.map((i) => i.label).join(", ")}
		>
			<div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
			<div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

			{reduceMotion ? (
				<div className="flex flex-wrap items-center justify-center gap-4 px-6">
					{items.map((item, index) => (
						<TrusteeLogo key={index} item={item} />
					))}
				</div>
			) : (
				<motion.div
					variants={marqueeVariants}
					custom={reverse}
					initial="animate"
					animate="animate"
					className="flex w-max items-center"
				>
					<RowContent items={items} />
					<RowContent items={items} ariaHidden />
				</motion.div>
			)}
		</div>
	);
}

function RowContent({ items, ariaHidden = false }: { items: TrusteeItem[]; ariaHidden?: boolean }) {
	return (
		<div aria-hidden={ariaHidden || undefined} className="flex items-center gap-4 pr-4">
			{items.map((item, index) => (
				<TrusteeLogo key={index} item={item} />
			))}
		</div>
	);
}

function TrusteeLogo({ item }: { item: TrusteeItem }) {
	const src = resolveAsset(item);
	return (
		<div
			className="flex h-16 items-center justify-center rounded-xl border border-ink/10 bg-surface px-6 grayscale opacity-70 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-brand-50 hover:grayscale-0 hover:opacity-100 cursor-pointer"
			title={item.label}
		>
			{src ? (
				<Image
					src={src}
					alt={item.label}
					width={96}
					height={40}
					className="h-8 w-auto object-contain sm:h-9"
				/>
			) : (
				<span className="text-sm font-bold uppercase tracking-widest text-on-surface/60">
					{item.label}
				</span>
			)}
		</div>
	);
}

export function TrusteesSection() {
	const { t } = useTranslation(["home"]);
	const items = t("home:trustees.items", { returnObjects: true }) as unknown as TrusteeItem[];

	if (!Array.isArray(items) || items.length === 0) return null;

	const half = Math.ceil(items.length / 2);
	const firstRow = items.slice(0, half);
	const secondRow = items.slice(half);

	return (
		<section id="trustees" className="py-24 sm:py-28 relative overflow-hidden">
			<div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
				<FadeUp>
					<div className="mb-12 flex flex-col items-center gap-4 text-center">
						<SectionTag>{t("home:trustees.tag") as string}</SectionTag>
						<h2 className="text-3xl sm:text-5xl font-light tracking-tight text-ink leading-tight">
							{t("home:trustees.headline") as string}
						</h2>
						<span className="inline-flex items-center gap-3">
							<span className="h-px w-10 bg-primary/40" />
							<span className="h-1.5 w-1.5 rounded-full bg-primary" />
							<span className="h-px w-10 bg-primary/40" />
						</span>
					</div>
				</FadeUp>

				<FadeUp delay={0.1} className="flex flex-col gap-5 sm:gap-6">
					<MarqueeRow items={firstRow} />
					<MarqueeRow items={secondRow} reverse />
				</FadeUp>
			</div>
		</section>
	);
}

export default TrusteesSection;