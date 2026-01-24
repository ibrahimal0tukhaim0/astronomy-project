import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { useState, Suspense, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import type { CelestialData } from './data/objects'
import { InfoPanel } from './components/InfoPanel'
import { Layout } from './components/Layout'
import { ErrorBoundary } from './components/ErrorBoundary'
import { TimeControls } from './components/TimeControls'
import { CameraController } from './components/CameraController'
import type { CameraControllerHandle } from './components/CameraController'
import { NavigationSidebar } from './components/NavigationSidebar'
import { GeminiChat } from './components/GeminiChat'
import { getObjectPosition } from './utils/astronomy'
import type { OrbitControls as OrbitControlsType } from 'three-stdlib'
import * as THREE from 'three'

// Direct import for debugging (Default import)
import SimulationScene from './components/SimulationScene'

console.log("App.tsx module loaded");

function AppContent() {
    console.log("AppContent component rendering");
    const [selectedObject, setSelectedObject] = useState<CelestialData | null>(null)
    const [isPaused, setIsPaused] = useState(false)
    const [currentDate, setCurrentDate] = useState(new Date())
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

    return (
        <div className="w-full h-screen bg-black relative overflow-hidden touch-none" dir="rtl">
            <ErrorBoundary>
                <Canvas
                    shadows
                    camera={{ position: [0, 40, 140], fov: 60, near: 0.1, far: 6000 }}
                    dpr={[1, 1.25]}
                    gl={{
                        antialias: false,
                        powerPreference: "low-power",
                        toneMapping: THREE.ReinhardToneMapping, // Better highlight compression
                        toneMappingExposure: 0.5, // Reduced exposure to prevent burnout
                        outputColorSpace: THREE.SRGBColorSpace
                    }}
                    onCreated={() => console.log("Canvas created")}
                >
                    <color attach="background" args={['#000814']} />

                    <Suspense fallback={null}>
                        <SimulationScene
                            onSelect={setSelectedObject}
                            isPaused={isPaused}
                            onDateChange={setCurrentDate}
                        />
                    </Suspense>

                    <CameraController
                        ref={cameraControllerRef}
                        selectedObject={selectedObject}
                        objectPosition={selectedObjectPos}
                        controlsRef={controlsRef as any}
                    />



                    <OrbitControls
                        ref={controlsRef}
                        target={[0, 0, 0]}
                        enableZoom={true}
                        enablePan={true}
                        panSpeed={1.0}
                        enableDamping={true}
                        dampingFactor={0.05}
                        maxDistance={2000}
                        minDistance={10}
                        autoRotate={false}
                        autoRotateSpeed={0.3}
                    />
                </Canvas>
            </ErrorBoundary>

            <NavigationSidebar onNavigate={handleNavigate} />

            <div className={`absolute top-0 left-0 p-4 md:p-8 text-white pointer-events-none transition-opacity duration-500 rtl:right-0 rtl:left-auto ${selectedObject ? 'opacity-0 md:opacity-100' : 'opacity-100'}`}>
                <h1 className="text-3xl md:text-5xl font-bold font-serif tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    {t('app.title')}
                </h1>
                <p className="text-base md:text-lg text-blue-200 mt-2 font-light">{t('app.subtitle')}</p>
                <div className="mt-4 md:mt-8 text-sm text-gray-500 max-w-xs">
                    <p>{t('app.instruction')}</p>
                    <div className="mt-4 flex gap-2 text-xs">
                        <span className="px-2 py-1 bg-white/10 rounded">{t('app.controls.zoom')}</span>
                        <span className="px-2 py-1 bg-white/10 rounded">{t('app.controls.rotate')}</span>
                    </div>
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

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-white/30 text-xs font-serif pointer-events-none z-10">
                {t('app.credits')}
            </div>

            {/* 🎵 Background Music (Interstellar Theme) */}
            <audio id="bg-music" loop>
                <source src="/textures/interstellar.mp3" type="audio/mpeg" />
            </audio>

            <div className="absolute bottom-4 left-4 z-50">
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

        </div>
    )
}

function App() {
    console.log("App root component rendering");
    return (
        <Layout>
            <ErrorBoundary>
                <AppContent />
            </ErrorBoundary>
        </Layout>
    )
}

export default App
