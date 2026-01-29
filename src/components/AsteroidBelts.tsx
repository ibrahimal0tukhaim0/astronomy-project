import { useRef, useLayoutEffect } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'

const SEED = 12345;
function random(seed: number) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

export function AsteroidBelts() {
    // 🌑 Load a generic rock texture (Bennu is perfect for this)
    // FIX: Use BASE_URL for correct loading on GitHub Pages
    const texture = useTexture(`${import.meta.env.BASE_URL}textures/asteroids/bennu.jpg`);

    // Refs for InstancedMesh
    const mainBeltRef = useRef<THREE.InstancedMesh>(null!);
    const kuiperBeltRef = useRef<THREE.InstancedMesh>(null!);

    // Configuration
    const mainBeltCount = 1500;
    const kuiperBeltCount = 1000;

    useLayoutEffect(() => {
        // --- Generate Main Belt (Mars-Jupiter Gap: 190 - 220) ---
        const tempObject = new THREE.Object3D();
        for (let i = 0; i < mainBeltCount; i++) {
            // Random Radius between 190 and 220
            const radius = 190 + (random(i * SEED) * 30);
            // Random Angle
            const angle = random(i * SEED + 1) * Math.PI * 2;

            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            // Spread in Y (Vertical thickness)
            const y = (random(i * SEED + 2) - 0.5) * 10;

            // FIX: Larger Scale for visibility (Was 0.5 - 2.0, Now 2.5 - 8.0)
            const scale = 2.5 + random(i * SEED + 3) * 5.5;

            tempObject.position.set(x, y, z);
            tempObject.scale.set(scale, scale, scale);
            tempObject.rotation.set(random(i), random(i + 1), random(i + 2));

            tempObject.updateMatrix();
            mainBeltRef.current.setMatrixAt(i, tempObject.matrix);
        }
        mainBeltRef.current.instanceMatrix.needsUpdate = true;

        // --- Generate Kuiper Belt (Beyond Neptune: 450 - 600) ---
        for (let i = 0; i < kuiperBeltCount; i++) {
            const radius = 450 + (random(i * SEED + 10) * 150);
            const angle = random(i * SEED + 11) * Math.PI * 2;

            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = (random(i * SEED + 12) - 0.5) * 40; // Thicker belt

            // FIX: Larger Scale for visibility
            const scale = 8.0 + random(i * SEED + 13) * 12.0; // Huge rocks for Kuiper

            tempObject.position.set(x, y, z);
            tempObject.scale.set(scale, scale, scale);
            tempObject.rotation.set(random(i + 10), random(i + 11), random(i + 12));

            tempObject.updateMatrix();
            kuiperBeltRef.current.setMatrixAt(i, tempObject.matrix);
        }
        kuiperBeltRef.current.instanceMatrix.needsUpdate = true;
    }, []);

    // 🔄 Animation: Slowly rotate the entire belts
    useFrame((_, delta) => {
        if (mainBeltRef.current) mainBeltRef.current.rotation.y += delta * 0.02;     // Fast inner belt
        if (kuiperBeltRef.current) kuiperBeltRef.current.rotation.y += delta * 0.005; // Slow outer belt
    });

    return (
        <group>
            {/* Main Belt */}
            <instancedMesh ref={mainBeltRef} args={[null as any, null as any, mainBeltCount]}>
                <dodecahedronGeometry args={[0.5, 0]} />
                <meshStandardMaterial
                    map={texture}
                    color="#888888"
                    roughness={0.8}
                    metalness={0.2}
                />
            </instancedMesh>

            {/* Kuiper Belt */}
            <instancedMesh ref={kuiperBeltRef} args={[null as any, null as any, kuiperBeltCount]}>
                <dodecahedronGeometry args={[0.8, 0]} />
                <meshStandardMaterial
                    map={texture}
                    color="#666666"
                    roughness={0.9}
                />
            </instancedMesh>
        </group>
    )
}
