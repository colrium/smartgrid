"use client";

import {
	Component,
	Suspense,
	useEffect,
	useMemo,
	useRef,
	useCallback,
	useState,
	type ReactNode,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import Image from "next/image";
import {
	OrbitControls,
	ContactShadows,
	Environment,
	useProgress,
	useGLTF,
	useAnimations,
	GizmoHelper,
	GizmoViewport,
	SoftShadows,
} from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import {
	Box3,
	Vector3,
	type DirectionalLight,
	type Group,
	type Mesh,
	type PerspectiveCamera,
} from "three";
import { useTranslation } from "@/hooks";

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

/**
 * World-space bounds of the loaded model, measured once it mounts. Shadows and
 * the key light anchor to these so GLBs that are not modeled around the origin
 * still get correct grounding, lighting and shadow coverage.
 */
export interface ModelBounds {
	/** Center of the model's bounding box (x, y, z) */
	center: [number, number, number];
	/** World Y of the model's lowest point */
	bottom: number;
	/** Full bounding radius: horizontal (turntable) radius merged with half the height */
	radius: number;
	/** Horizontal (turntable) radius only - the model's footprint on the ground */
	footprint: number;
	/** Full height of the bounding box */
	height: number;
}
export interface ModelViewerProps {
	/** URL to a .glb or .gltf file */
	url: string;
	/** Extra classes on the outer container. If given, YOU control sizing (e.g. "w-full h-[500px]") */
	className?: string;
	/** Disable all shadows: contact blob, shadow catcher and key-light shadows */
	disableShadow?: boolean;
	/**
	 * Per-light intensity/color/position overrides, or `false` to disable a
	 * light. The key light is the only shadow caster: with no explicit position
	 * it is placed relative to the model center and its shadow frustum is
	 * fitted to the model bounds.
	 */
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
	/** Environment preset for reflections ("city" self-hosted in /hdr), a custom files path, or false to disable */
	environmentPreset?: string | false;
	axesGizmoColors?: AxesGizmoColors;
	/** When true (default) the model fetches on mount. When false, a teaser with a Load button defers all 3D loading until clicked. */
	autoLoad?: boolean;
	/** Optional product image shown blurred behind the deferred-load prompt */
	placeholderSrc?: string;
}

/* ------------------------------------------------------------------ */
/* LoadingOverlay - rendered OUTSIDE the Canvas (and outside the       */
/* opacity-0 canvas wrapper), because drei's useProgress() is a global */
/* zustand store hook that does not require R3F context. The previous  */
/* Suspense fallback lived inside the fade-in wrapper, so the progress */
/* indicator was invisible during the whole GLB fetch.                 */
/* ------------------------------------------------------------------ */

function LoadingOverlay({ ready }: { ready: boolean }) {
	const { active, progress } = useProgress();
	const boxRef = useRef<HTMLDivElement>(null);

	// Ref-driven visibility (no setState): toggles the CSS classes directly,
	// same imperative pattern the canvas wrapper fade-in uses.
	useEffect(() => {
		const el = boxRef.current;
		if (!el) return;
		const loading = active && progress < 100 && !ready;
		if (!loading) {
			el.classList.remove("opacity-100");
			el.classList.add("opacity-0");
			el.setAttribute("aria-hidden", "true");
			return;
		}
		// Small delay so near-instant cached loads don't flash the overlay.
		const timer = setTimeout(() => {
			el.classList.remove("opacity-0");
			el.classList.add("opacity-100");
			el.setAttribute("aria-hidden", "false");
		}, 200);
		return () => clearTimeout(timer);
	}, [active, progress, ready]);

	return (
		<div
			ref={boxRef}
			role="status"
			aria-live="polite"
			aria-hidden="true"
			className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center opacity-0 transition-opacity duration-300 ease-out"
		>
			<div className="flex w-36 flex-col items-center gap-2 rounded-xl bg-surface/70 p-4 backdrop-blur-sm">
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
		</div>
	);
}

/* ------------------------------------------------------------------ */
/* LoadPrompt - deferred-load teaser. A blurred, slowly drifting       */
/* product image (or gradient fallback) behind a pulsing Load button.  */
/* Nothing 3D mounts until clicked: no WebGL context, no GLB fetch.    */
/* ------------------------------------------------------------------ */

function LoadPrompt({ src, onStart }: { src?: string; onStart: () => void }) {
	const {t} = useTranslation(["common"])
    return (
		<button
			type="button"
			onClick={onStart}
			aria-label="Load interactive 3D model"
			className="group relative flex h-full w-full cursor-pointer items-center justify-center overflow-hidden bg-linear-to-br from-primary-50/80 via-surface to-primary-100/60"
		>
			{src && (
				<Image
					src={src}
					alt=""
					fill
					loading="lazy"
					sizes="(min-width: 1024px) 60vw, 100vw"
					className="scale-110 object-contain p-12 opacity-70 blur-2xl transition-all duration-700 ease-out group-hover:scale-105 group-hover:opacity-90 group-hover:blur-xl"
				/>
			)}

			<span className="pointer-events-none absolute -left-16 top-1/4 h-56 w-56 rounded-full bg-primary-200/40 blur-3xl" />
			<span className="pointer-events-none absolute -right-16 bottom-1/4 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />

			<span className="relative z-10 flex flex-col items-center gap-4">
				<span className="relative flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 bg-surface/80 shadow-lg backdrop-blur-md transition-transform duration-300 group-hover:scale-110">
					<span className="mdi mdi-rotate-3d text-3xl text-primary" />
					<span className="absolute inset-0 animate-ping rounded-full border border-primary/40 opacity-25" />
				</span>
				<span className="rounded-full bg-primary px-5 py-2 text-xs font-medium uppercase tracking-widest text-surface shadow-md transition-colors group-hover:bg-accent">
					<span className="mdi mdi-play-circle-outline mr-1 align-[-2px]" />
					{t("common:misc.load3d")}
				</span>
			</span>
		</button>
	);
}

/* ------------------------------------------------------------------ */
/* Model - enables shadows, then signals readiness once (no material   */
/* opacity mutation: mutating shared/cached glTF materials per-instance*/
/* is what previously left meshes stuck invisible).                    */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/* Model - enables shadows, signals readiness, and wires glTF clips    */
/* (if any) into a play/pause controller exposed to the parent.        */
/* ------------------------------------------------------------------ */

export interface AnimationController {
	toggle: () => void;
}

function Model({
	url,
	onReady,
	onAnimations,
	onBounds,
}: {
	url: string;
	onReady: () => void;
	onAnimations: (controller: AnimationController | null) => void;
	onBounds: (bounds: ModelBounds) => void;
}) {
	const { scene, animations } = useGLTF(url);
	const groupRef = useRef<Group>(null);
	const announcedFor = useRef<string | null>(null);
	const { actions } = useAnimations(animations, groupRef);

	useEffect(() => {
		scene.traverse((child) => {
			const mesh = child as Mesh;
			if (!mesh.isMesh) return;
			mesh.castShadow = true;
			mesh.receiveShadow = true;
		});

		// Measure the mounted model so shadows/lighting can anchor to where the
		// GLB actually sits in world space (the scene is rendered as-is, never
		// re-centered, so off-origin assets keep their authored placement).
		const group = groupRef.current;
		if (group) {
			group.updateWorldMatrix(true, true);
			const box = new Box3().setFromObject(group);
			if (!box.isEmpty()) {
				const center = box.getCenter(new Vector3());
				let footprint = 0;
				for (const x of [box.min.x, box.max.x]) {
					for (const z of [box.min.z, box.max.z]) {
						footprint = Math.max(
							footprint,
							Math.hypot(x - center.x, z - center.z),
						);
					}
				}
				const halfHeight = (box.max.y - box.min.y) / 2;
				onBounds({
					center: [center.x, center.y, center.z],
					bottom: box.min.y,
					radius: Math.max(0.25, Math.hypot(footprint, halfHeight)),
					footprint: Math.max(0.25, footprint),
					height: Math.max(0.1, box.max.y - box.min.y),
				});
			}
		}

		const clips = Object.values(actions).filter(
			(action): action is NonNullable<(typeof actions)[string]> => Boolean(action),
		);
		if (clips.length > 0) {
			clips.forEach((action) => {
				action.reset();
				action.play();
			});
			onAnimations({
				toggle: () => {
					clips.forEach((action) => {
						action.paused = !action.paused;
					});
				},
			});
		} else {
			onAnimations(null);
		}

		if (announcedFor.current !== url) {
			announcedFor.current = url;
			onReady();
		}

		return () => {
			Object.values(actions).forEach((action) => action?.stop());
			onAnimations(null);
		};
	}, [scene, actions, onReady, onAnimations, onBounds, url]);

	return <primitive ref={groupRef} object={scene} />;
}

/* ------------------------------------------------------------------ */
/* AutoFit - initial framing that fills the canvas width and HOLDS at  */
/* any yaw angle: fits the model's max horizontal (turntable) radius   */
/* to the horizontal FOV, re-fits on resize, and saves controls state  */
/* so "Reset" restores this exact framing.                             */
/* ------------------------------------------------------------------ */

const FIT_MARGIN = 1.06;

/**
 * Imperative initial framing, run outside React's reactive graph: fits the
 * model's max horizontal (turntable) radius to the horizontal FOV so the
 * silhouette stays inside the frame at ANY yaw angle, re-fits on resize, and
 * saves controls state so "Reset" restores this exact framing.
 *
 * Lives at module scope on purpose - the three.js camera/controls are mutable,
 * non-reactive objects obtained from the R3F store, and mutating them here
 * (not during render) is the sanctioned pattern for imperative scene setup.
 */
function applyAutoFit(
	camera: PerspectiveCamera,
	controls: OrbitControlsImpl,
	group: Group,
	minDistance?: number,
	maxDistance?: number,
): void {
	group.updateWorldMatrix(true, true);
	const box = new Box3().setFromObject(group);
	if (box.isEmpty()) return;

	const center = box.getCenter(new Vector3());

	// Turntable-safe framing: use the largest horizontal radius from the
	// center so the silhouette stays inside the frame at ANY yaw angle,
	// not just the orientation present at load time.
	let horizontalRadius = 0;
	for (const x of [box.min.x, box.max.x]) {
		for (const z of [box.min.z, box.max.z]) {
			horizontalRadius = Math.max(
				horizontalRadius,
				Math.hypot(x - center.x, z - center.z),
			);
		}
	}
	const halfHeight = (box.max.y - box.min.y) / 2;
	const radius = Math.hypot(horizontalRadius, halfHeight);

	const vFov = (camera.fov * Math.PI) / 180;
	const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
	const distance =
		FIT_MARGIN *
		Math.max(
			horizontalRadius / Math.tan(hFov / 2),
			halfHeight / Math.tan(vFov / 2),
		);

	const dir = camera.position.clone().sub(center).normalize();
	camera.position.copy(center).addScaledVector(dir, distance);
	camera.near = Math.max(0.01, distance - radius * 2);
	camera.far = Math.max(distance + radius * 10, 50);
	camera.updateProjectionMatrix();

	controls.target.copy(center);
	controls.minDistance = Math.min(minDistance ?? Infinity, distance * 0.5);
	controls.maxDistance = Math.max(maxDistance ?? 0, distance * 2.5);
	controls.update();
	controls.saveState();
}

function AutoFit({
	minDistance,
	maxDistance,
	children,
}: {
	minDistance?: number;
	maxDistance?: number;
	children: ReactNode;
}) {
	const groupRef = useRef<Group>(null);
	const camera = useThree((s) => s.camera) as PerspectiveCamera;
	const size = useThree((s) => s.size);
	const controls = useThree((s) => s.controls) as unknown as OrbitControlsImpl | null;

	useEffect(() => {
		const group = groupRef.current;
		if (!group || !controls) return;

		applyAutoFit(camera, controls, group, minDistance, maxDistance);
	}, [camera, controls, size.width, size.height, minDistance, maxDistance]);

	return <group ref={groupRef}>{children}</group>;
}

/* ------------------------------------------------------------------ */
/* Turntable - rotates the MODEL on Y, not the camera. Keeps the       */
/* camera and ContactShadows world-anchored so the shadow stays in     */
/* place instead of swinging around like the whole scene is spinning.  */
/* ------------------------------------------------------------------ */

function Turntable({
	enabledRef,
	speed,
	children,
}: {
	enabledRef: React.RefObject<boolean>;
	speed: number;
	children: ReactNode;
}) {
	const groupRef = useRef<Group>(null);

	useFrame((_, delta) => {
		if (enabledRef.current && groupRef.current) {
			// OrbitControls convention: autoRotateSpeed 2.0 ≈ one orbit per 30s.
			groupRef.current.rotation.y += delta * ((Math.PI * speed) / 30);
		}
	});

	return <group ref={groupRef}>{children}</group>;
}

/* ------------------------------------------------------------------ */
/* Environment                                                         */
/* Self-hosted HDRs: drei's <Environment preset> pulls from an         */
/* external githack CDN which can fail ("Could not load *.hdr"),       */
/* crashing the canvas via suspense. Local files + error boundary      */
/* keep reflections working offline and failures non-fatal.            */
/* ------------------------------------------------------------------ */

const ENVIRONMENT_FILES: Record<string, string> = {
	city: "/hdr/potsdamer_platz_1k.hdr",
};

function resolveEnvironmentFiles(preset: string): string {
	return ENVIRONMENT_FILES[preset] ?? preset;
}

class EnvironmentErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
	state = { failed: false };

	static getDerivedStateFromError() {
		return { failed: true };
	}

	render() {
		if (this.state.failed) return null;
		return this.props.children;
	}
}

