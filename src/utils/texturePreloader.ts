// 🎯 Texture Preloader - Starts during Intro, checked by Loading Screen
// This service loads all textures in the background

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

        texturePaths.forEach((path) => {
            const img = new Image();
            img.onload = () => {
                loadedCount++;
                const progress = Math.floor((loadedCount / texturePaths.length) * 100);
                listeners.forEach(fn => fn(progress));
                if (loadedCount >= texturePaths.length) {
                    isComplete = true;
                }
            };
            img.onerror = () => {
                loadedCount++;
                const progress = Math.floor((loadedCount / texturePaths.length) * 100);
                listeners.forEach(fn => fn(progress));
                if (loadedCount >= texturePaths.length) {
                    isComplete = true;
                }
            };
            img.src = `${import.meta.env.BASE_URL}${path}`;
        });
    },

    // Get current progress (0-100)
    getProgress: () => Math.floor((loadedCount / texturePaths.length) * 100),

    // Check if complete
    isComplete: () => isComplete,

    // Subscribe to progress updates
    onProgress: (callback: (progress: number) => void) => {
        listeners.push(callback);
        // Immediately call with current progress
        callback(Math.floor((loadedCount / texturePaths.length) * 100));
        return () => {
            listeners = listeners.filter(fn => fn !== callback);
        };
    }
};
