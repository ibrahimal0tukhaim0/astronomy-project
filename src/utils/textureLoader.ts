import * as THREE from 'three';

// Performance: Switched to 1K textures where possible to save VRAM
// Helper to get correct path regardless of deployment
const getPath = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export const planetTextures: Record<string, any> = {
    sun: {
        map: getPath('textures/sun_real.png'), // High Quality 4K Sun
        emissiveMap: getPath('textures/sun_real.png'), // Self-illumination
    },
    moon: {
        map: getPath('textures/moon.jpg'),
        bumpMap: getPath('textures/moon.jpg'),
    },
    earth: {
        map: getPath('textures/earth.jpg'),
        clouds: getPath('textures/earth_clouds.jpg'),
        specular: getPath('textures/earth_specular.jpg'),
        bumpMap: getPath('textures/earth.jpg'),
    },
    mercury: { map: getPath('textures/mercury.jpg') },
    venus: {
        map: getPath('textures/venus.jpg'),
        atmosphere: getPath('textures/venus_atmosphere.jpg')
    },
    mars: { map: getPath('textures/mars.jpg') },
    jupiter: { map: getPath('textures/jupiter.jpg') },
    saturn: {
        map: getPath('textures/saturn.jpg'),
        ring: getPath('textures/saturn_ring.png')
    },
    uranus: { map: getPath('textures/uranus.jpg') },
    neptune: { map: getPath('textures/neptune.jpg') },
    pluto: { map: getPath('textures/pluto.jpg') },
    ceres: { map: getPath('textures/pluto.jpg') }, // Use Pluto (generic rock) instead of Moon to avoid confusion
    stars: { map: getPath('textures/stars.jpg') },
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


                // PERFORMANCE: Cap Anisotropy for Mobile Stability (Max 8x)
                // This prevents extreme filtering cost on oblique angles without visible quality loss
                texture.anisotropy = 8;

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
    const urls = planetTextures[bodyId as keyof typeof planetTextures];

    if (!urls) return null;

    if (typeof urls === 'string') {
        return loadTexture(urls);
    }

    const textures: Record<string, THREE.Texture> = {};

    const promises = Object.entries(urls).map(async ([key, url]) => {
        try {
            const tex = await loadTexture(url as string);
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
