
import { useEffect, useRef, useState, useMemo } from 'react';
import { useProgress } from '@react-three/drei';
import { gsap } from 'gsap';

interface MainMenuProps {
    onStart: () => void;
}

export function MainMenu({ onStart }: MainMenuProps) {
    const { progress } = useProgress();
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Dynamic Stars
    const [stars, setStars] = useState<{ x: number; y: number; size: number; delay: number }[]>([]);

    useEffect(() => {
        // More stars, varying sizes
        const newStars = Array.from({ length: 200 }).map(() => ({
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 2 + 0.5,
            delay: Math.random() * 5,
        }));
        setStars(newStars);

        if (progress >= 100) {
            setIsLoaded(true);
        }
    }, [progress]);

    const handleStart = () => {
        if (!isLoaded) return;
        gsap.to(containerRef.current, {
            opacity: 0,
            duration: 2.0,
            ease: "power2.inOut",
            onComplete: () => onStart()
        });
    };

    const starStyles = useMemo(() => {
        return stars.map(star => ({
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: Math.random() * 0.7 + 0.1,
            animationDuration: `${Math.random() * 3 + 2}s`
        }));
    }, [stars]);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black text-white overflow-hidden font-sans"
            dir="rtl"
        >
            {/* 🌌 DEEP SPACE BACKGROUND LAYERS */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                {/* 1. Deep Void Base */}
                <div className="absolute inset-0 bg-[#020408]" />

                {/* 2. Volumetric Nebulas (CSS Blurs) - Deep Purple & Cosmic Blue */}
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full animate-pulse-slow mix-blend-screen" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-900/20 blur-[130px] rounded-full animate-pulse-slow mix-blend-screen" style={{ animationDelay: '2s' }} />
                <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] bg-amber-900/10 blur-[100px] rounded-full animate-pulse-slow mix-blend-screen" style={{ animationDelay: '4s' }} />

                {/* 3. Orbital Rings (Celestial Mechanics) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vh] h-[120vh] border border-white/5 rounded-full animate-[spin_120s_linear_infinite]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160vh] h-[160vh] border border-white/5 rounded-full animate-[spin_180s_linear_infinite_reverse]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vh] h-[90vh] border border-white/5 rounded-full border-dashed animate-[spin_240s_linear_infinite]" />

                {/* 4. Starfield (Generated) */}
                {stars.map((_star, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white animate-twinkle"
                        style={starStyles[i]}
                    />
                ))}

                {/* 5. Constellation Lines (SVG Overlay) */}
                <svg className="absolute inset-0 w-full h-full opacity-20 pointer-events-none stroke-white/20">
                    <line x1="10%" y1="20%" x2="15%" y2="25%" strokeWidth="0.5" />
                    <line x1="15%" y1="25%" x2="18%" y2="15%" strokeWidth="0.5" />
                    <line x1="80%" y1="80%" x2="85%" y2="75%" strokeWidth="0.5" />
                    <line x1="85%" y1="75%" x2="82%" y2="65%" strokeWidth="0.5" />
                    <line x1="82%" y1="65%" x2="75%" y2="70%" strokeWidth="0.5" />
                    {/* Random connection spiderweb effect */}
                    <circle cx="15%" cy="25%" r="1" fill="white" />
                    <circle cx="18%" cy="15%" r="1" fill="white" />
                    <circle cx="85%" cy="75%" r="1" fill="white" />
                </svg>

                {/* 6. Shooting Stars */}
                <div className="absolute top-[-10%] right-[-10%] w-[2px] h-[150px] bg-gradient-to-b from-transparent via-blue-100 to-transparent rotate-[45deg] animate-[shooting-star_7s_infinite]" />
                <div className="absolute top-[20%] right-[-10%] w-[1px] h-[100px] bg-gradient-to-b from-transparent via-white to-transparent rotate-[45deg] animate-[shooting-star_12s_infinite] delay-1000" />

                {/* 7. Vignette Texture */}
                <div className="absolute inset-0 bg-radial-gradient-to-cc from-transparent via-transparent to-black/80" />
            </div>

            {/* 🕌 CENTERPIECE: Islamic Geometry (Still present but subtle) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none opacity-10 z-0 mix-blend-overlay">
                <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_200s_linear_infinite]">
                    <path d="M50 0 L61 35 L97 35 L68 57 L79 91 L50 70 L21 91 L32 57 L3 35 L39 35 Z" fill="none" stroke="#FFD700" strokeWidth="0.2" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#FFD700" strokeWidth="0.05" />
                    <circle cx="50" cy="50" r="55" fill="none" stroke="#FFD700" strokeWidth="0.05" strokeDasharray="1 2" />
                </svg>
            </div>

            {/* UI CONTENT */}
            <div className="relative z-10 text-center space-y-8 max-w-5xl px-6">

                {/* Branding with Deep Shadow */}
                <div className="space-y-6 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-blue-500/5 blur-[80px] rounded-full pointer-events-none" />

                    <h1 className="relative text-7xl md:text-9xl font-bold font-serif tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-amber-100 to-amber-600 drop-shadow-[0_0_50px_rgba(255,200,50,0.4)] animate-fade-in-up">
                        فلك وآية
                    </h1>

                    <div className="relative flex items-center justify-center gap-6 text-amber-100/60 animate-fade-in-up delay-200">
                        <span className="h-[0.5px] w-20 bg-gradient-to-r from-transparent to-amber-500/50"></span>
                        <p className="text-lg md:text-2xl font-light font-sans tracking-[0.2em] uppercase text-amber-50/90 drop-shadow-md">
                            رحلة في أعماق الكون وتدبر آياته
                        </p>
                        <span className="h-[0.5px] w-20 bg-gradient-to-l from-transparent to-amber-500/50"></span>
                    </div>
                </div>

                {/* Start Interaction */}
                <div className="min-h-[120px] flex flex-col items-center justify-center">
                    {!isLoaded ? (
                        <div className="w-64 space-y-4 animate-pulse">
                            <div className="flex justify-between text-[9px] text-blue-200/40 font-mono tracking-[0.3em] uppercase">
                                <span>Orbit Synchronization</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="h-[1px] w-full bg-white/10 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-400 via-white to-blue-400 blur-[1px] transition-all duration-300 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="animate-fade-in-up delay-500">
                            <button
                                onClick={handleStart}
                                className="group relative px-14 py-5 bg-transparent overflow-hidden rounded-full transition-all duration-1000 hover:scale-105"
                            >
                                {/* Thin Elegant Border */}
                                <div className="absolute inset-0 border border-amber-200/20 rounded-full group-hover:border-amber-100/50 transition-colors duration-700" />

                                {/* Deep Space Glow on Hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/0 via-amber-500/5 to-blue-900/0 group-hover:via-amber-500/10 transition-all duration-700 blur-xl" />

                                <span className="relative z-10 text-xl font-light text-amber-50 tracking-[0.1em] group-hover:text-white transition-colors duration-500 flex items-center gap-4">
                                    <span>ابدأ الرحلة</span>
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* FOOTER CREDITS */}
            <div className="absolute bottom-6 flex flex-col items-center space-y-3 opacity-50 hover:opacity-90 transition-opacity duration-700 group cursor-default">
                <div className="h-[1px] w-8 bg-amber-500/30 group-hover:w-24 transition-all duration-700"></div>
                <p className="text-amber-50/80 text-xs font-light tracking-widest font-serif">
                    إبراهيم سليمان الطخيم
                </p>
                <p className="text-[8px] text-blue-200/30 uppercase tracking-[0.4em]">
                    Digital Architect
                </p>
            </div>
        </div>
    );
}