/* ------------------------------------------------------------------ */
/* Lights                                                              */
/* ------------------------------------------------------------------ */

/**
 * Key light - the only shadow caster. With no explicit position it is placed
 * relative to the model center, it always aims at the model (not the world
 * origin), and its orthographic shadow frustum is fitted to the measured
 * bounds so large models don't clip and small models don't waste shadow-map
 * resolution. normalBias scales with the model to keep self-shadow acne off
 * thin geometry.
 */
function KeyLight({
	setting,
	shadows,
	bounds,
}: {
	setting?: LightSetting;
	shadows: boolean;
	bounds: ModelBounds | null;
}) {
	const lightRef = useRef<DirectionalLight>(null);

	const position = useMemo<[number, number, number]>(
		() =>
			setting?.position ?? [
				(bounds?.center[0] ?? 0) + 5,
				(bounds?.center[1] ?? 0) + 6,
				(bounds?.center[2] ?? 0) + 5,
			],
		[setting, bounds],
	);

	useEffect(() => {
		const light = lightRef.current;
		if (!light || !bounds) return;

		// Aim at the model. directionalLight.target is not scene-attached, so
		// its world matrix must be refreshed manually for the change to count.
		const center = new Vector3(...bounds.center);
		light.target.position.copy(center);
		light.target.updateMatrixWorld();

		// Fit the orthographic shadow camera around the bounding sphere.
		const extent = bounds.radius * 2;
		const distance = light.position.distanceTo(center);
		const shadowCam = light.shadow.camera;
		shadowCam.left = -extent;
		shadowCam.right = extent;
		shadowCam.top = extent;
		shadowCam.bottom = -extent;
		shadowCam.near = Math.max(0.1, distance - extent * 1.25);
		shadowCam.far = distance + extent * 1.25;
		shadowCam.updateProjectionMatrix();

		light.shadow.normalBias = Math.max(0.005, bounds.radius * 0.01);
		light.shadow.needsUpdate = true;
	}, [bounds, position]);

	return (
		<directionalLight
			ref={lightRef}
			position={position}
			intensity={setting?.intensity ?? 1.6}
			color={setting?.color ?? "#ffffff"}
			castShadow={shadows}
			shadow-mapSize={[1024, 1024]}
			shadow-bias={-0.0002}
		/>
	);
}

