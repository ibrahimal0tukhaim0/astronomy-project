import type { CelestialData } from '../types';

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
            orbitRadius: 13.2, // Increased 10% (was 12)
            orbitSpeed: 3.0,
            orbitInclination: 5.1,
            orbitPhase: 0,
        },
        initialPosition: [163.2, 0, 0], // Earth (150) + 13.2
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


    // المذنب الأخضر (Green Comet - Particle System)

    // نجم الشعرى
    {
        id: 'sirius',
        type: 'star',
        science: {
            color: '#D9E5FF',
            scale: 768.0, // 🌟 Doubled (was 384.0)
            orbitRadius: 0,
            orbitSpeed: 0,
            orbitInclination: 0,
            orbitPhase: 0,
            glowIntensity: 5.0,
        },
        initialPosition: [400, 458.6, -100], // 🌟 Raised 30% (352.8 * 1.3)
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
        initialPosition: [-400, 497.0, -150], // Raised 40% (354.9 * 1.4)
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
        initialPosition: [-52.73, 588.32, 400], // Spaced +30% (-40.56 * 1.3) & Raised +30% (452.55 * 1.3)
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
        initialPosition: [0, 638.82, 400], // Raised +30% (491.4 * 1.3)
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
        initialPosition: [52.73, 689.33, 400], // Spaced +30% (40.56 * 1.3) & Raised +30% (530.25 * 1.3)
    },

    // =============================================================================
    // الصخور الفضائية (Major Space Rocks)
    // =============================================================================

    // 1. سيريس (Ceres) - كروي تقريباً
    {
        id: 'ceres',
        type: 'planet',
        science: {
            color: '#FFFFFF', // ☀️ Restored to White for Texture Clarity
            scale: 224.0, // 2x Scaled (was 112)
            orbitRadius: 2470, // +40% Spacing (was 1764)
            orbitSpeed: 0.02,
            orbitInclination: 10.6,
            orbitPhase: 0, // 0 deg (1/9)
            shapeScale: [1, 1, 1],
            frustumCulled: false,
            glowIntensity: 0.3,
            texture: 'textures/asteroids/ceres.jpg' // 🌑 Authentic NASA Texture
        },
        initialPosition: [1764, 50, 0], // Y-offset +50
    },

    // 2. فيستا (Vesta) - كروي مفلطح
    {
        id: 'vesta',
        type: 'planet',
        science: {
            color: '#FFFFFF', // ☀️ Restored to White for Texture Clarity
            scale: 179.2, // 2x Scaled
            orbitRadius: 2646, // +40% Spacing (was 1890)
            orbitSpeed: 0.018,
            orbitInclination: 7.1,
            orbitPhase: 0.698, // 40 deg (2/9)
            shapeScale: [1.1, 1.0, 1.0],
            frustumCulled: false,
            glowIntensity: 0.3,
            texture: 'textures/asteroids/vesta.jpg' // 🌑 Authentic NASA Texture
        },
        initialPosition: [1890, -40, 0], // Y-offset -40
    },

    // 3. بالاس (Pallas) - غير منتظم قليلاً
    {
        id: 'pallas',
        type: 'planet',
        science: {
            color: '#888888', // 🌑 Darkened: High-albedo texture correction
            scale: 179.2, // 2x Scaled
            orbitRadius: 2793, // +40% Spacing (was 1995)
            orbitSpeed: 0.017,
            orbitInclination: 34.8,
            orbitPhase: 1.396, // 80 deg (3/9)
            shapeScale: [1.1, 1.0, 0.9],
            frustumCulled: false,
            glowIntensity: 0.3,
            texture: 'textures/asteroids/pallas.jpg' // 🌑 Generic High-Res Asteroid Texture (Fallback)
        },
        initialPosition: [1995, 80, 0], // Y-offset +80
    },

    // 4. جونو (Juno)
    {
        id: 'juno',
        type: 'planet',
        science: {
            color: '#FFFFFF', // ☀️ Restored to White for Texture Clarity
            scale: 140.8, // 2x Scaled
            orbitRadius: 2940, // +40% Spacing (was 2100)
            orbitSpeed: 0.019,
            orbitInclination: 13.0,
            orbitPhase: 2.094, // 120 deg (4/9)
            shapeScale: [1.0, 1.0, 0.9],
            frustumCulled: false,
            glowIntensity: 0.3,
            texture: 'textures/asteroids/juno.jpg' // 🌑 Generic High-Res Asteroid Texture (Fallback)
        },
        initialPosition: [2100, -60, 0], // Y-offset -60
    },

    // 5. إيروس (Eros) - متطاول جداً (شكل حبة الفول السوداني)
    {
        id: 'eros',
        type: 'planet',
        science: {
            color: '#888888', // 🌑 Darkened: High-albedo texture correction
            scale: 96.0, // 2x Scaled
            orbitRadius: 3116, // +40% Spacing (was 2226)
            orbitSpeed: 0.016,
            orbitInclination: 10.8,
            orbitPhase: 2.792, // 160 deg (5/9)
            shapeScale: [2.5, 1.0, 1.0],
            frustumCulled: false,
            glowIntensity: 0.3,
            texture: 'textures/asteroids/eros.jpg' // 🌑 Authentic NASA Texture
        },
        initialPosition: [2226, 30, 0], // Y-offset +30
    },

    // 6. إيدا (Ida) - متطاول (شكل البطاطس)
    {
        id: 'ida',
        type: 'planet',
        science: {
            color: '#888888', // 🌑 Darkened: High-albedo texture correction
            scale: 115.2, // 2x Scaled
            orbitRadius: 3293, // +40% Spacing (was 2352)
            orbitSpeed: 0.015,
            orbitInclination: 2.0,
            orbitPhase: 3.490, // 200 deg (6/9)
            shapeScale: [2.2, 1.0, 1.0],
            frustumCulled: false,
            glowIntensity: 0.3,
            texture: 'textures/asteroids/ida.jpg' // 🌑 Authentic NASA Texture
        },
        initialPosition: [2352, -20, 0], // Y-offset -20
    },

    // 7. جاسبرا (Gaspra) - غير منتظم جداً
    {
        id: 'gaspra',
        type: 'planet',
        science: {
            color: '#FFFFFF', // ☀️ Restored to White for Texture Clarity
            scale: 89.6, // 2x Scaled
            orbitRadius: 3455, // +40% Spacing (was 2467.5)
            orbitSpeed: 0.016,
            orbitInclination: 5.0,
            orbitPhase: 4.188, // 240 deg (7/9)
            shapeScale: [1.8, 1.1, 0.9],
            frustumCulled: false,
            glowIntensity: 0.3,
            texture: 'textures/asteroids/gaspra.jpg' // 🌑 Authentic NASA Texture
        },
        initialPosition: [2467.5, 70, 0], // Y-offset +70
    },

    // 8. بينو (Bennu) - شكل الماسة (معين)
    {
        id: 'bennu',
        type: 'planet',
        science: {
            color: '#888888', // 🌑 Darkened: High-albedo texture correction
            scale: 76.8, // 2x Scaled
            orbitRadius: 3616, // +40% Spacing (was 2583)
            orbitSpeed: 0.014,
            orbitInclination: 6.0,
            orbitPhase: 4.886, // 280 deg (8/9)
            shapeScale: [1.0, 1.0, 1.0],
            frustumCulled: false,
            glowIntensity: 0.3,
            texture: 'textures/asteroids/bennu.jpg' // 🌑 Authentic NASA Texture
        },
        initialPosition: [2583, -90, 0], // Y-offset -90
    },

    // 9. ريوجو (Ryugu) - شكل الماسة
    {
        id: 'ryugu',
        type: 'planet',
        science: {
            color: '#888888', // 🌑 Darkened: High-albedo texture correction
            scale: 83.2, // 2x Scaled
            orbitRadius: 3793, // +40% Spacing (was 2709)
            orbitSpeed: 0.013,
            orbitInclination: 5.9,
            orbitPhase: 5.585, // 320 deg (9/9)
            shapeScale: [1.0, 1.0, 1.0],
            frustumCulled: false,
            glowIntensity: 0.3,
            texture: 'textures/asteroids/ryugu.jpg' // 🌑 Authentic NASA Texture
        },
        initialPosition: [2709, 45, 0], // Y-offset +45
    },

    // 10. مذنب هالي (Halley's Comet) - DELETED per user request
];
