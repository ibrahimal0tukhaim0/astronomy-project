import { Canvas } from '@react-three/fiber'
import { OrbitControls, Loader, AdaptiveDpr, AdaptiveEvents, DeviceOrientationControls } from '@react-three/drei'
import React, { useState, Suspense, useRef, lazy, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { CelestialData } from './types'
import { InfoPanel } from './components/InfoPanel'
import { Layout } from './components/Layout'
import { TimeControls } from './components/TimeControls'
import { CameraController } from './components/CameraController'
import type { CameraControllerHandle } from './components/CameraController'
import { NavigationSidebar } from './components/NavigationSidebar'
import { GeminiChat } from './components/GeminiChat'
import { getObjectPosition } from './utils/astronomy'
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { PerformanceOptimizer } from './components/PerformanceOptimizer';
import { SmartRenderingManager } from './components/SmartRenderingManager';
import type { OrbitControls as OrbitControlsType } from 'three-stdlib'
import * as THREE from 'three'
import { Music } from 'lucide-react';

// Lazy load the heavy 3D scene so Home Screen loads instantly
const SimulationScene = lazy(() => import('./components/SimulationScene'));
import { CinematicHome } from './components/CinematicHome'
import { AppEnhancements } from './components/AppEnhancements'
import { AmbienceControl } from './components/AmbienceControl'
import { SplashIntro } from './components/SplashIntro'
import { WebcamLayer } from './components/WebcamLayer' // 📷 Import Webcam Layer

// 🛡️ User Requested: Error Boundary to prevent crashes
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(_: Error) {
        return { hasError: true };
    }

    componentDidCatch(error: Error, info: React.ErrorInfo) {
        console.error("🔥 APP CRASH DETECTED:", error);
        console.error("Stack Trace:", info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ background: 'black', color: 'white', padding: 20, textAlign: 'center', direction: 'rtl', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <h2>حدث خطأ بسيط في الفضاء ⚠️</h2>
                    <p>نحاول استعادة الاتصال...</p>
                    <button
                        onClick={() => this.setState({ hasError: false })}
                        style={{ background: 'orange', padding: '10px 20px', borderRadius: 5, color: 'black', fontWeight: 'bold', marginTop: 10, cursor: 'pointer' }}
                    >
                        إعادة المحاولة
                    </button>
                    <p style={{ fontSize: '0.8rem', color: '#666', marginTop: 20 }}>تم احتواء الخطأ بنجاح.</p>
                </div>
            );
        }
        return this.props.children;
    }
}

