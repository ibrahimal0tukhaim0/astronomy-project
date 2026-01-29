import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

// 🌠 Shooting Star Configuration
const METEOR_COUNT = 25; // 🚀 CREASED: Higher density for visual impact
const SPAWN_INTERVAL = 0.5; // 🚀 FASTER: Spawns every ~0.5 seconds

interface MeteorData {
    id: number;
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    scale: number;
    life: number; // 0 to 1
    maxLife: number;
}

export function Meteors() {
    // Texture: Use specific shooting star texture or fallback to a glow
    const texture = useTexture(`${import.meta.env.BASE_URL}textures/shooting_star_trail.png`);
    const [meteors, setMeteors] = useState<MeteorData[]>([]);
    const lastSpawnTime = useRef(0);

    // 1. SPAWN LOGIC - Defined before useFrame
    const spawnMeteor = () => {
        // Position: Random point on a sphere shell far away
        const r = 4000;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        const x = r * Math.sin(phi) * Math.cos(theta);
        const y = Math.abs(r * Math.sin(phi) * Math.sin(theta)) + 500; // Always spawn slightly above
        const z = r * Math.cos(phi);

        const startPos = new THREE.Vector3(x, y, z);

        // Target: Somewhere near the center (Solar System) but missing it
        const targetPos = new THREE.Vector3(
            (Math.random() - 0.5) * 2000,
            (Math.random() - 0.5) * 500,
            (Math.random() - 0.5) * 2000
        );

        const velocity = new THREE.Vector3().subVectors(targetPos, startPos).normalize().multiplyScalar(150 + Math.random() * 100); // Speed

        const newMeteor: MeteorData = {
            id: Math.random(),
            position: startPos,
            velocity: velocity,
            scale: 200 + Math.random() * 300,
            life: 1.0,
            maxLife: 4.0 // Seconds to live
        };

        setMeteors(prev => [...prev, newMeteor]);
    };

    useFrame(({ clock }) => {
        const time = clock.getElapsedTime();

        if (time - lastSpawnTime.current > SPAWN_INTERVAL) {
            // Chance to spawn
            if (meteors.length < METEOR_COUNT && Math.random() > 0.1) {
                spawnMeteor();
                lastSpawnTime.current = time;
            }
        }
    });

    const removeMeteor = (id: number) => {
        setMeteors(prev => prev.filter(m => m.id !== id));
    };

    return (
        <group>
            {meteors.map(m => (
                <Meteor key={m.id} data={m} texture={texture} onDeath={() => removeMeteor(m.id)} />
            ))}
        </group>
    );
}

// Single Meteor Component
function Meteor({ data, texture, onDeath }: { data: MeteorData, texture: THREE.Texture, onDeath: () => void }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const lifeRef = useRef(data.life);

    // Geometry & Material Reuse 
    // Note: In React Three Fiber, standard objects are automatically disposed, 
    // but explicit geometry sharing is better for GPU.
    // For simplicity and safety against context loss, we use primitive plane here.

    useFrame((_, delta) => {
        if (!meshRef.current) return;

        // 1. Move
        meshRef.current.position.addScaledVector(data.velocity, delta);

        // 2. Age
        lifeRef.current -= delta / data.maxLife;

        // 3. Update Visuals
        const material = meshRef.current.material as THREE.MeshBasicMaterial;
        if (material) {
            // Fade in/out
            const fade = Math.sin(lifeRef.current * Math.PI);
            material.opacity = fade * 0.8;
            material.needsUpdate = true; // Often needed for transparency changes
        }

        // 4. Orientation: Look along velocity
        // We want the "Tail" (negative local Y or Z) to point backwards.
        // PlaneGeometry defaults to facing Z. 
        // We lookAt the destination.
        const lookTarget = meshRef.current.position.clone().add(data.velocity);
        meshRef.current.lookAt(lookTarget);

        // 5. Check Death
        if (lifeRef.current <= 0) {
            onDeath();
        }
    });

    return (
        <mesh ref={meshRef} position={data.position} scale={[data.scale, data.scale * 0.1, 1]}>
            {/* Wide Plane for trail */}
            <planeGeometry args={[1, 5]} />
            {/* Texture usually trails vertical or horizontal. Assuming Vertical trail in texture. */}
            <meshBasicMaterial
                map={texture}
                transparent
                opacity={0}
                blending={THREE.AdditiveBlending}
                side={THREE.DoubleSide}
                depthWrite={false}
                color={new THREE.Color("#aaddff")}
            />
        </mesh>
    );
}
