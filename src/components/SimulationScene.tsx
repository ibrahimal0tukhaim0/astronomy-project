import React, { useRef, useEffect, Suspense } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import gsap from 'gsap'
import { Meteors } from './Meteors';
import { SpaceLightning } from './SpaceLightning';
import { SpaceProbe } from './SpaceProbe';

import type { CelestialData } from '../types'
import { celestialObjects } from '../data/objects'
import { CelestialObject } from './CelestialObject'

// 🛡️ Component Boundary: Prevents one effect from crashing the whole scene
class ComponentBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    state = { hasError: false }
    static getDerivedStateFromError() { return { hasError: true } }
    componentDidCatch(e: any) { console.warn("Visual Effect Failed:", e); }
    render() { return this.state.hasError ? null : this.props.children; }
}

interface SimulationSceneProps {
    onSelect: (data: CelestialData) => void;
    isPaused: boolean;
    onDateChange: (date: Date) => void;
    isARMode?: boolean; // 🎥 AR Prop
    isMarathonMode?: boolean; // 🏃‍♂️ Marathon Mode Prop
}

// Base time scale: 1 = Real Time. 2 = Double Speed (Requested)
const BASE_TIME_SCALE = 2.0;

// 🌌 360 Space Background (High Res)
function SpaceBackground() {
    // FIX: Using reliable CDN URL to guarantee loading (bypassing local path issues)
    const texture = useTexture("https://upload.wikimedia.org/wikipedia/commons/6/60/ESO_-_Milky_Way.jpg")

    return (
        <mesh scale={[90000, 90000, 90000]}> {/* Increased scale to 90000 to cover far plane */}
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
// Renders static rings, optionally animated with dashed lines for "High-Tech Radar" look
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

export default function SimulationScene({ onSelect, isPaused, onDateChange, isARMode = false, isMarathonMode = false }: SimulationSceneProps) {
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
            {/* 🌌 BACKGROUND SYSTEM */}
            {/* If AR Mode: Show Webcam. Else: Show Space Background */}
            <Suspense fallback={null}>
                {!isARMode && <SpaceBackground />}
            </Suspense>

            {/* Emergency Lighting - High Intensity */}
            <ambientLight intensity={1.5} color="#FFFFFF" />

            <directionalLight
                position={[100, 100, 100]}
                intensity={2.0}
                color="#FFFFFF"
                castShadow={false}
            />

            <directionalLight
                position={[-100, 50, -100]}
                intensity={1.5}
                color="#AAAAFF"
                castShadow={false}
            />



            {/* 🌠 Shooting Stars (Every 15s) */}
            <ComponentBoundary>
                <Meteors />
            </ComponentBoundary>

            {/* ⚡ Space Lightning (Random Flashes) */}
            <ComponentBoundary>
                <Suspense fallback={null}>
                    <SpaceLightning />
                </Suspense>
            </ComponentBoundary>

            {/* 🚀 Space Probe (Target: Rigil Kentaurus) */}
            <SpaceProbe />

            {/* 🪐 Orbit Rings (Visual Paths) */}
            <PlanetOrbits />

            {celestialObjects.map((obj) => (
                <CelestialObject
                    key={obj.id}
                    data={obj}
                    onSelect={onSelect}
                    dateRef={dateRef}
                    isMarathonMode={isARMode ? false : (isMarathonMode || false)} // Disable in AR, enable if prop is true
                />
            ))}
        </>
    )
}
