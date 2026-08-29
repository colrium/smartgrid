// @ts-nocheck
"use client";

/**
 * HeroScene — WebGL background for the home hero.
 *
 * Loaded via next/dynamic (ssr: false) from HeroSection so three.js and its
 * loaders stay out of the initial page bundle. The render loop starts
 * immediately (grid/particles/scanner visible right away) while the drone GLB
 * streams in and is added to the scene once ready.
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

const drone3dProps = new Map([
	[
		"/models/dji_spark_low_poly_medium.glb",
		{
			propellorsAxis: "y",
			scale: [5, 5, 5],
			position: [0, -0.25, 0],
			propellors: [
				"DJI_Spark_LowPol_Prop006_33",
				"DJI_Spark_LowPol_Prop005_28",
				"DJI_Spark_LowPol_Prop003_18",
				"DJI_Spark_LowPol_Prop004_23",
			],
		},
	],
	[
		"/models/drone.gltf",
		{
			propellorsAxis: "y",
			scale: [0.3, 0.3, 0.3],
			position: [0, -0.3, 0],
			propellors: [],
		},
	],
	[
		"/models/drone_low_poly.glb",
		{
			scale: [0.005, 0.005, 0.005],
			position: [0, -0.1, 0],
			propellorsAxis: "z",
			propellors: [
				"Wing1_LowPolyDrone_0",
				"Wing2_LowPolyDrone_0",
				"Wing3_LowPolyDrone_0",
				"Wing4_LowPolyDrone_0",
			],
		},
	],
	[
		"/models/dji_fpv.glb",
		{
			propellorsAxis: "y",
			scale: [0.003, 0.003, 0.003],
			position: [0, 0, 0],
			propellors: [],
		},
	],
	[
		"/models/dji_spark.glb",
		{
			propellorsAxis: "z",
			scale: [0.15, 0.15, 0.15],
			position: [0, -0.2, 0],
			propellors: [
				"Cube_001_Black02_0",
				"Cube_002_Black02_0",
				"Cube_003_Black02_0",
				"Cube_004_Black02_0",
			],
		},
	],
	[
		"/models/DJI_Matrice_M210_RTK.glb",
		{
			propellorsAxis: "z",
			scale: [0.015, 0.015, 0.015],
			position: [-0.14415, 0.155, 0.95],
			propellors: [
				"vrtula_1007_Material3358_0_0",
				"vrtula_1014_Material3180_0_0",
				"vrtula_1005_Material3356_0_0",
				"vrtula_1006_Material3357_0_0",
			],
		},
	],
	[
		"/models/dji-matrice-300.glb",
		{
			propellorsAxis: "y",
			scale: [0.55, 0.55, 0.55],
			position: [-0.015, 0, 0.225],
			propellors: [
				"DJI_M300_helice1_Grey_0",
				"DJI_M300_helice1002_Grey_0",
				"DJI_M300_helice1003_Grey_0",
				"DJI_M300_helice1004_Grey_0",
			],
		},
	],
	[
		"/models/dji-matrice-300-optimized.glb",
		{
			propellorsAxis: "y",
			scale: [0.55, 0.55, 0.55],
			position: [-0.015, 0, 0.225],
			propellors: [
				"DJI_M300_helice1_Grey_0",
				"DJI_M300_helice1002_Grey_0",
				"DJI_M300_helice1003_Grey_0",
				"DJI_M300_helice1004_Grey_0",
			],
		},
	],
]);

const drone3dFile = "/models/dji-matrice-300-optimized.glb";

// Utility function for debouncing events
function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
	let timeout: ReturnType<typeof setTimeout>;
	return function (this: any, ...args: Parameters<T>) {
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(this, args), wait);
	};
}

export default function HeroScene() {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const container = containerRef.current;

		if (!container) return;

		// --- Low-end device guard ---
		// The full-window WebGL scene is far too heavy for low-core / low-memory
		// devices (and software rasterizers) — skip it entirely there; the hero
		// content and fixed instrument frame carry the design on their own.
		const nav = navigator as Navigator & { deviceMemory?: number };
		const isLowEndDevice =
            (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;
        
		// if (isLowEndDevice) return;

		// --- Viewport Observer ---
		let isInViewport = true;
		const observer = new IntersectionObserver(
			([entry]) => {
				isInViewport = entry.isIntersecting;
			},
			{ threshold: 0 } // Triggers as soon as it fully leaves or partially enters
		);
		observer.observe(container);

		// --- Scene Setup ---
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(
			60,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
		camera.position.set(0, 5, 12);

		const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		// Cap pixel ratio at 1.5 — visually indistinguishable for this scene,
		// but far cheaper on high-DPI phones (full-window canvas).
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
		container.appendChild(renderer.domElement);

		// Lighting for the GLB Model
		const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
		scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0);
		directionalLight.position.set(10, 20, 15);
		scene.add(directionalLight);

		// --- Kinetic Grid Shader ---
		// The terrain wave is computed on the GPU via uTime (no per-frame CPU
		// vertex updates or buffer re-uploads).
		const gridUniforms = {
			uColor: { value: new THREE.Color(0xd1e6e3) },
			uDronePos: { value: new THREE.Vector3(10, 10, 10) },
			uRadius: { value: 10.0 },
			uTime: { value: 0 },
		};

		const gridMaterial = new THREE.ShaderMaterial({
			uniforms: gridUniforms,
			vertexShader: `
        uniform float uTime;
        varying vec3 vWorldPosition;
        void main() {
          vec3 pos = position;
          pos.z = sin(pos.x * 0.5 + uTime) * 0.3 + cos(pos.y * 0.5 + uTime) * 0.3;
          vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `,
			fragmentShader: `
        uniform vec3 uColor;
        uniform vec3 uDronePos;
        uniform float uRadius;
        varying vec3 vWorldPosition;
        void main() {
          float dist = distance(vWorldPosition.xz, uDronePos.xz);
          float alpha = 0.7 - smoothstep(0.0, uRadius, dist);
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
			wireframe: true,
			transparent: true,
			depthWrite: false,
			opacity: 0.3,
		});

		// --- Terrain Mesh ---
		const geometry = new THREE.PlaneGeometry(35, 35, 45, 45);
		const terrain = new THREE.Mesh(geometry, gridMaterial);
		terrain.rotation.x = -Math.PI / 2.2;
		terrain.position.set(0, -3.2, 0);
		scene.add(terrain);

		// --- Floating Particles ---
		const particleCount = 10;
		const pGeometry = new THREE.BufferGeometry();
		const pPositions = new Float32Array(particleCount * 3);
		for (let i = 0; i < particleCount * 3; i++) {
			pPositions[i] = (Math.random() - 0.5) * 20;
		}
		pGeometry.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
		const pMaterial = new THREE.PointsMaterial({
			color: 0xcccccc,
			size: 0.08,
			transparent: true,
			opacity: 0.6,
		});
		const particles = new THREE.Points(pGeometry, pMaterial);
		scene.add(particles);
		/*
		// --- Procedural GNSS Receiver (Background Left) ---
		const gnssGroup = new THREE.Group();
		gnssGroup.position.set(-8, -1.2, -5); // Positioned back and left

		// Survey Pole
		const poleGeo = new THREE.CylinderGeometry(0.05, 0.05, 4, 16);
		const poleMat = new THREE.MeshStandardMaterial({
			color: 0x888888,
			metalness: 0.9,
			roughness: 0.2,
		});
		const pole = new THREE.Mesh(poleGeo, poleMat);
		gnssGroup.add(pole);

		 // GNSS Receiver Head
		const headGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.3, 32);
		const headMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.1 });
		const head = new THREE.Mesh(headGeo, headMat);
		head.position.y = 2.15; // Set atop the pole
		gnssGroup.add(head);

		// GNSS Accent Ring (Often blue or yellow)
		const ringGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.05, 32);
		const ringMat = new THREE.MeshStandardMaterial({ color: 0x0077ff, roughness: 0.4 });
		const ring = new THREE.Mesh(ringGeo, ringMat);
		ring.position.y = 2.05;
		gnssGroup.add(ring);

		scene.add(gnssGroup); */
		// --- Procedural Wireframe GNSS Receiver (FOIF A90 Shape) ---
		/* const gnssGroup = new THREE.Group();
		gnssGroup.position.set(-8, -1.2, -5);

		// Wireframe Material
		const wireMat = new THREE.MeshBasicMaterial({
			color: 0x77ccee,
			wireframe: true,
			transparent: true,
			opacity: 0.5,
		});

		// Survey Pole
		const poleGeo = new THREE.CylinderGeometry(0.04, 0.04, 4.5, 12);
		const pole = new THREE.Mesh(poleGeo, wireMat);
		gnssGroup.add(pole);

		// FOIF A90 Lathe Profile
		const points = [];
		points.push(new THREE.Vector2(0, 0.25)); // Top center of dome
		points.push(new THREE.Vector2(0.28, 0.22)); // Dome edge
		points.push(new THREE.Vector2(0.35, 0.15)); // Top of bumper ring
		points.push(new THREE.Vector2(0.35, 0.05)); // Bottom of bumper ring
		points.push(new THREE.Vector2(0.12, -0.15)); // Tapered conical base
		points.push(new THREE.Vector2(0.12, -0.25)); // Base mount straight cylinder
		points.push(new THREE.Vector2(0, -0.25)); // Bottom center

		const headGeo = new THREE.LatheGeometry(points, 24);
		const head = new THREE.Mesh(headGeo, wireMat);
		// Position at the top of the 4.5 unit pole
		head.position.y = 2.25 + 0.25;
		gnssGroup.add(head);

		scene.add(gnssGroup);
	 */
		// --- Drone Container Group ---
		const droneGroup = new THREE.Group();
		droneGroup.position.set(0, 3.5, 0);
		scene.add(droneGroup);

		// Attached Scanner Beam Effect
		const scannerGeo = new THREE.ConeGeometry(2.5, 6, 16, 4, true);
		scannerGeo.translate(0, -3, 0);
		const scannerMat = new THREE.MeshBasicMaterial({
			color: 0xc2e0e8,
			transparent: true,
			opacity: 0.15,
			wireframe: true,
			side: THREE.DoubleSide,
		});
		const scanner = new THREE.Mesh(scannerGeo, scannerMat);
		scanner.position.set(0, -0.15, 0);
		

		// --- Load GLB Drone Model ---
		let mixer: THREE.AnimationMixer | null = null;
		const dracoLoader = new DRACOLoader();
		dracoLoader.setDecoderPath("/draco/");

		const gltfLoader = new GLTFLoader();
		gltfLoader.setDRACOLoader(dracoLoader);

		let loadedDroneMesh: THREE.Object3D | null = null;
		const propellers: THREE.Object3D[] = [];
		//
		const drone3dScale = drone3dProps.get(drone3dFile).scale;
		const drone3dPos = drone3dProps.get(drone3dFile).position;
		const propellorsAxis = drone3dProps.get(drone3dFile).propellorsAxis;
		gltfLoader.load(
			drone3dFile,
			(gltf) => {
				loadedDroneMesh = gltf.scene;

				loadedDroneMesh.scale.set(drone3dScale[0], drone3dScale[1], drone3dScale[2]);
				loadedDroneMesh.position.set(drone3dPos[0], drone3dPos[1], drone3dPos[2]);

				if (loadedDroneMesh.animations && loadedDroneMesh.animations.length > 0) {
					mixer = new THREE.AnimationMixer(loadedDroneMesh);
					loadedDroneMesh.animations.forEach((clip) => {
						mixer.clipAction(clip).play();
					});
				} else if (drone3dProps.has(drone3dFile)) {
					loadedDroneMesh.traverse((child) => {
						const name = child.name;
						if (drone3dProps.get(drone3dFile).propellors.includes(name)) {
							propellers.push(child);
						}
					});
				}
                droneGroup.add(loadedDroneMesh);
                droneGroup.add(scanner);
			},
			undefined,
			(error) => {
				console.error("Error loading GLB Drone model:", error);
			}
		);

		// --- Mouse Interaction with Interpolation ---
		let targetMouseX = 0;
		let targetMouseY = 0;
		let smoothMouseX = 0;
		let smoothMouseY = 0;

		// Store coordinates directly — the lerp in the render loop already
		// smooths the input, so debouncing only added latency.
		const onMouseMove = (e: MouseEvent) => {
			targetMouseX = (e.clientX / window.innerWidth) * 2 - 1;
			targetMouseY = -(e.clientY / window.innerHeight) * 2 + 1;
		};

		window.addEventListener("mousemove", onMouseMove);

		// --- Animation Loop ---
		const clock = new THREE.Clock();
		// Cap to ~30fps and skip entirely when the tab is hidden — continuous
		// full-window rendering saturates low-end CPUs and delays LCP.
		const FRAME_INTERVAL = 1000 / 30;
		let lastFrameTime = 0;
		let animId: number;

		function animate(now: number) {
			animId = requestAnimationFrame(animate);
			// If off-screen or the tab is hidden, skip all calculations and rendering!
			if (!isInViewport || document.hidden) return;
			const frameElapsed = now - lastFrameTime;
			if (frameElapsed < FRAME_INTERVAL) return;
			lastFrameTime = now - (frameElapsed % FRAME_INTERVAL);
			const t = clock.getElapsedTime();

			// Lerp mouse variables for butter-smooth animation
			smoothMouseX += (targetMouseX - smoothMouseX) * 0.05;
			smoothMouseY += (targetMouseY - smoothMouseY) * 0.05;

			// Terrain wave — GPU-side via uTime uniform
			gridUniforms.uTime.value = t;

			terrain.rotation.z = t * 0.05;
			particles.rotation.y = t * 0.02;

			// Drone physics, movement, and subtle mouse follow
			droneGroup.rotation.z = Math.sin(t * 1.5) * 0.05;
			droneGroup.rotation.x = Math.cos(t * 1.2) * 0.05;
			droneGroup.rotation.y += Math.random() * 0.005;

			// Combine sine wave hovering with the smoothed mouse coordinates
			droneGroup.position.x = Math.sin(t * 0.5) * 2.5 + smoothMouseX * 3;
			droneGroup.position.y = 4 + Math.sin(t * 1.2) * 0.3 + smoothMouseY * 2;
			droneGroup.position.z = Math.cos(t * 0.5) * 1.2;

			// Spin the propellers
			propellers.forEach((prop, index) => {
				const direction = index % 2 === 0 ? 1 : -1;
				prop.rotation[propellorsAxis] += 2 * direction;
			});

			scanner.rotation.y += 0.005;
			// Sync shader scan position to drone
			gridUniforms.uDronePos.value.copy(droneGroup.position);

			// Camera parallax (also using smoothed mouse variables)
			camera.position.x += (smoothMouseX * 5 - camera.position.x) * 0.1;
			// camera.position.y += (-smoothMouseY * 5 + 5 - camera.position.y) * 0.1;

			camera.lookAt(0, 2, 0); // Focus slightly above the center

			renderer.render(scene, camera);
		}

		// --- Debounced Resize Handler ---
		const onResize = debounce(() => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		}, 250); // Standard quarter-second debounce for resize operations

		window.addEventListener("resize", onResize);

		// Defer the first render until the window has fully loaded and the main
		// thread is idle — first-draw work (shader compilation, GL uploads)
		// would otherwise compete with hydration and LCP during page load. The
		// grid/particles/scanner appear a beat after load; the drone streams in
		// alongside as before.
		let loopStarted = false;
		const startLoop = () => {
			if (loopStarted) return;
			loopStarted = true;
			animId = requestAnimationFrame(animate);
		};
		const idleWindow = window as Window & {
			requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
		};
        const scheduleLoopStart = () => {
			if (idleWindow.requestIdleCallback) {
				idleWindow.requestIdleCallback(startLoop, { timeout: 3000 });
			} else {
				setTimeout(startLoop, 200);
			}
        };
		if (document.readyState === "complete") {
			scheduleLoopStart();
		} else {
			window.addEventListener("load", scheduleLoopStart);
		}

		// --- Cleanup ---
		return () => {
			cancelAnimationFrame(animId);
			window.removeEventListener("load", scheduleLoopStart);
			observer.disconnect();
			window.removeEventListener("mousemove", onMouseMove);
			window.removeEventListener("resize", onResize);
			geometry.dispose();
			gridMaterial.dispose();
			scannerGeo.dispose();
			scannerMat.dispose();
			pGeometry.dispose();
			pMaterial.dispose();
			renderer.dispose();
			dracoLoader.dispose();
			if (container.contains(renderer.domElement)) {
				container.removeChild(renderer.domElement);
			}
		};
	}, []);

	return (
        <div
            id="hero-scene"
			ref={containerRef}
			className="absolute inset-0 z-0 opacity-80 pointer-events-auto"
		/>
	);
}
