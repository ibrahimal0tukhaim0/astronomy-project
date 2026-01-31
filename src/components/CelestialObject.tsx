import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import type { CelestialData } from '../types' // ✨ Refactored Import
import * as THREE from 'three';
import { getObjectPosition } from '../utils/astronomy'
import { textureLoadingManager } from '../utils/textureManager';

// Helper for dynamic assets


interface CelestialObjectProps {
    data: CelestialData
    onSelect: (data: CelestialData) => void
    dateRef: React.MutableRefObject<Date>
    isSelected?: boolean
    isMarathonMode?: boolean
}




// 🌍 الكوكب العام (Generic Planet Component)
// يستخدم لجميع الكواكب الصخرية والغازية البسيطة لتقليل تكرار الكود
interface GenericPlanetProps {
    scale?: number;
    texturePath: string;
    rotationSpeed: number;
    roughness?: number;
    metalness?: number;
    bumpMapPath?: string;
    atmosphereColor?: string;
    emissiveColor?: string;
    emissiveIntensity?: number;
}

function GenericPlanet({
    scale = 1.0,
    texturePath,
    rotationSpeed,
    roughness = 0.3, // ✨ User Request: Glossy
    metalness = 0.2, // ✨ User Request: Specular
    emissiveColor = "#FFFFFF",
    emissiveIntensity = 0.05,
}: GenericPlanetProps) {
    const texture = useTexture(`${import.meta.env.BASE_URL}${texturePath}`);
    const meshRef = useRef<THREE.Mesh>(null);

    // ✅ تنظيف الذاكرة (Memory Cleanup)
    useEffect(() => {
        return () => texture.dispose();
    }, [texture]);

    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * rotationSpeed;
        }
    });

    return (
        <mesh ref={meshRef} scale={scale} castShadow={true} receiveShadow={true}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshStandardMaterial
                map={texture}
                color="#FFFFFF"
                roughness={roughness}
                metalness={metalness}
                emissiveMap={texture}
                emissive={emissiveColor}
                emissiveIntensity={emissiveIntensity} // إضاءة خافتة جداً للمناطق المظلمة (أو مخصصة)
            />
        </mesh>
    );
}

// 🪐 كوكب زحل الحقيقي (Real Saturn)
// يتضمن الحلقات والكوكب معاً في مجموعة واحدة
function RealSaturn({ scale = 1.0 }: { scale?: number }) {
    const surfaceTexture = useTexture(`${import.meta.env.BASE_URL}textures/saturn_surface.webp`);
    const ringTexture = useTexture(`${import.meta.env.BASE_URL}textures/saturn_rings.webp`);
    const groupRef = useRef<THREE.Group>(null);
    const planetRef = useRef<THREE.Mesh>(null);
    const ringsRef = useRef<THREE.Mesh>(null);

    // ✅ تنظيف الذاكرة
    useEffect(() => {
        return () => {
            surfaceTexture.dispose();
            ringTexture.dispose();
        };
    }, []);

    useFrame((_, delta) => {
        // 1. دوران الكوكب حول نفسه (سريع جداً)
        if (planetRef.current) {
            planetRef.current.rotation.y += delta * 2.5;
        }

        // 2. دوران الحلقات (بطيء ومستقل)
        if (ringsRef.current) {
            ringsRef.current.rotation.z -= delta * 0.02;
        }
    });

    return (
        <group ref={groupRef}>
            {/* جسم الكوكب (مفلطح قليلاً عند القطبين) */}
            <mesh
                ref={planetRef}
                scale={[scale * 1.1, scale * 0.9, scale * 1.1]}
                castShadow={true}
                receiveShadow={true}
            >
                <sphereGeometry args={[1, 64, 64]} />
                <meshStandardMaterial
                    map={surfaceTexture}
                    color="#FFFFFF"
                    roughness={0.3} // ✨ Glossy
                    metalness={0.2} // ✨ Specular
                    emissiveMap={surfaceTexture}
                    emissive="#C0A080" // Warm Saturnian color
                    emissiveIntensity={0.24} // Increased 20% (0.2 -> 0.24)
                />
            </mesh>
            {/* الحلقات */}
            <mesh
                ref={ringsRef}
                rotation={[-Math.PI / 2, 0, 0]}
                scale={scale}
                receiveShadow={true}
                castShadow={true}
            >
                <ringGeometry args={[1.4, 2.3, 128]} />
                <meshStandardMaterial
                    map={ringTexture}
                    transparent={true}
                    alphaMap={ringTexture}
                    side={THREE.DoubleSide}
                    depthWrite={false}
                    opacity={0.95}
                    color="#DDDDDD"
                    emissiveMap={ringTexture}
                    emissive="#C0A080"
                    emissiveIntensity={0.36} // Increased 20% (0.3 -> 0.36)
                />
            </mesh>
        </group>
    );
}
// ☀️ الشمس الحقيقية (Real Sun)
function RealSun({ scale = 1.0 }: { scale?: number }) {
    const texture = useTexture(`${import.meta.env.BASE_URL}textures/sun_surface.webp`);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/immutability
        texture.wrapS = THREE.RepeatWrapping;
        // eslint-disable-next-line react-hooks/immutability
        texture.wrapT = THREE.RepeatWrapping;
        return () => texture.dispose();
    }, [texture]);

    const meshRef = useRef<THREE.Mesh>(null);
    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.08;
        }
    });

    return (
        <mesh ref={meshRef} scale={scale} castShadow={false} receiveShadow={false}>
            <sphereGeometry args={[5, 64, 64]} />
            <meshStandardMaterial
                map={texture}
                color="#FFFFFF"
                roughness={0.2}
                metalness={0.0}
                emissiveMap={texture}
                emissive="#FFDD00"
                emissiveIntensity={2.0}
                toneMapped={false}
            />
        </mesh>
    );
}

