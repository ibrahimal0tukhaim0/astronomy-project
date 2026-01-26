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

        // If we are far, pick a nice angle. If close, preserve angle.
        if (currentOffset.lengthSq() < 0.1) currentOffset.set(0, 0.5, 1).normalize();

        const newCamPos = targetCenter.clone().add(currentOffset.multiplyScalar(dist));

        // Create M4 Optimized Timeline
        const tl = gsap.timeline({
            onUpdate: () => controlsRef.current?.update(),
            onComplete: () => {
                timelineRef.current = null; // Cleanup for GC
            }
        });

        // A. Pan Focus Point (Smoothly)
        tl.to(controlsRef.current.target, {
            x: targetCenter.x,
            y: targetCenter.y,
            z: targetCenter.z,
            duration: 2.0,
            ease: "power2.inOut"
        }, 0);

        // B. Glide Camera to new distance
        tl.to(camera.position, {
            x: newCamPos.x,
            y: newCamPos.y,
            z: newCamPos.z,
            duration: 2.5,
            ease: "power2.inOut" // Soft braking
        }, 0);

        // C. Slight Rotation for "Cinematic Feel"
        // Adjust the UP vector slightly if needed, but OrbitControls handles this mostly.

        timelineRef.current = tl;
    };

    // 🧹 4. DEEP CLEANUP (Strict Disposal)
    useEffect(() => {
        return () => {
            if (timelineRef.current) {
                timelineRef.current.kill();
                timelineRef.current = null;
            }
        }
    }, []);

    // 🔄 5. UPDATE LOOP
    useFrame(() => {
        if (controlsRef.current) {
            // Apply heavy camping if requested? (OrbitControls internal damping does this)
            controlsRef.current.update();
        }
    });

    return null;
});
