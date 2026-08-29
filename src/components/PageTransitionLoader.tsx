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
					className="fixed inset-0 z-10000 flex flex-col items-center justify-center"
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
							{/* <span className="h-5 w-5 rounded-full border-2 border-primary-100 border-t-primary animate-spin" /> */}
							<div className="grid  w-full place-items-center overflow-x-scroll rounded-lg p-2 lg:overflow-visible">
								<svg
									className="text-primary-200 animate-spin"
									viewBox="0 0 64 64"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
								>
									<path
										d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
										stroke="currentColor"
										stroke-width="5"
										stroke-linecap="round"
										stroke-linejoin="round"
									></path>
									<path
										d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
										stroke="currentColor"
										stroke-width="5"
										stroke-linecap="round"
										stroke-linejoin="round"
										className="text-primary"
									></path>
								</svg>
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