// 🌍 الأرض الحقيقية (Real Earth)
// تتطلب معالجة خاصة للغيوم والنهار
function RealEarth({ scale = 1.0 }: { scale?: number }) {
    const dayTexture = useTexture(`${import.meta.env.BASE_URL}textures/earth_daymap.webp`);
    const cloudTexture = useTexture(`${import.meta.env.BASE_URL}textures/earth_clouds.webp`);
    const earthRef = useRef<THREE.Group>(null);
    const cloudsRef = useRef<THREE.Mesh>(null);

    useEffect(() => {
        return () => {
            dayTexture.dispose();
            cloudTexture.dispose();
        };
    }, []);

    useFrame((_, delta) => {
        if (earthRef.current) earthRef.current.rotation.y += delta * 0.15;
        if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.02;
    });

    return (
        <group ref={earthRef}>
            {/* السطح */}
            <mesh scale={scale} castShadow={true} receiveShadow={true}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshStandardMaterial
                    map={dayTexture}
                    color="#FFFFFF"
                    roughness={0.3} // ✨ Glossy
                    metalness={0.2} // ✨ Specular
                    emissiveMap={dayTexture}
                    emissive="#112244" // Atmosphere Reflection
                    emissiveIntensity={0.18} // Increased 20% (0.15 -> 0.18)
                />
            </mesh>

            {/* الغيوم */}
            <mesh
                ref={cloudsRef}
                scale={scale * 1.01}
                castShadow={true}
                receiveShadow={true}
            >
                <sphereGeometry args={[1, 64, 64]} />
                <meshStandardMaterial
                    map={cloudTexture}
                    transparent={true}
                    opacity={0.9}
                    side={THREE.DoubleSide}
                    depthWrite={false}
                    blending={THREE.NormalBlending}
                />
            </mesh>

        </group>
    );
}

// 🌟 Generic Star for Elite Stars (Customizable)
function GenericStar({ scale = 1.0, color = "#FFFFFF", lightColor = "#FFFFFF", glowIntensity = 2.0, pulsationSpeed = 0, roughness = 0.2 }: {
    scale?: number, color?: string, lightColor?: string, glowIntensity?: number, pulsationSpeed?: number, roughness?: number
}) {
    const meshRef = useRef<THREE.Mesh>(null);
    const lightRef = useRef<THREE.PointLight>(null);

    // Pulse Effect
    useFrame(({ clock }, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.05;
        }
        if (pulsationSpeed > 0 && lightRef.current) {
            const time = clock.getElapsedTime();
            const pulse = 1 + Math.sin(time * pulsationSpeed) * 0.15;
            lightRef.current.intensity = glowIntensity * pulse;
        }
    });

    return (
        <group>
            <pointLight
                ref={lightRef}
                intensity={glowIntensity}
                distance={10000}
                decay={0.8}
                color={lightColor}
            />
            <mesh ref={meshRef} scale={scale}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshStandardMaterial
                    color={color}
                    roughness={roughness}
                    metalness={0.1}
                    emissive={color}
                    emissiveIntensity={2.0}
                    toneMapped={false}
                />
            </mesh>
        </group>
    );
}

