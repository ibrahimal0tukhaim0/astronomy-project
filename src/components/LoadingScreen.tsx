import { useEffect, useState } from 'react';
import './LoadingScreen.css';

interface LoadingScreenProps {
    progress: number; // 0 to 100
    onComplete?: () => void;
}

const TIPS = [
    'هل تعلم أن الشمس تمثل 99.86% من كتلة النظام الشمسي؟',
    'المسافة بين الأرض والشمس تسمى وحدة فلكية (150 مليون كم)',
    'يمكن أن يتسع كوكب المشتري لأكثر من 1300 كرة أرضية',
    'الضوء من الشمس يستغرق 8 دقائق للوصول إلى الأرض',
    'زحل أقل كثافة من الماء - يمكنه أن يطفو!',
    'يوم واحد على الزهرة أطول من سنة على الزهرة',
    'قال الله تعالى: "وَالسَّمَاءَ بَنَيْنَاهَا بِأَيْدٍ وَإِنَّا لَمُوسِعُونَ"',
    'النظام الشمسي عمره حوالي 4.6 مليار سنة'
];

export function LoadingScreen({ progress, onComplete }: LoadingScreenProps) {
    const [displayProgress, setDisplayProgress] = useState(0);
    const [tipIndex, setTipIndex] = useState(0);
    const [isFadingOut, setIsFadingOut] = useState(false);

    // Smoothly animate the progress number
    useEffect(() => {
        if (displayProgress < progress) {
            const diff = progress - displayProgress;
            const step = Math.max(1, Math.ceil(diff / 10)); // Speed up approach
            const timer = setTimeout(() => {
                setDisplayProgress(prev => Math.min(progress, prev + step));
            }, 20); // 50fps update
            return () => clearTimeout(timer);
        }
    }, [progress, displayProgress]);

    // Check completion
    useEffect(() => {
        if (displayProgress >= 100) {
            setIsFadingOut(true);
            const timer = setTimeout(() => {
                if (onComplete) onComplete();
            }, 800); // Wait for fade out transition (0.5s in CSS)
            return () => clearTimeout(timer);
        }
    }, [displayProgress, onComplete]);

    // Rotate tips
    useEffect(() => {
        const interval = setInterval(() => {
            setTipIndex(prev => (prev + 1) % TIPS.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    if (displayProgress >= 100 && !isFadingOut && !onComplete) return null; // Safety check if unmounted externally

    return (
        <div className={`loading-screen ${isFadingOut ? 'hidden' : ''}`} dir="rtl">

            {/* Background effects */}
            <div className="loading-bg-stars"></div>
            <div className="loading-nebula"></div>

            {/* App title */}
            <h1 className="loading-title">فلك وآية</h1>

            {/* Solar system animation */}
            <div className="loading-solar-system">
                <div className="loading-sun">
                    <div className="loading-sun-glow"></div>
                </div>
                <div className="loading-orbit orbit-1">
                    <div className="loading-planet planet-1"></div>
                </div>
                <div className="loading-orbit orbit-2">
                    <div className="loading-planet planet-2"></div>
                </div>
                <div className="loading-orbit orbit-3">
                    <div className="loading-planet planet-3"></div>
                </div>
            </div>

            {/* Loading percentage */}
            <div className="loading-percentage">{displayProgress}%</div>

            {/* Progress bar */}
            <div className="loading-progress-container">
                <div
                    className="loading-progress-bar"
                    style={{ width: `${displayProgress}%` }}
                ></div>
                <div
                    className="loading-progress-glow"
                    style={{ width: `${displayProgress}%` }}
                ></div>
            </div>

            {/* Loading text */}
            <div className="loading-text">جاري تحميل الكون...</div>

            {/* Random tip */}
            <div className="loading-tip" key={tipIndex}>
                {TIPS[tipIndex]}
            </div>

        </div>
    );
}
