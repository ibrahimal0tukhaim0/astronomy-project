import { useEffect, useState } from 'react';
import * as THREE from 'three';

// 🎥 AR Webcam Overlay (Environment Facing)
export function WebcamLayer() {
    const [videoTexture, setVideoTexture] = useState<THREE.VideoTexture | null>(null);

    useEffect(() => {
        const video = document.createElement('video');

        // Settings for AR: Rear Camera (environment), No Audio
        const constraints = {
            audio: false,
            video: {
                facingMode: 'environment', // Rear camera
                width: { ideal: 1920 },
                height: { ideal: 1080 }
            }
        };

        const startWebcam = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia(constraints);
                video.srcObject = stream;
                video.playsInline = true;
                video.autoplay = true;
                video.muted = true;
                await video.play();

                const texture = new THREE.VideoTexture(video);
                texture.colorSpace = THREE.SRGBColorSpace;
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.LinearFilter;
                texture.format = THREE.RGBAFormat;

                setVideoTexture(texture);
            } catch (err) {
                console.error("AR Start Failed:", err);
                alert("تعذر الوصول للكاميرا. يرجى التحقق من الصلاحيات.");
            }
        };

        startWebcam();

        return () => {
            // Cleanup: Stop stream tracks
            if (video.srcObject) {
                const tracks = (video.srcObject as MediaStream).getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, []);

    if (!videoTexture) return null;

    return (
        // Render a full-screen plane at the far back
        <mesh position={[0, 0, -50000]} scale={[160000, 90000, 1]}>
            {/* Scale aspect ratio adjustment might be needed depending on device. 
                For now, huge scale to cover frustum. */}
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial
                map={videoTexture}
                depthTest={false}
                depthWrite={false}
                toneMapped={false}
            />
        </mesh>
    );
}
