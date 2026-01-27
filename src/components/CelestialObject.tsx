import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import type { CelestialData } from '../data/objects'
import * as THREE from 'three'; // Restored namespace import
import { loadCelestialTextures } from '../utils/textureLoader';
import { getObjectPosition } from '../utils/astronomy'

// Helper for dynamic assets


interface CelestialObjectProps {
    data: CelestialData
    onSelect: (data: CelestialData) => void
    dateRef: React.MutableRefObject<Date>
    isSelected?: boolean
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
    roughness = 0.8,
    metalness = 0.1,
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
    const surfaceTexture = useTexture(`${import.meta.env.BASE_URL}textures/saturn_surface.png`);
    const ringTexture = useTexture(`${import.meta.env.BASE_URL}textures/saturn_rings.png`);
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
                    roughness={0.8}
                    metalness={0.1}
                    emissiveMap={surfaceTexture}
                    emissive="#C0A080" // Warm Saturnian color
                    emissiveIntensity={0.2} // Increased for visibility (approx 0.15-0.25)
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
                    emissiveIntensity={0.3} // Higher intensity for solid definition
                />
            </mesh>
        </group>
    );
}
// ☀️ الشمس الحقيقية (Real Sun)
function RealSun({ scale = 1.0 }: { scale?: number }) {
    const texture = useTexture(`${import.meta.env.BASE_URL}textures/sun_surface.png`);

    useEffect(() => {
        texture.wrapS = THREE.RepeatWrapping;
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
    const dayTexture = useTexture(`${import.meta.env.BASE_URL}textures/earth_daymap.png`);
    const cloudTexture = useTexture(`${import.meta.env.BASE_URL}textures/earth_clouds.png`);
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
                    roughness={0.6}
                    metalness={0.1}
                    emissive="#000022"
                    emissiveIntensity={0.1}
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

            {/* الغلاف الجوي */}
            <mesh scale={scale * 1.2}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshBasicMaterial
                    color="#4488ff"
                    transparent
                    opacity={0.1}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
        </group>
    );
}

// ❄️ أورانوس الحقيقي (ميلان محوري)
function RealUranus({ scale = 1.0 }: { scale?: number }) {
    const texture = useTexture(`${import.meta.env.BASE_URL}textures/uranus_surface.png`);

    useEffect(() => {
        return () => texture.dispose();
    }, []);

    const meshRef = useRef<THREE.Mesh>(null);
    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.z += delta * 0.15;
        }
    });

    return (
        <mesh
            ref={meshRef}
            scale={scale}
            castShadow={true}
            receiveShadow={true}
            rotation={[Math.PI / 2 + 0.14, 0, 0]} // ميلان 98 درجة
        >
            <sphereGeometry args={[1, 64, 64]} />
            <meshStandardMaterial
                map={texture}
                color="#FFFFFF"
                roughness={0.6}
                metalness={0.2}
                emissiveMap={texture}
                emissive="#FFFFFF"
                emissiveIntensity={0.1}
            />
        </mesh>
    );
}

// 🪐 المشتري (Textures Jupiter)
function TexturedJupiter({ scale = 1.0, textureMap }: { scale?: number, textureMap?: THREE.Texture | null }) {
    useEffect(() => {
        if (textureMap) textureMap.anisotropy = 16;
    }, [textureMap]);

    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((_, delta) => {
        if (meshRef.current) meshRef.current.rotation.y += delta * 0.006;
    });

    return (
        <mesh ref={meshRef} scale={scale} castShadow={false} receiveShadow={false}>
            <sphereGeometry args={[1, 128, 128]} />
            <meshStandardMaterial
                map={textureMap || null}
                color={textureMap ? "#FFFFFF" : "#C88B3A"}
                roughness={0.9}
                metalness={0.0}
                emissiveMap={textureMap || null}
                emissive="#FFFFFF"
                emissiveIntensity={0.05}
            />
        </mesh>
    );
}

