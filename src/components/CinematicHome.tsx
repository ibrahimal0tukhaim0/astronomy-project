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
                @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@200;400;900&display=swap');
                
                .home-screen { font-family: 'Cairo', sans-serif; }

                /* 4. Elegant Hero Text */
                .hero-text-container {
                    position: relative; z-index: 10;
                    text-align: center;
                    top: -10vh; /* Move up to clear planet */
                }

                .hero-title {
                    font-size: 5rem;
                    font-weight: 200; /* Thin, Elegant */
                    letter-spacing: 10px;
                    color: white;
                    text-shadow: 0 0 30px rgba(0, 150, 255, 0.5);
                    margin: 0;
                    background: linear-gradient(to bottom, #fff, #aaccff);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .hero-subtitle {
                    font-size: 1.2rem;
                    font-weight: 400;
                    color: rgba(255,255,255,0.6);
                    letter-spacing: 4px;
                    margin-top: 10px;
                    text-transform: uppercase;
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
                    position: absolute; bottom: 20px; width: 100%; text-align: center;
                    color: rgba(255,255,255,0.3); font-size: 0.9rem; letter-spacing: 1px;
                    z-index: 10;
                }

                /* Mobile Adjustments */
                @media (max-width: 768px) {
                    .hero-title { font-size: 3rem; letter-spacing: 5px; }
                    .orbital-planet { bottom: -55vh; }
                    /* Ensure button doesn't overlap on very small screens */
                    .orbital-button { bottom: 12%; padding: 12px 40px; font-size: 1rem; }
                }

            `}</style>

            {/* Background Image with Overlay */}
            {/* Background Image with Overlay */}
            {/* Background Image with Overlay */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0, backgroundColor: 'black' }}>
                <img
                    src={appLogoBg}
                    alt="App Logo Background"
                    className="w-full h-full object-contain"
                />
                <div className="absolute inset-0 bg-black/20 backdrop-blur-[0px]" />
            </div>

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
                صنع بواسطة ابراهيم سليمان الطخيم <span className="opacity-50 text-[10px] ml-2">v2.5</span>
            </div>
        </div>
    );
}

export const CinematicHome = memo(CinematicHomeComponent);
