// Celestial Objects Data Model - Educational Astronomy & Monotheism App
// Normalized for Visual Representation (Not 1:1 Scale)

export type CelestialObjectId = 'sun' | 'earth' | 'moon' | 'sirius' | 'al-tariq' | 'venus' | 'mars' | 'mercury' | 'jupiter' | 'saturn' | 'uranus' | 'neptune' | 'pluto' | 'ceres' | 'alnitak' | 'alnilam' | 'mintaka';

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
            scale: 5.0, // Repo Value: 5
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

    // عطارد
    {
        id: 'mercury',
        type: 'planet',
        science: {
            color: '#A5A5A5',
            scale: 0.5, // Repo: 0.5
            orbitRadius: 8, // Repo: 8
            orbitSpeed: 0.8, // Repo: 0.0041 (approx, keep ours for smoothness or adjust. I will keep ours for now but scale distance)
            orbitInclination: 2.0,
            orbitPhase: Math.random() * Math.PI * 2,
        },
        initialPosition: [20, 0, 0],
    },

    // الزهرة
    {
        id: 'venus',
        type: 'planet',
        science: {
            color: '#E3BB76',
            scale: 0.9, // Repo: 0.9
            orbitRadius: 11, // Repo: 11
            orbitSpeed: 0.6,
            orbitInclination: 1.0,
            orbitPhase: Math.random() * Math.PI * 2,
        },
        initialPosition: [35, 0, 0],
    },

    // الأرض
    {
        id: 'earth',
        type: 'planet',
        science: {
            color: '#2271B3',
            scale: 1.0, // Repo: 1
            orbitRadius: 15, // Repo: 15
            orbitSpeed: 0.4,
            orbitInclination: 0,
            orbitPhase: Math.random() * Math.PI * 2,
            rotationSpeed: 0.01,
        },
        initialPosition: [50, 0, 0],
    },

    // القمر - يدور حول الأرض
    // Note: Position handled by astronomy.ts logic relative to Earth
    {
        id: 'moon',
        type: 'moon',
        science: {
            color: '#D1D1D1',
            scale: 0.27, // Repo: 0.27
            orbitRadius: 2.5, // Repo: 2.5 (from Earth)
            orbitSpeed: 4.0,
            orbitInclination: 5.1,
            orbitPhase: 0,
        },
        initialPosition: [17.5, 0, 0], // Earth(15) + 2.5
    },

    // المريخ
    {
        id: 'mars',
        type: 'planet',
        science: {
            color: '#E27B58',
            scale: 0.8, // Repo: 0.8
            orbitRadius: 19, // Repo: 19
            orbitSpeed: 0.3,
            orbitInclination: 1.8,
            orbitPhase: Math.random() * Math.PI * 2,
        },
        initialPosition: [19, 0, 0],
    },

    // =============================================================================
    // العمالقة الغازية
    // =============================================================================

    // المشتري
    {
        id: 'jupiter',
        type: 'planet',
        science: {
            color: '#D39C7E',
            scale: 2.0, // Repo: 2
            orbitRadius: 25, // Repo: 25
            orbitSpeed: 0.2,
            orbitInclination: 1.3,
            orbitPhase: Math.random() * Math.PI * 2,
        },
        initialPosition: [25, 0, 0],
    },

    // زحل
    {
        id: 'saturn',
        type: 'planet',
        science: {
            color: '#E2BF7D',
            scale: 1.7, // Repo: 1.7
            orbitRadius: 31, // Repo: 31
            orbitSpeed: 0.15,
            orbitInclination: 2.5,
            orbitPhase: Math.random() * Math.PI * 2,
        },
        initialPosition: [31, 0, 0],
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
            scale: 4.0,
            orbitRadius: 0,
            orbitSpeed: 0,
            orbitInclination: 0,
            orbitPhase: 0,
            glowIntensity: 5.0,
        },
        initialPosition: [-100, 30, -50], // Within view (-100, not 8M)
    },

    // الطارق
    {
        id: 'al-tariq',
        type: 'conceptual',
        science: {
            color: '#FFFFFF',
            scale: 3.0,
            orbitRadius: 0,
            orbitSpeed: 0,
            orbitInclination: 0,
            orbitPhase: 0,
            glowIntensity: 8.0,
        },
        initialPosition: [80, -20, -100],
    },
    // =============================================================================
    // الكواكب الخارجية (العمالقة الجليدية والكواكب القزمة)
    // =============================================================================

    // أورانوس
    {
        id: 'uranus',
        type: 'planet',
        science: {
            color: '#73C6D9',
            scale: 1.2, // Repo: 1.2
            orbitRadius: 37, // Repo: 37
            orbitSpeed: 0.1,
            orbitInclination: 0.8,
            orbitPhase: Math.random() * Math.PI * 2,
        },
        initialPosition: [37, 0, 0],
    },

    // نبتون
    {
        id: 'neptune',
        type: 'planet',
        science: {
            color: '#4b70dd',
            scale: 1.1, // Repo: 1.1
            orbitRadius: 42, // Repo: 42
            orbitSpeed: 0.08,
            orbitInclination: 1.8,
            orbitPhase: Math.random() * Math.PI * 2,
        },
        initialPosition: [42, 0, 0],
    },

    // بلوتو
    {
        id: 'pluto',
        type: 'planet',
        science: {
            color: '#D0D0D0',
            scale: 0.4, // Repo: 0.4
            orbitRadius: 48, // Repo: 48
            orbitSpeed: 0.04,
            orbitInclination: 17.0,
            orbitPhase: Math.random() * Math.PI * 2,
        },
        initialPosition: [48, 4, 0],
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
            scale: 4.5,
            orbitRadius: 0,
            orbitSpeed: 0,
            orbitInclination: 0,
            orbitPhase: 0,
            glowIntensity: 6.0,
        },
        initialPosition: [-150, 60, -200], // Distant background
    },

    // النظام (Alnilam)
    {
        id: 'alnilam',
        type: 'star',
        science: {
            color: '#66ccff',
            scale: 4.6,
            orbitRadius: 0,
            orbitSpeed: 0,
            orbitInclination: 0,
            orbitPhase: 0,
            glowIntensity: 6.0,
        },
        initialPosition: [-135, 65, -200], // Middle star
    },

    // المنطقة (Mintaka)
    {
        id: 'mintaka',
        type: 'star',
        science: {
            color: '#66ccff',
            scale: 4.4,
            orbitRadius: 0,
            orbitSpeed: 0,
            orbitInclination: 0,
            orbitPhase: 0,
            glowIntensity: 6.0,
        },
        initialPosition: [-120, 70, -200], // Right star
    },
];
