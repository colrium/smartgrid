"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "@/hooks";

export default function PageTransitionLoader() {
	const router = useRouter();
	const { t } = useTranslation(["common", "meta"]);
	// Start hidden: the full-screen blurred overlay must never cover the
	// initial page load — its backdrop-filter is expensive on low-end devices
	// and it delays the first paint of real content (LCP). It is only shown
	// for client-side route transitions.
	const [loading, setLoading] = useState(false);

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
					className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
					exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
				>
					<div className="absolute inset-0 bg-surface/85 backdrop-blur-3xl" />
					<div className="absolute -top-40 -left-40 w-[28rem] h-[28rem] rounded-full bg-primary/25 blur-[120px]" />
					<div className="absolute bottom-4 right-4 w-[28rem] h-[28rem] rounded-full bg-primary/10 blur-[120px]" />

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
						animate={{ opacity: 1, y: 0, transition: { duration: 0.3 } }}
					>
						<div className="relative">
							<div className="absolute inset-0 bg-surface/75 rounded-full blur-3xl" />
							<Image
								src={t("common:nav.logo")}
								alt={t("common:nav.logo_alt")}
								width={56}
								height={56}
								className="relative drop-shadow"
							/>
						</div>

						<div className="flex flex-col items-center gap-1.5">
							<span className="font-display font-semibold uppercase tracking-[0.28em] text-on-surface text-sm sm:text-base">
								{t("meta:site.title")}
							</span>
							<span className="text-[7px] text-accent-600">
								{t("meta:site.subtitle")}
							</span>
						</div>

						<div className=" flex items-center gap-3">
							<div className="grid  w-full place-items-center overflow-x-scroll rounded-lg p-2 lg:overflow-visible  text-primary">
								<div role="status">
									<svg
										className="h-5 w-5 animate-spin"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
									>
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											stroke-width="4"
										></circle>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
										></path>
									</svg>
								</div>
							</div>

							{/* <span className="text-[8px] text-primary/70 font-sans">
								{t("common:misc.loading")}
							</span> */}
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}