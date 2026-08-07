import { Box } from "@mui/material";
import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Lenis from "lenis";
import { useEffect } from "react";
import ScrollTop from "./ScrollTop";
import ChatWidget from "@/components/ChatWidget";
import FloatingContactButtons from "@/components/FloatingContactButtons";

export default function LandingPageLayout({ children }: { children: ReactNode }) {
    useEffect(() => {
		const lenis = new Lenis();
		const raf = (time: number) => {
			lenis.raf(time);
			requestAnimationFrame(raf);
		};
        requestAnimationFrame(raf);
        
        return () => {
            lenis.destroy();
        }
	}, []);
	return (
		<Box className="flex flex-col min-h-screen relative">
			<div id="back-to-top-anchor"></div>
			<Navbar />

			<main className="flex-1 dark">
				<div
					className="fixed inset-0"
					style={{
						background:
							"radial-gradient(ellipse 60% 50% at 70% 40%, rgba(201,168,76,0.07) 0%, transparent 80%), radial-gradient(ellipse 40% 60% at 10% 80%, rgba(201,168,76,0.025) 0%, transparent 60%)",
					}}
				/>
				<div className="layout-gradient-bg fixed inset-0"></div>
				<div
					className="fixed z-[-1] inset-0"
					style={{
						backgroundImage:
							"linear-gradient(rgba(201,168,76,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px)",
						backgroundSize: "80px 80px",
						maskImage:
							"radial-gradient(ellipse 80% 60% at 60% 40%, black 30%, transparent 80%)",
					}}
				/>
				{children}
				<ChatWidget />

				<ScrollTop querySelector="#back-to-top-anchor" />
				<FloatingContactButtons />
			</main>
			<Footer />
		</Box>
	);
}
