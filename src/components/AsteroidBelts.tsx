import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

// Helper to create random asteroids for a specific belt definition
// Ported from: SoumyaEXE/3d-Solar-System-ThreeJS (main.js)

interface AsteroidBeltProps {
    count: number;
    innerRadius: number;
    outerRadius: number;
    minSize: number;
    maxSize: number;
    colorFn: () => THREE.Color;
    ySpread: number;
    offsetAngle?: number; // For Trojans
    name: string;
}

function ProceduralBelt({ count, innerRadius, outerRadius, minSize, maxSize, colorFn, ySpread, offsetAngle = 0, name }: AsteroidBeltProps) {
    // Generate static data once
    const data = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            // Logic from Repo: angle + random variance
            const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5 + offsetAngle;
            const radius = innerRadius + Math.random() * (outerRadius - innerRadius);
            const size = minSize + Math.random() * (maxSize - minSize);

            const x = Math.cos(angle) * radius;
            const z = Math.sin(angle) * radius;
            const y = (Math.random() - 0.5) * ySpread;

            const rotation = [
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            ];

            const color = colorFn();
            const emissive = color.clone().multiplyScalar(0.1); // Standard glow

            // Speed multiplier from repo logic
            const speed = 0.002 + Math.random() * 0.002;

            temp.push({ position: [x, y, z], rotation, scale: size, color, emissive, speed, id: i });
        }
        return temp;
    }, [count, innerRadius, outerRadius, minSize, maxSize, ySpread, offsetAngle]);

    // Ref for animation
    const groupRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (!groupRef.current) return;
        // Simple overall rotation for performance (approximating individual orbits)
        groupRef.current.rotation.y += 0.0005 * 1; // Base slow rotation
    });

    return (
        <group ref={groupRef} name={name}>
            {data.map((item) => (
                <mesh key={item.id} position={item.position as [number, number, number]} rotation={item.rotation as [number, number, number]} scale={item.scale}>
                    <sphereGeometry args={[1, 6, 6]} /> {/* Low poly sphere */}
                    <meshStandardMaterial
                        color={item.color}
                        emissive={item.emissive}
                        emissiveIntensity={0.2}
                        roughness={0.9}
                        metalness={0.1}
                        toneMapped={false}
                    />
                </mesh>
            ))}
        </group>
    );
}

export function AsteroidBelts() {
    // 1. Main Belt (Inner, Middle, Outer merged for simplicity or kept separate)
    // Repo splits them. We will generate one thick belt or 3 layers.
    // Repo: Inner(19.5-21.5), Middle(21.5-23.5), Outer(23.5-25.5). Total ~19.5 to 25.5.

    // Main Belt wrapper
    const MainBelt = () => (
        <>
            <ProceduralBelt
                name="MainBelt_Inner"
                count={150}
                innerRadius={19.5}
                outerRadius={21.5}
                minSize={0.01}
                maxSize={0.06}
                ySpread={0.8}
                colorFn={() => {
                    const r = Math.random();
                    // C-type, S-type, M-type logic
                    if (r < 0.5) return new THREE.Color(0.4, 0.26, 0.13);
                    else if (r < 0.8) return new THREE.Color(0.6, 0.6, 0.6);
                    else return new THREE.Color(0.5, 0.4, 0.3);
                }}
            />
            <ProceduralBelt
                name="MainBelt_Middle"
                count={200}
                innerRadius={21.5}
                outerRadius={23.5}
                minSize={0.01}
                maxSize={0.07}
                ySpread={1.0}
                colorFn={() => {
                    const r = Math.random();
                    if (r < 0.4) return new THREE.Color(0.4, 0.26, 0.13);
                    else if (r < 0.75) return new THREE.Color(0.6, 0.6, 0.6);
                    else return new THREE.Color(0.5, 0.4, 0.3);
                }}
            />
            <ProceduralBelt
                name="MainBelt_Outer"
                count={150}
                innerRadius={23.5}
                outerRadius={25.5}
                minSize={0.01}
                maxSize={0.08}
                ySpread={1.2}
                colorFn={() => {
                    const r = Math.random();
                    if (r < 0.3) return new THREE.Color(0.4, 0.26, 0.13);
                    else if (r < 0.7) return new THREE.Color(0.6, 0.6, 0.6);
                    else return new THREE.Color(0.5, 0.4, 0.3);
                }}
            />
        </>
    );

    // 2. Jupiter Trojans (L4 and L5)
    // Jupiter Dist: 25. L4 (+60 deg), L5 (-60 deg).
    const Trojans = () => (
        <>
            <ProceduralBelt
                name="Trojans_L4"
                count={50}
                innerRadius={24}  // Around 25 +/- variance
                outerRadius={26}
                minSize={0.02}
                maxSize={0.07}
                ySpread={1.0}
                offsetAngle={Math.PI / 3} // +60 deg
                colorFn={() => new THREE.Color(0.35, 0.25, 0.15)}
            />
            <ProceduralBelt
                name="Trojans_L5"
                count={50}
                innerRadius={24}
                outerRadius={26}
                minSize={0.02}
                maxSize={0.07}
                ySpread={1.0}
                offsetAngle={-Math.PI / 3} // -60 deg
                colorFn={() => new THREE.Color(0.35, 0.25, 0.15)}
            />
        </>
    );

    // 3. Kuiper Belt (44 - 58)
    const KuiperBelt = () => (
        <ProceduralBelt
            name="KuiperBelt"
            count={200}
            innerRadius={44}
            outerRadius={58}
            minSize={0.03}
            maxSize={0.11}
            ySpread={3.0}
            colorFn={() => {
                const r = Math.random();
                if (r < 0.3) return new THREE.Color(0.6, 0.7, 0.8); // Icy
                else if (r < 0.6) return new THREE.Color(0.5, 0.4, 0.3); // Rocky
                else return new THREE.Color(0.7, 0.5, 0.4); // Reddish
            }}
        />
    );

    // 4. Scattered Disk (58 - 80)
    const ScatteredDisk = () => (
        <ProceduralBelt
            name="ScatteredDisk"
            count={80}
            innerRadius={58}
            outerRadius={80}
            minSize={0.04}
            maxSize={0.14}
            ySpread={10.0} // High inclination
            colorFn={() => new THREE.Color(0.6, 0.3, 0.2)}
        />
    );

    // 5. Oort Cloud (80 - 120)
    const OortCloud = () => (
        <ProceduralBelt
            name="OortCloud"
            count={50}
            innerRadius={80}
            outerRadius={120}
            minSize={0.05}
            maxSize={0.17}
            ySpread={20.0} // Spherical-ish
            colorFn={() => new THREE.Color(0.8, 0.6, 0.9)}
        />
    );

    return (
        <group>
            <MainBelt />
            <Trojans />
            <KuiperBelt />
            <ScatteredDisk />
            <OortCloud />
        </group>
    );
}
