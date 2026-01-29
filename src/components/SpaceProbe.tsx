import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { celestialObjects } from '../data/objects';

export function SpaceProbe() {
    const meshRef = useRef<THREE.Group>(null);
    const [launched, setLaunched] = useState(false);
    const launchTime = useRef(0);

    // Target: Rigil Kentaurus
    const RIGIL_ID = 'rigil';
    const target = celestialObjects.find(o => o.id === RIGIL_ID);

    useFrame(({ clock }, delta) => {
        const time = clock.getElapsedTime();

        // Launch Logic: Every 4 minutes (240s)
        const cycle = 240;
        const offset = time % cycle;

        if (offset < 5 && !launched) {
            setLaunched(true);
            launchTime.current = time;
            // Reset position to Earth (or near center)
            if (meshRef.current) {
                meshRef.current.position.set(0, 10, 0);
                meshRef.current.visible = true;
            }
        } else if (offset > 20 && launched) {
            setLaunched(false); // Reset for next launch
            if (meshRef.current) meshRef.current.visible = false;
        }

        if (launched && meshRef.current && target) {
            // Move toward target
            const targetPos = new THREE.Vector3(...target.initialPosition);
            const currentPos = meshRef.current.position.clone();

            // Speed calculation to reach in ~20s visual time
            const dir = new THREE.Vector3().subVectors(targetPos, currentPos).normalize();
            const dist = currentPos.distanceTo(targetPos);

            // Accelerate
            const speed = 500 * delta;

            if (dist > 10) {
                meshRef.current.position.add(dir.multiplyScalar(speed));
                meshRef.current.lookAt(targetPos);
            }
        }
    });

    if (!target) return null;

    return (
        <group ref={meshRef} visible={false}>
            {/* Rocket Body */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.5, 1, 4, 8]} />
                <meshStandardMaterial color="#FFFFFF" metalness={0.8} roughness={0.2} />
            </mesh>
            {/* Engine Glow */}
            <pointLight distance={50} intensity={5} color="orange" position={[0, 0, -2]} />
            {/* Trail Particle System could go here */}
        </group>
    );
}
