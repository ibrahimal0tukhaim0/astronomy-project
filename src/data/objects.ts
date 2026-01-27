// Celestial Objects Data Model - Educational Astronomy & Monotheism App
// Normalized for Visual Representation (Not 1:1 Scale)

export type CelestialObjectId = 'sun' | 'earth' | 'moon' | 'sirius' | 'al-tariq' | 'venus' | 'mars' | 'mercury' | 'jupiter' | 'saturn' | 'uranus' | 'neptune' | 'pluto' | 'alnitak' | 'alnilam' | 'mintaka' | 'comet';

export interface CelestialData {
    id: CelestialObjectId;
    type: 'star' | 'planet' | 'moon' | 'conceptual';

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
    };

    initialPosition: [number, number, number];
}

export const celestialObjects: CelestialData[] = [
    // =============================================================================
    // النجم المركزي - الشمس
    // =============================================================================
    {
        id: 'sun',
        type: 'star',
        science: {
            color: '#FFCC33',
            scale: 10.0, // Doubled from 5.0
            orbitRadius: 0,
            orbitSpeed: 0,
            orbitInclination: 0,
            orbitPhase: 0,
            glowIntensity: 2.0,
        },
        initialPosition: [0, 0, 0],
    },

    // =============================================================================
    // الكواكب الداخلية
    // =============================================================================

    // 1. عطارد (Mercury) - Innermost
    {
        id: 'mercury',
        type: 'planet',
        science: {
            color: '#A5A5A5',
            scale: 8.0, // Multiplied by 2 (was 4.0)
            orbitRadius: 90, // Row 2 (Was 60)
            orbitSpeed: 0.3, // Slowed for distance
            orbitInclination: 2.0,
            orbitPhase: Math.random() * Math.PI * 2,
        },
        initialPosition: [90, 0, 0],
    },

    // 2. الزهرة (Venus)
    {
        id: 'venus',
        type: 'planet',
        science: {
            color: '#E3BB76',
            scale: 15.0, // Multiplied by 2 (was 7.5)
            orbitRadius: 120, // Row 3 (Was 90)
            orbitSpeed: 0.2,
            orbitInclination: 1.0,
            orbitPhase: Math.random() * Math.PI * 2,
        },
        initialPosition: [120, 0, 0],
    },

    // 3. الأرض (Earth)
    {
        id: 'earth',
        type: 'planet',
        science: {
            color: '#2271B3',
            scale: 8.5, // Enlarged (was 3.0)
            orbitRadius: 150, // Row 4 (Was 120)
            orbitSpeed: 0.15,
            orbitInclination: 0,
            orbitPhase: Math.random() * Math.PI * 2,
            rotationSpeed: 0.01,
        },
        initialPosition: [150, 0, 0],
    },

    // القمر (Moon)
    {
        id: 'moon',
        type: 'moon',
        science: {
            color: '#D1D1D1',
            scale: 4.4, // Multiplied by 2 (was 2.2)
            orbitRadius: 12, // Larger local orbit
            orbitSpeed: 3.0,
            orbitInclination: 5.1,
            orbitPhase: 0,
        },
        initialPosition: [162, 0, 0], // Earth (150) + 12
    },

    // 4. المريخ (Mars)
    {
        id: 'mars',
        type: 'planet',
        science: {
            color: '#E27B58',
            scale: 13.0, // Multiplied by 2 (was 6.5)
            orbitRadius: 180, // Row 5 (Was 150)
            orbitSpeed: 0.12,
            orbitInclination: 1.8,
            orbitPhase: Math.random() * Math.PI * 2,
        },
        initialPosition: [180, 0, 0],
    },

    // =============================================================================
    // العمالقة الغازية
    // =============================================================================

    // 5. المشتري (Jupiter)
    {
        id: 'jupiter',
        type: 'planet',
        science: {
            color: '#D39C7E',
            scale: 16.0, // Enlarged (was 6.0)
            orbitRadius: 220,
            orbitSpeed: 0.08,
            orbitInclination: 1.3,
            orbitPhase: Math.random() * Math.PI * 2,
        },
        initialPosition: [220, 0, 0],
    },

    // 6. زحل (Saturn)
    {
        id: 'saturn',
        type: 'planet',
        science: {
            color: '#E2BF7D',
            scale: 13.5, // Reduced by half (was 27.0)
            orbitRadius: 300,
            orbitSpeed: 0.06,
            orbitInclination: 2.5,
            orbitPhase: Math.random() * Math.PI * 2,
        },
        initialPosition: [300, 0, 0],
    },

    // =============================================================================
    // النجوم البعيدة (في نطاق الرؤية)
    // =============================================================================

    // نجم الشعرى
    {
        id: 'sirius',
        type: 'star',
        science: {
            color: '#D9E5FF',
            scale: 192.0, // Doubled again (was 96.0)
            orbitRadius: 0,
            orbitSpeed: 0,
            orbitInclination: 0,
            orbitPhase: 0,
            glowIntensity: 5.0,
        },
        initialPosition: [400, 235.2, -100], // Raised 40% (168 * 1.4)
    },

    // الطارق
    {
        id: 'al-tariq',
        type: 'conceptual',
        science: {
            color: '#FFFFFF',
            scale: 20.0, // Doubled (was 10.0)
            orbitRadius: 0,
            orbitSpeed: 0,
            orbitInclination: 0,
            orbitPhase: 0,
            glowIntensity: 8.0,
        },
        initialPosition: [-400, 354.9, -150], // Raised 30% (273 * 1.3)
    },
    // =============================================================================
    // الكواكب الخارجية (العمالقة الجليدية والكواكب القزمة)
    // =============================================================================

    // 7. أورانوس (Uranus)
    {
        id: 'uranus',
        type: 'planet',
        science: {
            color: '#73C6D9',
            scale: 9.0,
            orbitRadius: 360,
            orbitSpeed: 0.04,
            orbitInclination: 0.8,
            orbitPhase: Math.random() * Math.PI * 2,
        },
        initialPosition: [360, 0, 0],
    },

    // 8. نبتون (Neptune)
    {
        id: 'neptune',
        type: 'planet',
        science: {
            color: '#4b70dd',
            scale: 17.0,
            orbitRadius: 410,
            orbitSpeed: 0.03,
            orbitInclination: 1.8,
            orbitPhase: Math.random() * Math.PI * 2,
        },
        initialPosition: [410, 0, 0],
    },

    // 9. بلوتو (Pluto)
    {
        id: 'pluto',
        type: 'planet',
        science: {
            color: '#D0D0D0',
            scale: 9.0,
            orbitRadius: 450,
            orbitSpeed: 0.02,
            orbitInclination: 17.0,
            orbitPhase: Math.random() * Math.PI * 2,
            rotationSpeed: 0.0001,
        },
        initialPosition: [450, 12, 0],
    },

    // =============================================================================
    // نجوم حزام الجبار (Orion's Belt)
    // =============================================================================

    // النطاق (Alnitak)
    {
        id: 'alnitak',
        type: 'star',
        science: {
            color: '#66ccff',
            scale: 18.0, // Doubled (was 9.0)
            orbitRadius: 0,
            orbitSpeed: 0,
            orbitInclination: 0,
            orbitPhase: 0,
            glowIntensity: 6.0,
        },
        initialPosition: [-31.2, 301.7, 400], // Spaced 20% & Raised 30%
    },

    // النظام (Alnilam)
    {
        id: 'alnilam',
        type: 'star',
        science: {
            color: '#66ccff',
            scale: 18.4, // Doubled (was 9.2)
            orbitRadius: 0,
            orbitSpeed: 0,
            orbitInclination: 0,
            orbitPhase: 0,
            glowIntensity: 6.0,
        },
        initialPosition: [0, 327.6, 400], // Raised 30% (252 * 1.3)
    },

    // المنطقة (Mintaka)
    {
        id: 'mintaka',
        type: 'star',
        science: {
            color: '#66ccff',
            scale: 17.6, // Doubled (was 8.8)
            orbitRadius: 0,
            orbitSpeed: 0,
            orbitInclination: 0,
            orbitPhase: 0,
            glowIntensity: 6.0,
        },
        initialPosition: [31.2, 353.5, 400], // Spaced 20% & Raised 30%
    },
    // =============================================================================
    // المذنب (The Traveler)
    // =============================================================================
    {
        id: 'comet',
        type: 'conceptual', // Using conceptual to allow custom logic if needed, or treated as planet
        science: {
            color: '#A0E0FF', // Icy Blue
            scale: 6.0,       // Small nucleus but visible
            orbitRadius: 600, // Distant orbit (Safe zone)
            orbitSpeed: 0.1,  // Faster than distant planets implies elliptical rush
            orbitInclination: 20.0, // Highly inclined orbit
            orbitPhase: Math.random() * Math.PI * 2,
            glowIntensity: 2.0,
            texture: 'textures/comet_nucleus.png', // Nucleus Texture
        },
        initialPosition: [600, 100, 0],
    },
];
