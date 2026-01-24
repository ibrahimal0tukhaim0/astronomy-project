import { useState, useEffect, useRef } from 'react';
import {
    AdaptivePerformanceManager,
    getOptimalQualityLevel,
    loadQualityPreference,
    saveQualityPreference,
    type PerformanceSettings,
    type QualityLevel,
} from '../utils/PerformanceManager';

export interface UseAdaptiveQualityReturn {
    settings: PerformanceSettings;
    quality: QualityLevel;
    setQuality: (quality: QualityLevel) => void;
    isAdaptive: boolean;
    toggleAdaptive: () => void;
}

/**
 * React Hook for adaptive quality management
 * Automatically adjusts rendering quality based on performance
 */
export function useAdaptiveQuality(enableAdaptive: boolean = true): UseAdaptiveQualityReturn {
    const managerRef = useRef<AdaptivePerformanceManager | null>(null);
    const [isAdaptive, setIsAdaptive] = useState(enableAdaptive);

    // Initialize with saved preference or optimal detection
    const [quality, setQualityState] = useState<QualityLevel>(() => {
        const saved = loadQualityPreference();
        return saved || getOptimalQualityLevel();
    });

    const [settings, setSettings] = useState<PerformanceSettings>(() => {
        if (!managerRef.current) {
            managerRef.current = new AdaptivePerformanceManager(quality);
        }
        return managerRef.current.getCurrentSettings();
    });

    // Initialize manager
    useEffect(() => {
        if (!managerRef.current) {
            managerRef.current = new AdaptivePerformanceManager(quality);
        }
    }, []);

    // Update loop for adaptive quality
    useEffect(() => {
        if (!isAdaptive || !managerRef.current) return;

        let animationFrameId: number;

        const updateLoop = () => {
            if (managerRef.current) {
                const result = managerRef.current.update();

                if (result.qualityChanged) {
                    const newQuality = managerRef.current.getCurrentQuality();
                    setQualityState(newQuality);
                    setSettings(result.settings);
                    saveQualityPreference(newQuality);
                }
            }

            animationFrameId = requestAnimationFrame(updateLoop);
        };

        animationFrameId = requestAnimationFrame(updateLoop);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [isAdaptive]);

    const setQuality = (newQuality: QualityLevel) => {
        setQualityState(newQuality);
        if (managerRef.current) {
            managerRef.current.forceQuality(newQuality);
            setSettings(managerRef.current.getCurrentSettings());
        }
        saveQualityPreference(newQuality);
    };

    const toggleAdaptive = () => {
        setIsAdaptive(prev => !prev);
    };

    return {
        settings,
        quality,
        setQuality,
        isAdaptive,
        toggleAdaptive,
    };
}
