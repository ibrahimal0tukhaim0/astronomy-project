import * as THREE from 'three';

// Performance: Switched to 1K textures where possible to save VRAM
export const TEXTURE_URLS = {
    sun: {
        map: '/textures/sun.jpg', // SoumyaEXE Repo standard
    },
    moon: {
        map: '/textures/moon.jpg',
    },
    earth: {
        map: '/textures/earth.jpg', // User requested exact path
        clouds: '/textures/earth_clouds.jpg', // Repo file
        specular: '/textures/earth_specular.jpg', // Repo file
    },
    mercury: { map: '/textures/mercury.jpg' },
    venus: {
        map: '/textures/venus.jpg',
        atmosphere: '/textures/venus_atmosphere.jpg'
    },
    mars: { map: '/textures/mars.jpg' },
    jupiter: { map: '/textures/jupiter.jpg' },
    saturn: {
        map: '/textures/saturn.jpg',
        ring: '/textures/saturn_ring.png'
    },
    uranus: { map: '/textures/uranus.jpg' },
    neptune: { map: '/textures/neptune.jpg' },
    pluto: { map: '/textures/pluto.jpg' },
    ceres: { map: '/textures/pluto.jpg' }, // Use Pluto (generic rock) instead of Moon to avoid confusion
    stars: { map: '/textures/stars.jpg' }, // Repo standard
};

// Singleton LoadingManager for better debugging
const manager = new THREE.LoadingManager();

manager.onStart = (url, itemsLoaded, itemsTotal) => {
    console.log(`Started loading: ${url}. (${itemsLoaded}/${itemsTotal})`);
};

manager.onLoad = () => {
    console.log('Loading complete!');
};

manager.onProgress = (url, itemsLoaded, itemsTotal) => {
    console.log(`Loading file: ${url}. (${itemsLoaded}/${itemsTotal})`);
};

manager.onError = (url) => {
    console.error(`CRITICAL TEXTURE ERROR: Failed to load texture at path: ${url}. Check if file exists in 'public/textures/'.`);
};

// Singleton texture loader attached to manager
const loader = new THREE.TextureLoader(manager);

// Cache loaded textures
const textureCache = new Map<string, THREE.Texture>();

/**
 * Load a texture with caching
 */
export const loadTexture = (url: string): Promise<THREE.Texture | null> => {
    // Return cached texture if available
    if (textureCache.has(url)) {
        return Promise.resolve(textureCache.get(url)!);
    }

    return new Promise((resolve) => {
        loader.load(
            url,
            (texture) => {
                // Performance: Dispose texture when done (handled by caller usually, but we cache here)
                // Ensure mipmaps are optimized
                texture.minFilter = THREE.LinearMipMapLinearFilter;
                texture.magFilter = THREE.LinearFilter;
                texture.generateMipmaps = true;

                // IMPORTANT: Flag update for renderer
                texture.needsUpdate = true;

                textureCache.set(url, texture);
                resolve(texture);
            },
            undefined, // onProgress handled by manager
            (error) => {
                // Manager onError will also fire, but we handle promise here
                console.error(`Failed to load texture: ${url}`, error);
                resolve(null as any);
            }
        );
    });
};

/**
 * Load all textures for a celestial body
 */
export const loadCelestialTextures = async (bodyId: string) => {
    const urls = TEXTURE_URLS[bodyId as keyof typeof TEXTURE_URLS];

    if (!urls) return null;

    if (typeof urls === 'string') {
        return loadTexture(urls);
    }

    const textures: Record<string, THREE.Texture> = {};

    const promises = Object.entries(urls).map(async ([key, url]) => {
        try {
            const tex = await loadTexture(url);
            if (tex) {
                textures[key] = tex;
            }
        } catch (e) {
            console.warn(`Failed to load texture ${key} for ${bodyId}, using fallback.`);
            // Silent failure is okay here because loadTexture resolves empty texture now
        }
    });

    await Promise.all(promises);

    // If we loaded NOTHING (and there were URLs), return null to force color fallback?
    // Or return partial? Partial is better.
    if (Object.keys(textures).length === 0) return null;

    return textures;
};
