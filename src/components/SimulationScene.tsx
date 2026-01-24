import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
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
function ReferenceStarfield() {
    // Generate 5000 random stars
    const starsGeometry = new THREE.BufferGeometry();
    const count = 5000;
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i++) {
        // Range: -600 to +600 matchings repo
        positions[i] = (Math.random() - 0.5) * 1200;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    return (
        <points>
            <bufferGeometry attach="geometry" {...starsGeometry} />
            <pointsMaterial
                attach="material"
                color={0xffffff}
                size={0.7} // Repo size
                sizeAttenuation={true} // Perspective scaling
            />
        </points>
    );
}


// 🪐 Planet Orbits (Visual Paths)
// Renders static rings showing the orbital path of each planet
// 🪐 Planet Orbits (Visual Paths)
// Renders Dashed Blue Lines for "High-Tech Radar" look
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
                    // @ts-ignore: TypeScript confuses this with SVG line element
                    <line
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
                    </line>
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
            {/* Reference Repository Starfield System */}
            <ReferenceStarfield />

            {/* Reference Lighting Setup - Boosted for Visibility */}
            <ambientLight intensity={1.5} color={new THREE.Color(0.2, 0.2, 0.2)} />

            {/* Fill Light (Blueish) - Boosted */}
            <pointLight
                position={[50, 50, -100]}
                intensity={3.0}
                color={new THREE.Color(0.3, 0.5, 1.0)}
                distance={500}
                decay={0.5}
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
