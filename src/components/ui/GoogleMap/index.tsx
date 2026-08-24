"use client";

import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface Coords {
	lat: number;
	lng: number;
}

export interface MapMarker extends Coords {
	/** Short badge text (unused when title is present). */
	label?: string;
	/** Descriptive text rendered beside the mdi map-marker icon. */
	title?: string;
	icon?: string;
}

export interface GoogleMapProps {
	markers: MapMarker[];
	defaultCenter?: Coords;
	defaultZoom?: number;
	/** Extra classes on the map wrapper. Include a height class (e.g. "h-[500px]") when overriding. */
	className?: string;
}

const DEFAULT_ICON = "mdi-map-marker";

/**
 * A DOM pin projected onto the map at geographic coordinates: an mdi icon
 * plus a descriptive text chip. Recomputes its pixel position on every
 * camera change, so it tracks the map while panning/zooming.
 */
function ProjectedPin({ marker }: { marker: MapMarker }) {
	const map = useMap();
	const ref = useRef<HTMLDivElement>(null);
	const { lat, lng, title, label, icon = DEFAULT_ICON } = marker;

	useEffect(() => {
		const mapInstance = map;
		const el = ref.current;
		if (!mapInstance || !el) return;

		const update = () => {
			const bounds = mapInstance.getBounds();
			if (!bounds) return;
			const container = mapInstance.getDiv();
			const width = container?.clientWidth ?? 0;
			const height = container?.clientHeight ?? 0;
			const ne = bounds.getNorthEast();
			const sw = bounds.getSouthWest();
			const lngSpan = ne.lng() - sw.lng();
			const latSpan = ne.lat() - sw.lat();
			if (!width || !height || !lngSpan || !latSpan) return;

			const x = ((lng - sw.lng()) / lngSpan) * width;
			const y = ((ne.lat() - lat) / latSpan) * height;
			el.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
			el.style.opacity = "1";
		};

		update();
		const listeners = ["bounds_changed", "zoom_changed", "center_changed", "projection_changed", "resize"].map(
			(event) => mapInstance.addListener(event, update),
		);
		return () => listeners.forEach((listener) => listener.remove());
	}, [map, lat, lng]);

	if (!map) return null;

	return createPortal(
		<div
			ref={ref}
			className="absolute left-0 top-0 z-[5] will-change-transform"
			style={{ opacity: 0 }}
		>
			<div className="-translate-x-1/2 -translate-y-full">
				<div className="mb-0.5 flex justify-center">
					<span className="whitespace-nowrap rounded-xl bg-surface/95 px-2.5 p-4 text-xs font-semibold leading-none text-ink shadow-md hairline backdrop-blur-sm">
						{title ?? label}
					</span>
				</div>
				<div className="flex justify-center">
					<span className={`mdi ${icon} text-[34px] leading-none text-primary drop-shadow-sm`} aria-hidden />
				</div>
				<span
					className="mx-auto -mt-[3px] block h-2 w-2 rotate-45 rounded-[2px] bg-primary shadow-sm"
					aria-hidden
				/>
			</div>
		</div>,
		map.getDiv(),
	);
}

export default function GoogleMap({
	defaultCenter = { lat: -1.1466, lng: 36.9609 },
	defaultZoom = 10,
	markers = [
		{ lat: -1.2188769, lng: 36.8876524, title: "TRM" },
		{ lat: -1.1466, lng: 36.9609, title: "The Nord, Ruiru" },
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
				<Map defaultCenter={defaultCenter} defaultZoom={defaultZoom} disableDefaultUI={false}>
					{Array.isArray(markers) &&
						markers.map((marker, i) => (
							<ProjectedPin key={`map-pin-${i}`} marker={marker} />
						))}
				</Map>
			</div>
		</APIProvider>
	);
}
