import { useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import type { CelestialData } from '../data/objects'
import * as THREE from 'three'; // Restored namespace import
import { loadCelestialTextures } from '../utils/textureLoader';
import { getObjectPosition } from '../utils/astronomy'

// Helper for dynamic assets
const getPath = (path: string) => `${import.meta.env.BASE_URL}${path}`;

interface CelestialObjectProps {
    data: CelestialData
    onSelect: (data: CelestialData) => void
    dateRef: React.MutableRefObject<Date>
    isSelected?: boolean
}




// ☀️ SoumyaEXE Sun (Fresh Implementation with Atomic Fix)
function SoumyaSun({ scale = 1.0 }: { scale?: number }) {
    // SUSPENSE: This forces the MainMenu loading bar to WAIT for this texture
    const texture = useTexture('/textures/sun.jpg');

    // Ensure texture settings are correct immediately
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 16;

    const meshRef = useRef<THREE.Mesh>(null);

    // ATOMIC GUARD: Force material state every frame
    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.004;

            // The "Nuclear" Option: Force properties every single frame
            const mat = meshRef.current.material as THREE.MeshBasicMaterial;
            if (mat.toneMapped === true) {
                mat.toneMapped = false;
                mat.needsUpdate = true;
            }
            if (mat.color.getHexString() !== 'ffffff') {
                mat.color.setHex(0xffffff);
            }
        }
    });

    // Layer 1 Isolation for Selective Bloom
    useEffect(() => {
        if (meshRef.current) {
            meshRef.current.layers.set(1); // Enable Layer 1 (Bloom Layer)
            meshRef.current.layers.enable(0); // Also Keep Layer 0 to be visible in main camera
        }
    }, []);

    return (
        <mesh ref={meshRef} scale={scale} castShadow={false} receiveShadow={false}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshBasicMaterial
                map={texture}
                color="#ffffff"
                toneMapped={false}
            />
        </mesh>
    );
}
// ... (Moon and other components remain unchanged)



// 🌕 Real Textured Moon
function TexturedMoon({ scale = 1.0, textureMap }: { scale?: number, textureMap?: THREE.Texture | null }) {
    return (
        <mesh scale={scale} castShadow={true} receiveShadow={true}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshStandardMaterial
                map={textureMap || undefined}
                color={textureMap ? "#FFFFFF" : "#DDDDDD"}
                roughness={0.9}
                metalness={0.1}
                emissive="#000000"
            />
        </mesh>
    );
}

// 🔴 Real Textured Mars
function TexturedMars({ scale = 1.0, textureMap }: { scale?: number, textureMap?: THREE.Texture | null }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.015;
        }
    });

    return (
        <mesh ref={meshRef} scale={scale} castShadow={false} receiveShadow={false}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshStandardMaterial
                map={textureMap || null}
                color={textureMap ? "#FFFFFF" : "#D4704A"}
                roughness={0.75}
                metalness={0.02}
                emissive="#000000"
            />
        </mesh>
    );
}

// 🪐 Real Textured Jupiter
function TexturedJupiter({ scale = 1.0, textureMap }: { scale?: number, textureMap?: THREE.Texture | null }) {
    // Improve texture quality
    useEffect(() => {
        if (textureMap) {
            textureMap.anisotropy = 16;
        }
    }, [textureMap]);

    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.01;
        }
    });

    return (
        <mesh ref={meshRef} scale={scale} castShadow={false} receiveShadow={false}>
            <sphereGeometry args={[1, 128, 128]} />
            <meshStandardMaterial
                map={textureMap || null}
                color={textureMap ? "#FFFFFF" : "#C88B3A"}
                roughness={0.9}
                metalness={0.0}
                emissive="#000000"
            />
        </mesh>
    );
}

