import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { texturePreloader } from '../utils/texturePreloader';

interface SplashIntroProps {
    onComplete: () => void;
}

export function SplashIntro({ onComplete }: SplashIntroProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [hasError, setHasError] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    // 🚀 Start preloading textures immediately when intro starts
    useEffect(() => {
        texturePreloader.start();
    }, []);

    const handleVideoEnd = () => {
        setIsVisible(false);
        setTimeout(onComplete, 1000);
    };

    const handleStart = () => {
        if (videoRef.current) {
            videoRef.current.play()
                .catch(() => {
                    // Fail silently or handle UI
                });
        }
    };

    // 🔄 Autoplay Handling:
    // We MUST start muted to bypass browser restrictions (Safari/Chrome).
    // Then we try to unmute via code.
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = true; // Start safely
            videoRef.current.play().catch(() => { /* Autoplay blocked */ });

            // Try to unmute - if it fails, it stays muted but PLAYS
            videoRef.current.muted = false;
        }
    }, []);

    if (hasError) {
        return (
            <div className="fixed inset-0 z-[99999] bg-black flex flex-col items-center justify-center text-white">
                <p className="mb-4 text-red-500">فشل تحميل الفيديو (End of Stream or Network Error)</p>
                <button
                    onClick={onComplete}
                    className="px-6 py-2 border border-white rounded hover:bg-white hover:text-black transition"
                >
                    الدخول إلى التطبيق
                </button>
            </div>
        );
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-[99999] bg-black flex items-center justify-center overflow-hidden cursor-pointer"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
                    onClick={handleStart} // Click to unmute/ensure play
                >
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        style={{ filter: 'contrast(1.1) saturate(1.2) drop-shadow(0 0 20px rgba(0,0,0,0.5))' }}
                        src={`${import.meta.env.BASE_URL}videos/intro.mp4`}
                        autoPlay
                        muted // 🛡️ CRITICAL: Start muted to guarantee visual autoplay
                        playsInline
                        preload="auto" // Load full quality immediately
                        onEnded={handleVideoEnd}
                        onError={(e) => {
                            console.error("Video failed to load:", e);
                            setHasError(true);
                        }}
                    />

                    {/* DEBUG: Skip Button Restored for Dev Speed */}
                    <button
                        onClick={handleVideoEnd}
                        className="absolute bottom-10 right-10 text-white hover:text-white/80 text-xl tracking-[0.2em] font-light uppercase transition-all z-20 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 hover:border-white/60 hover:scale-105"
                    >
                        SKIP INTRO
                    </button>

                    {/* UI CLEANUP: No Mute Toggle - Pure Cinematic Experience */}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
