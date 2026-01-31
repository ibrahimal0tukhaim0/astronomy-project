import type { CelestialData } from '../types';
import { eliteStars } from './CelestialAtlas';

export const celestialObjects: CelestialData[] = [
    // =============================================================================
    // النجم المركزي - الشمس
    // =============================================================================
    {
        id: 'sun',
        type: 'star',
        science: {
            color: '#FFCC33',
            scale: 30.0,
            orbitRadius: 0,
            orbitSpeed: 0,
            orbitInclination: 0,
            orbitPhase: 0,
            glowIntensity: 2.0,
            poetry: 'قِفي يا شَمسُ نُحِيَّكِ بِالسَلامِ .. وَنَشهَدُ أَنَّ مُلكَكِ لا يُرامُ\n\nتحية لعظمة الشمس التي لا يطاول ملكها أحد، فهي مركز النظام.'
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
            scale: 20.0, // 2x (was 10.0)
            orbitRadius: 286, // +30% (was 220)
            orbitSpeed: 0.3, // Slowed for distance
            orbitInclination: 2.0,
            orbitPhase: Math.random() * Math.PI * 2,
            poetry: 'لو كنت يوماً بالنجوم مصدقـاً .. لزعمت أنك أنت بكر عطارد\n\nارتبط عطارد بالبلاغة والذكاء عند العرب.'
        },
        initialPosition: [286, 0, 0],
    },

    // 2. الزهرة (Venus)
    {
        id: 'venus',
        type: 'planet',
        science: {
            color: '#E3BB76',
            scale: 32.0, // 2x (was 16.0)
            orbitRadius: 382, // Gap 80->96 (+20%)
            orbitSpeed: 0.2,
            orbitInclination: 1.0,
            orbitPhase: Math.random() * Math.PI * 2,
        },
        initialPosition: [382, 0, 0],
    },

    // 3. الأرض (Earth)
    {
        id: 'earth',
        type: 'planet',
        science: {
            color: '#2271B3',
            scale: 56.0, // 2x (was 28.0)
            orbitRadius: 480, // Gap 82->98 (+20%)
            orbitSpeed: 0.15,
            orbitInclination: 0,
            orbitPhase: Math.random() * Math.PI * 2,
            rotationSpeed: 0.01,
            poetry: 'والأرضُ فيها لِلمسافرِ مَلجأٌ .. وبها مَقيلٌ للغريبِ ومَأوى\n\nيبرز دور الأرض كمأوى ومسكن آمن للبشر في وسط هذا الفضاء الموحش.'
        },
        initialPosition: [480, 0, 0],
    },

    // القمر (Moon)
    {
        id: 'moon',
        type: 'moon',
        science: {
            color: '#D1D1D1',
            scale: 18.0, // +50% (was 12.0)
            orbitRadius: 81.0, // +20% (was 67.2)
            orbitSpeed: 3.0,
            orbitInclination: 5.1,
            orbitPhase: 0,
            poetry: 'والبدرُ في كبدِ السماءِ كأنهُ .. ملكٌ يطلُّ على الرعيةِ منْ علِ\n\nيصف القمر في وسط السماء كالملك الذي يراقب رعيته بهدوء وهيبة.'
        },
        initialPosition: [561, 0, 0],
    },

    // 4. المريخ (Mars)
    {
        id: 'mars',
        type: 'planet',
        science: {
            color: '#E27B58',
            scale: 24.0, // 2x (was 12.0)
            orbitRadius: 577, // Gap 81->97 (+20%)
            orbitSpeed: 0.12,
            orbitInclination: 1.8,
            orbitPhase: Math.random() * Math.PI * 2,
            poetry: 'ولنارِ المريخِ من حدثانِ الدّهرِ .. مطفٍ وإن علت في اتقادِ\n\nعُرف المريخ بـ "بهرام" ولونه الأحمر الناري، ورُمز به للقوة والبطش.'
        },
        initialPosition: [577, 0, 0],
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
            scale: 32.0, // 2x (was 16.0)
            orbitRadius: 723, // Gap 122->146 (+20%)
            orbitSpeed: 0.08,
            orbitInclination: 1.3,
            orbitPhase: Math.random() * Math.PI * 2,
            poetry: 'له كبرياءُ المشتري وسُعوده .. وسورةُ بهرامٍ وظرفُ عطاردِ\n\nوُصف المشتري بكوكب العظمة والملوك والسعد.'
        },
        initialPosition: [723, 0, 0],
    },

    // 6. زحل (Saturn)
    {
        id: 'saturn',
        type: 'planet',
        science: {
            color: '#E2BF7D',
            scale: 27.0, // 2x (was 13.5)
            orbitRadius: 966, // Gap 203->243 (+20%)
            orbitSpeed: 0.06,
            orbitInclination: 2.5,
            orbitPhase: Math.random() * Math.PI * 2,
            poetry: 'زحلٌ أشرفُ الكواكبِ داراً .. من لقاء الردى على ميعاد\n\nلُقب زحل بـ "أشرف الكواكب" لارتفاع مداره وبُعده الشديد.'
        },
        initialPosition: [966, 0, 0],
    },


    // =============================================================================
    // النجوم البعيدة (في نطاق الرؤية)
    // =============================================================================


    // محطة الفضاء الدولية (ISS) - بمدار خارجي ضخم
    {
        id: 'iss',
        type: 'conceptual', // Special type
        science: {
            color: '#FFFFFF',
            scale: 60.0, // Big scale to be visible
            orbitRadius: 2500, // 🛰️ Far Outer Orbit (Beyond Pluto)
            orbitSpeed: 0.15, // Fast relative to outer planets
            orbitInclination: 20.0, // Tilted orbit
            orbitPhase: 0,
            glowIntensity: 2.0,
            poetry: 'محطة الفضاء الدولية (ISS)\n\nأعجوبة هندسية تدور في السماء، تجمع البشرية في منزلٍ واحد بين النجوم.\n\nالسرعة: 28,000 كم/س\nالارتفاع: 400 كم (واقعياً)\nالطاقم: 7 رواد فضاء'
        },
        initialPosition: [2500, 500, 0],
    },

    // نجم الشعرى
    {
        id: 'sirius',
        type: 'star',
        science: {
            color: '#D9E5FF',
            scale: 600.0,
            orbitRadius: 0,
            orbitSpeed: 0,
            orbitInclination: 0,
            orbitPhase: 0,
            glowIntensity: 5.0,
            poetry: 'نجم العرب الأول. بشروقه تنكسر حدة الحرارة ويبدأ موسم اعتدال الجو. له مكانة خاصة في الثقافة العربية وتسمية الأولاد.\n\nفَقالَ بَصيرُ القَومِ أَلمَحتُ كَوكَباً\nبَدا في سَوادِ اللَيلِ فَرداً يَمانِيا'
        },
        initialPosition: [1360, 1284, -340],
    },

    // الطارق
    {
        id: 'al-tariq',
        type: 'conceptual',
        science: {
            color: '#FFFFFF',
            scale: 480.0, // 🌟 2x Scale (was 240)
            orbitRadius: 0,
            orbitSpeed: 0,
            orbitInclination: 0,
            orbitPhase: 0,
            glowIntensity: 8.0,
            poetry: 'وطارقٍ في دُجى الليلِ جِئتُ بهِ .. يثقُبُ ثوبَ الظلامِ بِنورٍ وَقّادِ\n\nيصف النجم الطارق كأنه مسمار من نور يثقب ثوب الظلام الدامس بلمعانه الشديد.'
        },
        initialPosition: [-24966, 25554, -9360], // 🌟 +200% Distance (was [-8322, 8518, -3120])
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
            scale: 36.0, // 2x (was 18.0)
            orbitRadius: 1208, // Gap 202->242 (+20%)
            orbitSpeed: 0.04,
            orbitInclination: 0.8,
            orbitPhase: Math.random() * Math.PI * 2,
        },
        initialPosition: [1208, 0, 0],
    },

    // 8. نبتون (Neptune)
    {
        id: 'neptune',
        type: 'planet',
        science: {
            color: '#4b70dd',
            scale: 68.0, // 2x (was 34.0)
            orbitRadius: 1403, // Gap 163->195 (+20%)
            orbitSpeed: 0.03,
            orbitInclination: 1.8,
            orbitPhase: Math.random() * Math.PI * 2,
        },
        initialPosition: [1403, 0, 0],
    },

    // 9. بلوتو (Pluto)
    {
        id: 'pluto',
        type: 'planet',
        science: {
            color: '#D0D0D0',
            scale: 36.0, // 2x (was 18.0)
            orbitRadius: 1548, // Gap 121->145 (+20%)
            orbitSpeed: 0.02,
            orbitInclination: 17.0,
            orbitPhase: Math.random() * Math.PI * 2,
            rotationSpeed: 0.0001,
        },
        initialPosition: [1548, 12, 0],
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
            scale: 54.0, // 🌟 3x Scale (was 18)
            orbitRadius: 0,
            orbitSpeed: 0,
            orbitInclination: 0,
            orbitPhase: 0,
            glowIntensity: 6.0,
        },
        initialPosition: [-148, 1648, 1360], // 🌟 Extreme: 2x Distance & Spacing
    },

    // النظام (Alnilam)
    {
        id: 'alnilam',
        type: 'star',
        science: {
            color: '#66ccff',
            scale: 54.0, // 🌟 3x Scale (was 18)
            orbitRadius: 0,
            orbitSpeed: 0,
            orbitInclination: 0,
            orbitPhase: 0,
            glowIntensity: 6.0,
        },
        initialPosition: [0, 1788, 1360], // 🌟 Extreme: 2x Distance
    },

    // المنطقة (Mintaka)
    {
        id: 'mintaka',
        type: 'star',
        science: {
            color: '#66ccff',
            scale: 54.0, // 🌟 3x Scale (was 18)
            orbitRadius: 0,
            orbitSpeed: 0,
            orbitInclination: 0,
            orbitPhase: 0,
            glowIntensity: 6.0,
        },
        initialPosition: [148, 1930, 1360], // 🌟 Extreme: 2x Distance & Spacing
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
            scale: 70.0,
            orbitRadius: 2952, // +20% (was 2460)
            orbitSpeed: 0.1,
            orbitInclination: 10.6,
            orbitPhase: 0,
            shapeScale: [1, 1, 1],
            frustumCulled: false,
            glowIntensity: 0.42,
            texture: 'textures/asteroids/ceres.webp'
        },
        initialPosition: [2952, 20, 0],
    },

    // 2. فيستا (Vesta) - كروي مفلطح
    {
        id: 'vesta',
        type: 'planet',
        science: {
            color: '#FFFFFF', // ☀️ Restored to White for Texture Clarity
            scale: 56.0,
            orbitRadius: 3052, // +20% (was 2544)
            orbitSpeed: 0.09,
            orbitInclination: 7.1,
            orbitPhase: 0.698,
            shapeScale: [1.1, 1.0, 1.0],
            frustumCulled: false,
            glowIntensity: 0.42,
            texture: 'textures/asteroids/vesta.webp'
        },
        initialPosition: [3052, -15, 0],
    },

    // 3. بالاس (Pallas) - غير منتظم قليلاً
    {
        id: 'pallas',
        type: 'planet',
        science: {
            color: '#888888', // 🌑 Darkened: High-albedo texture correction
            scale: 56.0,
            orbitRadius: 3157, // +20% (was 2631)
            orbitSpeed: 0.08,
            orbitInclination: 34.8,
            orbitPhase: 1.396,
            shapeScale: [1.1, 1.0, 0.9],
            frustumCulled: false,
            glowIntensity: 0.42,
            texture: 'textures/asteroids/pallas.webp'
        },
        initialPosition: [3157, 30, 0],
    },

    // 4. جونو (Juno)
    {
        id: 'juno',
        type: 'planet',
        science: {
            color: '#FFFFFF', // ☀️ Restored to White for Texture Clarity
            scale: 44.0,
            orbitRadius: 3260, // +20% (was 2717)
            orbitSpeed: 0.11,
            orbitInclination: 13.0,
            orbitPhase: 2.094,
            shapeScale: [1.0, 1.0, 0.9],
            frustumCulled: false,
            glowIntensity: 0.42,
            texture: 'textures/asteroids/juno.webp'
        },
        initialPosition: [3260, -20, 0],
    },

    // 5. إيروس (Eros) - متطاول جداً (شكل حبة الفول السوداني)
    {
        id: 'eros',
        type: 'planet',
        science: {
            color: '#888888', // 🌑 Darkened: High-albedo texture correction
            scale: 30.0,
            orbitRadius: 3361, // +20% (was 2801)
            orbitSpeed: 0.11,
            orbitInclination: 10.8,
            orbitPhase: 2.792,
            shapeScale: [2.5, 1.0, 1.0],
            frustumCulled: false,
            glowIntensity: 0.42,
            texture: 'textures/asteroids/eros.webp'
        },
        initialPosition: [3361, 10, 0],
    },

    // 6. إيدا (Ida) - متطاول (شكل البطاطس)
    {
        id: 'ida',
        type: 'planet',
        science: {
            color: '#888888', // 🌑 Darkened: High-albedo texture correction
            scale: 36.0,
            orbitRadius: 3464, // +20% (was 2887)
            orbitSpeed: 0.09,
            orbitInclination: 2.0,
            orbitPhase: 3.490,
            shapeScale: [2.2, 1.0, 1.0],
            frustumCulled: false,
            glowIntensity: 0.42,
            texture: 'textures/asteroids/ida.webp'
        },
        initialPosition: [3464, -5, 0],
    },

    // 7. جاسبرا (Gaspra) - غير منتظم جداً
    {
        id: 'gaspra',
        type: 'planet',
        science: {
            color: '#FFFFFF', // ☀️ Restored to White for Texture Clarity
            scale: 28.0,
            orbitRadius: 3568, // +20% (was 2974)
            orbitSpeed: 0.1,
            orbitInclination: 5.0,
            orbitPhase: 4.188,
            shapeScale: [1.8, 1.1, 0.9],
            frustumCulled: false,
            glowIntensity: 0.42,
            texture: 'textures/asteroids/gaspra.webp'
        },
        initialPosition: [3568, 25, 0],
    },

    // 8. بينو (Bennu) - شكل الماسة (معين)
    {
        id: 'bennu',
        type: 'planet',
        science: {
            color: '#888888', // 🌑 Darkened: High-albedo texture correction
            scale: 24.0,
            orbitRadius: 3670, // +20% (was 3059)
            orbitSpeed: 0.12,
            orbitInclination: 6.0,
            orbitPhase: 4.886,
            shapeScale: [1.0, 1.0, 1.0],
            frustumCulled: false,
            glowIntensity: 0.42,
            texture: 'textures/asteroids/bennu.webp'
        },
        initialPosition: [3670, -30, 0],
    },

    // 9. ريوجو (Ryugu) - شكل الماسة
    {
        id: 'ryugu',
        type: 'planet',
        science: {
            color: '#888888', // 🌑 Darkened: High-albedo texture correction
            scale: 26.0,
            orbitRadius: 3774, // +20% (was 3145)
            orbitSpeed: 0.08,
            orbitInclination: 5.9,
            orbitPhase: 5.585,
            shapeScale: [1.0, 1.0, 1.0],
            frustumCulled: false,
            glowIntensity: 0.42,
            texture: 'textures/asteroids/ryugu.webp'
        },
        initialPosition: [3774, 15, 0],
    },

    // 🌟 THE ELITE STARS (Golden Five)
    ...eliteStars
];
