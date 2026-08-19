"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "@/hooks";

export default function PageTransitionLoader() {
	const router = useRouter();
	const { t } = useTranslation(["common", "meta"]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let hideTimer: ReturnType<typeof setTimeout> | undefined;

		const show = () => {
			if (hideTimer) clearTimeout(hideTimer);
			setLoading(true);
		};
		const hide = () => {
			if (hideTimer) clearTimeout(hideTimer);
			hideTimer = setTimeout(() => setLoading(false), 450);
		};

		router.events.on("routeChangeStart", show);
		router.events.on("routeChangeComplete", hide);
		router.events.on("routeChangeError", hide);

		if (router.isReady) hide();

		return () => {
			router.events.off("routeChangeStart", show);
			router.events.off("routeChangeComplete", hide);
			router.events.off("routeChangeError", hide);
			if (hideTimer) clearTimeout(hideTimer);
		};
	}, [router.isReady, router.events]);

	return (
		<AnimatePresence>
			{loading && (
				<motion.div
					key="page-transition-loader"
					className="fixed inset-0 z-[10000] flex flex-col items-center justify-center"
					exit={{ opacity: 0, transition: { duration: 0.45, ease: "easeInOut" } }}
				>
					<div className="absolute inset-0 bg-surface/85 backdrop-blur-2xl" />
					<div className="absolute -top-40 -left-40 w-[28rem] h-[28rem] rounded-full bg-primary/15 blur-[120px]" />
					<div className="absolute -bottom-40 -right-40 w-[28rem] h-[28rem] rounded-full bg-primary/10 blur-[120px]" />

					<div className="absolute top-0 left-0 h-1 w-full overflow-hidden">
						<motion.div
							className="h-full w-2/5 bg-gradient-to-r from-primary to-primary-300 rounded-r-full"
							animate={{ x: ["-120%", "320%"] }}
							transition={{ repeat: Infinity, duration: 1.1, ease: "easeInOut" }}
						/>
					</div>

					<motion.div
						className="relative flex flex-col items-center gap-6"
						initial={{ opacity: 0, y: 14 }}
						animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
					>
						<div className="relative">
							<div className="absolute inset-0 bg-surface/25 rounded-full blur-2xl" />
							<Image
								src={t("common:nav.logo")}
								alt={t("common:nav.logo_alt")}
								width={56}
								height={56}
								className="relative drop-shadow"
							/>
						</div>

						<div className="flex flex-col items-center gap-1.5">
							<span className="font-mono font-semibold uppercase tracking-[0.28em] text-on-surface text-sm sm:text-base">
								{t("meta:site.title")}
							</span>
							<span className="text-[10px] uppercase tracking-[0.18em] text-accent-600">
								{t("meta:site.subtitle")}
							</span>
						</div>

						<div className="mt-2 flex items-center gap-3">
							<span className="h-5 w-5 rounded-full border-2 border-surface/20 border-t-primary-300 animate-spin" />
							<span className="text-xs uppercase tracking-[0.2em] text-on-surface/70">
								{t("common:misc.loading")}
							</span>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}