// 🪐 المشتري الحقيقي (Real Jupiter) - 4K Upgrade
// Storms, Great Red Spot, and proper Gas Giant PBR properties
// 🪐 المشتري الحقيقي (Real Jupiter) - Robust Implementation
function RealJupiter({ scale = 1.0 }: { scale?: number }) {
    // 🔄 Use useTexture for Suspense integration
    const texture = useTexture("https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg");

    useEffect(() => {
        texture.anisotropy = 16;
        texture.colorSpace = THREE.SRGBColorSpace;
    }, [texture]);

    const meshRef = useRef<THREE.Mesh>(null);
    useFrame((_, delta) => {
        if (meshRef.current) meshRef.current.rotation.y += delta * 0.15;
    });

    return (
        <mesh ref={meshRef} scale={scale} castShadow={true} receiveShadow={false}>
            <sphereGeometry args={[1, 128, 128]} />
            <meshStandardMaterial
                map={texture}
                color="#FFFFFF"
                roughness={0.4} // ✨ Natural Gloss
                metalness={0.0} // 🚫 No Metal
                emissiveMap={texture}
                emissive="#C88B3A" // Warm Jupiter Glow
                emissiveIntensity={0.1} // 🌑 Subtle Ambient Fill (Removes pure blackness)
                toneMapped={false}
            />
        </mesh>
    );
}

// ❄️ أورانوس الحقيقي (Real Uranus) - Robust Implementation
function RealUranus({ scale = 1.0 }: { scale?: number }) {
    // 🔄 Use useTexture for Suspense integration
    const texture = useTexture("https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg");

    useEffect(() => {
        texture.anisotropy = 16;
        texture.colorSpace = THREE.SRGBColorSpace;
    }, [texture]);

    const meshRef = useRef<THREE.Mesh>(null);
    useFrame((_, delta) => {
        if (meshRef.current) meshRef.current.rotation.z += delta * 0.15;
    });

    return (
        <mesh
            ref={meshRef}
            scale={scale}
            castShadow={true}
            receiveShadow={false}
            rotation={[Math.PI / 2 + 0.14, 0, 0]}
        >
            <sphereGeometry args={[1, 64, 64]} />
            <meshStandardMaterial
                map={texture}
                color="#FFFFFF"
                roughness={0.4} // ✨ Natural Ice Gloss
                metalness={0.0} // 🚫 No Metal
                emissiveMap={texture}
                emissive="#ACE5EE" // Cyan Uranus Glow
                emissiveIntensity={0.15} // 🌑 Subtle Ambient Fill
            />
        </mesh>
    );
}

// 💫 الطارق (Real Al-Tariq - Sprite)
function RealAlTariq({ scale = 1.0 }: { scale?: number }) {
    const texture = useTexture(`${import.meta.env.BASE_URL}textures/al_tariq_real.webp`);
    return (
        <group>
            <sprite scale={[scale * 15, scale * 15, 1]}>
                <spriteMaterial
                    map={texture}
                    toneMapped={false}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    color="#FFFFFF"
                />
            </sprite>
            <sprite scale={[scale * 25, scale * 25, 1]}>
                <spriteMaterial
                    map={texture}
                    toneMapped={false}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    opacity={0.3}
                    color="#00FFFF"
                />
            </sprite>
        </group>
    );
}

// 🌟 نجم الجبار (Real Orion Star)
function RealOrionStar({ scale = 1.0 }: { scale?: number }) {
    const texture = useTexture(`${import.meta.env.BASE_URL}textures/blue_supergiant_surface.webp`);

    useEffect(() => {
        return () => texture.dispose();
    }, [texture]); // Fix dependency

    const meshRef = useRef<THREE.Mesh>(null);
    useFrame((_, delta) => {
        if (meshRef.current) meshRef.current.rotation.y += delta * 0.05;
    });

    return (
        <mesh ref={meshRef} scale={scale} castShadow={false} receiveShadow={false}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshStandardMaterial
                map={texture}
                color="#FFFFFF"
                roughness={0.2}
                metalness={0.1}
                emissiveMap={texture}
                emissive="#FFFFFF"
                emissiveIntensity={2.0}
                toneMapped={false}
            />
        </mesh>
    );
}

