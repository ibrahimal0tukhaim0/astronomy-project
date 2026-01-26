import { useEffect, useState, useRef, memo } from 'react';
import { gsap } from 'gsap';


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
        let isMounted = true;

        // 1. Simulation Loading
        const totalDuration = 2500; // Slightly faster load for this view
        const startTime = Date.now();

        const updateProgress = () => {
            if (!isMounted) return;
            const elapsed = Date.now() - startTime;
            const simulatedProgress = Math.min(100, Math.floor((elapsed / totalDuration) * 100));

            setProgress(simulatedProgress);

            if (simulatedProgress < 100) {
                requestAnimationFrame(updateProgress);
            } else {
                setTimeout(() => setIsLoaded(true), 500);
            }
        };
        requestAnimationFrame(updateProgress);

        // 2. High-Density Starfield - REMOVED for Performance

        return () => { isMounted = false; };
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

                /* 1. Deep Space Background */
                .deep-space-bg {
                    position: absolute; inset: 0;
                    background: radial-gradient(circle at 50% -20%, #000411, #000000);
                    z-index: 0;
                }

                .star {
                    position: absolute; background: white; border-radius: 50%;
                    animation: twinkle 4s ease-in-out infinite;
                }
                @keyframes twinkle { 0%,100% { opacity: 0.2; } 50% { opacity: 0.8; } }

                /* 2. The Orbital Planet (Earth-like) */
                .orbital-planet {
                    position: absolute;
                    bottom: -65vh; /* Massive curve at bottom */
                    left: 50%;
                    transform: translateX(-50%);
                    width: 150vw;
                    height: 150vw;
                    border-radius: 50%;
                    background: radial-gradient(circle at 50% 10%, #1a4f7a 0%, #001830 40%, #000000 70%);
                    box-shadow: 
                        inset 0 20px 100px rgba(64, 156, 255, 0.4), /* Atmosphere Glow Inner */
                        0 -20px 150px rgba(0, 110, 255, 0.3); /* Atmosphere Glow Outer */
                    z-index: 2;
                    overflow: hidden;
                    animation: planetBreath 20s ease-in-out infinite alternate;
                }

                @keyframes planetBreath {
                    from { transform: translateX(-50%) scale(1); }
                    to { transform: translateX(-50%) scale(1.02); }
                }

                /* Cloud Texture simulation */
                .orbital-clouds {
                    position: absolute; inset: 0; border-radius: 50%;
                    background: url('https://assets.codepen.io/123/clouds-noise.png'); /* Fallback or noise */
                    opacity: 0.3;
                    mix-blend-mode: overlay;
                    animation: rotateClouds 200s linear infinite;
                }
                @keyframes rotateClouds { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                /* 3. The Sunrise (Lens Flare) */
                .orbital-sunrise {
                    position: absolute;
                    bottom: 35vh; /* Just above planet curve */
                    left: 50%;
                    transform: translateX(-50%);
                    width: 600px;
                    height: 100px;
                    background: radial-gradient(ellipse at center, 
                        rgba(255, 255, 255, 1) 0%, 
                        rgba(200, 220, 255, 0.8) 10%, 
                        rgba(0, 100, 255, 0.4) 30%, 
                        transparent 70%);
                    filter: blur(40px);
                    z-index: 1;
                    opacity: 0.8;
                    animation: sunrisePulse 8s ease-in-out infinite;
                }
                @keyframes sunrisePulse { 0%,100%{ opacity: 0.6; transform: translateX(-50%) scaleX(0.9); } 50%{ opacity: 0.9; transform: translateX(-50%) scaleX(1.1); } }

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

                /* 5. Minimalist Button */
                .orbital-button {
                    margin-top: 50px;
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
                    position: relative; overflow: hidden;
                }

                .orbital-button:hover {
                    background: rgba(255,255,255,0.15);
                    letter-spacing: 5px;
                    border-color: rgba(255,255,255,0.6);
                    box-shadow: 0 0 30px rgba(0, 100, 255, 0.3);
                }

                .credit-orbital {
                    position: absolute; bottom: 20px; width: 100%; text-align: center;
                    color: rgba(255,255,255,0.3); font-size: 0.8rem; letter-spacing: 1px;
                    z-index: 10;
                }

                /* Mobile Adjustments */
                @media (max-width: 768px) {
                    .hero-title { font-size: 3rem; letter-spacing: 5px; }
                    .orbital-planet { bottom: -55vh; }
                }

            `}</style>

            {/* Glassmorphism Background - Blurs the Scene slightly */}
            <div style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(8px)', zIndex: -1 }} />

            {/* Background - Transparent to show 3D Scene */}
            {/* <div className="deep-space-bg" /> */}

            {/* The Sunrise Light - REMOVED for Transparency */}
            {/* <div className="orbital-sunrise" /> */}

            {/* The Planet (Earth) - REMOVED for Transparency */}
            {/* <div className="orbital-planet">
                <div className="orbital-clouds" />
            </div> */}

            {/* UI Content */}
            <div className="hero-text-container">
                <h1 className="hero-title">فلك وآية</h1>
                <p className="hero-subtitle">THE ORBITAL EXPERIENCE</p>

                {!isLoaded ? (
                    <div className="mt-10 opacity-70" style={{ letterSpacing: 3 }}>
                        جاري ضبط المدار... {progress}%
                    </div>
                    // <LoadingScreen progress={progress} /> // Keeping minimal text for this style unless full screen requested
                ) : (
                    <button onClick={handleStartClick} className="orbital-button">
                        انطلاق
                    </button>
                )}
            </div>

            <div className="credit-orbital">
                Designed by Ibrahim Al-Tukhaim
            </div>
        </div>
    );
}

export const CinematicHome = memo(CinematicHomeComponent);
