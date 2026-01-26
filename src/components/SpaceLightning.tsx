import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';

// 🌩️ AUDIO ASSETS ARRAY
// A mix of local and reliable CDN assets for variety
const THUNDER_SOUNDS = [
    `${import.meta.env.BASE_URL}sounds/thunder.ogg`,
    'https://actions.google.com/sounds/v1/weather/thunder_heavy.ogg', // Heavy crack
    'https://actions.google.com/sounds/v1/weather/thunder_rumble.ogg' // Deep rumble
];

interface LightningBolt {
    id: number;
    position: THREE.Vector3;
    rotation: THREE.Euler;
    scale: THREE.Vector3;
    life: number;
    opacity: number;
}

export function SpaceLightning() {
    // ⚡ REALISTIC TREE LIGHTNING TEXTURE
    const texture = useTexture(`${import.meta.env.BASE_URL}textures/lightning_branch.png`);
    const [bolts, setBolts] = useState<LightningBolt[]>([]);
    const nextFlashTime = useRef(0);

    // 🔊 AUDIO ENGINE STATE (Web Audio API)
    const [muted, setMuted] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const audioCtxRef = useRef<AudioContext | null>(null);
    const buffersRef = useRef<AudioBuffer[]>([]);
    const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

    // 1. INITIALIZE AUDIO ENGINE & PRELOAD
    useEffect(() => {
        // Initialize Context
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContext() as AudioContext;
        audioCtxRef.current = ctx;

        // Preload All Sounds in Parallel (M4 Optimized)
        const loadSound = async (url: string) => {
            try {
                const response = await fetch(url);
                const arrayBuffer = await response.arrayBuffer();
                // Decode asynchronously
                const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
                buffersRef.current.push(audioBuffer);
            } catch (e) {
                console.warn("Audio Asset Failed:", url);
            }
        };

        // Fire all loads
        THUNDER_SOUNDS.forEach(loadSound);

        // Interaction Unlocker
        const unlockAudio = () => {
            // Resume context if suspended (Browser policy)
            if (ctx.state === 'suspended') {
                ctx.resume().then(() => setHasInteracted(true));
            } else {
                setHasInteracted(true);
            }

            // Cleanup listeners
            window.removeEventListener('click', unlockAudio);
            window.removeEventListener('touchstart', unlockAudio);
            window.removeEventListener('keydown', unlockAudio);
        };

        window.addEventListener('click', unlockAudio);
        window.addEventListener('touchstart', unlockAudio);
        window.addEventListener('keydown', unlockAudio);

        return () => {
            if (ctx) ctx.close();
            window.removeEventListener('click', unlockAudio);
            window.removeEventListener('touchstart', unlockAudio);
            window.removeEventListener('keydown', unlockAudio);
            // Cleanup pending audio triggers on unmount
            timeoutRefs.current.forEach(t => clearTimeout(t));
        };
    }, []);

    // ⚡ SPATIAL AUDIO TRIGGER
    const triggerThunder = (positionX: number) => {
        if (muted || !hasInteracted || !audioCtxRef.current || buffersRef.current.length === 0) return;

        const ctx = audioCtxRef.current;
        const buffer = buffersRef.current[Math.floor(Math.random() * buffersRef.current.length)];
        // Distance Delay logic
        const delay = 200 + Math.random() * 800;

        const timeoutId = setTimeout(() => {
            // Guard: Context might be closed
            if (ctx.state === 'closed') return;

            const source = ctx.createBufferSource();
            source.buffer = buffer;
            source.playbackRate.value = 0.8 + Math.random() * 0.4;

            const gainNode = ctx.createGain();
            gainNode.gain.setValueAtTime(0, ctx.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 0.05);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + buffer.duration);

            const panner = ctx.createStereoPanner();
            const panValue = Math.max(-1, Math.min(1, positionX / 350));
            panner.pan.setValueAtTime(panValue, ctx.currentTime);

            source.connect(gainNode);
            gainNode.connect(panner);
            panner.connect(ctx.destination);

            source.start();
        }, delay);

        timeoutRefs.current.push(timeoutId);
    };

    useFrame((state) => {
        const time = state.clock.elapsedTime;

        // 🕒 STORM CYCLE LOGIC
        const CYCLE_DURATION = 20.0;
        const STORM_DURATION = 5.0;
        const cycleTime = time % CYCLE_DURATION;
        const isStormActive = cycleTime > (CYCLE_DURATION - STORM_DURATION);

        // 1. SPAWN LOGIC - SHOW REAL IMAGE
        if (isStormActive && time > nextFlashTime.current) {
            // Lower frequency, higher impact (1-2 big ones per storm)
            if (Math.random() > 0.60 && bolts.length < 5) {
                // Background Position (DEEP SPACE)
                // Pushed way back to 4000-5000 units so it's behind everything
                const radius = 4500;
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);

                const x = radius * Math.sin(phi) * Math.cos(theta);
                const y = radius * Math.sin(phi) * Math.sin(theta);
                const z = radius * Math.cos(phi);

                const position = new THREE.Vector3(x, y, z);

                // Massive Scale for Background Visibility
                // Needs to be huge to be seen from that far
                const size = 3000 + Math.random() * 3000;
                const scale = new THREE.Vector3(size, size, 1);

                const newBolt: LightningBolt = {
                    id: Math.random(),
                    position: position,
                    rotation: new THREE.Euler(0, 0, Math.random() * Math.PI * 2), // Random rotation
                    scale: scale,
                    life: 1.0,
                    opacity: 0,
                };

                setBolts(prev => [...prev, newBolt]);
                triggerThunder(x);

                // Slower re-trigger to appreciate the image
                nextFlashTime.current = time + 0.5 + Math.random() * 1.5;
            }
        }
    });

    const removeBolt = (id: number) => {
        setBolts(prev => prev.filter(b => b.id !== id));
    };

    return (
        <group>
            {/* 🎛️ MUTE BUTTON UI */}
            <Html fullscreen style={{ pointerEvents: 'none', zIndex: 1000 }}>
                {/* ... existing UI ... */}
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    pointerEvents: 'auto',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    <button
                        onClick={() => {
                            if (audioCtxRef.current?.state === 'suspended') {
                                audioCtxRef.current.resume();
                            }
                            setHasInteracted(true);
                            setMuted(!muted);
                        }}
                        style={{
                            background: 'rgba(0, 0, 0, 0.6)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            borderRadius: '50px',
                            color: 'white',
                            padding: '10px 16px',
                            cursor: 'pointer',
                            fontSize: '16px',
                            backdropFilter: 'blur(10px)',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                            fontFamily: 'system-ui, sans-serif'
                        }}
                    >
                        <span>{muted ? "🔇" : "🔊"}</span>
                        <span style={{ fontSize: '12px', opacity: 0.8, fontWeight: 500 }}>
                            {muted ? "SOUND OFF" : "SOUND ON (3D)"}
                        </span>
                    </button>
                    {!hasInteracted && !muted && (
                        <div style={{
                            color: '#FFCC00',
                            fontSize: '12px',
                            textShadow: '0 0 5px black',
                            animation: 'bounce 1s infinite'
                        }}>
                            Tap to Enable Audio
                        </div>
                    )}
                </div>
            </Html>

            {bolts.map(bolt => (
                <Bolt key={bolt.id} data={bolt} texture={texture} onComplete={() => removeBolt(bolt.id)} />
            ))}
        </group>
    );
}

