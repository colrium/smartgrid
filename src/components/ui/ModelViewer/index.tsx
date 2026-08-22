"use client";

import { Suspense, useEffect, useRef, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import {
	OrbitControls,
	Bounds,
	ContactShadows,
	Environment,
	Html,
	useProgress,
	useGLTF,
	GizmoHelper,
	GizmoViewport,
} from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { Group, Mesh } from "three";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

interface LightSetting {
	intensity?: number;
	color?: string;
	position?: [number, number, number];
}

export interface LightConfig {
	ambient?: LightSetting | false;
	key?: LightSetting | false;
	fill?: LightSetting | false;
	rim?: LightSetting | false;
}
export interface AxesGizmoColors {
    label: string,
    axis: [string, string, string]
}
export interface ModelViewerProps {
	/** URL to a .glb or .gltf file */
	url: string;
	/** Extra classes on the outer container. If given, YOU control sizing (e.g. "w-full h-[500px]") */
	className?: string;
	/** Disable the ground contact shadow */
	disableShadow?: boolean;
	/** Per-light intensity/color/position overrides, or `false` to disable a light */
	lights?: LightConfig;
	/** Slowly rotate the model */
	autoRotate?: boolean;
	autoRotateSpeed?: number;
	/** Closest the camera may zoom in */
	minZoom?: number;
	/** Farthest the camera may zoom out */
	maxZoom?: number;
	/** Show bottom-center button controls */
	showControls?: boolean;
	/** Show the orientation gizmo (top-right) */
	showAxesGizmo?: boolean;
	/** Show the live X/Y/Z camera readout (bottom-left) */
	showCoordinates?: boolean;
	/** drei <Environment> preset for reflections, or false to disable */
	environmentPreset?: string | false;
	axesGizmoColors?: AxesGizmoColors;
}

/* ------------------------------------------------------------------ */
/* Loader (Suspense fallback) — isolated re-renders via useProgress    */
/* ------------------------------------------------------------------ */

function Loader() {
	const { progress } = useProgress();
	return (
		<Html center>
			<div className="flex w-36 flex-col items-center gap-2">
				<div className="h-1 w-full overflow-hidden rounded-full bg-on-surface/10">
					<div
						className="h-full rounded-full bg-primary transition-[width] duration-150 ease-out"
						style={{ width: `${progress}%` }}
					/>
				</div>
				<span className="font-mono text-[11px] tabular-nums text-on-surface/60">
					{Math.round(progress)}%
				</span>
			</div>
		</Html>
	);
}

/* ------------------------------------------------------------------ */
/* Model — enables shadows, then signals readiness once (no material   */
/* opacity mutation: mutating shared/cached glTF materials per-instance*/
/* is what previously left meshes stuck invisible).                    */
/* ------------------------------------------------------------------ */

function Model({ url, onReady }: { url: string; onReady: () => void }) {
	const { scene } = useGLTF(url);
	const groupRef = useRef<Group>(null);
	const announced = useRef(false);

	useEffect(() => {
		scene.traverse((child) => {
			const mesh = child as Mesh;
			if (!mesh.isMesh) return;
			mesh.castShadow = true;
			mesh.receiveShadow = true;
		});

		if (!announced.current) {
			announced.current = true;
			onReady();
		}
	}, [scene, onReady]);

	return <primitive ref={groupRef} object={scene} />;
}

/* ------------------------------------------------------------------ */
/* Lights                                                              */
/* ------------------------------------------------------------------ */

function Lights({ config, shadows }: { config: LightConfig; shadows: boolean }) {
	const { ambient, key, fill, rim } = config;

	return (
		<>
			{ambient !== false && (
				<ambientLight
					intensity={ambient?.intensity ?? 0.6}
					color={ambient?.color ?? "#ffffff"}
				/>
			)}
			{key !== false && (
				<directionalLight
					position={key?.position ?? [5, 6, 5]}
					intensity={key?.intensity ?? 1.6}
					color={key?.color ?? "#ffffff"}
					castShadow={shadows}
					shadow-mapSize={[1024, 1024]}
					shadow-bias={-0.0005}
				/>
			)}
			{fill !== false && (
				<directionalLight
					position={fill?.position ?? [-5, 2, -4]}
					intensity={fill?.intensity ?? 0.45}
					color={fill?.color ?? "#ffffff"}
				/>
			)}
			{rim !== false && (
				<directionalLight
					position={rim?.position ?? [0, 4, -6]}
					intensity={rim?.intensity ?? 0.7}
					color={rim?.color ?? "#a8c6ff"}
				/>
			)}
		</>
	);
}

/* ------------------------------------------------------------------ */
/* Live X/Y/Z camera readout — driven by rAF + DOM refs, no React state*/
/* ------------------------------------------------------------------ */

function useCoordinateReadout(
	controlsRef: React.RefObject<OrbitControlsImpl | null>,
	enabled: boolean
) {
	const elRef = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		if (!enabled) return;
		let raf = 0;
		const tick = () => {
			const cam = controlsRef.current?.object;
			if (cam && elRef.current) {
				elRef.current.textContent = `X ${cam.position.x.toFixed(1)}  Y ${cam.position.y.toFixed(
					1
				)}  Z ${cam.position.z.toFixed(1)}`;
			}
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [controlsRef, enabled]);

	return elRef;
}

/* ------------------------------------------------------------------ */
/* Main component                                                      */
/* ------------------------------------------------------------------ */

export default function ModelViewer({
	url,
	className,
	disableShadow = false,
	lights = {},
	autoRotate = false,
	autoRotateSpeed = 1.2,
	minZoom = 1,
	maxZoom = 12,
	showControls = true,
	showAxesGizmo = false,
	showCoordinates = true,
	environmentPreset = "city",
	axesGizmoColors = {label: "black", axis: ["#f87171", "#4ade80", "#60a5fa"]},
}: ModelViewerProps) {
	const controlsRef = useRef<OrbitControlsImpl | null>(null);
	const autoRotateRef = useRef(autoRotate);
	const autoRotateBtnRef = useRef<HTMLButtonElement>(null);
	const canvasWrapperRef = useRef<HTMLDivElement>(null);

	const coordsRef = useCoordinateReadout(controlsRef, showCoordinates);

	// Ref-driven fade-in: flips a CSS class directly on the DOM node once the
	// model has mounted. No React state, so no extra re-render on load.
	const handleReady = useCallback(() => {
		const el = canvasWrapperRef.current;
		if (!el) return;
		requestAnimationFrame(() => {
			el.classList.remove("opacity-0");
			el.classList.add("opacity-100");
		});
	}, []);

	const handleReset = useCallback(() => {
		controlsRef.current?.reset();
	}, []);

	const dolly = useCallback(
		(factor: number) => {
			const controls = controlsRef.current;
			if (!controls) return;
			const camera = controls.object;
			const target = controls.target;

			const dir = camera.position.clone().sub(target);
			const dist = Math.min(maxZoom, Math.max(minZoom, dir.length() * factor));
			dir.setLength(dist);
			camera.position.copy(target.clone().add(dir));
			controls.update();
		},
		[minZoom, maxZoom]
	);

	const handleZoomIn = useCallback(() => dolly(0.85), [dolly]);
	const handleZoomOut = useCallback(() => dolly(1.15), [dolly]);

	const toggleAutoRotate = useCallback(() => {
		autoRotateRef.current = !autoRotateRef.current;
		if (controlsRef.current) {
			controlsRef.current.autoRotate = autoRotateRef.current;
		}
		autoRotateBtnRef.current?.classList.toggle("bg-accent/20", autoRotateRef.current);
		autoRotateBtnRef.current?.classList.toggle("text-accent", autoRotateRef.current);
	}, []);

	return (
		<div className={className ?? "relative h-[480px] w-full bg-transparent"}>
			<div
				ref={canvasWrapperRef}
				className="h-full w-full opacity-0 transition-opacity duration-500 ease-out"
			>
				<Canvas
					shadows={!disableShadow}
					camera={{ fov: 45, position: [4, 3, 4], near: 0.1, far: 100 }}
					dpr={[1, 2]}
					gl={{ alpha: true, antialias: true }}
					style={{ background: "transparent" }}
				>
					<Lights config={lights} shadows={!disableShadow} />

					<Suspense fallback={<Loader />}>
						<Bounds fit clip observe margin={1.3}>
							<Model url={url} onReady={handleReady} />
						</Bounds>
						{!disableShadow && (
							<ContactShadows
								position={[0, -0.001, 0]}
								opacity={0.55}
								scale={12}
								blur={2.4}
								far={6}
							/>
						)}
						{environmentPreset && <Environment preset={environmentPreset as never} />}
					</Suspense>

					<OrbitControls
						ref={controlsRef}
						makeDefault
						enableDamping
						dampingFactor={0.1}
						minDistance={minZoom}
						maxDistance={maxZoom}
						autoRotate={autoRotate}
						autoRotateSpeed={autoRotateSpeed}
					/>

					{showAxesGizmo && (
						<GizmoHelper alignment="top-right" margin={[64, 64]}>
							<GizmoViewport
								axisColors={
									axesGizmoColors?.axis ?? ["#f87171", "#4ade80", "#60a5fa"]
								}
								labelColor={axesGizmoColors?.label ?? "black"}
							/>
						</GizmoHelper>
					)}
				</Canvas>
			</div>

			{showCoordinates && (
				<span
					ref={coordsRef}
					className="pointer-events-none absolute bottom-3 left-3 select-none font-mono text-[11px] tabular-nums text-on-surface/50"
				/>
			)}

			{showControls && (
				<div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-surface/70 p-1 backdrop-blur-sm">
					<button
						type="button"
						onClick={handleReset}
						className="rounded-full px-3 py-1.5 text-xs text-on-surface/70 transition-colors hover:bg-on-surface/10 hover:text-on-surface"
					>
						Reset
					</button>
					<button
						type="button"
						onClick={handleZoomOut}
						aria-label="Zoom out"
						className="rounded-full px-3 py-1.5 text-sm text-on-surface/70 transition-colors hover:bg-on-surface/10 hover:text-on-surface"
					>
						−
					</button>
					<button
						type="button"
						onClick={handleZoomIn}
						aria-label="Zoom in"
						className="rounded-full px-3 py-1.5 text-sm text-on-surface/70 transition-colors hover:bg-on-surface/10 hover:text-on-surface"
					>
						+
					</button>
					<button
						type="button"
						ref={autoRotateBtnRef}
						onClick={toggleAutoRotate}
						className={`rounded-full px-3 py-1.5 text-xs text-on-surface/70 transition-colors hover:bg-on-surface/10 hover:text-on-surface ${
							autoRotate ? "bg-accent/20 text-accent" : ""
						}`}
					>
						Rotate
					</button>
				</div>
			)}
		</div>
	);
}

useGLTF.preload;
