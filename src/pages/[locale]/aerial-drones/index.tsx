import type { GetServerSideProps, NextPage } from "next";
import PageHead from "@/components/Head";

import { getI18nProps } from "@/lib/i18n";
import {
	AerialDronesHeroSection,
	AerialDronesServicesSection,
	DroneFleetSection,
	WhyDronesMatterSection,
	AerialExploreMoreSection,
	AerialProjectsSection,
	DronePhotographySection,
} from "@/components/sections/aerial-drones/landing";

type PageProps = {
	// Add custom props here
};

const Page: NextPage<PageProps> = () => {
	return (
		<div className="relative">
			<PageHead pageName="aerial-drones" />
			<div className="flex flex-col min-h-screen">
				<AerialDronesHeroSection />
				<AerialDronesServicesSection />
				<DroneFleetSection />
				<WhyDronesMatterSection />
				<AerialExploreMoreSection />
				<AerialProjectsSection />
				<DronePhotographySection />
			</div>
		</div>
	);
};
export const getServerSideProps: GetServerSideProps = async (context) => {
	const i18nProps = await getI18nProps(context, [
		"common",
		"meta",
		"aerial-drones/landing",
	]);

	if (!i18nProps) return { notFound: true };

	return { props: { ...i18nProps } };
};

export default Page;
