import { useFrame, useThree } from '@react-three/fiber'
import { useImperativeHandle, forwardRef, useEffect, useRef } from 'react'
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
    startIntro: boolean;
}

export interface CameraControllerHandle {
    flyTo: (objectId: string) => void;
}

export const CameraController = forwardRef<CameraControllerHandle, CameraControllerProps>(({
    selectedObject,
    controlsRef,
    startIntro
}, ref) => {
    const { camera } = useThree();
    const timelineRef = useRef<gsap.core.Timeline | null>(null);
    const hasIntroRun = useRef(false);
    const isFlying = useRef(false); // 🟢 Moved to top

    // 🎬 1. CINEMATIC INTRO ANIMATION (Fly-in)
    useEffect(() => {
        if (startIntro && !hasIntroRun.current && controlsRef.current) {
            hasIntroRun.current = true;

            // Clean prev animations
            timelineRef.current?.kill();

            // Set Initial State (Far away)
            const startPos = new THREE.Vector3(0, 300, 600);
            const targetPos = new THREE.Vector3(0, 40, 140); // Standard view

            camera.position.copy(startPos);
            controlsRef.current.target.set(0, 0, 0);
            controlsRef.current.enabled = false; // Disable user control during intro

            // Create Timeline
            const tl = gsap.timeline({
                onComplete: () => {
                    if (controlsRef.current) {
                        controlsRef.current.enabled = true;
                    }
                    // Immediate GC hint
                    timelineRef.current = null;
                }
            });

            // Fly-in Motion
            tl.to(camera.position, {
                x: targetPos.x,
                y: targetPos.y,
                z: targetPos.z,
                duration: 3.5,
                ease: "power3.inOut" // Cinematic ease
            });

            timelineRef.current = tl;
        }
    }, [startIntro, camera, controlsRef]);

    // 🔭 2. EXPOSE public flyTo API for Sidebar
    useImperativeHandle(ref, () => ({
        flyTo: (objectId: string) => {
            if (!controlsRef.current) return;
            handleFocus(objectId);
        }
    }));

    // 🎯 3. SMOOTH GLIDE FOCUS LOGIC
    const handleFocus = (objectId: string) => {
        const targetObj = celestialObjects.find(o => o.id === objectId);
        if (!targetObj || !controlsRef.current) return;

        // Clean prev
        timelineRef.current?.kill();

        // Calculate dynamic position
        const rawPos = getObjectPosition(objectId as CelestialObjectId, new Date());
        const targetCenter = new THREE.Vector3(...rawPos);

        // Smart Offset: Determine optimal distance based on object scale
        // "Scale * 4.0" is a good cinematic distance
        const dist = targetObj.science.scale * 4.0 + 5.0; // +5 buffer

        // Calculate new Camera Position (maintain current angle relative to object if possible, or fly in)
        const currentOffset = new THREE.Vector3().subVectors(camera.position, controlsRef.current.target).normalize();

        // Cinematic Destination: Position camera at optimal distance, slightly elevated
        const destination = targetCenter.clone().add(currentOffset.multiplyScalar(dist));

        // 🚀 ANIMATION START
        const duration = 2.5; // Smooth 2.5s travel
        controlsRef.current.enabled = false; // Lock controls

        // Kill existing
        timelineRef.current?.kill();
        const tl = gsap.timeline({
            onComplete: () => {
                if (controlsRef.current) {
                    controlsRef.current.enabled = true; // Unlock
                    // START ORBITING AROUND TARGET
                    // We can set autoRotate on controls, but we need to ensure target is kept updated.
                    controlsRef.current.autoRotate = true;
                    controlsRef.current.autoRotateSpeed = 1.0; // Slow orbit
                }
                isFlying.current = false;
            }
        });

        isFlying.current = true;

        // Animate Cam Position
        tl.to(camera.position, {
            x: destination.x,
            y: destination.y,
            z: destination.z,
            duration: duration,
            ease: "power2.inOut",
            onUpdate: () => {
                // While flying, manual update might be needed if controls are disabled?
                // Actually controls.update() is unneeded if disabled.
                // But let's just leave empty or simple log for now.
            }
        }, 0);

        // Animate Control Target (LookAt)
        tl.to(controlsRef.current.target, {
            x: targetCenter.x,
            y: targetCenter.y,
            z: targetCenter.z,
            duration: duration, // Sync with position
            ease: "power2.inOut"
        }, 0);

        timelineRef.current = tl;
    }

    // 🔄 4. AUTO-TRACKING LOOP
    // Trigger flyTo when prop changes
    useEffect(() => {
        if (selectedObject) {
            handleFocus(selectedObject.id);
        } else {
            // Reset? Or stay? Maybe stop autoRotate
            if (controlsRef.current) {
                controlsRef.current.autoRotate = false;
            }
        }
    }, [selectedObject]);

    // 🧹 5. CLEANUP ON UNMOUNT
    useEffect(() => {
        return () => {
            if (timelineRef.current) {
                timelineRef.current.kill();
                timelineRef.current = null;
            }
        };
    }, []);

    useFrame(() => {
        if (!controlsRef.current) return;

        // If we are locked on an object (and not currently mid-flight transition),
        // we should update the target to the object's NEW spherical position.
        // This ensures resizing/orbiting works around the MOVING planet.
        if (selectedObject && !isFlying.current) {
            const rawPos = getObjectPosition(selectedObject.id as CelestialObjectId, new Date());
            // We smoothly lerp the target to the new position to avoid jitter
            controlsRef.current.target.lerp(new THREE.Vector3(...rawPos), 0.1);
        }

        // Always update controls if damping is enabled
        controlsRef.current.update();
    });

    return null; // Logic only component
});
