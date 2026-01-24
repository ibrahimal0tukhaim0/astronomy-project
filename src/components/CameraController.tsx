import { useFrame, useThree } from '@react-three/fiber'
import { useImperativeHandle, forwardRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import type { CelestialData } from '../data/objects'
import { celestialObjects } from '../data/objects'
import { getObjectPosition } from '../utils/astronomy'
import type { CelestialObjectId } from '../data/objects'

interface CameraControllerProps {
    selectedObject: CelestialData | null;
    objectPosition: THREE.Vector3 | null;
    controlsRef: React.RefObject<OrbitControlsImpl>;
}

export interface CameraControllerHandle {
    flyTo: (objectId: string) => void;
}

export const CameraController = forwardRef<CameraControllerHandle, CameraControllerProps>(({ controlsRef }, ref) => {
    const { camera } = useThree();

    // Expose flyTo method to parent
    useImperativeHandle(ref, () => ({
        flyTo: (objectId: string) => {
            if (!controlsRef.current) return;

            // 1. Get Target Object directly from imported data
            const targetObj = celestialObjects.find((o) => o.id === objectId);

            if (!targetObj) return;

            // Calculate current position
            // We use current Date. Ideally this should be synchronized with simulation time,
            // but for a camera fly-to, "now" is usually acceptable or we can assume static check.
            const rawPos = getObjectPosition(objectId as CelestialObjectId, new Date());
            const targetPos = new THREE.Vector3(...rawPos);

            // 2. Calculate Smart Camera Position (Scale * 5.0)
            const offsetDir = new THREE.Vector3().subVectors(camera.position, targetPos).normalize();

            // If camera overlap (rare), set default offset
            if (offsetDir.lengthSq() < 0.1) {
                offsetDir.set(0, 0.5, 1).normalize();
            }

            const dist = targetObj.science.scale * 5.0;
            const destination = targetPos.clone().add(offsetDir.multiplyScalar(dist));

            // 3. Animate using GSAP
            const timeline = gsap.timeline();

            // Animate Controls Target (LookAt) - CENTER of object
            timeline.to(controlsRef.current.target, {
                x: targetPos.x,
                y: targetPos.y,
                z: targetPos.z,
                duration: 2.0,
                ease: "power2.inOut",
                onUpdate: () => controlsRef.current?.update()
            }, 0);

            // Animate Camera Position - offset
            timeline.to(camera.position, {
                x: destination.x,
                y: destination.y,
                z: destination.z,
                duration: 2.5, // Slightly slower for cinematic feel
                ease: "power2.inOut", // Smooth ease
                onUpdate: () => controlsRef.current?.update()
            }, 0);
        }
    }));

    useFrame(() => {
        if (!controlsRef.current) return;
        controlsRef.current.update();
    });

    return null;
});
