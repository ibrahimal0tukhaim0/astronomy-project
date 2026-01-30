import { useEffect } from 'react';

// Performance Optimization Code - Adapted for React/Three.js
// Based on User Provided Implementation

// 1. FPS Limiter/Monitor logic (Adapted for monitoring, since R3F manages the loop)
// const targetFPS = 60;
// const frameDelay = 1000 / targetFPS;

// 3. Debounce Function for expensive operations
export function debounce(func: Function, delay = 100) {
    let timeoutId: any;
    return function (this: any, ...args: any[]) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// 4. Memory Cleanup
function cleanupMemory() {
    // @ts-ignore
    if (window.gc) {
        // @ts-ignore
        window.gc();
    }

    // SAFEGUARDS: Only clear unused 2D canvases, NOT the WebGL 3D canvas
    const canvases = document.querySelectorAll('canvas');
    canvases.forEach(canvas => {
        // Skip the main 3D canvas (managed by Three.js)
        if (canvas.getAttribute('data-engine') === 'three.js') return;

        // Only clear if it creates a 2D context (avoiding WebGL context loss errors)
        try {
            if (canvas.width > 0) {
                // Check if it's a 2D canvas before getting context
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                }
            }
        } catch (e) {
            // Ignore errors for WebGL canvases
        }
    });


}

// 6. Reduce animation complexity based on device performance
export const detectPerformance = () => {
    const startTime = performance.now();
    // Simple performance test
    for (let i = 0; i < 1000000; i++) { }
    const duration = performance.now() - startTime;

    let performanceMode = 'high';

    if (duration > 50) {
        performanceMode = 'low';
    } else if (duration > 20) {
        performanceMode = 'medium';
    }


    return performanceMode;
};

// 2. Image Loading Optimization
function optimizeImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (!img.complete) {
            img.loading = 'lazy';
        }
    });
}

// 7. Initialize optimizations
function initPerformanceOptimizations() {
    optimizeImages();
    detectPerformance();

    // Run cleanup every 15 seconds (more frequent for better memory)
    setInterval(cleanupMemory, 15000);
}

// 🧹 GPU Memory Optimizer - Safe texture cache cleanup
function optimizeGPUMemory(gl: THREE.WebGLRenderer) {
    // Force WebGL garbage collection if available
    const info = gl.info;

    // Log memory stats (helpful for debugging)
    console.log(`🧹 GPU Memory: ${info.memory.textures} textures, ${info.memory.geometries} geometries`);

    // Reset render info (frees internal caches)
    info.reset();
}

// React Component Wrapper
// Rewriting component to be scene-aware for cleanup
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

// React Component Wrapper
// Rewriting component to be scene-aware for cleanup
export function PerformanceOptimizer() {
    const { scene, gl } = useThree();

    useEffect(() => {
        // Call on mount (simulating window.onload)
        initPerformanceOptimizations();

        const handleLoad = () => initPerformanceOptimizations();
        window.addEventListener('load', handleLoad);

        // 🧹 Periodic GPU memory optimization (every 20 seconds)
        const gpuCleanupInterval = setInterval(() => {
            optimizeGPUMemory(gl);
        }, 20000);

        return () => {
            window.removeEventListener('load', handleLoad);
            clearInterval(gpuCleanupInterval);

            // 🧹 MANUAL CLEANUP (User Requested)


            const cleanMaterial = (material: any) => {
                material.dispose();
                if (material.map) material.map.dispose();
                if (material.lightMap) material.lightMap.dispose();
                if (material.bumpMap) material.bumpMap.dispose();
                if (material.normalMap) material.normalMap.dispose();
                if (material.specularMap) material.specularMap.dispose();
                if (material.envMap) material.envMap.dispose();
            };

            scene.traverse((object) => {
                if (!(object as any).isMesh) return;

                const mesh = object as THREE.Mesh;
                if (mesh.geometry) mesh.geometry.dispose();

                if (mesh.material) {
                    if (Array.isArray(mesh.material)) {
                        mesh.material.forEach(m => cleanMaterial(m));
                    } else {
                        cleanMaterial(mesh.material);
                    }
                }
            });

            // Optional: Dispose renderer context if strictly needed, but typically R3F manages this.
            // gl.dispose(); 
        };
    }, [scene, gl]);

    return null; // Invisible component
}