function AppContent() {
    const [selectedObject, setSelectedObject] = useState<CelestialData | null>(null)
    const [isPaused, setIsPaused] = useState(false)
    const [isARMode, setIsARMode] = useState(false) // 🕶️ AR Mode State
    const [currentDate, setCurrentDate] = useState(new Date())
    const [hasStarted, setHasStarted] = useState(false)
    const [introFinished, setIntroFinished] = useState(false) // 🎬 Intro State
    const [isMarathonMode, setIsMarathonMode] = useState(false) // 🏃‍♂️ Marathon Mode
    const { t } = useTranslation()
    const controlsRef = useRef<OrbitControlsType>(null)
    const cameraControllerRef = useRef<CameraControllerHandle>(null)

    // 🎥 Cinematic Camera Move for Marathon Mode
    useEffect(() => {
        if (isMarathonMode && controlsRef.current) {
            // Side Angle: Elevated Z position looking at the line (X-axis)
            // Planets are at [R, 0, 0].
            // View from [300, 50, 500] looks at the "middle" of the line roughly.
            // Or [0, 50, 600] looks at Sun but sees the line extending?
            // "Show planets extended on horizon".
            // Side view: x=mid, z=distance.
            const camera = controlsRef.current.object as THREE.PerspectiveCamera;

            // GSAP animation for smooth transition
            import('gsap').then(({ default: gsap }) => {
                gsap.to(camera.position, {
                    x: 300,
                    y: 60,
                    z: 500,
                    duration: 2.5,
                    ease: "power3.inOut"
                });
                gsap.to(controlsRef.current!.target, {
                    x: 300,
                    y: 0,
                    z: 0,
                    duration: 2.5,
                    ease: "power3.inOut"
                });
            });
        }
    }, [isMarathonMode]);

    const selectedObjectPos = selectedObject
        ? new THREE.Vector3(...getObjectPosition(selectedObject.id, currentDate))
        : null;

    const handleNavigate = (objectId: string) => {
        if (cameraControllerRef.current) {
            cameraControllerRef.current.flyTo(objectId);
        }

        import('./data/objects').then(({ celestialObjects }) => {
            const obj = celestialObjects.find(o => o.id === objectId);
            if (obj) setSelectedObject(obj);
        });
    };

    // 📱 MOBILE OPTIMIZATION: Immediate Resize Handler
    // Ensures Camera Aspect Ratio & Renderer size update accurately on rotation
    useEffect(() => {
        const handleResize = () => {
            // Force layout recalculation for mobile browser bars (100vh fix)
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);

        // Init
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('orientationchange', handleResize);
        };
    }, []);

    return (
        // touch-none prevents "pull-to-refresh" on mobile which ruins the 3D experience
        <div
            className={`w-full relative overflow-hidden touch-none ${isARMode ? 'bg-transparent' : 'bg-black'}`}
            dir="rtl"
            style={{
                height: 'calc(var(--vh, 1vh) * 100)',
                zIndex: 2, // Ensure App content sits ABOVE the fixed video (Z:1)
                position: 'relative'
            }}
        >
            {/* 🔮 Visual Enhancements & Logic Layer */}
            <AppEnhancements currentDate={currentDate} />

            {/* 🎥 AR LAYER: HTML Video Background (Outside Canvas) */}
            {isARMode && <WebcamLayer />}

            {/* 🎬 Cinematic Splash Intro */}
            {!introFinished && (
                <SplashIntro onComplete={() => setIntroFinished(true)} />
            )}

            {/* 🎛️ Fixed Ambience HUD - Renders outside Canvas for stability */}
            {introFinished && <AmbienceControl />}
            {introFinished && (
                <ErrorBoundary>
                    {/* 3D Scene */}
                    <Canvas
                        shadows
                        camera={{
                            // 🎥 CAMERA INTRO: Responsive FOV for Mobile/Desktop
                            position: hasStarted ? [0, 400, 900] : [0, 2000, 3500],
                            fov: hasStarted
                                ? (window.innerWidth < 768 ? 75 : 60)
                                : (window.innerWidth < 768 ? 90 : 75),
                            near: 0.1,
                            far: 20000 // ⚡ Performance: Reduced Far Clip (User Request: 20k)
                        }}
                        // 🌟 4K RENDER UPGRADE: Optimized Pixel Ratio (User Request: 0.85 Factor)
                        // Scales resolution to 85% of native, saving GPU power while looking identical on Retina
                        dpr={[0.85, Math.min(window.devicePixelRatio, 2) * 0.85]}
                        gl={{
                            // PERFORMANCE: Auto-disable Antialias on High-DPI screens
                            antialias: window.devicePixelRatio < 2,
                            powerPreference: "high-performance",
                            precision: "highp", // Force high precision for gradients/shaders
                            toneMapping: THREE.ACESFilmicToneMapping,
                            toneMappingExposure: 0.8,
                            outputColorSpace: THREE.SRGBColorSpace,
                            preserveDrawingBuffer: false,
                            alpha: true, // ✨ Allow Transparent Background for AR
                            logarithmicDepthBuffer: true // 📐 Fixes Z-fighting for distant stars/backgrounds
                        }}
                    >
                        {/* In AR Mode, we want transparent background so VideoTexture (or DOM) shows through */}
                        {/* Background Color handles regular mode. In AR mode, it's transparent. */}
                        {!isARMode && <color attach="background" args={['#000814']} />}

                        {/* Performance Optimization for iOS */}
                        <AdaptiveDpr pixelated />
                        <AdaptiveEvents />

                        <Suspense fallback={null}>
                            <SimulationScene
                                onSelect={setSelectedObject}
                                isPaused={isPaused || !hasStarted}
                                onDateChange={setCurrentDate}
                                isARMode={isARMode} // 🎥 AR Pass-through
                                isMarathonMode={isMarathonMode}
                            />
                        </Suspense>

                        {/* 🕹️ CONTROLS SWITCHING */}
                        {!isARMode ? (
                            <>
                                <CameraController
                                    ref={cameraControllerRef}
                                    selectedObject={selectedObject}
                                    objectPosition={selectedObjectPos}
                                    controlsRef={controlsRef as any}
                                    startIntro={hasStarted}
                                />
                                <OrbitControls
                                    ref={controlsRef}
                                    target={[0, 0, 0]}
                                    enableZoom={true}
                                    zoomSpeed={1.2} // 🔍 Optimized Pinch-to-Zoom Speed
                                    zoomToCursor={true} // 🔍 Pro Feature: Zoom to wherever cursor is
                                    enablePan={true} // ✋ Allow panning (2 fingers on mobile)
                                    panSpeed={1.0} // Screen-space panning
                                    enableDamping={true}
                                    dampingFactor={0.05} // 🌊 Smooth inertia (Requested Feature)
                                    minDistance={60} // 🛡️ Collision Avoidance (Sun Radius is 30)
                                    maxDistance={14000} // ⚡ Performance: Max Distance 14000 (User Request)
                                    autoRotate={!hasStarted}
                                    autoRotateSpeed={0.5}
                                    // 📱 Mobile Optimization: Slower rotation for touch precision (0.5), faster for mouse (0.8)
                                    rotateSpeed={window.matchMedia("(pointer: coarse)").matches ? 0.5 : 0.8}
                                    enabled={true}
                                />
                            </>
                        ) : (
                            /* 📱 GYROSCOPE (MOTION) CONTROLS FOR AR */
                            <DeviceOrientationControls />
                        )}

                        {/* 🧹 Memory Management & FPS Stability */}
                        <PerformanceOptimizer />
                        <SmartRenderingManager />

                        {/* ✨ Post-Processing: Cinematic Bloom (Glow) */}
                        <EffectComposer>
                            <Bloom
                                luminanceThreshold={0.2}
                                mipmapBlur
                                intensity={1.5}
                                radius={0.6}
                            />
                        </EffectComposer>
                    </Canvas>
                </ErrorBoundary>
            )}
            {/* Main Menu Overlay (Cinematic Home) - Only after Intro finishes */}
            {introFinished && !hasStarted && (
                <div className="absolute inset-0 z-50">
                    <CinematicHome onStart={() => setHasStarted(true)} />
                </div>
            )}

            {/* UI Layer - Only Visible After Start */}
            <div className={`transition-opacity duration-1000 ${hasStarted ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <NavigationSidebar onNavigate={handleNavigate} isHidden={!!selectedObject} />

                <div className="absolute top-safe right-0 p-6 md:p-8 text-white pointer-events-none transition-opacity duration-500 z-10" style={{ marginTop: 'env(safe-area-inset-top)' }}>
                    <div className="text-sm md:text-base text-gray-300/80 font-light max-w-xs text-right" style={{ fontFamily: '"Cairo", sans-serif' }}>
                        <p>{t('app.instruction')}</p>
                    </div>
                </div>

                <TimeControls
                    isPaused={isPaused}
                    currentDate={currentDate}
                    onPauseToggle={() => setIsPaused(!isPaused)}
                />

                <InfoPanel
                    selectedObject={selectedObject}
                    onClose={() => setSelectedObject(null)}
                />

                <div className="absolute bottom-safe left-1/2 -translate-x-1/2 text-white/30 text-xs font-serif pointer-events-none z-10 mb-2">
                    {t('app.credits')}
                </div>

                {/* 🎵 Background Music */}
                <audio id="bg-music" loop>
                    <source src={`${import.meta.env.BASE_URL}textures/interstellar.mp3`} type="audio/mpeg" />
                </audio>

                <div className="absolute bottom-safe left-safe z-50 mb-4 ml-4 flex flex-row gap-[15px] items-end">
                    <button
                        onClick={() => setIsARMode(!isARMode)}
                        className={`p-3 rounded-full transition-all backdrop-blur-sm border border-white/10 ${isARMode ? 'bg-red-500/80 text-white' : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'}`}
                        title="AR Mode"
                    >
                        {/* Simple Icon for AR (Eye/Camera) */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                    </button>

                    <button
                        onClick={() => setIsMarathonMode(!isMarathonMode)}
                        className={`p-3 rounded-full transition-all backdrop-blur-sm border border-white/10 ${isMarathonMode ? 'bg-blue-500/80 text-white' : 'bg-white/10 hover:bg-white/20 text-white/70 hover:text-white'}`}
                        title="Marathon Mode"
                    >
                        {/* Icon: Alignment (Straight Line) */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="2" x2="12" y2="22" strokeWidth="3" />
                            <circle cx="12" cy="5" r="2" fill="currentColor" />
                            <circle cx="12" cy="12" r="2" fill="currentColor" />
                            <circle cx="12" cy="19" r="2" fill="currentColor" />
                        </svg>
                    </button>

                    {/* Vertical Stack: Robot on TOP of Music */}
                    <div className="flex flex-col items-center gap-3">
                        {/* 🤖 Gemini AI Assistant (Now embedded in layout) */}
                        <GeminiChat />

                        <button
                            onClick={() => {
                                const audio = document.getElementById('bg-music') as HTMLAudioElement;
                                if (audio.paused) {
                                    audio.volume = 0.4;
                                    audio.play().catch(() => { });
                                } else {
                                    audio.pause();
                                }
                            }}
                            className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white/70 hover:text-white transition-all backdrop-blur-sm border border-white/10"
                            title="Toggle Music"
                        >
                            <Music className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Removed fixed GeminiChat from here */}

                <Loader />
            </div>
        </div>
    )
}

function App() {
    return (
        <Layout>
            <ErrorBoundary>
                <AppContent />
            </ErrorBoundary>
        </Layout>
    )
}

export default App