// 🪐 Real Textured Saturn
function TexturedSaturn({ scale = 1.0, textureMap, ringMap }: { scale?: number, textureMap?: THREE.Texture | null, ringMap?: THREE.Texture | null }) {
    const groupRef = useRef<THREE.Group>(null);

    useFrame((_, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y += delta * 0.012;
        }
    });

    return (
        <group ref={groupRef}>
            {/* Saturn Planet Body */}
            <mesh scale={scale} castShadow={true} receiveShadow={true}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshStandardMaterial
                    map={textureMap || undefined}
                    color={textureMap ? "#FFFFFF" : "#F4D03F"}
                    roughness={0.9}
                    metalness={0.0}
                // Emissive removed to match Repo (Saturn body isn't self-luminous)
                />
            </mesh>

            {/* Saturn Rings */}
            {ringMap ? (
                <mesh
                    rotation={[Math.PI / 2, 0, 0]} // STRICT: Math.PI / 2 as requested
                    scale={scale}
                    receiveShadow={true}
                >
                    <ringGeometry args={[1.4, 2.4, 128]} />
                    <meshStandardMaterial
                        map={ringMap}
                        alphaMap={ringMap}
                        transparent={true}
                        opacity={0.8}
                        side={THREE.DoubleSide}
                        depthWrite={false}
                        roughness={0.8}
                        metalness={0.2}
                        color="#FFFFFF"
                    />
                </mesh>
            ) : (
                // Fallback procedural ring
                <mesh
                    rotation={[-Math.PI / 2.3, 0.1, 0]}
                    scale={scale}
                    receiveShadow={true}
                >
                    <ringGeometry args={[1.3, 2.4, 64]} />
                    <meshStandardMaterial
                        color="#C0B090"
                        side={THREE.DoubleSide}
                        transparent
                        opacity={0.5}
                    />
                </mesh>
            )}
        </group>
    );
}