function Lights({
	config,
	shadows,
	bounds,
}: {
	config: LightConfig;
	shadows: boolean;
	bounds: ModelBounds | null;
}) {
	const { ambient, key, fill, rim } = config;

	return (
		<>
			{ambient !== false && (
				<ambientLight
					intensity={ambient?.intensity ?? 0.6}
					color={ambient?.color ?? "#ffffff"}
				/>
			)}
			{key !== false && <KeyLight setting={key} shadows={shadows} bounds={bounds} />}
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

/**
 * Shadow catcher - an invisible ground plane under the model that receives
 * the key light's real shadow. ShadowMaterial renders only the shadowed
 * texels and stays transparent everywhere else, so the canvas' transparent
 * background (and whatever the page puts behind it) is preserved.
 */
function ShadowCatcher({ bounds }: { bounds: ModelBounds }) {
	const size = bounds.radius * 5;
	// Sits below the model and below the ContactShadows plane so the two
	// transparent planes never z-fight.
	const y = bounds.bottom - Math.max(0.01, bounds.radius * 0.01);

	return (
		<mesh
			rotation-x={-Math.PI / 2}
			position={[bounds.center[0], y, bounds.center[2]]}
			receiveShadow
		>
			<planeGeometry args={[size, size]} />
			<shadowMaterial transparent opacity={0.4} color="#000000" />
		</mesh>
	);
}

/* ------------------------------------------------------------------ */
/* Live X/Y/Z camera readout - driven by rAF + DOM refs, no React state*/
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
				elRef.current.textContent = `X: ${cam.position.x.toFixed(1)}  Y: ${cam.position.y.toFixed(
					1
				)}  Z: ${cam.position.z.toFixed(1)}`;
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

/** Stable empty config so the `lights` prop identity never churns per render. */
const DEFAULT_LIGHTS: LightConfig = {};

export default function ModelViewer({
	url,
	className,
	disableShadow = false,
	lights = DEFAULT_LIGHTS,
	autoRotate = false,
	autoRotateSpeed = 1.2,
	minZoom = 1,
	maxZoom = 12,
	showControls = true,
	showAxesGizmo = false,
	showCoordinates = true,
	environmentPreset = "city",
	axesGizmoColors = {label: "black", axis: ["#f87171", "#4ade80", "#60a5fa"]},
	autoLoad = true,
	placeholderSrc,
}: ModelViewerProps) {
	const controlsRef = useRef<OrbitControlsImpl | null>(null);
	const autoRotateRef = useRef(autoRotate);
	const autoRotateBtnRef = useRef<HTMLButtonElement>(null);
	const canvasWrapperRef = useRef<HTMLDivElement>(null);

	// Deferred loading: when autoLoad is false, no Canvas/GLB exists until
	// the user hits the Load prompt.
	const [started, setStarted] = useState(autoLoad);

	// URL of the GLB that has resolved and mounted; gates the LoadingOverlay
	// (ready = the *current* url has finished) so a still-loading HDR
	// environment cannot re-show the overlay over the model.
	const [readyUrl, setReadyUrl] = useState<string | null>(null);

	// World-space bounds of the loaded model - anchors the contact shadow, the
	// shadow catcher and the key light to where the GLB actually sits.
	const [bounds, setBounds] = useState<ModelBounds | null>(null);

	// glTF clip playback (only when the loaded model ships animations).
	const animationCtlRef = useRef<AnimationController | null>(null);
	const [hasAnimations, setHasAnimations] = useState(false);
	const [animPlaying, setAnimPlaying] = useState(true);

	const handleAnimations = useCallback((controller: AnimationController | null) => {
		animationCtlRef.current = controller;
		setHasAnimations(controller !== null);
		setAnimPlaying(controller !== null);
	}, []);

	const toggleAnimations = useCallback(() => {
		animationCtlRef.current?.toggle();
		setAnimPlaying((playing) => !playing);
	}, []);

	const handleClose = useCallback(() => {
		animationCtlRef.current = null;
		setHasAnimations(false);
		setReadyUrl(null);
		setBounds(null);
		setStarted(false);
	}, []);

	const coordsRef = useCoordinateReadout(controlsRef, showCoordinates);

	// Ref-driven fade-in: flips a CSS class directly on the DOM node once the
	// model has mounted. No React state, so no extra re-render on load - except
	// the single modelReady flip that hides the loading overlay.
	const handleBounds = useCallback((next: ModelBounds) => setBounds(next), []);

	const handleReady = useCallback(() => {
		setReadyUrl(url);
		const el = canvasWrapperRef.current;
		if (!el) return;
		requestAnimationFrame(() => {
			el.classList.remove("opacity-0");
			el.classList.add("opacity-100");
		});
	}, [url]);

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
		autoRotateBtnRef.current?.classList.toggle("bg-accent/20", autoRotateRef.current);
		autoRotateBtnRef.current?.classList.toggle("text-accent", autoRotateRef.current);
	}, []);

	// Contact shadow placement/quality derived from the measured bounds, with
	// origin-anchored fallbacks for the brief period before the model mounts.
	// Width tracks the footprint while blur stays fixed, so the soft spread
	// stays a consistent fraction of the model size at any GLB scale.
	const contactPosition: [number, number, number] = bounds
		? [
				bounds.center[0],
				bounds.bottom - Math.max(0.001, bounds.footprint * 0.002),
				bounds.center[2],
			]
		: [0, -0.001, 0];
	const contactScale = bounds ? bounds.footprint * 5 : 12;
	const contactFar = bounds ? Math.max(1.5, bounds.height * 1.4) : 6;

	return (
		<div className={className ?? "relative h-[80dvh] w-full bg-transparent"}>
			{!started ? (
				<LoadPrompt src={placeholderSrc} onStart={() => setStarted(true)} />
			) : (
				<>
					<LoadingOverlay ready={readyUrl === url} />
					{/* Lenis opt-out (wheel-scoped): root-mode Lenis hijacks plain
					    wheel events for page scrolling, so zooming the model only
					    worked while holding Ctrl (Lenis ignores ctrl+wheel). This
					    attribute makes Lenis skip wheel events over the viewer so
					    OrbitControls receives them - hover + scroll = zoom. Touch
					    behavior is intentionally left unchanged. */}
					<div
						ref={canvasWrapperRef}
						data-lenis-prevent-wheel
						className="h-full w-full opacity-0 transition-opacity duration-500 ease-out"
					>
						<Canvas
							shadows={!disableShadow}
							camera={{ fov: 45, position: [4, 3, 4], near: 0.1, far: 100 }}
							dpr={[1, 2]}
							gl={{ alpha: true, antialias: true }}
							style={{ background: "transparent" }}
						>
							<Lights config={lights} shadows={!disableShadow} bounds={bounds} />

							<Suspense fallback={null}>
								<AutoFit minDistance={minZoom} maxDistance={maxZoom}>
									<Turntable enabledRef={autoRotateRef} speed={autoRotateSpeed}>
										<Model
											url={url}
											onReady={handleReady}
											onAnimations={handleAnimations}
											onBounds={handleBounds}
										/>
									</Turntable>
								</AutoFit>
								{/* The key light's real shadow needs a receiver: an
								    invisible ground plane at the model's base. */}
								{/* PCSS soft shadows: patches the shadow shader so
								    penumbras widen with distance from the contact point
								    (contact-hardening). It disposes/recompiles materials
								    on mount/unmount - keep it stably mounted. */}
								{!disableShadow && <SoftShadows size={40} samples={12} focus={0} />}
								{!disableShadow && bounds && <ShadowCatcher bounds={bounds} />}
								{!disableShadow && (
									<ContactShadows
										position={contactPosition}
										opacity={0.4}
										scale={contactScale}
										blur={2.4}
										far={contactFar}
										frames={Infinity}
										resolution={1024}
									/>
								)}
							</Suspense>

							{/* Separate boundary: HDR loading must never re-hide an
							    already-resolved model nor re-trigger the overlay. */}
							<Suspense fallback={null}>
								{environmentPreset && (
									<EnvironmentErrorBoundary>
										<Environment files={resolveEnvironmentFiles(environmentPreset)} />
									</EnvironmentErrorBoundary>
								)}
							</Suspense>

							<OrbitControls
								ref={controlsRef}
								makeDefault
								enableDamping
								dampingFactor={0.1}
								minDistance={minZoom}
								maxDistance={maxZoom}
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
							className="pointer-events-none absolute top-3 left-3 select-none font-mono text-[9px] tabular-nums text-on-surface/50"
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
							{hasAnimations && (
								<button
									type="button"
									onClick={toggleAnimations}
									aria-label={animPlaying ? "Pause animation" : "Play animation"}
									className="rounded-full px-3 py-1.5 text-xs text-on-surface/70 transition-colors hover:bg-on-surface/10 hover:text-on-surface"
								>
									<span
										className={`mdi ${animPlaying ? "mdi-pause" : "mdi-play"} align-[-1px]`}
										aria-hidden
									/>
									{animPlaying ? "Pause" : "Play"}
								</button>
							)}
							<button
								type="button"
								onClick={handleClose}
								aria-label="Close 3D model"
								className="rounded-full px-3 py-1.5 text-xs text-on-surface/70 transition-colors hover:bg-on-surface/10 hover:text-on-surface"
							>
								<span className="mdi mdi-close align-[-1px]" aria-hidden />
								Close 3D Model
							</button>
						</div>
					)}
				</>
			)}
		</div>
	);
}