// 🪨 كويكب عام (Generic Asteroid) - Final Authentic Version
function GenericAsteroid({
    scale = 1.0,
    texturePath,
    color = "#FFFFFF",
    dimensions = [1, 1, 1],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    name
}: {
    scale?: number,
    texturePath: string,
    color?: string,
    dimensions?: [number, number, number],
    name: string
}) {
    // 🔄 Use useTexture for Suspense integration
    const cleanPath = texturePath.startsWith('/') ? texturePath.slice(1) : texturePath;
    const fullPath = `${import.meta.env.BASE_URL}${cleanPath}`;
    const texture = useTexture(fullPath);

    useEffect(() => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 2);
        texture.needsUpdate = true;
    }, [texture]);

    // 🎨 Matte Mode Tint
    const displayColor = color === '#FFFFFF' ? '#BBBBBB' : color;

    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.2;
            meshRef.current.rotation.x += delta * 0.1;
        }
    });

    return (
        <group>
            {/* 💡 CINEMATIC LIGHTING */}
            <pointLight color="#a3ccf5" intensity={2.0} distance={40} decay={2} />

            <mesh ref={meshRef} scale={[scale * dimensions[0], scale * dimensions[1], scale * dimensions[2]]} castShadow={true} receiveShadow={true}>
                {/* 🌐 High-Res Sphere for Displacement Mapping */}
                <sphereGeometry args={[1, 64, 64]} />
                <meshStandardMaterial
                    map={texture}
                    // 🏔️ SHAPE: Displacement Map
                    displacementMap={texture}
                    displacementScale={0.08}
                    // 🌑 DETAIL: Bump Map
                    bumpMap={texture}
                    bumpScale={0.02}
                    // 💡 VISIBILITY: Matte Mode
                    emissiveMap={texture}
                    emissive="#222222"
                    emissiveIntensity={0.1}
                    color={displayColor}
                    roughness={0.9}
                    metalness={0.0}
                    flatShading={false}
                />
            </mesh>
        </group>
    );
}

// ☄️ مذنب هالي (Halley's Comet)
function HalleyComet({
    scale = 1.0,
    name
}: {
    scale?: number,
    name: string
}) {
    // 🔄 Use useTexture with Suspense
    const tailTexture = useTexture(`${import.meta.env.BASE_URL}textures/shooting_star_trail.webp`);

    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.1;
        }
    });

    return (
        <group>
            {/* Tail - Rendered as a Volumetric Cone */}
            <mesh
                position={[scale * 10, 0, 0]}
                rotation={[0, 0, -Math.PI / 2]} // Pointing trailing direction
                renderOrder={-2}
            >
                {/* RadiusTop: 0.5, RadiusBottom: 6 (Flare out), Height: 25 */}
                <cylinderGeometry args={[0.5 * scale, 6 * scale, scale * 25, 32, 1, true]} />
                <meshBasicMaterial
                    map={tailTexture}
                    color="#AADDFF" // Slight blue tint for ice feel
                    opacity={0.3} // Lower opacity for soft "gas" look
                    transparent={true}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </group>
    );
}

// ☄️ المذنب الأخضر (Green Comet ZTF) - "Tail Only" Concept
function GreenComet({ scale = 1.0 }: { scale?: number }) {
    // We use the same tail texture but tint it green
    const tailTexture = useTexture(`${import.meta.env.BASE_URL}textures/shooting_star_trail.webp`);

    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.1;
        }
    });

    return (
        <group>
            {/* 🟢 The Coma (Head Glow) - NO SOLID SPHERE */}
            {/* Just a soft green light point to represent the nucleus position */}
            <pointLight distance={500} intensity={3} color="#20FF80" decay={1} />

            {/* 🟢 The Tail - Massive & Green */}
            <mesh
                ref={meshRef}
                position={[scale * 12, 0, 0]} // Offset tail behind
                rotation={[0, 0, -Math.PI / 2]}
                renderOrder={-1}
            >
                {/* Long, wide tail */}
                <cylinderGeometry args={[1 * scale, 10 * scale, scale * 40, 32, 1, true]} />
                <meshBasicMaterial
                    map={tailTexture}
                    color="#20FF80" // ❇️ Toxic Green / Emerald
                    opacity={0.6}
                    transparent={true}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Inner Core Glow (Just visually anchoring the tail) */}
            <mesh scale={scale * 2}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshBasicMaterial
                    color="#FFFFFF"
                    transparent={true}
                    opacity={0.8}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
        </group>
    );
}

