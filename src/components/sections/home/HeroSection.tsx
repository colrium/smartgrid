// @ts-nocheck
"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useLenis } from "lenis/react";
import { useTranslation } from "@/hooks";
import { Trans } from "next-i18next/pages";
import { ButtonProps } from "@mui/material/Button";
import { FadeUp, FadeRight, FadeLeft } from "@/components/animations/Fade";
import ScrollIndicator from "@/components/ui/ScrollIndicator";

// Three.js + loaders (~500-700KB) stay out of the initial page bundle:
// the WebGL scene is code-split and mounted client-side only.
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

interface CtaItem {
	label: string;
	href?: string;
	icon?: string;
	class?: string;
	variant?: ButtonProps["variant"];
	color?: ButtonProps["color"];
}
interface LocationTagItem {
	label: string;
	code: string;
	href?: string;
	icon?: string;
	class?: string;
}
interface Location {
	label: string;
	items?: LocationTagItem[];
}

export default function HeroSection() {
	const heroRef = useRef<HTMLElement>(null);

	// WebGL scene is only for capable desktop-class devices. Deciding here —
	// not inside HeroScene — means the ~600 KB three.js chunk is never even
	// fetched on touch devices / small viewports / low-core hardware, where
	// the animated full-window canvas would otherwise saturate the CPU during
	// load (the dominant Total Blocking Time + LCP delay in Lighthouse). The
	// hero content and fixed instrument frame carry the design on their own.
	const [sceneEnabled, setSceneEnabled] = useState(true);

	/* useEffect(() => {
		const nav = navigator as Navigator & { deviceMemory?: number };
		const supported =
			!window.matchMedia("(pointer: coarse)").matches &&
			!window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
			window.innerWidth > 768 &&
			(nav.hardwareConcurrency ?? 8) > 4 &&
            (nav.deviceMemory ?? 8) > 4;
        
		if (supported) setSceneEnabled(true);
	}, []); */

	const { t } = useTranslation(["home"]);
	const ctaPrimary = t("home:hero.ctaPrimary", { returnObjects: true }) as CtaItem;
	const ctaSecondary = t("home:hero.ctaSecondary", { returnObjects: true }) as CtaItem;
	const location = t("home:hero.location", { returnObjects: true }) as Location;
	const scrollYPercentage = useMotionValue(0);

	// Hero height is cached and only re-measured on resize — reading
	// clientHeight on every scroll frame would force layout thrash.
	let heroHeight = 900;
	useLenis(
		({ scroll }) => {
			const progressPercentage = (scroll / heroHeight) * 100;
			scrollYPercentage.set(progressPercentage);
		},
		[]
	);

	useEffect(() => {
		const measure = () => {
			heroHeight = (heroRef.current?.clientHeight || 900) * 2;
		};
		measure();
		window.addEventListener("resize", measure);
		return () => window.removeEventListener("resize", measure);
	}, []);

	const colorOpacity = useTransform(scrollYPercentage, [10, 30], [1, 0]);
	const wireframeOpacity = useTransform(scrollYPercentage, [10, 30], [0, 0.4]);

	return (
		<section
			ref={heroRef}
			className="relative min-h-screen flex items-center justify-center pt-24 pb-20 sm:pt-28 sm:pb-24 lg:pt-32 lg:pb-32 overflow-hidden"
		>
			{/* WebGL Background (code-split, client-only, capable devices only) */}
			{sceneEnabled && <HeroScene />}

			{/* Content Overlay */}
			<div className="relative z-10 mx-auto w-full min-h-full max-w-7xl px-6 sm:px-8 lg:px-12 xl:px-16 py-10 sm:py-14 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20 xl:gap-24 items-center pointer-events-none">
				{/* Left Column */}
				<div className="lg:col-span-10 h-full pointer-events-auto">
					<FadeLeft delay={0.1} className="reveal active">
						<div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-ink text-xs font-semibold uppercase tracking-[0.18em] mb-8 sm:mb-10">
							<span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
							<span className="whitespace-pre-line">{t("home:hero.badge")}</span>
						</div>
					</FadeLeft>

					<FadeRight delay={0.1} className="reveal active">
						<h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-ink leading-[1.05] mb-8 sm:mb-10 lg:mb-12 whitespace-pre-line">
							<Trans
								i18nKey={["home:hero.headline"]}
								defaults="Survey <primary>Smarter</primary>, Build Stronger"
								components={{
									accent: <span className="text-accent" />,
									primary: <span className="text-primary" />,
								}}
							/>
						</h1>
					</FadeRight>
					<FadeUp delay={0.15} className="mt-12 sm:mt-14">
						<p className="text-base sm:text-lg text-on-surface/60 max-w-2xl font-normal leading-relaxed mb-10 sm:mb-12 whitespace-pre-line">
							{t("home:hero.description")}
						</p>
					</FadeUp>

					<FadeUp
						delay={0.1}
						className="flex flex-col-reverse items-center md:flex-row md:flex-wrap justify-start md:items-start gap-4 sm:gap-6"
					>
						{ctaPrimary?.href && (
							<Link
								href={ctaPrimary.href}
								className="group inline-flex items-center gap-3 h-14 rounded-full bg-primary shadow-2xl px-8 text-surface shadow-primary-200 font-medium text-base transition-all duration-300 hover:shadow-[0_18px_42px_-10px_rgba(1,55,61,0.55)]"
							>
								<span className="h-1.5 w-1.5 rounded-full bg-surface transition-transform duration-300 group-hover:scale-125" />
								{ctaPrimary.label}
								{ctaPrimary.icon && (
									<span
										className={`mdi mdi-${ctaPrimary.icon} text-xl text-surface transition-transform duration-300 group-hover:translate-x-1`}
									/>
								)}
							</Link>
						)}

						{ctaSecondary?.href && (
							<Link
								href={ctaSecondary.href}
								className="group inline-flex items-center gap-3 h-14 bg-accent rounded-full border border-accent/20 shadow-accent-200 shadow-2xl px-8 text-surface font-medium text-base transition-all duration-300 "
								data-ripple-light="true"
							>
								{ctaSecondary.label}
								{ctaSecondary.icon ? (
									<span
										className={`mdi mdi-${ctaSecondary.icon} text-lg text-urface transition-transform group-hover:translate-x-1`}
									/>
								) : (
									<span className="h-1.5 w-1.5 rounded-full bg-primary-200" />
								)}
							</Link>
						)}
					</FadeUp>
					<div className="flex flex-wrap items-center gap-4">
						<FadeUp delay={0.2} className="mt-12 sm:mt-14">
							<div className="flex flex-wrap items-center gap-8 reveal active">
								<div className="flex items-center gap-3">
									<div className="flex -space-x-2">
										{Array.isArray(location.items) &&
											location.items.map(
												(item: LocationTagItem, index: number) => (
													<div
														className="w-9 h-9 rounded-full bg-primary/20 border-2 border-surface flex items-center justify-center text-xs font-bold text-primary"
														key={index}
													>
														{item.code}
													</div>
												)
											)}
									</div>
									<span className="text-sm text-on-surface/50 font-medium">
										{location.label}
									</span>
								</div>
							</div>
						</FadeUp>
					</div>
				</div>

				{/* Right Column */}
				<div className="lg:col-span-2 pointer-events-auto" />
			</div>
			<div className="absolute bottom-0 left-1/2 -translate-x-1/2 p-4 flex">
				<ScrollIndicator />
			</div>
			<motion.div
				className={`rounded-3xl fixed  -right-40 md:-right-20 lg:-right-8 bottom-0 overflow-hidden w-80 md:w-100 lg:w-140 aspect-3/4 z-0`}
				style={{ opacity: colorOpacity }}
			>
				{/* LCP element — priority + high fetch priority so it is discovered
				    in the initial document and requested ahead of everything else. */}
				<Image
					src="/img/instruments/total-station-color.png"
					alt="total-station-color"
					fill
					priority
					fetchPriority="high"
					layout="fill"
					sizes="(min-width: 1024px) 560px, (min-width: 768px) 400px, 320px"
					className="object-scale-down"
				/>
			</motion.div>
			<motion.div
				className={`rounded-3xl  fixed -right-40 md:-right-20 lg:-right-8 bottom-0 overflow-hidden w-80 md:w-100 lg:w-140 aspect-3/4`}
				style={{ opacity: wireframeOpacity }}
			>
				<Image
					src="/img/instruments/total-station-wireframe.svg"
					alt="total-station-wireframe"
					fill
					priority
					fetchPriority="high"
					sizes="(min-width: 1024px) 560px, (min-width: 768px) 400px, 320px"
					className="object-scale-down"
				/>
			</motion.div>
		</section>
	);
}