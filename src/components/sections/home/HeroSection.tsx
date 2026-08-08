"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

import { useTranslation } from "@/hooks";
import { Trans } from "next-i18next/pages";
import Button, { ButtonProps } from "@mui/material/Button";
import { FadeUp, FadeRight } from "@/components/animations/Fade";

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
    class?: string
}
interface Location {	
	label: string;
    items?: LocationTagItem[];
}
export default function HeroSection() {
	const containerRef = useRef<HTMLDivElement>(null);
    const { t } = useTranslation(["home"]);
    const ctaPrimary = t("home:hero.ctaPrimary", { returnObjects: true }) as CtaItem;
    const ctaSecondary = t("home:hero.ctaSecondary", { returnObjects: true }) as CtaItem;
    const location = t("home:hero.location", { returnObjects: true }) as Location;

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

		// --- Kinetic Grid Shader ---
		const gridUniforms = {
			uColor: { value: new THREE.Color(0xff0000) },
			uDronePos: { value: new THREE.Vector3(10, 10, 10) },
			uRadius: { value: 4.0 },
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
          float alpha = 1.0 - smoothstep(0.0, uRadius, dist);
          gl_FragColor = vec4(uColor, alpha);
        }
      `,
			wireframe: true,
			transparent: true,
			depthWrite: false,
            opacity: 0.5
		});

		// --- Terrain Mesh ---
		const geometry = new THREE.PlaneGeometry(35, 35, 45, 45);
		const terrain = new THREE.Mesh(geometry, gridMaterial);
		terrain.rotation.x = -Math.PI / 2.2;
		scene.add(terrain);

		// --- Floating Particles ---
		const particleCount = 100;
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

		// --- Drone Construction ---
		const droneGroup = new THREE.Group();

		const wireMain = new THREE.LineBasicMaterial({
			color: 0x0097b2,
			transparent: true,
			opacity: 0.7,
		});
		const wireDim = new THREE.LineBasicMaterial({
			color: 0x0097b2,
			transparent: true,
			opacity: 0.45,
		});
		const rotorMat = new THREE.MeshBasicMaterial({
			color: 0x0097b2,
			transparent: true,
			opacity: 0.15,
			side: THREE.DoubleSide,
		});

		const wireMesh = (geo: THREE.BufferGeometry, mat = wireMain) => {
			const edges = new THREE.EdgesGeometry(geo);
			return new THREE.LineSegments(edges, mat);
		};

		// Body
		const body = wireMesh(new THREE.BoxGeometry(0.4, 0.2, 0.7), wireMain);
		droneGroup.add(body);

		// Canopy
		const canopy = wireMesh(new THREE.BoxGeometry(0.25, 0.05, 0.4), wireMain);
		canopy.position.set(0, 0.12, 0.05);
		droneGroup.add(canopy);

		// Arms & Rotors
		const rotors: THREE.Mesh[] = [];
		const angles = [Math.PI / 4, (3 * Math.PI) / 4, -Math.PI / 4, (-3 * Math.PI) / 4];

		angles.forEach((angle) => {
			const armGroup = new THREE.Group();
			armGroup.rotation.y = angle;

			const arm = wireMesh(new THREE.CylinderGeometry(0.025, 0.025, 0.8, 8), wireDim);
			arm.rotation.x = Math.PI / 2;
			arm.position.z = 0.4;
			armGroup.add(arm);

			const motor = wireMesh(new THREE.CylinderGeometry(0.06, 0.06, 0.1, 12), wireMain);
			motor.position.set(0, 0.05, 0.8);
			armGroup.add(motor);

			const rotor = new THREE.Mesh(
				new THREE.CylinderGeometry(0.35, 0.35, 0.005, 16),
				rotorMat
			);
			rotor.position.set(0, 0.1, 0.8);
			armGroup.add(rotor);
			rotors.push(rotor);

			droneGroup.add(armGroup);
		});

		// Landing Gear
		const skidGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.6, 8);
		const skid1 = wireMesh(skidGeo, wireDim);
		skid1.rotation.x = Math.PI / 2;
		skid1.position.set(0.2, -0.25, 0);
		droneGroup.add(skid1);

		const skid2 = wireMesh(skidGeo, wireDim);
		skid2.rotation.x = Math.PI / 2;
		skid2.position.set(-0.2, -0.25, 0);
		droneGroup.add(skid2);

		const legGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.3, 8);
		[-0.2, 0.2].forEach((x) => {
			[-0.15, 0.15].forEach((z) => {
				const leg = wireMesh(legGeo, wireDim);
				leg.position.set(x, -0.125, z);
				droneGroup.add(leg);
			});
		});

		// Gimbal & Scanner Beam
		const gimbal = wireMesh(new THREE.SphereGeometry(0.1, 16, 16), wireMain);
		gimbal.position.set(0, -0.15, 0.2);
		droneGroup.add(gimbal);

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

		droneGroup.position.set(0, 3.5, 0);
		scene.add(droneGroup);

		// --- Mouse Interaction ---
		let mouseX = 0;
		let mouseY = 0;
		const onMouseMove = (e: MouseEvent) => {
			mouseX = (e.clientX / window.innerWidth - 0.5) * 0.5;
			mouseY = (e.clientY / window.innerHeight - 0.5) * 0.5;
		};
		window.addEventListener("mousemove", onMouseMove);

		// --- Animation Loop ---
		const clock = new THREE.Clock();
		let animId: number;

		const animate = () => {
			animId = requestAnimationFrame(animate);
			const t = clock.getElapsedTime();

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

			// Drone physics
			droneGroup.position.y = 3.5 + Math.sin(t * 2) * 0.3;
			droneGroup.rotation.z = Math.sin(t * 1.5) * 0.05;
			droneGroup.rotation.x = Math.cos(t * 1.2) * 0.05;
			droneGroup.position.x = Math.sin(t * 0.5) * 2.5;
			droneGroup.position.z = Math.cos(t * 0.5) * 1.8;

			rotors.forEach((r) => {
				r.rotation.y -= 0.8;
			});
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
		<section className="relative min-h-screen flex items-center justify-center pt-28 pb-16 overflow-hidden">
			{/* WebGL Background */}
			<div
				ref={containerRef}
				className="absolute inset-0 z-0 opacity-80 pointer-events-auto"
			/>

			{/* Content Overlay */}
			<div className="relative z-10 max-w-7xl mx-auto px-6 w-full min-h-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pointer-events-none">
				{/* Left Column */}
				<div className="lg:col-span-8 h-full pointer-events-auto">
					<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-primary/20 text-primary text-xs font-mono font-medium mb-6">
						<span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
						<span>{t("home:hero.badge")}</span>
					</div>
					<FadeRight delay={0.1} className="reveal active">
						<h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-on-surface leading-[1.08] mb-8">
							<Trans
								i18nKey={["home:hero.headline"]}
								defaults="Survey <shine>Smarter</shine>, Build Stronger" // optional defaultValue
								components={{
									italic: <i />,
									shine: <span className="text-primary shine-primary " />,
								}}
							/>
						</h1>
					</FadeRight>

					<p className="text-base sm:text-lg text-on-surface/70 max-w-2xl font-normal leading-relaxed mb-10">
						{t("home:hero.description")}
					</p>
					<FadeUp delay={0.1} className="flex flex-col md:flex-row md:flex-wrap justify-center items-center gap-8 ">
						{ctaPrimary?.href && (
							<Button
								href={ctaPrimary.href}
								className={`rounded-full ${ctaPrimary?.class || ""}`}
								endIcon={<span className={`mdi mdi-${ctaPrimary.icon} text-xl`} />}
								size="large"
								variant={ctaPrimary.variant || "contained"}
								color={ctaPrimary.color || "primary"}
							>
								{ctaPrimary.label}
							</Button>
						)}

						{ctaSecondary?.href && (
							<Button
								href={ctaSecondary.href}
								className={`rounded-full ${ctaSecondary?.class || ""}`}
								endIcon={
									<span className={`mdi mdi-${ctaSecondary.icon} text-sm`} />
								}
								variant={ctaSecondary.variant || "text"}
								color={ctaSecondary.color}
								size="large"
							>
								{ctaSecondary.label}
							</Button>
						)}
					</FadeUp>
					<div className="flex flex-wrap items-center gap-4"></div>
					<FadeUp delay={0.2} className="mt-10">
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

				{/* Right Column — HUD Card */}
				<div className="lg:col-span-4 pointer-events-auto">
					{/* <div className="px-6 rounded-3xl border border-primary/20 relative overflow-hidden ">
						<Image
							src="/img/equipment/total-station.svg"
							alt="total-station-wireframe"
                            
							width={400}
							height={300}
						/>
					</div> */}
				</div>
			</div>
			<div
				className={`px-6 rounded-3xl  hidden md:inline-block fixed right-0 bottom-0 overflow-hidden h-2/3 md:w-1/3 w-full bg-[url('/img/equipment/total-station-wireframe.svg')] bg-cover bg-no-repeat`}
			>
				{/* <Image
					src="/img/equipment/total-station-wireframe.svg"
					alt="total-station-wireframe"
					width={400}
					height={300}
				/> */}
			</div>
		</section>
	);
}