// 🛰️ محطة الفضاء الدولية (ISS) - Fully Constructed 3D Model
function InternationalSpaceStation({ scale = 1.0 }: { scale?: number }) {
    const solarTexture = useTexture(`${import.meta.env.BASE_URL}textures/solar_panel_texture.jpg`);
    const hullTexture = useTexture(`${import.meta.env.BASE_URL}textures/space_hull_texture.jpg`);
    const meshRef = useRef<THREE.Group>(null);

    // Optimize Textures
    useEffect(() => {
        solarTexture.wrapS = solarTexture.wrapT = THREE.RepeatWrapping;
        solarTexture.repeat.set(2, 1);

        hullTexture.wrapS = hullTexture.wrapT = THREE.RepeatWrapping;
        // eslint-disable-next-line react-hooks/immutability
        hullTexture.repeat.set(4, 1);
    }, [solarTexture, hullTexture]);

    // Slow Rotation of the Station
    useFrame((state, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.05; // Gentle spin
            meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.1; // Slight tilt
        }
    });

    const moduleMaterial = new THREE.MeshStandardMaterial({
        map: hullTexture,
        metalness: 0.6,
        roughness: 0.4,
        color: "#DDDDDD"
    });

    const solarMaterial = new THREE.MeshStandardMaterial({
        map: solarTexture,
        metalness: 0.1,
        roughness: 0.2,
        color: "#3344AA", // Blue tint for solar cells
        emissive: "#112255",
        emissiveIntensity: 0.2,
        side: THREE.DoubleSide
    });

    const trussMaterial = new THREE.MeshStandardMaterial({
        color: "#888888",
        metalness: 0.8,
        roughness: 0.3
    });

    return (
        <group ref={meshRef} scale={scale}>
            {/* 1. CENTRAL MODULES (The Living Quarters) - Z Axis */}
            <group rotation={[Math.PI / 2, 0, 0]}>
                {/* Zarya / Service Module */}
                <mesh position={[0, -2, 0]}>
                    <cylinderGeometry args={[0.6, 0.6, 6, 16]} />
                    <primitive object={moduleMaterial} />
                </mesh>
                {/* Unity / Node 1 */}
                <mesh position={[0, 1.5, 0]}>
                    <sphereGeometry args={[0.7, 16, 16]} />
                    <primitive object={moduleMaterial} />
                </mesh>
                {/* Destiny / Lab */}
                <mesh position={[0, 4, 0]}>
                    <cylinderGeometry args={[0.55, 0.55, 5, 16]} />
                    <primitive object={moduleMaterial} />
                </mesh>
                {/* Columbus / Kibo (Side Modules) */}
                <mesh position={[1, 2, 0]} rotation={[0, 0, Math.PI / 2]}>
                    <cylinderGeometry args={[0.5, 0.5, 3, 16]} />
                    <primitive object={moduleMaterial} />
                </mesh>
            </group>

            {/* 2. THE TRUSS (The Backbone) - X Axis */}
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[20, 0.5, 0.5]} />
                <primitive object={trussMaterial} />
            </mesh>

            {/* 3. SOLAR ARRAYS (The Wings) */}
            {/* Left Wing Outer */}
            <group position={[-9, 0, 0]} rotation={[0.5, 0, 0]}>
                <mesh position={[0, 3, 0]}>
                    <boxGeometry args={[2, 8, 0.1]} />
                    <primitive object={solarMaterial} />
                </mesh>
                <mesh position={[0, -3, 0]}>
                    <boxGeometry args={[2, 8, 0.1]} />
                    <primitive object={solarMaterial} />
                </mesh>
            </group>
            {/* Left Wing Inner */}
            <group position={[-5, 0, 0]} rotation={[0.5, 0, 0]}>
                <mesh position={[0, 3, 0]}>
                    <boxGeometry args={[2, 8, 0.1]} />
                    <primitive object={solarMaterial} />
                </mesh>
                <mesh position={[0, -3, 0]}>
                    <boxGeometry args={[2, 8, 0.1]} />
                    <primitive object={solarMaterial} />
                </mesh>
            </group>

            {/* Right Wing Inner */}
            <group position={[5, 0, 0]} rotation={[0.5, 0, 0]}>
                <mesh position={[0, 3, 0]}>
                    <boxGeometry args={[2, 8, 0.1]} />
                    <primitive object={solarMaterial} />
                </mesh>
                <mesh position={[0, -3, 0]}>
                    <boxGeometry args={[2, 8, 0.1]} />
                    <primitive object={solarMaterial} />
                </mesh>
            </group>
            {/* Right Wing Outer */}
            <group position={[9, 0, 0]} rotation={[0.5, 0, 0]}>
                <mesh position={[0, 3, 0]}>
                    <boxGeometry args={[2, 8, 0.1]} />
                    <primitive object={solarMaterial} />
                </mesh>
                <mesh position={[0, -3, 0]}>
                    <boxGeometry args={[2, 8, 0.1]} />
                    <primitive object={solarMaterial} />
                </mesh>
            </group>

            {/* 4. RADIATORS (Heat Management) */}
            <mesh position={[-2, 0, -2]} rotation={[Math.PI / 4, 0, 0]}>
                <boxGeometry args={[1, 4, 0.1]} />
                <meshStandardMaterial color="#EEEEEE" roughness={0.9} />
            </mesh>
            <mesh position={[2, 0, -2]} rotation={[Math.PI / 4, 0, 0]}>
                <boxGeometry args={[1, 4, 0.1]} />
                <meshStandardMaterial color="#EEEEEE" roughness={0.9} />
            </mesh>

            {/* Lights */}
            <pointLight distance={50} intensity={1} color="#aaaaff" position={[0, 2, 2]} />
        </group>
    );
}

