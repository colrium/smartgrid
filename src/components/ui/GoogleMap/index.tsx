"use client";

import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";

interface Coords {
	lat: number;
	lng: number;
}
interface MapMarker extends Coords {
	label?: string;
	title?: string;
}

export interface GoogleMapProps {
	markers: MapMarker[];
	defaultCenter?: Coords;
	defaultZoom?: number;
	/** Extra classes on the map wrapper. Include a height class (e.g. "h-[500px]") when overriding. */
	className?: string;
}

export default function GoogleMap({
	defaultCenter = { lat: -1.1466, lng: 36.9609 },
	defaultZoom = 10,
	markers = [
		{ lat: -1.2188769, lng: 36.8876524, label: "TRM" },
		{ lat: -1.1466, lng: 36.9609, label: "The Nord, Ruiru" },
	],
	className = "h-[500px]",
}: GoogleMapProps) {
	const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;
	if (!apiKey) {
		return null;
	}

	return (
		<APIProvider apiKey={apiKey}>
			<div className={`w-full ${className}`}>
				<Map defaultCenter={defaultCenter} defaultZoom={defaultZoom}>
					{Array.isArray(markers) &&
						markers.map((marker, i) => <Marker key={`map-marker-${i}`} {...marker} />)}
				</Map>
			</div>
		</APIProvider>
	);
}
