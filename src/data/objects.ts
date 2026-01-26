// Celestial Objects Data Model - Educational Astronomy & Monotheism App
// Normalized for Visual Representation (Not 1:1 Scale)

export type CelestialObjectId = 'sun' | 'earth' | 'moon' | 'sirius' | 'al-tariq' | 'venus' | 'mars' | 'mercury' | 'jupiter' | 'saturn' | 'uranus' | 'neptune' | 'pluto' | 'alnitak' | 'alnilam' | 'mintaka';

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

    // 1. عطارد (Mercury) - Innermost
    {
        id: 'mercury',
        type: 'planet',
        science: {
            color: '#A5A5A5',
            scale: 1.5, // 3x Original (0.5)
            orbitRadius: 14, // Gap: Sun(5) + Buffer < 14. Safe.
            orbitSpeed: 0.8, // RESTORED
            orbitInclination: 2.0,
            orbitPhase: Math.random() * Math.PI * 2,
        },
        initialPosition: [14, 0, 0],
    },

    // 2. الزهرة (Venus)
    {
        id: 'venus',
        type: 'planet',
        science: {
            color: '#E3BB76',
            scale: 2.7, // 3x Original (0.9)
            orbitRadius: 22,
            orbitSpeed: 0.6, // RESTORED
            orbitInclination: 1.0,
            orbitPhase: Math.random() * Math.PI * 2,
        },
        initialPosition: [22, 0, 0],
    },

    // 3. الأرض (Earth)
    {
        id: 'earth',
        type: 'planet',
        science: {
            color: '#2271B3',
            scale: 3.0, // 3x Original (1.0)
            orbitRadius: 30,
            orbitSpeed: 0.4, // RESTORED
            orbitInclination: 0,
            orbitPhase: Math.random() * Math.PI * 2,
            rotationSpeed: 0.01,
        },
        initialPosition: [30, 0, 0],
    },

    // القمر (Moon)
    {
        id: 'moon',
        type: 'moon',
        science: {
            color: '#D1D1D1',
            scale: 0.81, // 3x Original (0.27)
            orbitRadius: 4.5,
            orbitSpeed: 4.0,
            orbitInclination: 5.1,
            orbitPhase: 0,
        },
        initialPosition: [34.5, 0, 0],
    },

    // 4. المريخ (Mars)
    {
        id: 'mars',
        type: 'planet',
        science: {
            color: '#E27B58',
            scale: 2.4, // 3x Original (0.8)
            orbitRadius: 40,
            orbitSpeed: 0.3, // RESTORED
            orbitInclination: 1.8,
            orbitPhase: Math.random() * Math.PI * 2,
        },
        initialPosition: [40, 0, 0],
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
            scale: 6.0, // 3x Original (2.0)
            orbitRadius: 65,
            orbitSpeed: 0.2,
            orbitInclination: 1.3,
            orbitPhase: Math.random() * Math.PI * 2,
        },
        initialPosition: [65, 0, 0],
    },

    // 6. زحل (Saturn)
    {
        id: 'saturn',
        type: 'planet',
        science: {
            color: '#E2BF7D',
            scale: 5.1, // 3x Original (1.7)
            orbitRadius: 90,
            orbitSpeed: 0.15,
            orbitInclination: 2.5,
            orbitPhase: Math.random() * Math.PI * 2,
        },
        initialPosition: [90, 0, 0],
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

    // 7. أورانوس (Uranus)
    {
        id: 'uranus',
        type: 'planet',
        science: {
            color: '#73C6D9',
            scale: 3.6, // 3x Original (1.2)
            orbitRadius: 110,
            orbitSpeed: 0.0005, // Background Slow
            orbitInclination: 0.8,
            orbitPhase: Math.random() * Math.PI * 2,
            // rotationSpeed removed (back to default)
        },
        initialPosition: [110, 0, 0],
    },

    // 8. نبتون (Neptune)
    {
        id: 'neptune',
        type: 'planet',
        science: {
            color: '#4b70dd',
            scale: 3.3, // 3x Original (1.1)
            orbitRadius: 130,
            orbitSpeed: 0.0004, // Background Slow
            orbitInclination: 1.8,
            orbitPhase: Math.random() * Math.PI * 2,
            // rotationSpeed removed
        },
        initialPosition: [130, 0, 0],
    },

    // 9. بلوتو (Pluto)
    {
        id: 'pluto',
        type: 'planet',
        science: {
            color: '#D0D0D0',
            scale: 1.2, // 3x Original (0.4)
            orbitRadius: 145,
            orbitSpeed: 0.0002, // Background Slow
            orbitInclination: 17.0,
            orbitPhase: Math.random() * Math.PI * 2,
            rotationSpeed: 0.0001, // DEEP FREEZE
        },
        initialPosition: [145, 4, 0],
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
