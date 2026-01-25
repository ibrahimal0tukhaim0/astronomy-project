import { useRef, useEffect, Suspense } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import gsap from 'gsap'
import { AsteroidBelts } from './AsteroidBelts'

import type { CelestialData } from '../data/objects'
import { celestialObjects } from '../data/objects'
import { CelestialObject } from './CelestialObject'

interface SimulationSceneProps {
    onSelect: (data: CelestialData) => void;
    isPaused: boolean;
    onDateChange: (date: Date) => void;
}

// Base time scale: 1 = Real Time (1 second = 1 second)
const BASE_TIME_SCALE = 1;

// 🌌 Procedural Particle Starfield (SoumyaEXE Implementation)
// 🌌 360 Space Background (High Res)
// 🌌 360 Space Background (High Res)
function SpaceBackground() {
    // FIX: Using reliable CDN URL to guarantee loading (bypassing local path issues)
    const texture = useTexture("https://upload.wikimedia.org/wikipedia/commons/6/60/ESO_-_Milky_Way.jpg")

    return (
        <mesh scale={[4000, 4000, 4000]}> {/* Increased scale to 4000 to be safely behind everything */}
            <sphereGeometry args={[1, 64, 64]} />
            <meshBasicMaterial
                map={texture}
                side={THREE.BackSide}
                toneMapped={false} // Keep colors vivid
            />
        </mesh>
    )
}


// 🪐 Planet Orbits (Visual Paths)
// Renders static rings showing the orbital path of each planet
// 🪐 Planet Orbits (Visual Paths)
// Renders Dashed Blue Lines for "High-Tech Radar" look
// 🪐 Planet Orbits (Visual Paths)
// Renders Dashed Blue Lines for "High-Tech Radar" look
// Bypass TS conflict for <line> element
const ThreeLine = 'line' as any;

function PlanetOrbits() {
    const groupRef = useRef<THREE.Group>(null);
    const orbitPlanets = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];

    // GSAP Fade-in Effect
    useEffect(() => {
        if (groupRef.current) {
            // Animate opacity using GSAP
            groupRef.current.children.forEach((child, index) => {
                if (child instanceof THREE.Line) { // Changed to Line check
                    const mat = child.material as THREE.LineDashedMaterial;
                    const targetOpacity = 0.5; // Subtle opacity as requested
                    mat.opacity = 0;
                    gsap.to(mat, {
                        opacity: targetOpacity,
                        duration: 2.0, // Slower fade for elegance
                        delay: index * 0.15,
                        ease: "power2.out"
                    });
                }
            });
        }
    }, []);

    return (
        <group ref={groupRef} rotation={[Math.PI / 2, 0, 0]}>
            {celestialObjects.map((obj) => {
                if (!orbitPlanets.includes(obj.id)) return null;

                const r = obj.science.orbitRadius;

                // Create Curve Geometry
                const curve = new THREE.EllipseCurve(0, 0, r, r, 0, 2 * Math.PI, false, 0);
                const points = curve.getPoints(128); // Smooth circle
                const geometry = new THREE.BufferGeometry().setFromPoints(points);

                return (
                    <ThreeLine
                        key={`orbit-${obj.id}`}
                        geometry={geometry}
                        onUpdate={(self: any) => {
                            const line = self as THREE.Line;
                            line.computeLineDistances();
                        }}
                    >
                        <lineDashedMaterial
                            color="#44aaff"
                            dashSize={3} // Requested: 3
                            gapSize={1}  // Requested: 1
                            scale={1}    // Adjust scale if dashes look too big/small relative to scene unit
                            transparent={true}
                            opacity={0} // Controlled by GSAP
                            depthWrite={false}
                            blending={THREE.AdditiveBlending}
                        />
                    </ThreeLine>
                );
            })}
        </group>
    );
}

export default function SimulationScene({ onSelect, isPaused, onDateChange }: SimulationSceneProps) {
    const dateRef = useRef(new Date());
    const lastUiUpdate = useRef(0);

    // Use useFrame for loop but respect pause state
    useFrame((state, delta) => {
        if (isPaused) return;

        const safeDelta = Math.min(delta, 0.1);
        const effectiveTimeScale = BASE_TIME_SCALE;

        dateRef.current = new Date(dateRef.current.getTime() + safeDelta * 1000 * effectiveTimeScale);

        if (state.clock.elapsedTime - lastUiUpdate.current > 0.06) {
            onDateChange(new Date(dateRef.current));
            lastUiUpdate.current = state.clock.elapsedTime;
        }
    });

    return (
        <>
            {/* Reference Repository Starfield System - REPLACED with 360 Background */}
            <Suspense fallback={null}>
                <SpaceBackground />
            </Suspense>

            {/* Reference Lighting Setup - Cinematic Deep Space Balance */}
            <ambientLight intensity={0.2} color="#111122" /> {/* Subtle blue tint for shadows */}

            {/* Fill Light (Blueish) - Soft Rim Light */}
            <pointLight
                position={[50, 50, -100]}
                intensity={0.5}
                color="#4466ff"
                distance={500}
                decay={0.8}
            />

            {/* ☄️ Procedural Asteroid Belts (Main, Trojans, Kuiper, Oort) */}
            <AsteroidBelts />

            {/* 🪐 Orbit Rings (Visual Paths) */}
            <PlanetOrbits />

            {celestialObjects.map((obj) => (
                <CelestialObject
                    key={obj.id}
                    data={obj}
                    onSelect={onSelect}
                    dateRef={dateRef}
                />
            ))}
        </>
    )
}
