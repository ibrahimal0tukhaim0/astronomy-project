import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { getObjectPosition } from '../utils/astronomy';
import { celestialObjects } from '../data/objects';
import type { CelestialObjectId } from '../types';

interface OrbitPathProps {
    objectId: string;
    color: string;
    periodYears: number;
}

// Orbital periods in years (kept for potential future planet additions)
const ORBITAL_PERIODS: Record<string, number> = {

    venus: 0.615, // Venus orbital period ~225 days
    mercury: 0.24, // Mercury period ~88 days
    mars: 1.88, // Mars orbital period ~687 days
    jupiter: 11.86, // Jupiter orbital period ~11.86 years
    saturn: 29.46, // Saturn orbital period ~29.46 years
    uranus: 84.0, // Uranus orbital period ~84 years
    neptune: 164.8, // Neptune orbital period ~164.8 years
    pluto: 248.0, // Pluto orbital period ~248 years
    ceres: 4.6, // Ceres orbital period ~4.6 years
};

function OrbitPath({ objectId, color, periodYears }: OrbitPathProps) {
    const points = useMemo(() => {
        const pts: THREE.Vector3[] = [];
        // For distinct visual orbit, we want a full loop.
        // We calculate positions for the full period.
        // We use more segments for larger orbits.
        const segments = Math.max(128, Math.ceil(periodYears * 60));
        const now = new Date();
        const fullPeriodMs = periodYears * 365.25 * 24 * 60 * 60 * 1000;

        // Start from "now" and go back a full period to form a closed loop ending at "now"
        // (Actually it doesn't matter where we start as long as it covers the period)

        for (let i = 0; i <= segments; i++) {
            const t = i / segments;
            // t goes 0 to 1 over the full period
            const timeOffset = t * fullPeriodMs;
            const date = new Date(now.getTime() - timeOffset);

            const pos = getObjectPosition(objectId as CelestialObjectId, date);
            pts.push(new THREE.Vector3(...pos));
        }
        return pts;
    }, [objectId, periodYears]);

    return (
        <Line
            points={points}
            color={color}
            opacity={0.15} // Reduced opacity for cleaner look
            transparent
            lineWidth={1}
        />
    );
}

export function OrbitalTrails() {
    // Only show trails for major planets
    const orbitingObjects = celestialObjects.filter(obj =>
        obj.type === 'planet' &&
        obj.id !== 'moon'
    );

    return (
        <group>
            {orbitingObjects.map(obj => (
                <OrbitPath
                    key={obj.id}
                    objectId={obj.id}
                    color={obj.science.color}
                    periodYears={ORBITAL_PERIODS[obj.id] || 1}
                />
            ))}
        </group>
    );
}