// 💫 الطارق (Real Al-Tariq - Sprite)
function RealAlTariq({ scale = 1.0 }: { scale?: number }) {
    const texture = useTexture(`${import.meta.env.BASE_URL}textures/al_tariq_real.png`);
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
    const texture = useTexture(`${import.meta.env.BASE_URL}textures/blue_supergiant_surface.png`);

    useEffect(() => {
        return () => texture.dispose();
    }, []);

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
// ☄️ المذنب (Real Comet - The Traveler)
// "Clean Slate" Implementation: Strict separation of Head (Solid) and Tail (Glow)
function RealComet({ scale = 1.0 }: { scale?: number }) {
    // 1. Asset Sourcing: Using 'pluto_surface' for the solid rocky/icy head
    // and 'shooting_star_trail' for the gaseous tail.
    const nucleusTexture = useTexture(`${import.meta.env.BASE_URL}textures/pluto_surface.png`);
    const tailTexture = useTexture(`${import.meta.env.BASE_URL}textures/shooting_star_trail.png`);

    const groupRef = useRef<THREE.Group>(null);

    // Orientation: The glowing tail must always point AWAY from the Sun.
    // We lookAt(0,0,0) (The Sun), so the local +Z axis points to Sun.
    // Therefore, the tail must extend along the local -Z axis.
    useFrame((state) => {
        if (groupRef.current) {
            groupRef.current.lookAt(0, 0, 0);
        }
    });

    return (
        <group ref={groupRef}>
            {/* 1. The Nucleus (The Head): Solid Object */}
            <mesh
                castShadow
                receiveShadow
                scale={scale}
                renderOrder={20} // 🔴 Priority: Draw ON TOP of the tail
            >
                <sphereGeometry args={[1, 64, 64]} />
                <meshStandardMaterial
                    map={nucleusTexture}
                    color="#DDDDDD" // Light grey base for rock/ice
                    roughness={0.6} // Semi-rough
                    metalness={0.2}
                    emissiveMap={nucleusTexture}
                    emissive="#112233" // Very subtle inner glow, keeps it looking "Solid"
                    emissiveIntensity={0.5}
                />
            </mesh>

            {/* 2. The Tail: Glowing Gas Stream */}
            <group position={[0, 0, 0]}>
                {/* Gap: The tail geometry starts at Z = -2 and extends to -28 (Center at -15, Height 26) */}

                {/* Main Tail Stream */}
                <mesh
                    position={[0, 0, -15]}
                    rotation={[-Math.PI / 2, 0, 0]}
                    scale={[scale, scale, scale]}
                    renderOrder={10} // 🔴 Priority: Draw BEHIND the head
                >
                    <planeGeometry args={[5, 26]} />
                    <meshBasicMaterial
                        map={tailTexture}
                        transparent={true}
                        opacity={0.8}
                        side={THREE.DoubleSide}
                        depthWrite={false} // 🔴 Vital: No Z-write to prevent clipping
                        blending={THREE.AdditiveBlending} // 🔴 Vital: Light addition
                        color="#88CCFF" // Cyan/Blue Gas
                    />
                </mesh>

                {/* Volumetric Cross Section */}
                <mesh
                    position={[0, 0, -15]}
                    rotation={[0, -Math.PI / 2, -Math.PI / 2]}
                    scale={[scale, scale, scale]}
                    renderOrder={10}
                >
                    <planeGeometry args={[5, 26]} />
                    <meshBasicMaterial
                        map={tailTexture}
                        transparent={true}
                        opacity={0.6}
                        side={THREE.DoubleSide}
                        depthWrite={false}
                        blending={THREE.AdditiveBlending}
                        color="#66AAFF"
                    />
                </mesh>
            </group>

            {/* 3. Interaction Hitbox (Invisible & Large) */}
            <mesh visible={false} scale={scale * 1.5} onClick={(e) => e.stopPropagation()}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshBasicMaterial color="red" wireframe />
            </mesh>
        </group>
    );
}

export function CelestialObject({ data, onSelect, dateRef, isSelected }: CelestialObjectProps) {
    const meshRef = useRef<THREE.Mesh>(null)
    const groupRef = useRef<THREE.Group>(null)

    const [hovered, setHover] = useState(false)
    const [textures, setTextures] = useState<any>(null)

    // تحميل النسيج (Textures)
    useEffect(() => {
        const loadTextures = async () => {
            try {
                const loadedTextures = await loadCelestialTextures(data.id);
                if (loadedTextures) {
                    if (loadedTextures.map) {
                        loadedTextures.map.colorSpace = THREE.SRGBColorSpace;
                    }
                    setTextures(loadedTextures);
                } else {
                    setTextures(null);
                }
            } catch (error) {
                console.error(`Texture load failed for ${data.id}`, error);
            }
        };
        loadTextures();
    }, [data.id]);

    const baseScale = data.science.scale;
    const targetScale = hovered || isSelected ? baseScale * 1.1 : baseScale;

    // تحديث الموقع والدوران
    useFrame((_, delta) => {
        if (groupRef.current && dateRef.current) {
            const newPos = getObjectPosition(data.id, dateRef.current);
            groupRef.current.position.set(newPos[0], newPos[1], newPos[2]);
        }

        if (meshRef.current) {
            const rotateSpeed = 0.2;
            let finalScale = targetScale;
            meshRef.current.rotation.y += delta * rotateSpeed;
            meshRef.current.scale.lerp(new THREE.Vector3(finalScale, finalScale, finalScale), 10 * delta);
        }
    })

    const initialPos = new THREE.Vector3(...data.initialPosition);

    // تحديد المواد (Materials) للكائنات غير المخصصة
    const getMaterial = () => {
        if (['alnitak', 'alnilam', 'mintaka'].includes(data.id)) return (
            <meshStandardMaterial
                color={'#66ccff'}
                emissive={'#66ccff'}
                emissiveIntensity={4.0}
                roughness={0.1}
                metalness={0.8}
                toneMapped={false}
            />
        );

        if (!textures) {
            return <meshStandardMaterial
                color={data.science.color}
                emissive={data.science.color}
                emissiveIntensity={0.2}
            />;
        }

        if (data.id === 'sirius') return (
            <meshBasicMaterial color={'#A0C8FF'} toneMapped={false} />
        );

        if (data.id === 'al-tariq') return (
            <meshStandardMaterial
                color={'#FFFFFF'}
                emissive={'#FFFFFF'}
                emissiveIntensity={5.0}
                roughness={0.4}
                metalness={0.1}
                toneMapped={false}
            />
        );

        if (data.id === 'pluto') return (
            <meshStandardMaterial color={data.science.color} />
        );

        if (!textures.map) {
            return <meshStandardMaterial color={data.science.color} />;
        }

        return <meshStandardMaterial color={data.science.color} />;
    };

    return (
        <group ref={groupRef} position={initialPos} name={data.id}>
            {/* منطقة النقر (Hitbox) - مخفية */}
            <mesh
                ref={meshRef}
                scale={data.id === 'sun' || data.id === 'jupiter' ? targetScale * 1.05 : targetScale}
                onClick={(e) => {
                    e.stopPropagation()
                    onSelect(data)
                }}
                onPointerOver={() => {
                    document.body.style.cursor = 'pointer'
                    setHover(true)
                }}
                onPointerOut={() => {
                    document.body.style.cursor = 'auto'
                    setHover(false)
                }}
                visible={true}
                frustumCulled={false}
            >
                <sphereGeometry args={[1, 16, 16]} />
                <meshBasicMaterial
                    transparent={true}
                    opacity={0.0}
                    depthWrite={false}
                    depthTest={false}
                    color="red"
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* عرض المجسمات حسب النوع (Rendering Logic) */}

            {/* 1. زحل (Saturn) */}
            {data.id === 'saturn' && (
                <group><RealSaturn scale={targetScale} /></group>
            )}

            {/* 2. المشتري (Jupiter) */}
            {data.id === 'jupiter' && (
                <group><TexturedJupiter scale={targetScale} textureMap={textures?.map} /></group>
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

            {/* 8. الشعرى (Sirius) - Sprite */}
            {data.id === 'sirius' && (
                <>
                    <pointLight intensity={250.0} distance={8000} decay={1.0} color="#dceeff" />
                    {textures?.map && (
                        <sprite scale={[50, 50, 1]}>
                            <spriteMaterial
                                map={textures.map}
                                color="#FFFFFF"
                                blending={THREE.AdditiveBlending}
                                depthWrite={false}
                                toneMapped={false}
                            />
                        </sprite>
                    )}
                </>
            )}

            {/* 9. الكواكب العامة (Generic Planets) - دمج المنطق المتكرر */}
            {data.id === 'mars' && (
                <GenericPlanet
                    scale={targetScale}
                    texturePath="textures/mars_surface.png"
                    rotationSpeed={0.12}
                    roughness={0.8}
                    metalness={0.05}
                    emissiveColor="#C05030" // Reddish glow for Mars
                    emissiveIntensity={0.2} // Increased visibility
                />
            )}
            {data.id === 'comet' && <RealComet scale={targetScale} />}
            {data.id === 'venus' && (
                <GenericPlanet scale={targetScale} texturePath="textures/venus_atmosphere.png" rotationSpeed={0.05} roughness={1.0} metalness={0.0} />
            )}
            {data.id === 'mercury' && (
                <GenericPlanet scale={targetScale} texturePath="textures/mercury_surface.png" rotationSpeed={0.05} roughness={0.9} metalness={0.1} />
            )}
            {data.id === 'neptune' && (
                <GenericPlanet scale={targetScale} texturePath="textures/neptune_surface.png" rotationSpeed={0.12} roughness={0.4} metalness={0.1} />
            )}
            {data.id === 'pluto' && (
                <GenericPlanet scale={targetScale} texturePath="textures/pluto_surface.png" rotationSpeed={0.02} roughness={0.8} metalness={0.05} />
            )}
            {data.id === 'moon' && (
                <GenericPlanet scale={targetScale} texturePath="textures/moon_surface.png" rotationSpeed={0.05} roughness={0.9} metalness={0.05} />
            )}

            {/* 10. حلقة التحديد (Selection Ring) */}
            {(hovered || isSelected) && (
                <mesh rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
                    <ringGeometry args={[baseScale * 1.5, baseScale * 1.52, 64]} />
                    <meshBasicMaterial color="#4facfe" side={THREE.DoubleSide} toneMapped={false} />
                </mesh>
            )}
        </group>
    );
}


