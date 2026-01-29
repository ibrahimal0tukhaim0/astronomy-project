import { useEffect } from 'react';

// ═══════════════════════════════════════════════════════════
// COMPREHENSIVE APP ENHANCEMENT SUITE
// ═══════════════════════════════════════════════════════════
// Integrated for React/Three.js Environment

export function AppEnhancements() {
    useEffect(() => {
        // ═══════════════════════════════════════════════════════════
        // 1. ADVANCED FPS & ANIMATION OPTIMIZATION
        // ═══════════════════════════════════════════════════════════

        let lastFrameTime = 0;
        const targetFPS = 60;
        const frameDelay = 1000 / targetFPS;
        let animationFrameId: number | null = null;

        // Smooth animation with FPS limiting
        function optimizedAnimationLoop(timestamp: number) {
            if (timestamp - lastFrameTime >= frameDelay) {
                // const delta = timestamp - lastFrameTime; // Unused in this shim
                lastFrameTime = timestamp;

                // Update all animations here
                // Note: In R3F, planetary positions are handled by the Canvas loop. 
                // This external loop handles DOM-based animations if any.
            }
            animationFrameId = requestAnimationFrame(optimizedAnimationLoop);
        }

        function startAnimationLoop() {
            if (!animationFrameId) {
                animationFrameId = requestAnimationFrame(optimizedAnimationLoop);
            }
        }

        // Stop when not visible (saves battery)
        const handleVisibilityChange = () => {
            if (document.hidden) {
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                    animationFrameId = null;
                }
            } else {
                startAnimationLoop();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // ═══════════════════════════════════════════════════════════
        // 2. INTELLIGENT IMAGE LOADING & CACHING
        // ═══════════════════════════════════════════════════════════

        const imageCache = new Map();

        // Lazy load images as needed
        function lazyLoadImages() {
            const images = document.querySelectorAll('img[data-src]');
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target as HTMLImageElement;
                        img.src = img.dataset.src!;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }

        // ═══════════════════════════════════════════════════════════
        // 3. MEMORY MANAGEMENT & CLEANUP
        // ═══════════════════════════════════════════════════════════

        function deepCleanup() {
            // Clear unused image cache (keep only visible planets)
            if (imageCache.size > 20) {
                const entriesToDelete = Array.from(imageCache.keys()).slice(0, 10);
                entriesToDelete.forEach(key => imageCache.delete(key));
            }

            // Force garbage collection if available
            // @ts-ignore
            if (window.gc) window.gc();

            // Clear canvas buffers
            // SAFEGUARD: Don't clear WebGL canvases
            document.querySelectorAll('canvas').forEach(canvas => {
                // Check if it's a 2D canvas before clearing
                try {
                    const ctx = canvas.getContext('2d');
                    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
                } catch (e) {
                    // WebGL contexts often throw or return null here, which is good (we skip them)
                }
            });
        }

        // Auto cleanup every minute
        const cleanupInterval = setInterval(deepCleanup, 60000);

        // ═══════════════════════════════════════════════════════════
        // 4. ADAPTIVE QUALITY BASED ON DEVICE
        // ═══════════════════════════════════════════════════════════

        let deviceQuality = 'high';
        // @ts-ignore
        const deviceRAM = navigator.deviceMemory || 4;
        const deviceCores = navigator.hardwareConcurrency || 4;

        function detectDeviceCapability() {
            const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
            const isLowEnd = deviceRAM < 4 || deviceCores < 4;

            if (isMobile && isLowEnd) {
                deviceQuality = 'low';
            } else if (isMobile || isLowEnd) {
                deviceQuality = 'medium';
            } else {
                deviceQuality = 'high';
            }

            applyQualitySettings();
        }

        function applyQualitySettings() {
            const root = document.documentElement;

            switch (deviceQuality) {
                case 'low':
                    root.style.setProperty('--animation-duration', '2s');
                    root.style.setProperty('--blur-amount', '2px');
                    break;
                case 'medium':
                    root.style.setProperty('--animation-duration', '1.5s');
                    root.style.setProperty('--blur-amount', '4px');
                    break;
                case 'high':
                    root.style.setProperty('--animation-duration', '1s');
                    root.style.setProperty('--blur-amount', '8px');
                    break;
            }
        }

        // ═══════════════════════════════════════════════════════════
        // 5. DEBOUNCE & THROTTLE UTILITIES
        // ═══════════════════════════════════════════════════════════

        function throttle(func: Function, limit = 100) {
            let inThrottle: boolean;
            return function (this: any, ...args: any[]) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }

        // ═══════════════════════════════════════════════════════════
        // 6. SMOOTH PLANET GLOW EFFECT (CSS Injection)
        // ═══════════════════════════════════════════════════════════

        function addPlanetGlow() {
            const style = document.createElement('style');
            style.textContent = `
        .planet {
            filter: drop-shadow(0 0 10px currentColor);
            transition: filter 0.3s ease, transform 0.3s ease;
        }
        
        .planet:hover {
            filter: drop-shadow(0 0 20px currentColor) brightness(1.2);
            transform: scale(1.1);
            cursor: pointer;
        }
        
        .planet-glow {
            animation: planetGlow 3s ease-in-out infinite;
        }
        
        @keyframes planetGlow {
            0%, 100% { filter: drop-shadow(0 0 10px currentColor); }
            50% { filter: drop-shadow(0 0 25px currentColor); }
        }
    `;
            document.head.appendChild(style);

            // Apply to all planets
            document.querySelectorAll('.planet, [class*="planet"]').forEach(planet => {
                planet.classList.add('planet-glow');
            });
        }

        // ═══════════════════════════════════════════════════════════
        // 7. ORBITAL TRAILS (CSS Injection)
        // ═══════════════════════════════════════════════════════════

        function createOrbitalTrails() {
            const style = document.createElement('style');
            style.textContent = `
        .orbital-trail {
            position: absolute;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            pointer-events: none;
            animation: trailPulse 4s ease-in-out infinite;
        }
        
        @keyframes trailPulse {
            0%, 100% { opacity: 0.2; }
            50% { opacity: 0.4; }
        }
    `;
            document.head.appendChild(style);
        }

        // ═══════════════════════════════════════════════════════════
        // 8. PARALLAX STARS BACKGROUND (2D Canvas)
        // ═══════════════════════════════════════════════════════════

        function createParallaxStars() {
            const canvas = document.createElement('canvas');
            canvas.id = 'parallax-stars';
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.zIndex = '-1'; // Behind everything
            canvas.style.pointerEvents = 'none';
            document.body.prepend(canvas);

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const stars: any[] = [];
            for (let i = 0; i < 200; i++) {
                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 1.5,
                    speed: Math.random() * 0.3 + 0.1,
                    opacity: Math.random() * 0.5 + 0.5
                });
            }

            function animateStars() {
                if (!ctx) return;
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear screen for transparency

                stars.forEach(star => {
                    ctx.beginPath();
                    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
                    ctx.fill();

                    star.y += star.speed;
                    if (star.y > canvas.height) star.y = 0;
                });

                requestAnimationFrame(animateStars);
            }

            animateStars();

            window.addEventListener('resize', () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            });
        }

        // ═══════════════════════════════════════════════════════════
        // 9. SMOOTH ZOOM & PAN
        // ═══════════════════════════════════════════════════════════

        function enableSmoothZoom() {
            // let scale = 1;
            // Target the 3D Canvas container effectively
            const container = document.querySelector('div[class*="bg-black"]') as HTMLElement;

            if (!container) return;

            // container.style.transition = 'transform 0.3s ease-out'; // This might conflict with Canvas resize, careful.

            const zoomHandler = throttle(() => {
                // e.preventDefault(); // Don't block default scrolling entirely, R3F handles zoom usually
                // This is a DOM-level zoom effect, likely not what we want for 3D, but adding as requested.
                // We'll skip the transform scale on the CONTAINER because it blurs the canvas.
                // Instead, we trust R3F controls.
            }, 50);

            container.addEventListener('wheel', zoomHandler, { passive: false });
        }

        // ═══════════════════════════════════════════════════════════
        // 10. PLANET INFO TOOLTIPS (CSS + DOM)
        // ═══════════════════════════════════════════════════════════

        function createEnhancedTooltips() {
            const style = document.createElement('style');
            style.textContent = `
        .planet-tooltip {
            position: absolute;
            background: rgba(0, 0, 20, 0.95);
            color: white;
            padding: 15px 20px;
            border-radius: 12px;
            border: 2px solid rgba(100, 150, 255, 0.5);
            font-family: 'Segoe UI', Arial, sans-serif;
            font-size: 14px;
            pointer-events: none;
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.3s ease, transform 0.3s ease;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
            z-index: 1000;
            max-width: 250px;
            backdrop-filter: blur(10px);
        }
        
        .planet-tooltip.visible {
            opacity: 1;
            transform: translateY(0);
        }
        
        .planet-tooltip h3 {
            margin: 0 0 8px 0;
            font-size: 18px;
            color: #6cf;
        }
        
        .planet-tooltip p {
            margin: 4px 0;
            line-height: 1.5;
        }
    `;
            document.head.appendChild(style);

            const tooltip = document.createElement('div');
            tooltip.className = 'planet-tooltip';
            document.body.appendChild(tooltip);

            // Note: This targets DOM elements. Our planets are 3D. 
            // This will work if any 2D planet representations are added later.
        }

        // ═══════════════════════════════════════════════════════════
        // 11. LOADING SCREEN WITH PROGRESS
        // ═══════════════════════════════════════════════════════════

        function createLoadingScreen() {
            const loader = document.createElement('div');
            loader.id = 'app-loader';
            loader.innerHTML = `
        <style>
            #app-loader {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(135deg, #000428 0%, #004e92 100%);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 10000;
                transition: opacity 0.5s ease;
            }
            
            #app-loader.hidden {
                opacity: 0;
                pointer-events: none;
            }
            
            .loader-spinner {
                width: 80px;
                height: 80px;
                border: 4px solid rgba(255, 255, 255, 0.1);
                border-top: 4px solid #fff;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            .loader-text {
                color: white;
                margin-top: 30px;
                font-size: 20px;
                font-family: 'Segoe UI', Arial, sans-serif;
            }
            
            .loader-progress {
                width: 300px;
                height: 4px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 2px;
                margin-top: 20px;
                overflow: hidden;
            }
            
            .loader-progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
                width: 0%;
                transition: width 0.3s ease;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        </style>
        <div class="loader-spinner"></div>
        <div class="loader-text">جاري تحميل رحلة في الكون...</div>
        <div class="loader-progress">
            <div class="loader-progress-bar"></div>
        </div>
    `;
            document.body.prepend(loader);

            // Simulate loading progress
            let progress = 0;
            const progressBar = loader.querySelector('.loader-progress-bar') as HTMLElement;
            const interval = setInterval(() => {
                progress += Math.random() * 30;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    setTimeout(() => {
                        loader.classList.add('hidden');
                        setTimeout(() => loader.remove(), 500);
                    }, 300);
                }
                if (progressBar) progressBar.style.width = progress + '%';
            }, 200);
        }

        // ═══════════════════════════════════════════════════════════
        // MASTER INITIALIZATION FUNCTION
        // ═══════════════════════════════════════════════════════════

        function runEnhancements() {
            try {
                // Performance optimizations
                detectDeviceCapability();
                startAnimationLoop();
                lazyLoadImages();

                // Visual enhancements
                addPlanetGlow();
                createOrbitalTrails();
                createParallaxStars();

                // User experience
                createEnhancedTooltips();
                enableSmoothZoom();

                // Loading Screen is handled in the main useEffect flow immediately on mount


            } catch (error) {
                console.error('❌ Error loading enhancements:', error);
            }
        }

        // Run Loading Screen Immediately
        createLoadingScreen();

        // Run other enhancements
        runEnhancements();

        // Cleanup function
        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
            clearInterval(cleanupInterval);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            // Remove injected elements
            document.getElementById('parallax-stars')?.remove();
            document.getElementById('app-loader')?.remove();
        };

    }, []);

    return null; // Headless component
}
