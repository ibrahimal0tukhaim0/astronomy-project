import { Canvas } from '@react-three/fiber'
import { OrbitControls, Loader, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei'
import React, { useState, Suspense, useRef, lazy, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import type { CelestialData } from './data/objects'
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
import type { OrbitControls as OrbitControlsType } from 'three-stdlib'
import * as THREE from 'three'

// Lazy load the heavy 3D scene so Home Screen loads instantly
const SimulationScene = lazy(() => import('./components/SimulationScene'));
import { CinematicHome } from './components/CinematicHome'
import { AppEnhancements } from './components/AppEnhancements'
import { AmbienceControl } from './components/AmbienceControl'
import { SplashIntro } from './components/SplashIntro'

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
        console.log("حدث خطأ بسيط في الفضاء، تم الاحتواء:", error, info);
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
    const [currentDate, setCurrentDate] = useState(new Date())
    const [hasStarted, setHasStarted] = useState(false)
    const [introFinished, setIntroFinished] = useState(false) // 🎬 Intro State
    const { t } = useTranslation()
    const controlsRef = useRef<OrbitControlsType>(null)
    const cameraControllerRef = useRef<CameraControllerHandle>(null)

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
            className="w-full bg-black relative overflow-hidden touch-none"
            dir="rtl"
            style={{ height: 'calc(var(--vh, 1vh) * 100)' }} // Mobile 100vh Fix
        >
            <AppEnhancements />

            {/* 🎬 Cinematic Splash Intro */}
            {!introFinished && (
                <SplashIntro onComplete={() => setIntroFinished(true)} />
            )}

            {/* 🎛️ Fixed Ambience HUD - Renders outside Canvas for stability */}
            {introFinished && <AmbienceControl />}
            <ErrorBoundary>
                {/* 3D Scene */}
                <Canvas
                    shadows
                    camera={{
                        // 🎥 CAMERA INTRO: Panorama Mode (Ultra Wide Max)
                        // Intro: Wide FOV (75) + Far Z (660) + High Y (92)
                        position: hasStarted ? [0, 40, 140] : [0, 92, 660],
                        fov: hasStarted ? 60 : 75,
                        near: 0.1,
                        far: 100000
                    }}
                    // 🌟 4K RENDER UPGRADE: Use full devicePixelRatio (Max 3)
                    dpr={[1, Math.min(window.devicePixelRatio, 3)]}
                    gl={{
                        // PERFORMANCE: Auto-disable Antialias on High-DPI screens (Retina/4K)
                        // At dpr > 1, pixels are so small that MSAA is redundant and costly.
                        antialias: window.devicePixelRatio < 2,
                        powerPreference: "high-performance",
                        precision: "highp", // Force high precision for gradients/shaders
                        toneMapping: THREE.ACESFilmicToneMapping,
                        toneMappingExposure: 0.8,
                        outputColorSpace: THREE.SRGBColorSpace,
                        preserveDrawingBuffer: false
                    }}
                >
                    <color attach="background" args={['#000814']} />

                    {/* Performance Optimization for iOS */}
                    <AdaptiveDpr pixelated />
                    <AdaptiveEvents />

                    <Suspense fallback={null}>
                        <SimulationScene
                            onSelect={setSelectedObject}
                            isPaused={isPaused || !hasStarted}
                            onDateChange={setCurrentDate}
                        />
                    </Suspense>

                    <CameraController
                        ref={cameraControllerRef}
                        selectedObject={selectedObject}
                        objectPosition={selectedObjectPos}
                        controlsRef={controlsRef as any}
                        startIntro={hasStarted} // Trigger intro when started
                    />

                    <OrbitControls
                        ref={controlsRef}
                        target={[0, 0, 0]}
                        enableZoom={true}
                        enablePan={true}
                        panSpeed={1.0}
                        enableDamping={true}
                        dampingFactor={0.05} // Smooth damping as requested
                        maxDistance={4000}   // Prevent getting lost
                        minDistance={20}     // Prevent crashing into planets
                        autoRotate={!hasStarted}
                        autoRotateSpeed={0.5}
                        enabled={true}      // Always enabled, controlled by CameraController
                        regress={true}
                    />

                    {/* 🧹 Memory Management & FPS Stability */}
                    <PerformanceOptimizer />

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

            {/* Main Menu Overlay (Cinematic Home) */}
            {!hasStarted && (
                <div className="absolute inset-0 z-50">
                    <CinematicHome onStart={() => setHasStarted(true)} />
                </div>
            )}

            {/* UI Layer - Only Visible After Start */}
            <div className={`transition-opacity duration-1000 ${hasStarted ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <NavigationSidebar onNavigate={handleNavigate} />

                <div className="absolute top-safe left-0 p-4 md:p-8 text-white pointer-events-none transition-opacity duration-500 rtl:right-0 rtl:left-auto mt-12 md:mt-0" style={{ marginTop: 'env(safe-area-inset-top)' }}>
                    <h1 className="text-3xl md:text-5xl font-bold font-serif tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        {t('app.title')}
                    </h1>
                    <p className="text-base md:text-lg text-blue-200 mt-2 font-light">{t('app.subtitle')}</p>
                    <div className="mt-4 md:mt-8 text-sm text-gray-500 max-w-xs">
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

                <div className="absolute bottom-safe left-safe z-50 mb-4 ml-4">
                    <button
                        onClick={() => {
                            const audio = document.getElementById('bg-music') as HTMLAudioElement;
                            if (audio.paused) {
                                audio.volume = 0.4;
                                audio.play().catch(e => console.log("Audio play failed:", e));
                            } else {
                                audio.pause();
                            }
                        }}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white/50 hover:text-white transition-colors"
                        title="Toggle Music"
                    >
                        🎵
                    </button>
                </div>

                {/* 🤖 Gemini AI Assistant */}
                <GeminiChat />

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
