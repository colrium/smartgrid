
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
		<div
			className={`flex flex-col min-h-screen relative`}
		>
				<div id="back-to-top-anchor"></div>
				<Navbar />

				<div className="flex-1 -mt-24">
					{children}
					<ChatWidget />

					<ScrollTop querySelector="#back-to-top-anchor" />
					<FloatingContactButtons />
				</div>
				<Footer />
		</div>
	);
}
