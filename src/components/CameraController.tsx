import { useFrame, useThree } from '@react-three/fiber'
import { useImperativeHandle, forwardRef, useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import type { CelestialData } from '../types'
import { celestialObjects } from '../data/objects'

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

    // 📌 STATE: Track locking status
    const lockedObjectId = useRef<string | null>(null);
    const currentOffset = useRef(new THREE.Vector3());
    const lastTargetPos = useRef<THREE.Vector3 | null>(null); // To track movement delta
    const { scene } = useThree();

    // 🎯 3. SMOOTH GLIDE FOCUS LOGIC (OFFSET-BASED TRACKING)
    const handleFocus = (objectId: string) => {
        const targetObj = celestialObjects.find(o => o.id === objectId);
        if (!targetObj || !controlsRef.current) return;

        // Clean prev
        timelineRef.current?.kill();

        // 1. Set Lock ID & Reset Delta Tracker
        lockedObjectId.current = objectId;
        lastTargetPos.current = null; // Will be set on first frame

        // 2. Calculate Final Desired Offset (Cinematic Angle)
        // Fixed Beauty Shot: (0.0, 0.4, 1.0) normalized
        // We removed X offset to be centered, and increased Y (0.4) to look slightly down
        // This prevents cutting through Saturn's rings (which are on X-Z plane).
        const approachVector = new THREE.Vector3(0.0, 0.4, 1.0).normalize();
        const finalDist = targetObj.science.scale * 6.0 + 25.0; // Safe distance
        const finalOffset = approachVector.multiplyScalar(finalDist);

        // 3. Initialize current offset
        const sceneObj = scene.getObjectByName(objectId);
        if (!sceneObj) return;

        const targetPos = new THREE.Vector3();
        sceneObj.getWorldPosition(targetPos);

        // Initialize tracker
        lastTargetPos.current = targetPos.clone();

        // Calculate where we are relative to it NOW
        currentOffset.current.subVectors(camera.position, targetPos);

        // 🛑 Stop Rotation/Input
        controlsRef.current.autoRotate = false;
        controlsRef.current.enabled = false;

        // Create Animation Timeline
        const tl = gsap.timeline({
            onComplete: () => {
                if (controlsRef.current) {
                    controlsRef.current.enabled = true;
                    if (selectedObject?.id === objectId) {
                        controlsRef.current.autoRotate = true;
                        controlsRef.current.autoRotateSpeed = 2.0;
                    }
                    timelineRef.current = null;
                }
            }
        });

        // Animate the Offset Vector
        tl.to(currentOffset.current, {
            x: finalOffset.x,
            y: finalOffset.y,
            z: finalOffset.z,
            duration: 2.5,
            ease: "power3.inOut"
        });

        timelineRef.current = tl;
    };

    // 🛑 4. EXIT LOGIC
    useEffect(() => {
        if (!selectedObject) {
            if (controlsRef.current) controlsRef.current.autoRotate = false;
            lockedObjectId.current = null;
            lastTargetPos.current = null;
        } else {
            // Ensure lock is in sync
            lockedObjectId.current = selectedObject.id;
        }
    }, [selectedObject]);

    // 🧹 5. DEEP CLEANUP
    useEffect(() => {
        return () => {
            timelineRef.current?.kill();
        }
    }, []);

    // 🔄 6. UPDATE LOOP (DELTA TRACKING) - PRIORITY 1000 (Run AFTER objects move)
    useFrame(() => {
        if (controlsRef.current && lockedObjectId.current) {
            const sceneObj = scene.getObjectByName(lockedObjectId.current);
            if (sceneObj) {
                const targetPos = new THREE.Vector3();
                sceneObj.getWorldPosition(targetPos);

                // A. DELTA TRACKING: Move camera by the EXACT amount the object moved
                if (lastTargetPos.current) {
                    const delta = new THREE.Vector3().subVectors(targetPos, lastTargetPos.current);

                    // Apply delta to camera (carry it along)
                    camera.position.add(delta);

                    // Update controls target to center
                    controlsRef.current.target.copy(targetPos);
                }

                // If controls disabled (flying), we also need to apply the animation offset
                if (!controlsRef.current.enabled) {
                    // During flight, `camera.position` = `active target` + `animated offset`
                    // We override the delta logic slightly here to ensure strictly smooth animation
                    // Use force-set to prevent drift
                    camera.position.copy(targetPos).add(currentOffset.current);
                }

                // Update last pos for next frame
                if (!lastTargetPos.current) lastTargetPos.current = new THREE.Vector3();
                lastTargetPos.current.copy(targetPos);
            }
        }

        if (controlsRef.current) {
            controlsRef.current.update();
        }
    }, 1000); // ⚡ PRIORITY HI: Runs after objects update to prevent 1-frame jitter

    return null;
});