// ⚡ OPTIMIZED BOLT COMPONENT (No State Re-renders)
function Bolt({ data, texture, onComplete }: { data: LightningBolt, texture: THREE.Texture, onComplete: () => void }) {
    const materialRef = useRef<THREE.MeshBasicMaterial>(null);
    const lifeRef = useRef(1.0); // Start life

    useFrame((_, delta) => {
        if (!materialRef.current) return;

        // Decrement life directly on ref
        lifeRef.current -= delta * 3.0;

        if (lifeRef.current <= 0) {
            onComplete();
            return;
        }

        // Calculate opacity directly
        let opacity = Math.sin(lifeRef.current * 20) * 0.5 + 0.5;
        opacity *= lifeRef.current;

        // Apply directly to material uniform WITHOUT triggering React render
        materialRef.current.opacity = opacity;
    });

    return (
        <mesh
            position={data.position}
            rotation={data.rotation}
            scale={data.scale}
        >
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial
                ref={materialRef}
                map={texture}
                transparent={true}
                opacity={0} // Controlled by ref
                blending={THREE.AdditiveBlending}
                side={THREE.DoubleSide}
                depthWrite={false}
                toneMapped={false}
                color={new THREE.Color("#88ccff").multiplyScalar(2)}
            />
        </mesh>
    );
}

// Global Style for Animation
const style = document.createElement('style');
style.innerHTML = `
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-5px); }
  }
`;
document.head.appendChild(style);
