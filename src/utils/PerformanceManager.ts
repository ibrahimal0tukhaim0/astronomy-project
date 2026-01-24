/**
 * Performance Management System
 * Automatically adjusts rendering quality based on device capabilities
 */

export type QualityLevel = 'low' | 'medium' | 'high';

export interface PerformanceSettings {
    qualityLevel: QualityLevel;
    geometryDetail: number;      // Sphere segments (16/32/64)
    glowLayers: number;           // Number of glow layers (1/2/3)
    bloomIntensity: number;       // Bloom effect intensity
    shadowsEnabled: boolean;      // Enable/disable shadows
    particleCount: number;        // Star field particle count
    targetFPS: number;            // Target frame rate
}

/**
 * Detect GPU tier based on WebGL capabilities
 */
export function detectGPUTier(): QualityLevel {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;

    if (!gl) {
        return 'low'; // No WebGL support
    }

    try {
        // Get renderer info
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
            const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

            // Check for high-end GPUs
            if (
                renderer.includes('NVIDIA') ||
                renderer.includes('AMD Radeon') ||
                renderer.includes('Apple M1') ||
                renderer.includes('Apple M2') ||
                renderer.includes('Apple M3')
            ) {
                return 'high';
            }

            // Check for integrated/mobile GPUs
            if (
                renderer.includes('Intel') ||
                renderer.includes('Mobile') ||
                renderer.includes('PowerVR')
            ) {
                return 'medium';
            }
        }

        // Fallback: Check max texture size
        const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        if (maxTextureSize >= 16384) return 'high';
        if (maxTextureSize >= 8192) return 'medium';

    } catch (error) {
        console.warn('Could not detect GPU tier:', error);
    }

    return 'medium'; // Default to medium
}

/**
 * Check if device is mobile
 */
export function isMobileDevice(): boolean {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );
}

/**
 * Get performance settings based on quality level
 */
export function getPerformanceSettings(quality: QualityLevel): PerformanceSettings {
    const baseSettings: Record<QualityLevel, PerformanceSettings> = {
        low: {
            qualityLevel: 'low',
            geometryDetail: 16,
            glowLayers: 1,
            bloomIntensity: 0.8,
            shadowsEnabled: false,
            particleCount: 500,
            targetFPS: 30,
        },
        medium: {
            qualityLevel: 'medium',
            geometryDetail: 32,
            glowLayers: 2,
            bloomIntensity: 1.0,
            shadowsEnabled: true,
            particleCount: 1000,
            targetFPS: 45,
        },
        high: {
            qualityLevel: 'high',
            geometryDetail: 64,
            glowLayers: 3,
            bloomIntensity: 1.2,
            shadowsEnabled: true,
            particleCount: 2000,
            targetFPS: 60,
        },
    };

    return baseSettings[quality];
}

/**
 * Automatically determine best quality level
 */
export function getOptimalQualityLevel(): QualityLevel {
    const gpuTier = detectGPUTier();
    const isMobile = isMobileDevice();

    // Mobile devices get reduced quality
    if (isMobile) {
        if (gpuTier === 'high') return 'medium';
        if (gpuTier === 'medium') return 'low';
        return 'low';
    }

    return gpuTier;
}

/**
 * FPS Monitor class
 */
export class FPSMonitor {
    private frames: number[] = [];
    private lastTime: number = performance.now();
    private readonly sampleSize: number = 60; // Monitor over 60 frames

    update(): number {
        const currentTime = performance.now();
        const delta = currentTime - this.lastTime;
        this.lastTime = currentTime;

        const fps = 1000 / delta;
        this.frames.push(fps);

        // Keep only recent samples
        if (this.frames.length > this.sampleSize) {
            this.frames.shift();
        }

        return this.getAverageFPS();
    }

    getAverageFPS(): number {
        if (this.frames.length === 0) return 60;
        const sum = this.frames.reduce((a, b) => a + b, 0);
        return sum / this.frames.length;
    }

    isPerformancePoor(targetFPS: number = 30): boolean {
        return this.getAverageFPS() < targetFPS;
    }

    reset(): void {
        this.frames = [];
        this.lastTime = performance.now();
    }
}

/**
 * Adaptive Performance Manager
 */
export class AdaptivePerformanceManager {
    private currentQuality: QualityLevel;
    private fpsMonitor: FPSMonitor;
    private settings: PerformanceSettings;
    private checkInterval: number = 3000; // Check every 3 seconds
    private lastCheck: number = 0;

    constructor(initialQuality?: QualityLevel) {
        this.currentQuality = initialQuality || getOptimalQualityLevel();
        this.settings = getPerformanceSettings(this.currentQuality);
        this.fpsMonitor = new FPSMonitor();
    }

    update(): { settings: PerformanceSettings; qualityChanged: boolean } {
        const currentFPS = this.fpsMonitor.update();
        const currentTime = performance.now();

        let qualityChanged = false;

        // Check if we should adjust quality
        if (currentTime - this.lastCheck > this.checkInterval) {
            this.lastCheck = currentTime;

            // Downgrade if performance is poor
            if (this.fpsMonitor.isPerformancePoor(this.settings.targetFPS * 0.8)) {
                if (this.currentQuality === 'high') {
                    this.currentQuality = 'medium';
                    qualityChanged = true;
                } else if (this.currentQuality === 'medium') {
                    this.currentQuality = 'low';
                    qualityChanged = true;
                }
            }
            // Upgrade if performance is excellent (cautiously)
            else if (currentFPS > this.settings.targetFPS * 1.2) {
                if (this.currentQuality === 'low') {
                    this.currentQuality = 'medium';
                    qualityChanged = true;
                } else if (this.currentQuality === 'medium' && !isMobileDevice()) {
                    this.currentQuality = 'high';
                    qualityChanged = true;
                }
            }

            if (qualityChanged) {
                this.settings = getPerformanceSettings(this.currentQuality);
                this.fpsMonitor.reset(); // Reset to measure new quality level
                // Quality adjusted automatically
            }
        }

        return {
            settings: this.settings,
            qualityChanged,
        };
    }

    getCurrentSettings(): PerformanceSettings {
        return this.settings;
    }

    getCurrentQuality(): QualityLevel {
        return this.currentQuality;
    }

    forceQuality(quality: QualityLevel): void {
        this.currentQuality = quality;
        this.settings = getPerformanceSettings(quality);
        this.fpsMonitor.reset();
    }
}

/**
 * Save/Load user preferences
 */
const STORAGE_KEY = 'astronomy-app-quality-preference';

export function saveQualityPreference(quality: QualityLevel): void {
    try {
        localStorage.setItem(STORAGE_KEY, quality);
    } catch (error) {
        console.warn('Could not save quality preference:', error);
    }
}

export function loadQualityPreference(): QualityLevel | null {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'low' || stored === 'medium' || stored === 'high') {
            return stored;
        }
    } catch (error) {
        console.warn('Could not load quality preference:', error);
    }
    return null;
}
