
import type { ReactNode } from "react";



import Navbar, { NavbarProps } from "./Navbar";
import Footer from "./Footer";
import Lenis from "lenis";
import { useEffect } from "react";


import ScrollTop from "./ScrollTop";
import ChatWidget from "@/components/ChatWidget";
import FloatingContactButtons from "@/components/FloatingContactButtons";

interface LandingPageLayoutSlotProps {
	navbar?: NavbarProps;
};
interface LandingPageLayoutProps {
	children: ReactNode;
	slotProps?: LandingPageLayoutSlotProps;
};


export default function LandingPageLayout({ children, slotProps = {} }: LandingPageLayoutProps) {
    const { navbar = { scrollVariantPercent : 10, variant: 'light'} } = slotProps;
	
	return (
		<div className={`flex flex-col min-h-screen relative`}>
			<div id="back-to-top-anchor"></div>
			<Navbar {...navbar} />

			<div className="flex-1 -mt-35">
				{children}
				{/* <ChatWidget /> */}

				<ScrollTop querySelector="#back-to-top-anchor" />
				<FloatingContactButtons />
			</div>
			<Footer />
		</div>
	);
}
