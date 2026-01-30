export type CelestialObjectId = 'sun' | 'earth' | 'moon' | 'sirius' | 'al-tariq' | 'venus' | 'mars' | 'mercury' | 'jupiter' | 'saturn' | 'uranus' | 'neptune' | 'pluto' | 'alnitak' | 'alnilam' | 'mintaka' | 'comet' | 'ceres' | 'vesta' | 'pallas' | 'juno' | 'eros' | 'ida' | 'gaspra' | 'bennu' | 'ryugu' | 'halley' | 'canopus' | 'arcturus' | 'rigil' | 'vega' | 'capella';

export interface CelestialData {
    id: CelestialObjectId;
    type: 'star' | 'planet' | 'moon' | 'conceptual' | 'comet';

    // Visual properties for 3D rendering
    science: {
        color: string;
        scale: number;
        orbitRadius: number; // Distance from center
        orbitSpeed: number;
        orbitInclination: number; // Vertical tilt amplitude
        orbitPhase: number; // Starting angle offset
        rotationSpeed?: number;
        glowIntensity?: number;
        texture?: string; // Optional texture path
        eccentricity?: number; // Optional for elliptical orbits
        shapeScale?: [number, number, number]; // Non-uniform scaling for realistic shapes
        frustumCulled?: boolean; // ✨ User Request: Disable culling for far objects
        lightColor?: string; // 🌟 Custom PointLight Color
        roughness?: number; // 🌟 Surface texture roughness
        pulsationSpeed?: number; // 🌟 Pulse effect speed (for Capella)
        realImage?: string; // 🌟 NASA Image for Info Panel Background
        augustNotification?: boolean; // 🌟 Canopus special alert
        poetry?: string; // 🌟 Arabic poetry
    };

    initialPosition: [number, number, number];
}
