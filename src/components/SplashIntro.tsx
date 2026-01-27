import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashIntroProps {
    onComplete: () => void;
}

export function SplashIntro({ onComplete }: SplashIntroProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [loading, setLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleVideoEnd = () => {
        setIsVisible(false);
        setTimeout(onComplete, 1000);
    };

    const handleStart = () => {
        if (videoRef.current) {
            videoRef.current.play()
                .then(() => setLoading(false))
                .catch(e => {
                    console.error("Manual Play failed", e);
                });
        }
    };

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
                    onClick={handleStart} // Click anywhere to ensure playback with sound
                >
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                            <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                        </div>
                    )}

                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        style={{ filter: 'contrast(1.1) saturate(1.2) drop-shadow(0 0 20px rgba(0,0,0,0.5))' }} // 🌟 4K Enhanced Visuals
                        src={`${import.meta.env.BASE_URL}videos/intro.mp4`}
                        autoPlay
                        muted={false} // 🔊 Sound Mandatory
                        playsInline
                        preload="auto" // Load full quality immediately
                        onCanPlay={() => setLoading(false)}
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
