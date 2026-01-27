import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

// 🌠 Meteor (Shooting Star) Component
export function Meteors() {
    const [meteors, setMeteors] = useState<{ id: number; startPos: THREE.Vector3; endPos: THREE.Vector3 }[]>([]);

    // Timer to spawn meteors every 15 seconds (randomized slightly)
    useEffect(() => {
        const spawnMeteor = () => {
            const id = Date.now();

            // Random start position (far away)
            const startX = (Math.random() - 0.5) * 1000;
            const startY = (Math.random() - 0.5) * 500 + 200; // Higher up
            const startZ = -(Math.random() * 500 + 500); // Background depth

            // Random end position (across the screen)
            const endX = startX + (Math.random() - 0.5) * 800;
            const endY = startY - (Math.random() * 400 + 100); // Moving down
            const endZ = startZ;

            setMeteors(prev => [...prev, {
                id,
                startPos: new THREE.Vector3(startX, startY, startZ),
                endPos: new THREE.Vector3(endX, endY, endZ)
            }]);

            // Cleanup after animation (2 seconds max lifetime)
            setTimeout(() => {
                setMeteors(prev => prev.filter(m => m.id !== id));
            }, 2000);
        };

        // Initial spawn
        spawnMeteor();

        // Loop interval (6000ms = 6s) - Balanced for visibility
        const interval = setInterval(spawnMeteor, 6000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            {meteors.map(meteor => (
                <SingleMeteor key={meteor.id} start={meteor.startPos} end={meteor.endPos} />
            ))}
        </>
    );
}

// 🌠 Single Real Meteor Component
function SingleMeteor({ start, end }: { start: THREE.Vector3; end: THREE.Vector3 }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const progressRef = useRef(0);

    // Load the Real Texture
    const texture = useTexture(`${import.meta.env.BASE_URL}textures/shooting_star_trail.png`);

    // Orientation Logic
    useEffect(() => {
        if (meshRef.current) {
            // 1. Position at start
            meshRef.current.position.copy(start);
            // 2. Look at destination
            meshRef.current.lookAt(end);
            // 3. Rotate 90deg on Y if needed to align the plane's face to camera? 
            // Actually, for a 3D line effect, we usually use 2 crossed planes or just bilboarding.
            // But let's stick to the user's request: "PlaneGeometry". 
            // We rotate X so the plane travels "flat" or "side-on"?
            // A Plane in XY plane facing Z. `lookAt` points Z to target.
            // We want the LONG edge (60) to align with Z.
            // PlaneGeometry(4, 60) -> Width X=4, Height Y=60.
            // So Y axis is the "long" one. 
            // If we `lookAt`, Z axis points to target. We need Y axis to point to target (or -Z).
            // Let's rotate X by -PI/2 to align local Y with local -Z? 
            meshRef.current.rotateX(-Math.PI / 2);
        }
    }, [start, end]);

    useFrame((_, delta) => {
        if (!meshRef.current) return;

        // Speed: Slower for visibility (was 2.0 * delta)
        // Now about 2-3 seconds to cross
        const speed = 0.5 * delta;
        progressRef.current += speed;

        if (progressRef.current <= 1.0) {
            // Move linearly
            meshRef.current.position.lerpVectors(start, end, progressRef.current);

            // Fade Out Logic (Opacity)
            const material = meshRef.current.material as THREE.MeshBasicMaterial;
            if (material) {
                // Fade in at start
                if (progressRef.current < 0.1) material.opacity = progressRef.current * 10;
                // Fade out at end
                else if (progressRef.current > 0.8) material.opacity = (1 - progressRef.current) * 5;
                else material.opacity = 1;
            }
        }
    });

    return (
        <mesh ref={meshRef} position={start} renderOrder={9999}>
            {/* PlaneGeometry: Long and thin. Y is length. */}
            <planeGeometry args={[4, 80]} />
            <meshBasicMaterial
                map={texture}
                color="#FFFFFF"
                transparent={true}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                side={THREE.DoubleSide}
                toneMapped={false}
            />
        </mesh>
    );
}
