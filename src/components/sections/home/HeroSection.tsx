// @ts-nocheck
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { motion, useScroll, useTransform } from "framer-motion";

import { useTranslation } from "@/hooks";
import { Trans } from "next-i18next/pages";
import Button, { ButtonProps } from "@mui/material/Button";
import { FadeUp, FadeRight, FadeLeft } from "@/components/animations/Fade";

interface CtaItem {
	label: string;
	href?: string;
	icon?: string;
	class?: string;
	variant?: ButtonProps["variant"];
	color?: ButtonProps["color"];
}
interface LocationTagItem {
	label: string;
	code: string;
	href?: string;
	icon?: string;
	class?: string;
}
interface Location {
	label: string;
	items?: LocationTagItem[];
}

export default function HeroSection() {
	const containerRef = useRef<HTMLDivElement>(null);
	const heroRef = useRef<HTMLElement>(null);
	const { t } = useTranslation(["home"]);
	const ctaPrimary = t("home:hero.ctaPrimary", { returnObjects: true }) as CtaItem;
	const ctaSecondary = t("home:hero.ctaSecondary", { returnObjects: true }) as CtaItem;
	const location = t("home:hero.location", { returnObjects: true }) as Location;

	const { scrollYProgress } = useScroll({
		target: heroRef,
		offset: ["start end", "start end"],
	});
	const wireframeOpacity = useTransform(scrollYProgress, [0.02, 0.35], [0, 1]);
	const colorOpacity = useTransform(scrollYProgress, [0.3, 0.7], [1, 0]);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

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
		renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
		container.appendChild(renderer.domElement);

		// --- Lighting (Required for GLTF standard materials) ---
		const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
		scene.add(ambientLight);

		const dirLight = new THREE.DirectionalLight(0xffffff, 2.5);
		dirLight.position.set(5, 12, 8);
		scene.add(dirLight);

		// --- Kinetic Grid Shader ---
		const gridUniforms = {
			uColor: { value: new THREE.Color(0xd1e6e3) },
			uDronePos: { value: new THREE.Vector3(10, 10, 10) },
			uRadius: { value: 10.0 },
		};

		const gridMaterial = new THREE.ShaderMaterial({
			uniforms: gridUniforms,
			vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
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

		// --- Drone Parent Container ---
		const droneGroup = new THREE.Group();
		droneGroup.position.set(0, 3.5, 0);
		scene.add(droneGroup);

		// --- Scanner Beam (Sci-fi Light Cone) ---
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
		scanner.position.set(0, -0.15, 0.2);
		droneGroup.add(scanner);

		// --- GLTF Drone Model Loader ---
		let mixer: THREE.AnimationMixer | null = null;
		const loader = new GLTFLoader();

		// Update path to point to your GLTF model file in the public directory
		loader.load(
			"/models/drone.gltf",
			(gltf) => {
				const gltfScene = gltf.scene;

				// Adjust scale, position, or rotation if needed to fit your scene
				gltfScene.scale.set(0.3, 0.3, 0.3);
				gltfScene.position.set(0, -0.3, 0);

				droneGroup.add(gltfScene);

				// Play model animations (e.g. spinning propellers) if embedded in GLTF
				if (gltf.animations && gltf.animations.length > 0) {
					mixer = new THREE.AnimationMixer(gltfScene);
					gltf.animations.forEach((clip) => {
						mixer.clipAction(clip).play();
					});
				}
			},
			undefined,
			(error) => {
				console.error("An error occurred loading the GLTF model:", error);
			}
		);

		// --- Mouse Interaction ---
		let mouseX = 0;
		let mouseY = 0;
		const onMouseMove = (e: MouseEvent) => {
			mouseX = -(e.clientX / window.innerWidth - 0.5) * 2 + 1;
			mouseY = (e.clientY / window.innerHeight - 0.5) * 2 + 1;
		};
		window.addEventListener("mousemove", onMouseMove);

		// --- Animation Loop ---
		const clock = new THREE.Clock();
		let animId: number;

		const animate = () => {
			animId = requestAnimationFrame(animate);
			const delta = clock.getDelta();
			const t = clock.getElapsedTime();

			// Update GLTF model animations (e.g., spinning rotors)
			if (mixer) mixer.update(delta);

			// Terrain wave
			const pos = geometry.attributes.position as THREE.BufferAttribute;
			for (let i = 0; i < pos.count; i++) {
				const u = pos.getX(i);
				const v = pos.getY(i);
				const z = Math.sin(u * 0.5 + t) * 0.3 + Math.cos(v * 0.5 + t) * 0.3;
				pos.setZ(i, z);
			}
			pos.needsUpdate = true;

			terrain.rotation.z = t * 0.05;
			particles.rotation.y = t * 0.02;

			// Drone floating physics
			droneGroup.position.y = 3.5 + Math.sin(t * 2) * 0.3;
			droneGroup.rotation.z = Math.sin(t * 1.5) * 0.05;
			droneGroup.rotation.x = Math.cos(t * 1.2) * 0.05;
			droneGroup.position.x = Math.sin(t * 0.5) * 2.5;
			droneGroup.position.z = Math.cos(t * 0.5) * 1.8;

			scanner.rotation.y += 0.02;

			// Sync shader scan position to drone
			gridUniforms.uDronePos.value.copy(droneGroup.position);

			// Camera parallax
			camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
			camera.position.y += (-mouseY * 5 + 5 - camera.position.y) * 0.05;
			camera.lookAt(0, 0, 0);

			renderer.render(scene, camera);
		};
		animate();

		// --- Resize Handler ---
		const onResize = () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		};
		window.addEventListener("resize", onResize);

		// --- Cleanup ---
		return () => {
			cancelAnimationFrame(animId);
			window.removeEventListener("mousemove", onMouseMove);
			window.removeEventListener("resize", onResize);
			geometry.dispose();
			gridMaterial.dispose();
			pGeometry.dispose();
			pMaterial.dispose();
			renderer.dispose();
			if (container.contains(renderer.domElement)) {
				container.removeChild(renderer.domElement);
			}
		};
	}, []);

	return (
		<section
			ref={heroRef}
			className="relative min-h-[90dvh] flex items-center justify-center pt-24 pb-20 sm:pt-28 sm:pb-24 lg:pt-32 lg:pb-32 overflow-hidden"
		>
			{/* WebGL Background */}
			<div
				ref={containerRef}
				className="absolute inset-0 z-0 opacity-80 pointer-events-auto"
			/>

			{/* Content Overlay */}
			<div className="relative z-10 mx-auto w-full min-h-full max-w-7xl px-6 sm:px-8 lg:px-12 xl:px-16 py-10 sm:py-14 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-20 xl:gap-24 items-center pointer-events-none">
				{/* Left Column */}
				<div className="lg:col-span-10 h-full pointer-events-auto">
					<FadeLeft delay={0.1} className="reveal active">
						<div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full glass text-primary text-xs font-semibold uppercase tracking-[0.18em] mb-8 sm:mb-10">
							<span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
							<span className="whitespace-pre-line">{t("home:hero.badge")}</span>
						</div>
					</FadeLeft>

					<FadeRight delay={0.1} className="reveal active">
						<h1 className="text-5xl sm:text-7xl lg:text-8xl font-light tracking-tight text-ink leading-[1.05] mb-8 sm:mb-10 lg:mb-12 whitespace-pre-line">
							<Trans
								i18nKey={["home:hero.headline"]}
								defaults="Survey <shine>Smarter</shine>, Build Stronger"
								components={{
									italic: <i />,
									shine: <span className="text-primary shine-primary " />,
								}}
							/>
						</h1>
					</FadeRight>
					<FadeUp delay={0.15} className="mt-12 sm:mt-14">
						<p className="text-base sm:text-lg text-on-surface/60 max-w-2xl font-normal leading-relaxed mb-10 sm:mb-12 whitespace-pre-line">
							{t("home:hero.description")}
						</p>
					</FadeUp>

					<FadeUp
						delay={0.1}
						className="flex flex-col-reverse items-center md:flex-row md:flex-wrap justify-start md:items-start gap-4 sm:gap-6"
					>
						{ctaPrimary?.href && (
							<Link
								href={ctaPrimary.href}
								className="group inline-flex items-center gap-3 h-14 rounded-full bg-primary shadow-2xl px-8 text-surface font-medium text-base transition-all duration-300 hover:shadow-[0_18px_42px_-10px_rgba(1,55,61,0.55)]"
							>
								<span className="h-1.5 w-1.5 rounded-full bg-surface transition-transform duration-300 group-hover:scale-125" />
								{ctaPrimary.label}
								{ctaPrimary.icon && (
									<span
										className={`mdi mdi-${ctaPrimary.icon} text-xl text-surface transition-transform duration-300 group-hover:translate-x-1`}
									/>
								)}
							</Link>
						)}

						{ctaSecondary?.href && (
							<Link
								href={ctaSecondary.href}
								className="group inline-flex items-center gap-3 h-14 rounded-full bg-surface shadow-2xl px-8 text-primary font-medium text-base transition-all duration-300 hover:shadow-[0_18px_42px_-10px_rgba(1,55,61,0.55)]"
							>
								{ctaSecondary.label}
								{ctaSecondary.icon ? (
									<span
										className={`mdi mdi-${ctaSecondary.icon} text-lg text-primary transition-transform group-hover:translate-x-1`}
									/>
								) : (
									<span className="h-1.5 w-1.5 rounded-full bg-brand-200" />
								)}
							</Link>
						)}
					</FadeUp>
					<div className="flex flex-wrap items-center gap-4">
						<FadeUp delay={0.2} className="mt-12 sm:mt-14">
							<div className="flex flex-wrap items-center gap-8 reveal active">
								<div className="flex items-center gap-3">
									<div className="flex -space-x-2">
										{Array.isArray(location.items) &&
											location.items.map((item: any, index: number) => (
												<div
													className="w-9 h-9 rounded-full bg-primary/20 border-2 border-surface flex items-center justify-center text-xs font-bold text-primary"
													key={index}
												>
													{item.code}
												</div>
											))}
									</div>
									<span className="text-sm text-on-surface/50 font-medium">
										{location.label}
									</span>
								</div>
							</div>
						</FadeUp>
					</div>
				</div>

				{/* Right Column */}
				<div className="lg:col-span-2 pointer-events-auto" />
			</div>

			<motion.div
				className={`px-6 rounded-3xl hidden md:inline-block absolute right-0 bottom-0 overflow-hidden h-2/3 md:w-1/3 w-full bg-[url('/img/equipment/total-station-color.png')] bg-cover bg-no-repeat -z-0`}
				style={{ opacity: wireframeOpacity }}
			/>
		</section>
	);
}
