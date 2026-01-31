import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

// 🌠 Shooting Star Configuration
const METEOR_COUNT = 30; // Increased count supported by Instancing
const SPAWN_INTERVAL = 0.4;
const TRAIL_LENGTH = 5.0;

interface MeteorData {
    active: boolean;
    position: THREE.Vector3;
    velocity: THREE.Vector3;
    scale: number;
    life: number;
    maxLife: number;
}

export function Meteors() {
    const texture = useTexture(`${import.meta.env.BASE_URL}textures/shooting_star_trail.webp`);
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const lastSpawnTime = useRef(0);

    // 🧠 Object Pool Pattern
    // Instead of creating/destroying objects, we reuse a fixed pool
    const meteors = useMemo(() => {
        return new Array(METEOR_COUNT).fill(null).map(() => ({
            active: false,
            position: new THREE.Vector3(),
            velocity: new THREE.Vector3(),
            scale: 1,
            life: 0,
            maxLife: 1
        } as MeteorData));
    }, []);

    const dummy = useMemo(() => new THREE.Object3D(), []);

    // Helper to spawn a single meteor
    const spawnMeteor = (meteor: MeteorData) => {
        // Position: Random point on a far sphere
        const r = 4000;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        meteor.position.set(
            r * Math.sin(phi) * Math.cos(theta),
            Math.abs(r * Math.sin(phi) * Math.sin(theta)) + 500, // Top hemisphere
            r * Math.cos(phi)
        );

        // Target: Near center
        const targetPos = new THREE.Vector3(
            (Math.random() - 0.5) * 2000,
            (Math.random() - 0.5) * 500,
            (Math.random() - 0.5) * 2000
        );

        meteor.velocity.subVectors(targetPos, meteor.position).normalize().multiplyScalar(150 + Math.random() * 100);
        meteor.scale = 200 + Math.random() * 300;
        meteor.active = true;
        meteor.life = 1.0;
        meteor.maxLife = 3.0 + Math.random() * 2.0;
    };

    useFrame(({ clock }, delta) => {
        if (!meshRef.current) return;

        const time = clock.getElapsedTime();

        // 1. Spawning Logic
        if (time - lastSpawnTime.current > SPAWN_INTERVAL) {
            const inactiveMeteor = meteors.find(m => !m.active);
            if (inactiveMeteor) {
                spawnMeteor(inactiveMeteor);
                lastSpawnTime.current = time;
            }
        }

        // 2. Simulation & Rendering Loop
        meteors.forEach((meteor, i) => {
            if (!meteor.active) {
                // Hide inactive instances by scaling to zero
                dummy.scale.set(0, 0, 0);
                dummy.updateMatrix();
                meshRef.current!.setMatrixAt(i, dummy.matrix);
                return;
            }

            // Update Physics
            meteor.position.addScaledVector(meteor.velocity, delta);
            meteor.life -= delta / meteor.maxLife;

            if (meteor.life <= 0) {
                meteor.active = false;
                return;
            }

            // Update Visuals
            const lookTarget = meteor.position.clone().add(meteor.velocity);
            dummy.position.copy(meteor.position);
            dummy.lookAt(lookTarget);

            // X scale = Width, Y scale = Length (Trail)
            // Fade out by shrinking active scale
            const fade = Math.sin(meteor.life * Math.PI);
            dummy.scale.set(meteor.scale * 0.1, meteor.scale, 1); // Trail stretches along Y locally? No, plane is XY usually.
            // PlaneGeometry is XY default. We lookAt, so Z points to target.
            // To make trail follow Z, we elongate Z?
            // Actually simpler: Plane is flat. we orient it.
            // Let's assume standard billboard behavior modified by lookAt.
            // Trail stretching:

            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);

            // Update Color/Opacity (InstancedMesh doesn't support per-instance opacity easily without custom shader,
            // so we simulate fade by scaling width to 0)
            if (fade < 0.1) dummy.scale.set(0, 0, 0);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, METEOR_COUNT]} frustumCulled={false}>
            {/* Plane facing Up/Z. We orient it with LookAt */}
            <planeGeometry args={[1, 5]} />
            <meshBasicMaterial
                map={texture}
                transparent
                opacity={0.6}
                blending={THREE.AdditiveBlending}
                side={THREE.DoubleSide}
                depthWrite={false}
                color={new THREE.Color("#aaddff")}
            />
        </instancedMesh>
    );
}
