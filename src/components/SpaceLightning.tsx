import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface LightningBolt {
    id: number;
    position: THREE.Vector3;
    rotation: THREE.Euler;
    scale: THREE.Vector3;
    life: number; // 0 to 1, where 1 is start of flash
    opacity: number;
}

export function SpaceLightning() {
    const texture = useTexture('/textures/lightning.png');
    const [bolts, setBolts] = useState<LightningBolt[]>([]);
    const nextFlashTime = useRef(0);

    useFrame((state, delta) => {
        const time = state.clock.elapsedTime;

        // 1. SPAWN LOGIC
        if (time > nextFlashTime.current) {
            // Chance to spawn a new bolt
            if (Math.random() > 0.95 && bolts.length < 3) {
                // Random Position in Background (Deep Space)
                // Distance roughly 200-400 units away
                const radius = 250 + Math.random() * 200;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);

                const x = radius * Math.sin(phi) * Math.cos(theta);
                const y = radius * Math.sin(phi) * Math.sin(theta);
                const z = radius * Math.cos(phi);

                const position = new THREE.Vector3(x, y, z);
                const lookAtPos = new THREE.Vector3(0, 0, 0); // Face center

                // Create base orientation
                const dummyObj = new THREE.Object3D();
                dummyObj.position.copy(position);
                dummyObj.lookAt(lookAtPos);

                // Random scale (HUGE because it's far away)
                const scaleBase = 40 + Math.random() * 40;
                const scale = new THREE.Vector3(scaleBase, scaleBase * 2, 1);

                const newBolt: LightningBolt = {
                    id: Math.random(),
                    position: position,
                    rotation: dummyObj.rotation.clone(),
                    scale: scale,
                    life: 1.0,
                    opacity: 0,
                };

                setBolts(prev => [...prev, newBolt]);

                // Set next check time
                nextFlashTime.current = time + 0.5 + Math.random() * 2; // Wait 0.5-2.5s
            }
        }

        // 2. ANIMATION LOGIC
        setBolts(prevBolts =>
            prevBolts
                .map(bolt => {
                    // Life decreases
                    const newLife = bolt.life - (delta * 3.0); // Lasts ~0.33 seconds

                    if (newLife <= 0) return null;

                    // Flicker effect based on life
                    // High intensity start, chaotic flicker
                    let opacity = Math.sin(newLife * 20) * 0.5 + 0.5;
                    opacity *= newLife; // Fade out over time

                    return { ...bolt, life: newLife, opacity };
                })
                .filter((b): b is LightningBolt => b !== null)
        );
    });

    return (
        <group>
            {bolts.map(bolt => (
                <mesh
                    key={bolt.id}
                    position={bolt.position}
                    rotation={bolt.rotation}
                    scale={bolt.scale}
                >
                    <planeGeometry args={[1, 1]} />
                    <meshBasicMaterial
                        map={texture}
                        transparent={true}
                        opacity={bolt.opacity}
                        blending={THREE.AdditiveBlending}
                        side={THREE.DoubleSide}
                        depthWrite={false}
                        toneMapped={false}
                        color={new THREE.Color("#88ccff").multiplyScalar(2)} // Bright Blue-White
                    />
                </mesh>
            ))}
        </group>
    );
}
