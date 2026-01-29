import { useRef, useLayoutEffect } from 'react'
import { useThree } from '@react-three/fiber'
import gsap from 'gsap'
import type { OrbitControls as OrbitControlsType } from 'three-stdlib'

interface CameraIntroProps {
    onComplete: () => void
    controlsRef: React.RefObject<OrbitControlsType | null>
}

export function CameraIntro({ onComplete, controlsRef }: CameraIntroProps) {
    const { camera } = useThree()
    const timeline = useRef<gsap.core.Timeline | null>(null)

    useLayoutEffect(() => {
        // Initial setup - Disable controls
        if (controlsRef.current) {
            controlsRef.current.enabled = false
            controlsRef.current.target.set(0, 0, 0)
        }

        // Start Position (Far away)
        const startPos = { x: 0, y: 150, z: 400 } // Adjusted scale for SoumyaEXE sizes
        // End Position (Cinematic framing)
        const endPos = { x: 0, y: 60, z: 180 }

        camera.position.set(startPos.x, startPos.y, startPos.z)
        camera.lookAt(0, 0, 0)

        // Create GSAP Timeline
        timeline.current = gsap.timeline({
            onComplete: () => {
                // Re-enable controls
                if (controlsRef.current) {
                    controlsRef.current.enabled = true
                }
                onComplete()
            }
        })

        timeline.current.to(camera.position, {
            x: endPos.x,
            y: endPos.y,
            z: endPos.z,
            duration: 3.5,
            ease: "power2.inOut",
            onUpdate: () => {
                camera.lookAt(0, 0, 0)
            }
        })

        return () => {
            timeline.current?.kill()
        }
    }, [camera, onComplete, controlsRef])

    return null
}
