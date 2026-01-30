import type { CelestialData } from '../types';

export const eliteStars: CelestialData[] = [
    // 1. سهيل (Canopus)
    {
        id: 'canopus',
        type: 'star',
        science: {
            color: '#F5F5DC', // Yellowish White (Beige)
            scale: 540.0,
            orbitRadius: 0,
            orbitSpeed: 0,
            orbitInclination: 0,
            orbitPhase: 0,
            glowIntensity: 4.0,
            roughness: 0.3,
            lightColor: '#F5F5DC',
            augustNotification: true,
            realImage: 'textures/stars/canopus_nasa.jpg',
            poetry: 'أبصرتُ سُهيلاً في السَّماءِ كأنهُ .. جمرةٌ تَذكو في ظلامٍ منَ اللَّيلِ\n\nيصف الشاعر لمعان سهيل القوي وكأنه جمرة متقدة في سواد الليل.'
        },
        initialPosition: [0, -15000, 25000], // South, Very Distant
    },

    // 2. السماك الرامح (Arcturus)
    {
        id: 'arcturus',
        type: 'star',
        science: {
            color: '#FF7F00', // Deep Orange
            scale: 315.0,
            orbitRadius: 0,
            orbitSpeed: 0,
            orbitInclination: 0,
            orbitPhase: 0,
            glowIntensity: 5.0,
            lightColor: '#FF4500',
            realImage: 'textures/stars/arcturus_nasa.jpg'
        },
        initialPosition: [20000, 12000, 0], // East, Very Distant
    },

    // 3. رجل القنطور (Rigil Kentaurus)
    {
        id: 'rigil',
        type: 'star',
        science: {
            color: '#FFF4E5', // G2V (Sun-like)
            scale: 252.0,
            orbitRadius: 0,
            orbitSpeed: 0,
            orbitInclination: 0,
            orbitPhase: 0,
            glowIntensity: 3.5,
            lightColor: '#ffcc33',
            realImage: 'textures/stars/rigil_nasa.jpg'
        },
        initialPosition: [-20000, -8000, 8000], // West/South, Very Distant
    },

    // 4. النسر الواقع (Vega)
    {
        id: 'vega',
        type: 'star',
        science: {
            color: '#A0C0FF', // Blue-White
            scale: 225.0,
            orbitRadius: 0,
            orbitSpeed: 0,
            orbitInclination: 0,
            orbitPhase: 0,
            glowIntensity: 8.0,
            lightColor: '#4488ff',
            realImage: 'textures/stars/vega_nasa.jpg'
        },
        initialPosition: [0, 22000, -10000], // North High, Very Distant
    },

    // 5. العيوق (Capella)
    {
        id: 'capella',
        type: 'star',
        science: {
            color: '#FFD700', // Golden
            scale: 243.0,
            orbitRadius: 0,
            orbitSpeed: 0,
            orbitInclination: 0,
            orbitPhase: 0,
            glowIntensity: 4.0,
            lightColor: '#FFD700',
            pulsationSpeed: 1.5,
            realImage: 'textures/stars/capella_nasa.jpg',
            poetry: 'تراقبُ العيُّوقَ في مَسراهُ .. كما يرقبُ الظمآنُ بَردَ مياهِ\n\nيصف الشدة في مراقبة النجوم وكأنها مراقبة العطشان للماء البارد.'
        },
        initialPosition: [12000, 22000, 12000], // North East, Very Distant
    },
];
