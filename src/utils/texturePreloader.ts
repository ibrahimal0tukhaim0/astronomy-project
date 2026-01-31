// 🎯 Texture Preloader - Starts during Intro, checked by Loading Screen
// This service loads all textures in the background using THREE.js Loader Manager
import { useTexture } from '@react-three/drei';

const texturePaths = [
    'textures/sun_surface.webp',
    'textures/mercury_surface.webp',
    'textures/venus_atmosphere.webp',
    'textures/earth_daymap.webp',
    'textures/earth_clouds.webp',
    'textures/moon_surface.webp',
    'textures/mars_surface.webp',
    'textures/saturn_surface.webp',
    'textures/saturn_rings.webp',
    'textures/neptune_surface.webp',
    'textures/pluto_surface.webp',
    'textures/stars.webp',
    'textures/al_tariq_real.webp', // 🌟 Added Al-Tariq
    'textures/herbig_haro_49_50.jpg', // 🌌 Herbig-Haro 49/50 (User Request)
    // Asteroids
    'textures/asteroids/ceres.webp',
    'textures/asteroids/vesta.webp',
    'textures/asteroids/pallas.webp',
    'textures/asteroids/juno.webp',
    'textures/asteroids/eros.webp',
    'textures/asteroids/ida.webp',
    'textures/asteroids/gaspra.webp',
    'textures/asteroids/bennu.webp',
    'textures/asteroids/ryugu.webp',
];

let loadedCount = 0;
let isStarted = false;
let isComplete = false;
let listeners: ((progress: number) => void)[] = [];

export const texturePreloader = {
    // Start preloading (called by SplashIntro)
    start: () => {
        if (isStarted) return;
        isStarted = true;

        // 🚀 Preload using Drei's system to populate Three cache
        texturePaths.forEach((path) => {
            const fullPath = `${import.meta.env.BASE_URL}${path}`;

            // We use the Drei preload mechanism which handles the TextureLoader
            useTexture.preload(fullPath);

            // We also manually track "loading" via a standard fetch/img 
            // because useTexture.preload is void/fire-and-forget in terms of callbacks usually.
            // But to keep it simple and reliable for the progress bar, we keep the Image method
            // heavily relying on browser cache for the second hit by ThreeJS.
            const img = new Image();
            img.onload = () => {
                loadedCount++;
                updateProgress();
            };
            img.onerror = () => {
                loadedCount++; // Count errors as done to prevent hanging
                updateProgress();
            };
            img.src = fullPath;
        });
    },

    // Get current progress (0-100)
    getProgress: () => texturePaths.length === 0 ? 100 : Math.floor((loadedCount / texturePaths.length) * 100),

    // Check if complete
    isComplete: () => isComplete,

    // Subscribe to progress updates
    onProgress: (callback: (progress: number) => void) => {
        listeners.push(callback);
        // Immediately call with current progress
        if (texturePaths.length > 0) {
            callback(Math.floor((loadedCount / texturePaths.length) * 100));
        } else {
            callback(100);
        }
        return () => {
            listeners = listeners.filter(fn => fn !== callback);
        };
    }
};

function updateProgress() {
    const progress = Math.floor((loadedCount / texturePaths.length) * 100);
    listeners.forEach(fn => fn(progress));
    if (loadedCount >= texturePaths.length) {
        isComplete = true;
    }
}