export function CelestialObject(props: CelestialObjectProps) {
    const { data, onSelect, dateRef, isSelected } = props;
    const meshRef = useRef<THREE.Mesh>(null)
    const groupRef = useRef<THREE.Group>(null)

    const [hovered, setHover] = useState(false)

    // 🔍 Debug Logging for Missing Objects
    useEffect(() => {
        if (['canopus', 'bennu'].includes(data.id)) {
            console.log(`🌟 Rendering Object: ${data.id}`, { visible: groupRef.current?.visible, position: groupRef.current?.position });
        }
    }, [data.id]);

    const baseScale = data.science.scale;
    const targetScale = hovered || isSelected ? baseScale * 1.1 : baseScale;

    // تحديث الموقع والدوران
    useFrame((state, delta) => {
        if (groupRef.current && dateRef.current) {
            // Pass marathon mode flag
            const newPos = getObjectPosition(data.id, dateRef.current, props.isMarathonMode);
            groupRef.current.position.set(newPos[0], newPos[1], newPos[2]);

            // ⚡ Frustum Culling: Hide objects if too far
            const distance = state.camera.position.distanceTo(groupRef.current.position);
            const isCritical = ['sun', 'al-tariq', 'sirius'].includes(data.id); // ⚠️ Constraint: Do not cull these

            if (!isCritical) {
                if (distance > 50000) { // ✨ Extended Range (was 2000)
                    groupRef.current.visible = false;
                } else {
                    groupRef.current.visible = true;
                }
            }
        }

        if (meshRef.current) {
            const rotateSpeed = 0.2;
            const finalScale = targetScale;
            meshRef.current.rotation.y += delta * rotateSpeed;
            meshRef.current.scale.lerp(new THREE.Vector3(finalScale, finalScale, finalScale), 10 * delta);
        }
    })

    const initialPos = new THREE.Vector3(...data.initialPosition);

    // 🔧 Special Scale Overrides (Fixing Sirius & Small Objects)
    let hitboxScale = targetScale * 1.25;
    if (['mercury', 'moon', 'pluto'].includes(data.id)) hitboxScale = targetScale * 1.5;
    if (data.id === 'sirius') hitboxScale = 120; // 🌟 Override for Sirius (Visual is 100, so 120 is tight)

    let ringInner = baseScale * 1.5;
    let ringOuter = baseScale * 1.52;
    if (data.id === 'sirius') {
        hitboxScale = 2; // 🎯 FINAL: Absolute minimum (diameter 4) - requires precise click
        ringInner = 200;
        ringOuter = 202;
    }

    // ═══════════════════════════════════════════════════════════════
    // RENDER: Main Celestial Group
    // ═══════════════════════════════════════════════════════════════
    return (
        <group
            ref={groupRef}
            name={data.id} // Essential for CameraController to find it
            position={initialPos}
            onPointerOver={(e) => {
                if (data.id === 'sirius') return; // 🛑 HARD RESET: Disable Group Hover for Sirius
                e.stopPropagation();
                setHover(true);
                document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
                if (data.id === 'sirius') return; // 🛑 HARD RESET: Disable Group Hover for Sirius
                setHover(false);
                document.body.style.cursor = 'auto';
            }}
            onClick={(e) => {
                if (data.id === 'sirius') return; // 🛑 HARD RESET: Disable Group Click for Sirius
                e.stopPropagation();
                onSelect(data);
            }}
        >
            {/* 🎯 UNIVERSAL INTERACTION HITBOX (The padding/margin of error) */}
            {/* This invisible sphere is slightly larger than the visual object to capture clicks easily */}
            {/* It acts as the primary raycast target to solve "layer/cloud" blocking issues */}
            <mesh
                ref={meshRef}
                name={`${data.id}-hitbox`}
                // Scale is slightly larger (1.3x) for easier tapping on mobile
                // For small objects (Moon, Mercury, Pluto), we grant even generous padding
                scale={hitboxScale} // ✅ Uses correct scale logic
                onClick={(e) => {
                    if (data.id === 'sirius') return; // 🚫 DISABLED: No interaction
                    e.stopPropagation()
                    onSelect(data)
                }}
                onPointerOver={() => {
                    if (data.id === 'sirius') return; // 🚫 DISABLED: No interaction
                    document.body.style.cursor = 'pointer'
                    setHover(true)
                }}
                onPointerOut={() => {
                    if (data.id === 'sirius') return; // 🚫 DISABLED: No interaction
                    document.body.style.cursor = 'auto'
                    setHover(false)
                }}
                visible={data.id === 'sirius' ? false : true} // 🚫 DISABLED: Invisible to raycaster
            >
                <sphereGeometry args={[1, 16, 16]} />
                <meshBasicMaterial
                    transparent={true}
                    opacity={0.0} // Invisible
                    depthWrite={false}
                    depthTest={data.id === 'sirius' ? true : false} // ☢️ NUCLEAR: Enable depth for Sirius
                    color="pink" // Debug color (invisible via opacity)
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* عرض المجسمات حسب النوع (Rendering Logic) */}

            {/* 1. زحل (Saturn) */}
            {data.id === 'saturn' && (
                <group><RealSaturn scale={targetScale} /></group>
            )}

            {/* 2. المشتري (Jupiter) - 4K Real Texture */}
            {data.id === 'jupiter' && (
                <group><RealJupiter scale={targetScale} /></group>
            )}

            {/* 3. الأرض (Earth) */}
            {data.id === 'earth' && (
                <group><RealEarth scale={targetScale} /></group>
            )}

            {/* 4. الشمس (Sun) */}
            {data.id === 'sun' && (
                <>
                    <pointLight
                        intensity={2.0}
                        distance={10000}
                        decay={0.5}
                        color="#FFF4E6"
                        castShadow={true}
                        shadow-bias={-0.0001}
                        shadow-mapSize-width={2048}
                        shadow-mapSize-height={2048}
                    />
                    <group><RealSun scale={targetScale} /></group>
                </>
            )}

            {/* 5. أورانوس (Uranus) - خاص بسبب الميلان */}
            {data.id === 'uranus' && (
                <group><RealUranus scale={targetScale} /></group>
            )}

            {/* 6. نجوم الحزام (Orion's Belt) */}
            {['alnitak', 'alnilam', 'mintaka'].includes(data.id) && (
                <group>
                    <pointLight intensity={1.5} distance={500} decay={2.0} color="#4488ff" />
                    <RealOrionStar scale={targetScale} />
                </group>
            )}

            {/* 7. الطارق (Al-Tariq) */}
            {data.id === 'al-tariq' && (
                <group>
                    <pointLight intensity={100.0} distance={6000} decay={1.5} color="#00FFFF" />
                    <RealAlTariq scale={targetScale} />
                </group>
            )}

            {/* 🌟 7.5. النجوم الخماسية (The Elite Stars) */}
            {['canopus', 'arcturus', 'rigil', 'vega', 'capella'].includes(data.id) && (
                <GenericStar
                    scale={data.science.scale} // Use raw scale from data (already adjusted)
                    color={data.science.color}
                    lightColor={data.science.lightColor}
                    glowIntensity={data.science.glowIntensity}
                    pulsationSpeed={data.science.pulsationSpeed}
                    roughness={data.science.roughness}
                />
            )}

            {/* 8. الشعرى (Sirius) - Sprite */}
            {data.id === 'sirius' && <SiriusSprite scale={data.science.scale} />}

            {/* 9. الكواكب العامة (Generic Planets) - دمج المنطق المتكرر */}
            {data.id === 'mars' && (
                <GenericPlanet
                    scale={targetScale}
                    texturePath="textures/mars_surface.webp"
                    rotationSpeed={0.12}
                    roughness={0.8}
                    metalness={0.05}
                    emissiveColor="#C05030" // Reddish glow for Mars
                    emissiveIntensity={0.24} // Increased 20% (0.2 -> 0.24)
                />
            )}
            {data.id === 'venus' && (
                <GenericPlanet
                    scale={targetScale}
                    texturePath="textures/venus_atmosphere.webp"
                    rotationSpeed={0.05}
                    roughness={1.0}
                    metalness={0.0}
                    emissiveColor="#E6C288"
                    emissiveIntensity={0.18} // +20%
                />
            )}
            {data.id === 'mercury' && (
                <GenericPlanet
                    scale={targetScale}
                    texturePath="textures/mercury_surface.webp"
                    rotationSpeed={0.05}
                    roughness={0.9}
                    metalness={0.1}
                    emissiveColor="#A0A0A0"
                    emissiveIntensity={0.18} // +20%
                />
            )}
            {data.id === 'neptune' && (
                <GenericPlanet
                    scale={targetScale}
                    texturePath="textures/neptune_surface.webp"
                    rotationSpeed={0.12}
                    roughness={0.4}
                    metalness={0.1}
                    emissiveColor="#4b70dd"
                    emissiveIntensity={0.18} // +20%
                />
            )}
            {data.id === 'pluto' && (
                <GenericPlanet
                    scale={targetScale}
                    texturePath="textures/pluto_surface.webp"
                    rotationSpeed={0.02}
                    roughness={0.8}
                    metalness={0.05}
                    emissiveColor="#D0D0D0"
                    emissiveIntensity={0.18} // +20%
                />
            )}
            {data.id === 'moon' && (
                <GenericPlanet
                    scale={targetScale}
                    texturePath="textures/moon_surface.webp"
                    rotationSpeed={0.05}
                    roughness={0.9}
                    metalness={0.05}
                    emissiveColor="#BBBBBB"
                    emissiveIntensity={0.18} // +20%
                />
            )}


            {/* 10. الصخور الفضائية الجديدة (New Space Rocks) */}
            {data.id === 'halley' && (
                <HalleyComet
                    scale={targetScale}
                    name={data.id} // ✨ Pass name for logging
                />
            )}

            {/* 11. محطة الفضاء الدولية (ISS) */}
            {data.id === 'iss' && (
                <InternationalSpaceStation scale={targetScale} />
            )}

            {/* Asteroids - Mapping IDs to Textures */}
            {['ceres', 'vesta', 'pallas', 'juno', 'eros', 'ida', 'gaspra', 'bennu', 'ryugu'].includes(data.id) && (
                <GenericAsteroid
                    scale={targetScale}
                    texturePath={data.science.texture || `textures/${data.id}_surface.png`}
                    color={data.science.color} // ✨ User Request: Full True Color via Data
                    dimensions={data.science.shapeScale}
                    name={data.id} // ✨ For Logging
                />
            )}

            {/* 11. حلقة التحديد (Selection Ring) */}
            {(hovered || isSelected) && (
                <mesh rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
                    <ringGeometry args={[ringInner, ringOuter, 64]} />
                    <meshBasicMaterial color="#4facfe" side={THREE.DoubleSide} toneMapped={false} />
                </mesh>
            )}
        </group>
    );
}
// 🌟 نجم الشعرى (Sirius Sprite Component)
function SiriusSprite({ scale }: { scale: number }) {
    const texture = useTexture(`${import.meta.env.BASE_URL}textures/sirius_real.webp`);
    return (
        <group>
            <pointLight intensity={250.0} distance={8000} decay={1.0} color="#dceeff" />
            <sprite scale={[scale, scale, 1]} raycast={() => null}>
                <spriteMaterial
                    map={texture}
                    color="#FFFFFF"
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                    toneMapped={false}
                />
            </sprite>
        </group>
    );
}
