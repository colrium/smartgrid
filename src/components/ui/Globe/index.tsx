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

interface GlobeProps {
	className?: string;
    placesData?: LocationPlace[];
    labelDotOrientation?: (d: LocationPlace) => void
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

const Globe = ({ labelDotOrientation, ...rest }: GlobeProps & GlobeProps) => {
	const globeEl = useRef<GlobeMethods | undefined>(undefined);
    const [state, setState] = useSetState({ loading: false, countriesFeatures: [], altitude: 0.05 });
    const { t } = useTranslation(["common"]);
    const projectsByCountry = t("common:projectsByCountry", {
		returnObjects: true,
	}) as unknown as ProjectByCountry[];

    // Memoized so the fetch effect below only re-runs when the country list
    // actually changes, not on every render.
    const countriesNames = useMemo(
        () => projectsByCountry.map((c) => c.name.toLocaleLowerCase()),
        [projectsByCountry],
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

	
	useEffect(() => {
		if (globeEl.current) {
			// Auto-rotate
			globeEl.current.controls().autoRotate = false;
			globeEl.current.controls().autoRotateSpeed = 0.1;
			globeEl.current.controls().enableZoom = false;
        }
        setState({ loading: true })
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
	}, [countriesNames, setState]);

	return (
		<div>
			<GlobeGl
				ref={globeEl}
				globeImageUrl="/img/earth/earth-light.jpg"
				bumpImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-topology.png"
				backgroundColor="#00000000"
				atmosphereAltitude={0.05}
				atmosphereColor="#00000000"
				polygonsData={state.countriesFeatures}
				polygonResolution={3}
				polygonMargin={0.3}
				polygonAltitude={state.altitude}
				polygonCapColor={() => "#2bb4cc"}
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
				width={size}
				height={size}
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
export default Globe;
