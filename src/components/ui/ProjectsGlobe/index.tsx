/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import GlobeGl, { GlobeMethods, GlobeProps } from "react-globe.gl";
import { useEffect, useMemo, useRef,  } from "react";
import { useSetState, useTranslation } from "@/hooks";
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

interface ProjectsGlobeProps {
	className?: string;
	width?: number;
	height?: number;
	placesData?: LocationPlace[];
	labelDotOrientation?: (d: LocationPlace) => void;
}
interface ProjectByCountry {
	name: string;
	totalHa: number;
	description: string;
}
const sizes = {
	xs: 360,
	sm: 420,
	md: 500,
	lg: 600,
	xl: 600,
};



const ProjectsGlobe = ({ labelDotOrientation, width, height, globeOffset, ...rest }: ProjectsGlobeProps & GlobeProps) => {
	const globeEl = useRef<GlobeMethods | undefined>(undefined);
	const primaryColorRef = useRef<string | null>(null);
	const [state, setState] = useSetState({
		loading: false,
		countriesFeatures: [],
		altitude: 0.05,
	});
	const { t } = useTranslation(["common"]);
	const projectsByCountry = t("common:projectsByCountry", {
		returnObjects: true,
	}) as unknown as ProjectByCountry[];

	// Memoized so the fetch effect below only re-runs when the country list
	// actually changes, not on every render.
	const countriesNames = useMemo(
		() => projectsByCountry.map((c) => c.name.toLocaleLowerCase()),
		[projectsByCountry]
    );
    
	const dataByCountry = projectsByCountry.reduce((acc, c) => {
		acc[c.name.toLocaleLowerCase()] = {
			totalHa: c.totalHa,
			description: c.description,
		};
		return acc;
	}, {});
	const breakpoint = useBreakpoint();
	const size = sizes[breakpoint];

	const fetchData = () => {
		setState({ loading: true });
		fetch("/geojson/ne_110m_admin_0_countries.geojson")
			.then((res) => res.json())
			.then((json) => {
				const countriesFeatures = json.features.filter((f) =>
					countriesNames.includes(f.properties.NAME.toLocaleLowerCase())
				);
				setState({
					loading: false,
					countriesFeatures,
				});
			})
			.catch(() => setState({ loading: false }));
	};
	useEffect(() => {
		if (globeEl.current) {
			// Auto-rotate
			globeEl.current.controls().autoRotate = false;
			globeEl.current.controls().autoRotateSpeed = 0.1;
			globeEl.current.controls().enableZoom = false;
		}
		fetchData();
	}, []);

	const widthVal = width || size;
	const heightVal = height || size;
	const globeOffsetVal = globeOffset || [-(widthVal * 0.1), -(heightVal * 0.1)];

	

	return (
		<div className="w-full h-full relative">
			{state.loading && (
				<div
					className={`absolute inset-0 text-center flex items-center bg-surface/10 text-primary justify-center w-[${widthVal}px] h-[${widthVal}px] md:w-100 md:h-100 lg:w-130 lg:h-130`}
				>
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
			)}

			<GlobeGl
				ref={globeEl}
				globeImageUrl="/img/earth/earth-blue-marble.jpg"
				bumpImageUrl="/img/earth/earth-topology.jpg"
				backgroundColor="#00000000"
				atmosphereAltitude={0.05}
				atmosphereColor="#00000000"
				polygonsData={state.countriesFeatures}
				polygonStrokeColor={() => "rgba(39, 212, 243, 1)"}
				polygonResolution={3}
				polygonMargin={0.3}
				polygonAltitude={state.altitude}
				polygonCapColor={() => "rgba(39, 212, 243, 0.5)"}
				polygonSideColor={() => "rgba(0, 0, 0, 0.15)"}
				polygonLabel={(d) => (
					<div className="text-primary-100">
						<div className="text-xs text-surface">{d.properties.NAME}</div>
						<div className="text-xs">
							<i>
								{dataByCountry[d.properties.NAME.toLocaleLowerCase()].description}
							</i>
						</div>
						<div className="text-[10px] text-surface">
							ha: {dataByCountry[d.properties.NAME.toLocaleLowerCase()].totalHa}
						</div>
					</div>
				)}
				globeOffset={globeOffsetVal}
				width={widthVal}
				height={heightVal}
				showAtmosphere={false}
				labelColor={() => "#27d4f3"}
				labelText={"country"}
				labelDotOrientation={labelDotOrientation}
				labelLabel={(d) => (
					<div className="text-primary">
						<div className="text-xs text-on-surface">{d.goldfield}</div>
						<div className="text-xs">
							<i>
								{dataByCountry[d.properties.NAME.toLocaleLowerCase()].description}
							</i>
						</div>
						<div className="text-[10px] text-on-surface">{d.geology}</div>
					</div>
				)}
				labelSize={0}
				labelDotRadius={1}
				labelResolution={5}

				{...rest}
			/>
		</div>
	);
};
export default ProjectsGlobe;
