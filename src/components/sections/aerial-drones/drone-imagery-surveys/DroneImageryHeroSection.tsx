"use client";

import type { ReactElement } from "react";
import { useTranslation } from "@/hooks";
import {
	AerialServiceHero,
	type AerialServiceHeroContent,
} from "@/components/sections/aerial-drones/shared/AerialServiceHero";

export function DroneImageryHeroSection(): ReactElement {
	const { t } = useTranslation(["aerial-drones/drone-imagery-surveys"]);
	const hero = t("aerial-drones/drone-imagery-surveys:hero", {
		returnObjects: true,
	}) as unknown as AerialServiceHeroContent;

	return <AerialServiceHero hero={hero} />;
}

export default DroneImageryHeroSection;
