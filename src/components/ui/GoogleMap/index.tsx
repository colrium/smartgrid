"use client";

import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface Coords {
	lat: number;
	lng: number;
}

export interface MapMarker extends Coords {
	/** Short badge text (unused when title is present). */
	label?: string;
	/** Descriptive text rendered above the mdi map-marker icon. */
	title?: string;
	icon?: string;
	/** Overrides the auto-generated Google Maps share link. */
	shareUrl?: string;
}

export interface GoogleMapProps {
	markers: MapMarker[];
	defaultCenter?: Coords;
	defaultZoom?: number;
	/** Extra classes on the map wrapper. Include a height class (e.g. "h-[500px]") when overriding. */
	className?: string;
}

const DEFAULT_ICON = "mdi-map-marker";

const mapsLink = (lat: number, lng: number) =>
	`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

/**
 * A DOM pin projected onto the map at geographic coordinates: an mdi icon
 * anchored at the position with its descriptive label floating above, plus
 * a share action that copies a Google Maps link for the spot.
 */
function ProjectedPin({ marker }: { marker: MapMarker }) {
	const map = useMap();
	const ref = useRef<HTMLDivElement>(null);
	const [copied, setCopied] = useState(false);
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

	const handleShare = async (event: React.MouseEvent) => {
		event.stopPropagation();
		const url = marker.shareUrl ?? mapsLink(lat, lng);
		try {
			await navigator.clipboard.writeText(url);
		} catch {
			const textarea = document.createElement("textarea");
			textarea.value = url;
			document.body.appendChild(textarea);
			textarea.select();
			document.execCommand("copy");
			textarea.remove();
		}
		setCopied(true);
		window.setTimeout(() => setCopied(false), 1600);
	};

	if (!map) return null;

	return createPortal(
		<div
			ref={ref}
			className="pointer-events-none absolute left-0 top-0 z-[5] will-change-transform"
			style={{ opacity: 0 }}
		>
			<div className="-translate-x-1/2 -translate-y-full">
				<div className="mb-0.5 flex justify-center">
					<div className="pointer-events-auto flex items-center gap-1 whitespace-nowrap rounded-full bg-surface/95 py-1 pl-2.5 pr-1 shadow-md hairline backdrop-blur-sm">
						<span className="text-xs font-semibold leading-none text-ink">{title ?? label}</span>
						<button
							type="button"
							onClick={handleShare}
							aria-label={`Share location of ${title ?? label}`}
							title={copied ? "Link copied!" : "Share location"}
							className={`ml-0.5 flex h-5 w-5 items-center justify-center rounded-full transition-colors duration-200 cursor-pointer ${
								copied ? "bg-green-100 text-green-700" : "text-on-surface/50 hover:bg-primary-50 hover:text-primary"
							}`}
						>
							<span
								className={`mdi ${copied ? "mdi-check" : "mdi-share-variant"} text-[13px] leading-none`}
								aria-hidden
							/>
						</button>
					</div>
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

/** Custom +/- zoom controls rendered inside the map container. */
function ZoomControls({ fallbackZoom }: { fallbackZoom: number }) {
	const map = useMap();
	if (!map) return null;

	const zoomBy = (delta: number) => {
		const current = map.getZoom() ?? fallbackZoom;
		map.setZoom(current + delta);
	};

	return createPortal(
		<div className="absolute left-3 top-3 z-[6] flex flex-col overflow-hidden rounded-xl bg-surface/95 shadow-md hairline backdrop-blur-sm">
			<button
				type="button"
				onClick={() => zoomBy(1)}
				aria-label="Zoom in"
				className="flex h-9 w-9 cursor-pointer items-center justify-center text-lg text-ink transition-colors duration-200 hover:bg-primary-50 hover:text-primary"
			>
				<span className="mdi mdi-plus leading-none" aria-hidden />
			</button>
			<span className="mx-auto block h-px w-6 bg-ink/10" aria-hidden />
			<button
				type="button"
				onClick={() => zoomBy(-1)}
				aria-label="Zoom out"
				className="flex h-9 w-9 cursor-pointer items-center justify-center text-lg text-ink transition-colors duration-200 hover:bg-primary-50 hover:text-primary"
			>
				<span className="mdi mdi-minus leading-none" aria-hidden />
			</button>
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
				<Map
					defaultCenter={defaultCenter}
					defaultZoom={defaultZoom}
					zoomControl={false}
					streetViewControl={false}
					mapTypeControl={false}
					fullscreenControl={false}
				>
					<ZoomControls fallbackZoom={defaultZoom} />
					{Array.isArray(markers) &&
						markers.map((marker, i) => (
							<ProjectedPin key={`map-pin-${i}`} marker={marker} />
						))}
				</Map>
			</div>
		</APIProvider>
	);
}