export function CelestialObject({ data, onSelect, dateRef, isSelected }: CelestialObjectProps) {
    const meshRef = useRef<THREE.Mesh>(null)
    const cloudsRef = useRef<THREE.Mesh>(null) // Earth clouds
    const groupRef = useRef<THREE.Group>(null)

    const [hovered, setHover] = useState(false)
    const [textures, setTextures] = useState<any>(null)
    // Load textures with enhanced error handling and logging
    // 🌍 TEXTURE LOADING & SELECTION
    // --------------------------------------------------------------------------------

    // 🔄 RE-VERIFY: Sometimes hooks cache old values. 
    // We force specific textures for key objects to prevent "Generic Rock" syndrome.


    // 🌍 TEXTURE LOADING & SELECTION
    useEffect(() => {
        const loadTextures = async () => {
            try {
                // Hard-Coded Override for specific objects
                if (['moon', 'mercury', 'earth'].includes(data.id)) {
                    let forcedUrl = '';
                    if (data.id === 'moon') forcedUrl = getPath('textures/moon.jpg');
                    if (data.id === 'mercury') forcedUrl = getPath('textures/mercury_new.jpg');
                    if (data.id === 'earth') forcedUrl = getPath('textures/earth.jpg');

                    if (forcedUrl) {
                        const loader = new THREE.TextureLoader();
                        loader.setCrossOrigin('anonymous');
                        const forcedTex = await loader.loadAsync(forcedUrl);

                        forcedTex.colorSpace = THREE.SRGBColorSpace;
                        forcedTex.flipY = false;

                        if (data.id === 'earth') {
                            forcedTex.wrapS = THREE.RepeatWrapping;
                            forcedTex.wrapT = THREE.RepeatWrapping;
                            forcedTex.anisotropy = 16;
                        }

                        forcedTex.needsUpdate = true;
                        if (meshRef.current) {
                            // @ts-ignore
                            meshRef.current.material.map = forcedTex;
                            // @ts-ignore
                            meshRef.current.material.needsUpdate = true;
                        }
                        // We don't necessarily need to set state if we direct-assign, 
                        // but keeping setTextures keeps the rest of the component happy
                        // setTextures({ map: forcedTex }); 
                        return;
                    }
                }

                // Standard Loader
                const loadedTextures = await loadCelestialTextures(data.id);
                if (loadedTextures) {
                    // Update refs if needed
                    // @ts-ignore
                    // @ts-ignore
                    if (loadedTextures.map) {
                        // @ts-ignore
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

    // Force material update when texture changes
    useEffect(() => {
        if (meshRef.current) {
            const mat = meshRef.current.material as THREE.Material;
            mat.needsUpdate = true;
        }
    }, [textures, data.id]);

    // Direct scale from data (no multipliers needed in new system)
    const baseScale = data.science.scale;

    // If highlighted/hovered, grow slightly
    const targetScale = hovered || isSelected ? baseScale * 1.1 : baseScale;



    useFrame((_, delta) => {
        // 1. UPDATE POSITION directly from ref logic
        // This avoids React Prop overhead
        if (groupRef.current && dateRef.current) {
            // Using the current simulation date from the ref
            const newPos = getObjectPosition(data.id, dateRef.current);
            // Optional: Lerp position for super smoothness if calc is choppy, 
            // but usually direct set is fine for this scale/framerate
            groupRef.current.position.set(newPos[0], newPos[1], newPos[2]);
        }

        // 2. Local Animations (Rotate, Clean Scale)
        if (meshRef.current) {
            // Rotation
            const rotateSpeed = 0.2;

            // Dynamic Sun Scaling removed
            let finalScale = targetScale;

            // Unique Rotation: Uranus rolls on its side (98 degrees)
            if (data.id === 'uranus') {
                meshRef.current.rotation.x = Math.PI / 2 + 0.14; // ~98 degrees tilt (PI/2 = 90)
                meshRef.current.rotation.z += delta * rotateSpeed; // Rotate along Z when tilted on X
            } else {
                meshRef.current.rotation.y += delta * rotateSpeed;
            }

            // Smooth scale transition
            meshRef.current.scale.lerp(new THREE.Vector3(finalScale, finalScale, finalScale), 10 * delta);
        }

        // 3. Earth Clouds Rotation
        if (cloudsRef.current) {
            cloudsRef.current.rotation.y += delta * 0.05; // Clouds move slightly faster than surface
        }
    })


    // Initial position is just fallback now
    const initialPos = new THREE.Vector3(...data.initialPosition);

    // Material Logic
    const getMaterial = () => {
        // ORION'S BELT STARS: Blue Supergiants (Alnitak, Alnilam, Mintaka)
        if (['alnitak', 'alnilam', 'mintaka'].includes(data.id)) return (
            <meshStandardMaterial
                color={'#66ccff'}
                emissive={'#66ccff'}
                emissiveIntensity={4.0} // Blindingly bright
                roughness={0.1}
                metalness={0.8} // Metallic shine for star core feel
                toneMapped={false}
            />
        );

        // CERES: Asteroid Belt (Grey, emissive to be visible)
        if (data.id === 'ceres') return (
            <meshStandardMaterial
                color={'#8C8C8C'}
                emissive={'#555555'}
                emissiveIntensity={0.5}
                roughness={0.9}
                toneMapped={false}
            />
        );

        // Fallback or missing textures
        if (!textures) {
            return <meshStandardMaterial
                color={data.science.color}
                emissive={data.science.color}
                emissiveIntensity={0.2} // Prevent total darkness
            />;
        }

        // EARTH: Realistic Rocky Planet (Reference Repo Style)
        if (data.id === 'earth') return (
            <meshStandardMaterial // Switched to Standard to match Repo
                map={textures.map || undefined}
                // specularMap={textures.specular || undefined} // Repo doesn't use specular map
                // normalMap={textures.normal || undefined}
                roughness={0.5}
                metalness={0.01}
                emissive="#000000"
            />
        );

        // SIRIUS: Enhanced bright star with intense luminosity
        if (data.id === 'sirius') return (
            <meshBasicMaterial // Switched to Basic per user request
                color={'#A0C8FF'}
                toneMapped={false}
            />
        );

        // AL-TARIQ: Enhanced piercing star with powerful radiance
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



        // VENUS: Thick atmospheric planet with golden sulfuric clouds
        // Check BEFORE generic fallback so Venus always gets its dedicated material
        // VENUS: Surface + Atmosphere Layer
        if (data.id === 'venus') return (
            <group>
                {/* Surface */}
                <mesh>
                    <sphereGeometry args={[1, 64, 64]} />
                    <meshStandardMaterial
                        map={textures?.map || null}
                        color={textures?.map ? '#FFFFFF' : '#E3BB76'}
                        roughness={0.7}
                        metalness={0.4}
                    />
                </mesh>
                {/* Atmosphere Cloud Layer */}
                {textures?.atmosphere && (
                    <mesh scale={[1.02, 1.02, 1.02]}>
                        <sphereGeometry args={[1, 64, 64]} />
                        <meshStandardMaterial
                            map={textures.atmosphere}
                            transparent={true}
                            opacity={0.85} // Dense clouds
                            side={THREE.DoubleSide}
                            roughness={1}
                        />
                    </mesh>
                )}
            </group>
        );

        // MARS: Fully illuminated from all angles
        // MARS: Reference Repo Style
        if (data.id === 'mars') return (
            <meshStandardMaterial // Switched from Basic to Standard per Repo
                map={textures?.map || null}
                roughness={0.75}
                metalness={0.02}
                emissive="#000000"
            />
        );

        // MERCURY: The Swift Planet - Rocky and Cratered
        // MERCURY: Reference Repo Style
        if (data.id === 'mercury') return (
            <meshStandardMaterial
                map={textures?.map || null}
                roughness={0.7}
                metalness={0.4}
                // HACK: Fill texture gaps with matching rock color
                color={textures?.map ? '#C4AFA0' : data.science.color}
                // HACK: Force opacity to hide holes in bad user texture
                transparent={false}
                side={THREE.DoubleSide} // Ensure inside isn't invisible if wrap fails
                emissive="#000000"
            />
        );

        // JUPITER: Basic Texture Mapping (Simplified - No Displacement)
        // JUPITER: Reference Repo Style
        if (data.id === 'jupiter') return (
            <meshStandardMaterial
                map={textures?.map || null}
                roughness={0.7}
                metalness={0.4}
                emissive="#000000"
            />
        );

        // JUPITER: Basic Texture Mapping (Simplified - No Displacement)
        // SATURN: Reference Repo Style
        if (data.id === 'saturn') return (
            <meshStandardMaterial
                map={textures?.map || null}
                roughness={0.7}
                metalness={0.4}
            // Emissive removed to match Repo (Saturn body isn't self-luminous)
            />
        );

        // URANUS: Pale Cyan with 98 Degree Tilt
        // URANUS: Ice Giant - Frozen Appearance
        // URANUS: Reference Repo Style
        if (data.id === 'uranus') return (
            <meshStandardMaterial
                map={textures?.map || null}
                roughness={0.7}
                metalness={0.4}
                color={textures?.map ? '#FFFFFF' : data.science.color}
                emissive="#000000"
            />
        );

        // NEPTUNE: Deep Blue Ice Giant
        // NEPTUNE: Ice Giant - Deep Frozen Blue
        // NEPTUNE: Reference Repo Style
        if (data.id === 'neptune') return (
            <meshStandardMaterial
                map={textures?.map || null}
                roughness={0.7}
                metalness={0.4}
                color={textures?.map ? '#FFFFFF' : data.science.color}
                emissive="#000000"
            />
        );

        // PLUTO: Rocky Dwarf - Grey/Brownish
        // PLUTO: Rocky Dwarf
        if (data.id === 'pluto') return (
            <meshStandardMaterial
                map={textures?.map || null}
                color={textures?.map ? '#FFFFFF' : data.science.color}
                roughness={0.7}
                metalness={0.4}
                emissive={'#806050'}
                emissiveIntensity={0.1}
            />
        );

        if (!textures.map) {
            return <meshStandardMaterial color={data.science.color} />;
        }

        // No other objects need special materials - fallback below will handle

        return <meshStandardMaterial color={data.science.color} />;
    };

    return (
        <group ref={groupRef} position={initialPos}>
            {/* HITBOX - Invisible Interactor */}
            <mesh
                ref={meshRef}
                scale={
                    data.id === 'sun' || data.id === 'jupiter' ? targetScale * 1.05 : targetScale /* Scale hitbox 5% larger to avoid z-fighting */
                }
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
                visible={true} // Must be visible to catch clicks
                frustumCulled={false}
            >
                <sphereGeometry args={[1, 16, 16]} />
                <meshBasicMaterial
                    transparent={true}
                    opacity={0.0}
                    depthWrite={false} // CRITICAL: Do not write to depth buffer
                    depthTest={false}  // CRITICAL: Always pass depth test (render on top invisible)
                    color="red"
                    side={THREE.DoubleSide}
                />
            </mesh>


            {/* VISUAL MESH - Optimized geometry (Skip for Sun/Moon/Mars/Jupiter/Saturn/OrionStars as they have custom handling) */}
            {data.id !== 'sun' && data.id !== 'moon' && data.id !== 'mars' && data.id !== 'jupiter' && data.id !== 'saturn' && !['alnitak', 'alnilam', 'mintaka'].includes(data.id) && (
                <mesh
                    ref={meshRef}
                    scale={targetScale}
                    castShadow={true}
                    receiveShadow={true}
                    raycast={() => null}
                    frustumCulled={false}
                >
                    <sphereGeometry args={[1, 32, 32]} />
                    {getMaterial()}
                </mesh>
            )}

            {/* Mars - Real Textured Surface */}
            {data.id === 'mars' && (
                <group>
                    <TexturedMars scale={targetScale} textureMap={textures?.map} />
                </group>
            )}

            {/* Saturn - Real Textured Surface */}
            {data.id === 'saturn' && (
                <group>
                    <TexturedSaturn
                        scale={targetScale}
                        textureMap={textures?.map}
                        ringMap={textures?.ring}
                    />
                </group>
            )}

            {/* Jupiter - Real Textured Surface (High-Res, No Z-Fighting) */}
            {data.id === 'jupiter' && (
                <group>
                    <TexturedJupiter scale={targetScale} textureMap={textures?.map} />
                </group>
            )}

            {/* Moon - Real Textured Surface */}
            {data.id === 'moon' && (
                <group>
                    <TexturedMoon scale={targetScale} textureMap={textures?.map} />
                </group>
            )}

            {/* 💡 SUN LIGHT - Reference Repo Settings */}
            {data.id === 'sun' && (
                <>
                    <pointLight
                        intensity={2.0} // Reduced from 10 to prevent Bloom Whiteout
                        distance={1000}
                        decay={0.5}
                        color="#FFF4E6"
                        castShadow={true}
                        shadow-bias={-0.0001}
                        shadow-mapSize-width={1024} // Optimized for Mobile (was 2048)
                        shadow-mapSize-height={1024} // Optimized for Mobile
                    />

                    {/* CORE: Real Textured Sun */}
                    <group>
                        <SoumyaSun scale={targetScale} />
                    </group>
                </>
            )}



            {/* Earth - Clouds & Atmosphere */}
            {data.id === 'earth' && (
                <>
                    {/* Cloud Layer */}
                    <mesh ref={cloudsRef} scale={targetScale * 1.015} raycast={() => null}>
                        <sphereGeometry args={[1, 64, 64]} />
                        <meshStandardMaterial
                            map={textures?.clouds || null}
                            transparent={true}
                            opacity={0.8}
                            side={THREE.DoubleSide}
                            blending={THREE.NormalBlending}
                            depthWrite={false}
                        />
                    </mesh>
                    {/* Atmospheric Glow */}
                    <mesh scale={targetScale * 1.15} raycast={() => null}>
                        <sphereGeometry args={[1, 64, 64]} />
                        <meshBasicMaterial
                            color="#5080ff"
                            transparent
                            opacity={0.12}
                            side={THREE.BackSide}
                            blending={THREE.AdditiveBlending}
                        />
                    </mesh>
                </>
            )}

            {/* Sirius - The Brightest Star (Blue-White) - EXTREME RADIANCE UPGRADE */}
            {data.id === 'sirius' && (
                <>
                    {/* Blinding Light Source */}
                    <pointLight intensity={300.0} distance={8000} decay={1.0} color="#FFFFFF" />

                    {/* Solid Core (White Hot) */}
                    <mesh scale={3.0} raycast={() => null}>
                        <sphereGeometry args={[1, 32, 32]} />
                        <meshBasicMaterial color="#FFFFFF" toneMapped={false} />
                    </mesh>

                    {/* Primary Glare (Blue-White) */}
                    <mesh scale={6.0} raycast={() => null}>
                        <sphereGeometry args={[1, 32, 32]} />
                        <meshBasicMaterial
                            color="#dceeff"
                            transparent
                            opacity={0.8}
                            blending={THREE.AdditiveBlending}
                            depthWrite={false}
                            toneMapped={false}
                        />
                    </mesh>

                    {/* Massive Radiant Halo */}
                    <mesh scale={15.0} raycast={() => null}>
                        <sphereGeometry args={[1, 32, 32]} />
                        <meshBasicMaterial
                            color="#4A90E2"
                            transparent
                            opacity={0.4}
                            blending={THREE.AdditiveBlending}
                            depthWrite={false}
                            toneMapped={false}
                        />
                    </mesh>
                </>
            )}

            {/* Al-Tariq - Neutron Star / Pulsar (The Knocker) */}
            {/* Al-Tariq - Neutron Star / Pulsar (The Knocker) - EXTREME RADIANCE UPGRADE */}
            {data.id === 'al-tariq' && (
                <>
                    {/* Blinding Light Source (Cyan/White) */}
                    <pointLight intensity={150.0} distance={6000} decay={1.5} color="#00FFFF" />

                    {/* Pulsar Beam - Core (White Hot Laser) - Fixed Geometry */}
                    <mesh rotation={[0, 0, Math.PI / 3]} raycast={() => null}>
                        {/* Thin beam: 0.1 radius, Length 40 */}
                        <cylinderGeometry args={[0.1, 0.1, 40, 8, 1, true]} />
                        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} toneMapped={false} />
                    </mesh>

                    {/* Pulsar Beam - Outer Glow (Cyan) - Narrow Aura */}
                    <mesh rotation={[0, 0, Math.PI / 3]} raycast={() => null}>
                        {/* Slightly wider beam: 0.4 radius, Length 35 */}
                        <cylinderGeometry args={[0.4, 0.6, 35, 16, 1, true]} />
                        <meshBasicMaterial color="#00FFFF" transparent opacity={0.3} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} toneMapped={false} />
                    </mesh>

                    {/* Neutron Star Core (Blue-White) */}
                    <mesh scale={1.2} raycast={() => null}>
                        <sphereGeometry args={[1, 32, 32]} />
                        <meshBasicMaterial color="#E0FFFF" toneMapped={false} />
                    </mesh>

                    {/* Core Glow (Electric Blue Halo) */}
                    <mesh scale={4.0} raycast={() => null}>
                        <sphereGeometry args={[1, 32, 32]} />
                        <meshBasicMaterial color="#0088FF" transparent opacity={0.6} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
                    </mesh>

                    {/* Radiant Shockwave Ring */}
                    <mesh rotation={[Math.PI / 2, 0, 0]} scale={6.0} raycast={() => null}>
                        <ringGeometry args={[0.8, 1.0, 64]} />
                        <meshBasicMaterial color="#00FFFF" transparent opacity={0.3} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} depthWrite={false} toneMapped={false} />
                    </mesh>
                </>
            )}

            {/* Alnilam - Blue Supergiant (النظام) */}
            {data.id === 'alnilam' && (
                <>
                    {/* Massive Blue Point Light */}
                    <pointLight intensity={10.0} distance={5000} decay={2.0} color="#aaaaff" />

                    {/* Blue Supergiant - Reduced Brightness to show Texture */}
                    <mesh scale={targetScale} raycast={() => null}>
                        <sphereGeometry args={[1, 64, 64]} />
                        <meshStandardMaterial
                            map={textures?.map || null}
                            color="#aaaaff"
                            emissive="#0044ff"
                            emissiveMap={textures?.map || null}
                            emissiveIntensity={10.5} // Reduced by 65% from 30.0
                            roughness={0.2}
                            metalness={0.1}
                            toneMapped={false}
                        />
                    </mesh>
                </>
            )}

            {/* Other Orion Stars - Alnitak, Alnilam & Mintaka */}
            {['alnitak', 'alnilam', 'mintaka'].includes(data.id) && (
                <>
                    {/* Strong Blue Point Light - Makes them real light sources */}
                    <pointLight intensity={1.0} distance={100} decay={2.0} color="#4488ff" />

                    {/* Single Glowing Sphere - Reduced Brightness */}
                    <mesh scale={targetScale} raycast={() => null}>
                        <sphereGeometry args={[1, 32, 32]} />
                        <meshStandardMaterial
                            color="#4488ff"
                            emissive="#0055ff"
                            emissiveIntensity={3.5} // Reduced from 10.0 to 3.5
                            roughness={0.5}
                            metalness={0.2}
                            toneMapped={false}
                        />
                    </mesh>
                </>
            )}

            {/* Venus - Thick atmospheric golden glow */}
            {data.id === 'venus' && (
                <>
                    <pointLight intensity={1.5} distance={1500} decay={0.4} color="#FFD700" />
                    {/* Inner atmospheric glow - thick sulfuric clouds */}
                    <mesh scale={1.3} raycast={() => null}>
                        <sphereGeometry args={[1, 32, 32]} />
                        <meshBasicMaterial color="#F0D88C" transparent opacity={0.55} blending={THREE.AdditiveBlending} depthWrite={false} />
                    </mesh>
                    {/* Outer atmospheric haze - yellowish */}
                    <mesh scale={1.9} raycast={() => null}>
                        <sphereGeometry args={[1, 24, 24]} />
                        <meshBasicMaterial color="#FFE4A0" transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
                    </mesh>
                </>
            )}



            {/* 🌕 MOON: Real Textured Moon */}
            {data.id === 'moon' && (
                <group>
                    <TexturedMoon />
                </group>
            )}

            {/* Atmospheric rim glow for stars */}
            {data.id !== 'sun' && data.id !== 'moon' && (
                <mesh scale={targetScale * 1.06} raycast={() => null}>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshBasicMaterial
                        color={data.science.color}
                        transparent
                        opacity={0.1}
                        side={THREE.BackSide}
                        blending={THREE.AdditiveBlending}
                        depthWrite={false}
                    />
                </mesh>
            )}

            {/* Selection Ring - Simplified & Thinner */}
            {(hovered || isSelected) && (
                <mesh rotation={[-Math.PI / 2, 0, 0]} raycast={() => null}>
                    {/* Thinner ring: 1.5 to 1.52 instead of 1.55 */}
                    <ringGeometry args={[baseScale * 1.5, baseScale * 1.52, 64]} />
                    <meshBasicMaterial color="#4facfe" side={THREE.DoubleSide} toneMapped={false} />
                </mesh>
            )}
        </group>
    );
}


