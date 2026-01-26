import * as THREE from 'three';

// Singleton LoadingManager for better debugging
// Helper to get correct path regardless of deployment
export const planetTextures: Record<string, any> = {
    sun: {
        map: '/textures/sun_real.png',
        emissiveMap: '/textures/sun_real.png',
    },
    moon: {
        map: '/textures/moon_nasa_new.jpg', // NASA PIA00405
        bumpMap: '/textures/moon_nasa_new.jpg',
    },
    earth: {
        map: '/textures/earth_recreated.png', // RECREATED
        // clouds: '/textures/earth_clouds.jpg', 
        specular: '/textures/earth_specular.jpg',
        bumpMap: '/textures/earth_recreated.png',
    },
    mercury: { map: '/textures/mercury.jpg' },
    venus: {
        map: '/textures/venus.jpg',
        atmosphere: '/textures/venus_atmosphere.jpg'
    },
    mars: { map: '/textures/mars_final.png' }, // KEPT
    jupiter: { map: '/textures/jupiter_recreated.png' }, // RECREATED
    saturn: {
        map: '/textures/saturn_recreated.png', // RECREATED
        ring: '/textures/saturn_ring_detailed.png' // Keeping geometry ring but using image for map
    },
    uranus: { map: '/textures/uranus_recreated.png' }, // RECREATED
    neptune: { map: '/textures/neptune.jpg' },
    pluto: { map: '/textures/pluto.jpg' },
    ceres: { map: '/textures/pluto.jpg' },
    sirius: { map: '/textures/sirius_real.png' }, // Generated Real Texture
    stars: { map: '/textures/stars.jpg' },
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
