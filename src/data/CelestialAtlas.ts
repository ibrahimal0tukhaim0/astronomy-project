import type { CelestialData } from '../types';

export const eliteStars: CelestialData[] = [
    // 1. سهيل (Canopus)
    {
        id: 'canopus',
        type: 'star',
        science: {
            color: '#F5F5DC', // Yellowish White (Beige)
            scale: 70.0,
            orbitRadius: 0,
            orbitSpeed: 0,
            orbitInclination: 0,
            orbitPhase: 0,
            glowIntensity: 4.0,
            roughness: 0.3, // ✨ User Request: 70% reflective
            lightColor: '#F5F5DC', // Matching light
            augustNotification: true, // 🌟 Special feature
            realImage: 'textures/stars/canopus_nasa.jpg'
        },
        initialPosition: [0, -1000, 1400], // South, Distant
    },

    // 2. السماك الرامح (Arcturus)
    {
        id: 'arcturus',
        type: 'star',
        science: {
            color: '#FF7F00', // Deep Orange
            scale: 90.0, // ✨ 1.5x Larger (Standard star ~60)
            orbitRadius: 0,
            orbitSpeed: 0,
            orbitInclination: 0,
            orbitPhase: 0,
            glowIntensity: 5.0,
            lightColor: '#FF4500', // Orange-Red Light
            realImage: 'textures/stars/arcturus_nasa.jpg'
        },
        initialPosition: [1400, 800, 0], // East, High
    },

    // 3. رجل القنطور (Rigil Kentaurus)
    {
        id: 'rigil',
        type: 'star',
        science: {
            color: '#FFF4E5', // G2V (Sun-like)
            scale: 65.0,
            orbitRadius: 0,
            orbitSpeed: 0,
            orbitInclination: 0,
            orbitPhase: 0,
            glowIntensity: 3.5,
            lightColor: '#ffcc33', // Golden Sun-like
            realImage: 'textures/stars/rigil_nasa.jpg'
        },
        initialPosition: [-1400, -500, 500], // West/South
    },

    // 4. النسر الواقع (Vega)
    {
        id: 'vega',
        type: 'star',
        science: {
            color: '#A0C0FF', // Blue-White
            scale: 60.0,
            orbitRadius: 0,
            orbitSpeed: 0,
            orbitInclination: 0,
            orbitPhase: 0,
            glowIntensity: 8.0, // ✨ Sharp Luminosity
            lightColor: '#4488ff', // Blue Light
            realImage: 'textures/stars/vega_nasa.jpg'
        },
        initialPosition: [0, 1500, -500], // North High
    },

    // 5. العيوق (Capella)
    {
        id: 'capella',
        type: 'star',
        science: {
            color: '#FFD700', // Golden
            scale: 65.0,
            orbitRadius: 0,
            orbitSpeed: 0,
            orbitInclination: 0,
            orbitPhase: 0,
            glowIntensity: 4.0,
            lightColor: '#FFD700',
            pulsationSpeed: 1.5, // 🌟 Subtle Pulsation
            realImage: 'textures/stars/capella_nasa.jpg'
        },
        initialPosition: [800, 1500, 800], // North East
    },
];
