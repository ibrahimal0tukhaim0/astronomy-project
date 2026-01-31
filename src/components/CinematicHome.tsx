import { useEffect, useState, useRef, memo } from 'react';
import { gsap } from 'gsap';
import { texturePreloader } from '../utils/texturePreloader';
import appLogoBg from '../assets/app_logo_bg.jpg';



// ═══════════════════════════════════════════════════════════
// CINEMATIC HOME SCREEN - V7 (THE ORBITAL VIEW 🌍)
// ═══════════════════════════════════════════════════════════

interface CinematicHomeProps {
    onStart: () => void;
}

function CinematicHomeComponent({ onStart }: CinematicHomeProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // 🎯 Use shared preloader (already started by SplashIntro)
        // If preloading already complete, immediately ready
        if (texturePreloader.isComplete()) {
            setProgress(100);
            setTimeout(() => setIsLoaded(true), 500);
            return;
        }

        // Subscribe to progress updates from the shared preloader
        const unsubscribe = texturePreloader.onProgress((p) => {
            setProgress(p);
            if (p >= 100) {
                setTimeout(() => setIsLoaded(true), 500);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleStartClick = () => {
        if (!containerRef.current) return;

        // Cinematic "Warp" Effect on Start
        gsap.to('.orbital-planet', {
            y: 500,
            scale: 2,
            duration: 1.5,
            ease: "power3.in"
        });

        gsap.to('.hero-text-container', {
            opacity: 0,
            y: -50,
            duration: 1
        });

        gsap.to(containerRef.current, {
            opacity: 0,
            duration: 1.5,
            delay: 0.5,
            onComplete: onStart
        });
    };

    return (
        <div
            ref={containerRef}
            className="home-screen relative w-full h-screen overflow-hidden flex flex-col justify-center items-center text-white bg-transparent pointer-events-auto"
            dir="rtl"
        >
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@200;400;900&family=Amiri:wght@400;700&display=swap');
                
                .home-screen { font-family: 'Cairo', sans-serif; }

                /* Logo in Top Right Corner */
                .hero-text-container {
                    position: absolute;
                    top: 25px;
                    right: 25px;
                    z-index: 10;
                    text-align: right;
                }

                .hero-title {
                    font-family: 'Amiri', serif;
                    font-size: 1.6rem;
                    font-weight: 400;
                    letter-spacing: 2px;
                    color: white;
                    text-shadow: 0 0 15px rgba(0, 150, 255, 0.4);
                    margin: 0;
                    background: linear-gradient(to bottom, #fff, #aaccff);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .hero-subtitle {
                    font-size: 0.8rem;
                    font-weight: 400;
                    color: rgba(255,255,255,0.5);
                    letter-spacing: 2px;
                    margin-top: 5px;
                }

                /* 5. Minimalist Button (Relocated to Bottom Center) */
                .orbital-button {
                    position: absolute;
                    bottom: 10%;
                    left: 50%;
                    transform: translateX(-50%);
                    padding: 15px 50px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.2);
                    border-radius: 50px;
                    color: white;
                    font-size: 1.2rem;
                    font-weight: 300;
                    letter-spacing: 2px;
                    backdrop-filter: blur(10px);
                    transition: all 0.5s ease;
                    z-index: 20;
                    overflow: hidden;
                }

                .orbital-button:hover {
                    background: rgba(255,255,255,0.15);
                    letter-spacing: 5px;
                    border-color: rgba(255,255,255,0.6);
                    box-shadow: 0 0 30px rgba(0, 100, 255, 0.3);
                }

                .credit-orbital {
                    position: absolute;
                    bottom: 15px;
                    left: 15px;
                    text-align: left;
                    color: rgba(255,255,255,0.25);
                    font-size: 0.55rem;
                    letter-spacing: 0.5px;
                    z-index: 10;
                }

                /* Mobile Adjustments */
                @media (max-width: 768px) {
                    .hero-title { font-size: 1.2rem; letter-spacing: 1px; }
                    .orbital-planet { bottom: -55vh; }
                    /* Ensure button doesn't overlap on very small screens */
                    .orbital-button { bottom: 12%; padding: 12px 40px; font-size: 1rem; }
                }

            `}</style>

            {/* Background Image with Overlay */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0, backgroundColor: 'black' }}>
                <img
                    src={appLogoBg}
                    alt="App Logo Background"
                    className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[0px]" />

                {/* Animated Planets Overlay - Positioned on helmet visor */}
                <div className="animated-solar-system">
                    {/* Sun (center glow) */}
                    <div className="orbit-center">
                        <div className="sun-glow" />
                    </div>

                    {/* Mercury */}
                    <div className="orbit orbit-1">
                        <div className="planet planet-mercury" />
                    </div>

                    {/* Venus */}
                    <div className="orbit orbit-2">
                        <div className="planet planet-venus" />
                    </div>

                    {/* Earth */}
                    <div className="orbit orbit-3">
                        <div className="planet planet-earth" />
                    </div>

                    {/* Mars */}
                    <div className="orbit orbit-4">
                        <div className="planet planet-mars" />
                    </div>

                    {/* Jupiter */}
                    <div className="orbit orbit-5">
                        <div className="planet planet-jupiter" />
                    </div>

                    {/* Saturn */}
                    <div className="orbit orbit-6">
                        <div className="planet planet-saturn">
                            <div className="saturn-ring" />
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                /* Animated Solar System Styles */
                .animated-solar-system {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -52%);
                    width: 55%;
                    height: 55%;
                    pointer-events: none;
                }
                
                .orbit-center {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                }
                
                .sun-glow {
                    width: 30px;
                    height: 30px;
                    background: radial-gradient(circle, #fff9c4 0%, #ffb300 40%, #ff8f00 70%, transparent 100%);
                    border-radius: 50%;
                    box-shadow: 0 0 40px 15px rgba(255, 180, 0, 0.4), 0 0 80px 30px rgba(255, 140, 0, 0.2);
                    animation: sunPulse 3s ease-in-out infinite;
                }
                
                @keyframes sunPulse {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.1); opacity: 0.9; }
                }
                
                .orbit {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    border: 1px solid rgba(255, 180, 100, 0.15);
                    border-radius: 50%;
                    transform-style: preserve-3d;
                    transform: translate(-50%, -50%) rotateX(75deg);
                }
                
                .planet {
                    position: absolute;
                    border-radius: 50%;
                    top: -4px;
                    left: 50%;
                    transform: translateX(-50%) rotateX(-75deg);
                    box-shadow: 0 0 10px 2px rgba(255,255,255,0.3);
                }
                
                /* Orbit sizes and speeds */
                .orbit-1 { width: 50px; height: 50px; animation: orbitRotate 4s linear infinite; }
                .orbit-2 { width: 80px; height: 80px; animation: orbitRotate 6s linear infinite; }
                .orbit-3 { width: 110px; height: 110px; animation: orbitRotate 10s linear infinite; }
                .orbit-4 { width: 145px; height: 145px; animation: orbitRotate 15s linear infinite; }
                .orbit-5 { width: 190px; height: 190px; animation: orbitRotate 25s linear infinite; }
                .orbit-6 { width: 240px; height: 240px; animation: orbitRotate 35s linear infinite; }
                
                @keyframes orbitRotate {
                    from { transform: translate(-50%, -50%) rotateX(75deg) rotateZ(0deg); }
                    to { transform: translate(-50%, -50%) rotateX(75deg) rotateZ(360deg); }
                }
                
                /* Planet styles */
                .planet-mercury { width: 5px; height: 5px; background: #b0b0b0; }
                .planet-venus { width: 7px; height: 7px; background: #e6c87a; }
                .planet-earth { width: 8px; height: 8px; background: linear-gradient(135deg, #4a90d9 50%, #2d5a1d 50%); }
                .planet-mars { width: 6px; height: 6px; background: #c1440e; }
                .planet-jupiter { width: 14px; height: 14px; background: linear-gradient(180deg, #d4a574 0%, #c99856 50%, #a97842 100%); }
                .planet-saturn { 
                    width: 12px; height: 12px; 
                    background: linear-gradient(180deg, #f4d59e 0%, #d4a574 100%);
                    position: relative;
                }
                .saturn-ring {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 22px;
                    height: 6px;
                    border: 1px solid rgba(210, 180, 140, 0.6);
                    border-radius: 50%;
                    transform: translate(-50%, -50%) rotateX(75deg);
                }
                
                /* Mobile adjustments */
                @media (max-width: 768px) {
                    .animated-solar-system {
                        width: 70%;
                        height: 50%;
                        transform: translate(-50%, -55%);
                    }
                    .sun-glow { width: 20px; height: 20px; }
                    .orbit-1 { width: 35px; height: 35px; }
                    .orbit-2 { width: 55px; height: 55px; }
                    .orbit-3 { width: 75px; height: 75px; }
                    .orbit-4 { width: 100px; height: 100px; }
                    .orbit-5 { width: 130px; height: 130px; }
                    .orbit-6 { width: 165px; height: 165px; }
                    .planet-jupiter { width: 10px; height: 10px; }
                    .planet-saturn { width: 9px; height: 9px; }
                    .saturn-ring { width: 16px; height: 4px; }
                }
            `}</style>

            {/* UI Content */}
            <div className="hero-text-container">
                <h1 className="hero-title">فلك وآية</h1>
                {/* Subtitle Removed as requested */}

                {!isLoaded && (
                    <div className="mt-10 opacity-70" style={{ letterSpacing: 3 }}>
                        جاري ضبط المدار... {progress}%
                    </div>
                )}
            </div>

            {/* Start Button - Moved to Bottom Center independent of Text */}
            {isLoaded && (
                <button onClick={handleStartClick} className="orbital-button">
                    انطلاق
                </button>
            )}

            <div className="credit-orbital">
                جميع الحقوق محفوظة © 2026 تطبيق فلك وآية
            </div>
        </div>
    );
}

export const CinematicHome = memo(CinematicHomeComponent);
