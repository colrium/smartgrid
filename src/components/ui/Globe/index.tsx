// @ts-nocheck
import GlobeGl, { GlobeMethods } from "react-globe.gl";
import { useEffect, useRef } from "react";
import { useTranslation } from "@/hooks";
import { useBreakpoint } from "@/hooks/useWindowSize";

export interface LocationPlace{
	role: string;
	country: string;
	flag?: string;
	site: string;
	region: string;
	lat: number;
	lng: number;
	place_id: string | null;
	deposit_type: string[];
	goldfield: string;
	geology: string;
	licence_authority: string;
	regulatory_body: string;
	status: string;
	elevation_m: number;
	notes: string;
};

interface GlobeProps {
	className?: string;
    placesData?: LocationPlace[];
    labelDotOrientation?: (d: LocationPlace) => void
}

const sizes = {
	xs: 360,
	sm: 420,
	md: 500,
	lg: 600,
	xl: 600,
};

const Globe = ({ className, placesData = [], labelDotOrientation }: GlobeProps) => {
	const globeEl = useRef<GlobeMethods | undefined>(undefined);

	const { t } = useTranslation(["common", "operations"]);
	const breakpoint = useBreakpoint();

	const size = sizes[breakpoint];

	
	useEffect(() => {
		if (globeEl.current) {
			// Auto-rotate
			globeEl.current.controls().autoRotate = false;
			globeEl.current.controls().autoRotateSpeed = 0.1;
			globeEl.current.controls().enableZoom = false;
		}
	}, []);

	return (
		<div>
			<GlobeGl
				ref={globeEl}
				globeImageUrl="/img/earth/grey.jpg"
				bumpImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png"
				backgroundColor="#00000000"
				atmosphereAltitude={0.05}
				atmosphereColor="#00000000"
				// globeOffset={[-5, -10]}
				width={size}
				height={size}
				showAtmosphere={false}
				labelsData={placesData}
				labelColor={() => "#27d4f3"}
				labelText={"country"}
				labelDotOrientation={labelDotOrientation}
				labelLabel={(d) => (
					<div className="text-primary">
						<div className="text-xs text-on-surface">{d.goldfield}</div>
						<div className="text-xs">
							<i>{d.country}</i>
						</div>
						<div className="text-[10px] text-on-surface">{d.geology}</div>
					</div>
				)}
				labelSize={0}
				labelDotRadius={1}
				labelResolution={5}
			/>
		</div>
	);
};
export default Globe;
