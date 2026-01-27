import { useState, useRef, useEffect } from 'react';
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
                    console.error("Play failed", e);
                    // If autoplay fails, we might need user interaction
                    setLoading(false);
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
                    className="fixed inset-0 z-[99999] bg-black flex items-center justify-center overflow-hidden"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, transition: { duration: 1.5, ease: "easeInOut" } }}
                >
                    {loading && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                        </div>
                    )}

                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        src="https://googleusercontent.com/generated_video_content/12158959972652609561"
                        autoPlay
                        muted
                        playsInline
                        onCanPlay={() => setLoading(false)}
                        onEnded={handleVideoEnd}
                        onError={(e) => {
                            console.error("Video failed to load:", e);
                            setHasError(true);
                        }}
                        onClick={handleStart}
                    />

                    <button
                        onClick={handleVideoEnd}
                        className="absolute bottom-10 right-10 text-white/30 hover:text-white/80 text-xs tracking-widest uppercase transition-colors z-20"
                    >
                        SKIP
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
