
import type { ReactNode } from "react";



import Navbar, { NavbarProps } from "./Navbar";
import Footer from "./Footer";
import { ReactLenis } from "lenis/react";
import type { LenisRef } from "lenis/react";
import { cancelFrame, frame } from "framer-motion";
import { useEffect, useRef } from "react";


import ScrollTop from "./ScrollTop";
import ChatWidget from "@/components/ChatWidget";
import WhatsappButton from "@/components/WhatsappButton";
import RippleSetup from "./RippleSetup";
import MediaProtection from "./MediaProtection";
import CookieConsent from "@/components/CookieConsent";

interface LandingPageLayoutSlotProps {
	navbar?: NavbarProps;
};
interface LandingPageLayoutProps {
	children: ReactNode;
	slotProps?: LandingPageLayoutSlotProps;
};


export default function LandingPageLayout({ children, slotProps = {} }: LandingPageLayoutProps) {
    const { navbar = { scrollVariantPercent : 20, variant: 'light'} } = slotProps;
	const lenisRef = useRef<LenisRef>(null);
    const backToTopAnchorRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function update(data: { timestamp: number }) {
			const time = data.timestamp;
			lenisRef.current?.lenis?.raf(time);
		}

		frame.update(update, true);

		return () => cancelFrame(update);
	}, []);
    return (
		<ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
			<div className={`flex flex-col min-h-screen relative`}>
				<div className="w-full h-0.5" ref={backToTopAnchorRef}></div>
				<Navbar {...navbar} />

				<div className="flex-1 -mt-35">
					{children}
					<ChatWidget />
					<div className="fixed right-6 bottom-8 z-999999 flex flex-col gap-2 items-center justify-center">
						<ScrollTop anchorRef={backToTopAnchorRef} />
						<WhatsappButton />
					</div>
				</div>
				<Footer />
				<RippleSetup />
				<MediaProtection />
				<CookieConsent />
			</div>
		</ReactLenis>
	);
}
