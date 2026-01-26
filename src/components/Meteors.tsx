import { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
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

        // Loop interval (15000ms = 15s)
        const interval = setInterval(spawnMeteor, 15000);
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

function SingleMeteor({ start, end }: { start: THREE.Vector3; end: THREE.Vector3 }) {
    const meshRef = useRef<THREE.Group>(null);
    const [progress, setProgress] = useState(0);

    // Procedural Glow Texture (Halo)
    const glowTexture = useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 128; canvas.height = 128;
        const context = canvas.getContext('2d');
        if (context) {
            const gradient = context.createRadialGradient(64, 64, 0, 64, 64, 64);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');     // Core White
            gradient.addColorStop(0.2, 'rgba(200, 240, 255, 0.8)'); // Inner Cyan
            gradient.addColorStop(0.5, 'rgba(0, 100, 255, 0.2)');   // Outer Blue
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');           // Fade
            context.fillStyle = gradient;
            context.fillRect(0, 0, 128, 128);
        }
        return new THREE.CanvasTexture(canvas);
    }, []);

    // Orient the meteor to face its destination once on mount
    useEffect(() => {
        if (meshRef.current) {
            meshRef.current.lookAt(end);
        }
    }, [end]);

    useFrame((_, delta) => {
        if (!meshRef.current) return;

        // Speed factor (Faster)
        const speed = 0.8 * delta;
        const newProgress = progress + speed;

        if (newProgress <= 1) {
            // Linear interpolation for movement
            meshRef.current.position.lerpVectors(start, end, newProgress);

            // Fade out tail near end (Accessing children materials is tricky in React-Three unless declarative)
            // We'll keep it simple: just scale down slightly at the very end
            if (newProgress > 0.9) {
                const scale = 1 - ((newProgress - 0.9) * 10);
                meshRef.current.scale.setScalar(Math.max(0, scale));
            }

            setProgress(newProgress);
        }
    });

    // Enhanced Visuals: Glowing Head + Long Tail
    return (
        <group ref={meshRef as any} position={start}>
            {/* 1. The Meteor Head (Solid Core) */}
            <mesh>
                <sphereGeometry args={[1.5, 16, 16]} />
                <meshBasicMaterial color="#FFFFFF" />
            </mesh>

            {/* 2. The Super Glow Halo (Sprite) - Replaces the weak light visual */}
            <sprite scale={[25, 25, 1]}> {/* Large Halo */}
                <spriteMaterial map={glowTexture} color={0xFFFFFF} blending={THREE.AdditiveBlending} depthWrite={false} />
            </sprite>

            {/* 3. The Glow Light (Illuminates Planets) */}
            <pointLight distance={200} intensity={10} color="#AAFFFF" decay={1} />

            {/* 4. The Trail */}
            <mesh position={[0, 0, 20]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.5, 2.5, 60, 8]} />
                <meshBasicMaterial
                    color={new THREE.Color(0x88CCFF)}
                    transparent
                    opacity={0.6}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </mesh>
        </group>
    );
}
