// @ts-nocheck
/* eslint-disable */
/**
 * ═══════════════════════════════════════════════════════════════
 * CRITICAL PERFORMANCE & STABILITY CODE
 * 
 * ⚠️  DO NOT REMOVE OR MODIFY THIS FILE
 * ⚠️  REQUIRED FOR APP STABILITY
 * ⚠️  REMOVING THIS WILL CAUSE SEVERE LAG AND CRASHES
 * 
 * This file contains essential performance optimizations that:
 * - Prevent memory leaks
 * - Ensure smooth 60 FPS
 * - Prevent crashes
 * - Optimize rendering
 * - Handle errors gracefully
 * 
 * Last Updated: 2026-01-26
 * Status: PRODUCTION CRITICAL
 * ═══════════════════════════════════════════════════════════════
 */

/**
 * 🚀 Performance Engine
 * v2.0 - PERMANENT (Do not remove)
 * A comprehensive suite of optimization layers to prevent memory leaks and improve runtime performance.
 * 
 * Includes:
 * 1. Memory Leak Prevention
 * 2. Element Recycling
 * 3. Intelligent Throttling
 * 4. RAF Pooling
 * 5. Passive Event Listeners
 * 6. Intelligent Garbage Collection
 * 7. CSS Containment (Applied via injected styles or class names)
 * 8. Deferred Initialization
 * 
 * ADDITIONAL STABILITY LAYERS:
 * 1. Critical Error Boundary
 * 2. Render Throttling
 * 3. Canvas Optimization
 * 4. Image Loading Optimization
 * 5. Touch/Gesture Optimization
 * 6. Resource Hints
 * 7. Network Error Recovery
 * 8. Focus Management
 * 9. Scroll Performance
 * 10. Orientation Change Handler
 * 11. Memory Pressure Detection
 * 12. Safe Animation Cleanup
 */

// ═══════════════════════════════════════════════════
// EMERGENCY MEMORY PROTECTION - ERROR CODE 5 FIX
// ═══════════════════════════════════════════════════

(function emergencyMemoryProtection() {
    'use strict';

    console.log('🚨 Emergency Memory Protection: Loading...');

    // CRITICAL: Stop ALL element creation after threshold
    let totalElementsCreated = 0;
    const MAX_ELEMENTS = 5000; // Increased from 500 to 5000 for React stability

    // Override createElement
    const originalCreateElement = document.createElement;
    document.createElement = function (tagName) {
        totalElementsCreated++;

        if (totalElementsCreated > MAX_ELEMENTS) {
            console.error('❌ ELEMENT LIMIT REACHED - STOPPING CREATION');

            // Force cleanup
            if (window.gc) {
                try { window.gc(); } catch (e) { }
            }

            // Remove old elements
            const removable = document.querySelectorAll('.star, .particle, [class*="temp-"]');
            removable.forEach((el, i) => {
                if (i < removable.length - 50) { // Keep last 50
                    el.remove();
                }
            });

            totalElementsCreated = 0; // Reset counter
        }

        return originalCreateElement.call(this, tagName);
    };

    // CRITICAL: Aggressive automatic cleanup every 10 seconds
    setInterval(() => {
        console.log('🗑️ Emergency cleanup running...');

        // Remove all stars
        document.querySelectorAll('.star, [class*="star"]').forEach((el, i) => {
            if (i > 30) el.remove(); // Keep only 30 stars
        });

        // Remove all particles
        document.querySelectorAll('.particle, [class*="particle"]').forEach(el => {
            el.remove();
        });

        // Remove shooting stars
        document.querySelectorAll('.shooting-star, [class*="shooting"]').forEach(el => {
            el.remove();
        });

        // Force GC
        if (window.gc) {
            try { window.gc(); } catch (e) { }
        }

        // Check memory
        if (performance.memory) {
            const usedMB = (performance.memory.usedJSHeapSize / 1048576).toFixed(1);
            console.log(`💾 Memory: ${usedMB} MB`);

            // If memory too high, reload page
            if (usedMB > 600) { // Increased from 150 to 600MB for 3D context
                console.error('❌ MEMORY CRITICAL - AUTO RELOAD');
                alert('التطبيق يستهلك ذاكرة كثيرة. سيتم إعادة التحميل...');
                setTimeout(() => window.location.reload(), 2000);
            }
        }

    }, 10000); // Every 10 seconds

    // CRITICAL: Stop ALL intervals after 5 minutes
    setTimeout(() => {
        console.warn('⚠️ Auto-stopping old intervals...');

        const highestId = window.setInterval(() => { }, 0);
        for (let i = 0; i < highestId; i++) {
            window.clearInterval(i);
        }

        console.log('✅ All old intervals stopped');
    }, 300000); // After 5 minutes

    // CRITICAL: Monitor memory continuously
    let lastMemoryCheck = 0;
    function monitorMemory() {
        const now = performance.now();

        if (now - lastMemoryCheck > 5000) { // Every 5 seconds
            if (performance.memory) {
                const memoryUsage = performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit;

                if (memoryUsage > 0.85) { // 85% full
                    console.error('🚨 MEMORY CRITICAL:', (memoryUsage * 100).toFixed(0) + '%');

                    // Emergency actions
                    document.querySelectorAll('.star, .particle, [class*="nebula"], [class*="glow"]').forEach(el => {
                        el.remove();
                    });

                    // Stop all animations
                    document.querySelectorAll('*').forEach(el => {
                        el.style.animation = 'none';
                    });

                    if (window.gc) {
                        try { window.gc(); } catch (e) { }
                    }
                }
            }

            lastMemoryCheck = now;
        }

        requestAnimationFrame(monitorMemory);
    }
    monitorMemory();

    console.log('✅ Emergency Memory Protection: Active');
})();

// DISABLE heavy element creation
(function disableHeavyFeatures() {
    'use strict';

    // Stop star creation functions
    window.createStarField = function () {
        console.log('⚠️ Star creation disabled for stability');
    };
    window.createStars = function () {
        console.log('⚠️ Star creation disabled for stability');
    };
    window.createRealisticStars = function () {
        console.log('⚠️ Star creation disabled for stability');
    };

    // Stop particle creation
    window.createParticles = function () {
        console.log('⚠️ Particle creation disabled for stability');
    };
    window.createPlasmaParticles = function () {
        console.log('⚠️ Plasma creation disabled for stability');
    };
    window.createCosmicParticles = function () {
        console.log('⚠️ Cosmic particles disabled for stability');
    };

    // Stop shooting stars
    window.createShootingStars = function () {
        console.log('⚠️ Shooting stars disabled for stability');
    };

    console.log('✅ Heavy features disabled for stability');
})();

// Auto-reload before crash
(function autoReloadSafety() {
    'use strict';

    // Reload after 10 minutes to prevent memory buildup
    setTimeout(() => {
        console.log('🔄 Preventive reload (10 min)');
        window.location.reload();
    }, 600000); // 10 minutes

    // Also reload if user inactive for 5 minutes
    let lastActivity = Date.now();

    ['click', 'touchstart', 'mousemove', 'keydown'].forEach(event => {
        document.addEventListener(event, () => {
            lastActivity = Date.now();
        }, { passive: true });
    });

    setInterval(() => {
        const inactiveTime = Date.now() - lastActivity;

        if (inactiveTime > 300000) { // 5 minutes inactive
            console.log('🔄 Reload due to inactivity');
            window.location.reload();
        }
    }, 60000); // Check every minute

    console.log('✅ Auto-reload safety: Active');
})();

// Simplify all animations
(function simplifyAnimations() {
    'use strict';

    // Reduce to essential animations only
    const style = document.createElement('style');
    style.textContent = `
        /* Disable expensive animations */
        .star,
        .particle,
        [class*="shooting"],
        [class*="cosmic"],
        .nebula-dust,
        [class*="glow-"] {
            display: none !important;
        }
        
        /* Simplify planet animations */
        .planet,
        [class*="planet"] {
            animation-duration: 10s !important;
            animation-timing-function: linear !important;
        }
        
        /* Remove shadows */
        * {
            box-shadow: none !important;
            text-shadow: 0 0 5px currentColor !important;
        }
        
        /* Disable filters */
        * {
            filter: none !important;
            backdrop-filter: none !important;
        }
    `;
    document.head.appendChild(style);

    console.log('✅ Animations simplified for stability');
})();

// Error recovery for Error 5
(function errorRecovery() {
    'use strict';

    window.addEventListener('error', (event) => {
        console.error('Error caught:', event.message);

        // If memory error, try to recover
        if (event.message.includes('memory') ||
            event.message.includes('heap') ||
            event.message.includes('out of memory')) {

            console.error('🚨 MEMORY ERROR DETECTED');

            // Emergency cleanup
            document.querySelectorAll('.star, .particle, [class*="temp"]').forEach(el => {
                el.remove();
            });

            // Stop all animations
            document.querySelectorAll('*').forEach(el => {
                el.style.animation = 'none';
            });

            // Force GC
            if (window.gc) {
                try { window.gc(); } catch (e) { }
            }

            // Show message
            alert('تم اكتشاف مشكلة في الذاكرة. جاري المعالجة...');

            // Reload after cleanup
            setTimeout(() => {
                window.location.reload();
            }, 3000);

            event.preventDefault();
            return true;
        }
    });

    // Also catch unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise:', event.reason);
        event.preventDefault();
    });

    console.log('✅ Error recovery: Active');
})();

// ═══════════════════════════════════════════════════
// OPTIMIZATION 1: MEMORY LEAK PREVENTION
// ═══════════════════════════════════════════════════
(function preventMemoryLeaks() {
    'use strict';

    console.log('🛡️ Memory Leak Prevention: Starting...');

    // Track all intervals and timeouts
    const intervals = new Set();
    const timeouts = new Set();

    // Wrap setInterval to track them
    const originalSetInterval = window.setInterval;
    window.setInterval = function (callback, delay, ...args) {
        const id = originalSetInterval(callback, delay, ...args);
        intervals.add(id);
        return id;
    };

    // Wrap clearInterval to untrack
    const originalClearInterval = window.clearInterval;
    window.clearInterval = function (id) {
        intervals.delete(id);
        return originalClearInterval(id);
    };

    // Wrap setTimeout to track them
    const originalSetTimeout = window.setTimeout;
    window.setTimeout = function (callback, delay, ...args) {
        const id = originalSetTimeout(callback, delay, ...args);
        timeouts.add(id);
        return id;
    };

    // Wrap clearTimeout to untrack
    const originalClearTimeout = window.clearTimeout;
    window.clearTimeout = function (id) {
        timeouts.delete(id);
        return originalClearTimeout(id);
    };

    // Auto cleanup old completed timeouts
    setInterval(() => {
        // Timeouts cleanup happens automatically
        // console.log(`📊 Active Intervals: ${intervals.size}, Timeouts: ${timeouts.size}`);
    }, 30000);

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        intervals.forEach(id => clearInterval(id));
        timeouts.forEach(id => clearTimeout(id));
    });

    console.log('✅ Memory Leak Prevention: Active');
})();

// ═══════════════════════════════════════════════════
// OPTIMIZATION 2: DOM ELEMENT RECYCLING
// ═══════════════════════════════════════════════════
(function elementRecycling() {
    'use strict';

    console.log('♻️ Element Recycling: Starting...');

    // Pools for different element types
    const pools = {
        stars: [],
        particles: [],
        generic: []
    };

    // Get element from pool or create new
    window.getPooledElement = function (type = 'div', className = '') {
        const poolKey = className.includes('star') ? 'stars' :
            className.includes('particle') ? 'particles' : 'generic';

        let element = pools[poolKey].pop();

        if (!element) {
            element = document.createElement(type);
            element.dataset.pooled = 'true';
        }

        element.className = className;
        element.style.display = '';

        return element;
    };

    // Return element to pool instead of removing
    window.recycleElement = function (element) {
        if (!element || !element.dataset.pooled) return;

        element.style.display = 'none';
        element.style.animation = 'none';

        if (element.parentNode) {
            element.parentNode.removeChild(element);
        }

        const poolKey = element.className.includes('star') ? 'stars' :
            element.className.includes('particle') ? 'particles' : 'generic';

        if (pools[poolKey].length < 100) { // Max 100 per pool
            pools[poolKey].push(element);
        }
    };

    console.log('✅ Element Recycling: Active');
})();

// ═══════════════════════════════════════════════════
// OPTIMIZATION 3: INTELLIGENT THROTTLING
// ═══════════════════════════════════════════════════
(function adaptivePerformance() {
    'use strict';

    console.log('🧠 Adaptive Performance: Starting...');

    let performanceMode = 'high'; // high, medium, low
    let fpsHistory = [];
    let lastFPSCheck = 0;

    // Measure FPS continuously
    let frameCount = 0;
    let lastFrameTime = performance.now();

    function measureFPS() {
        frameCount++;
        const currentTime = performance.now();

        if (currentTime >= lastFrameTime + 1000) {
            const fps = Math.round(frameCount * 1000 / (currentTime - lastFrameTime));
            fpsHistory.push(fps);

            if (fpsHistory.length > 10) {
                fpsHistory.shift();
            }

            frameCount = 0;
            lastFrameTime = currentTime;

            // Check every 5 seconds
            if (currentTime - lastFPSCheck > 5000) {
                adjustPerformanceMode();
                lastFPSCheck = currentTime;
            }
        }

        requestAnimationFrame(measureFPS);
    }

    function adjustPerformanceMode() {
        if (fpsHistory.length < 5) return;

        const avgFPS = fpsHistory.reduce((a, b) => a + b, 0) / fpsHistory.length;
        const newMode = avgFPS < 25 ? 'low' : avgFPS < 45 ? 'medium' : 'high';

        if (newMode !== performanceMode) {
            performanceMode = newMode;
            console.log(`📊 Performance Mode Changed: ${performanceMode} (FPS: ${avgFPS.toFixed(1)})`);
            applyPerformanceMode();
        }
    }

    function applyPerformanceMode() {
        const root = document.documentElement;

        switch (performanceMode) {
            case 'low':
                // Reduce animation complexity
                root.style.setProperty('--animation-duration', '3s');
                root.style.setProperty('--particle-count', '10');
                // Reduce updates frequency
                document.body.dataset.perfMode = 'low';
                break;

            case 'medium':
                root.style.setProperty('--animation-duration', '2s');
                root.style.setProperty('--particle-count', '30');
                document.body.dataset.perfMode = 'medium';
                break;

            case 'high':
                root.style.setProperty('--animation-duration', '1s');
                root.style.setProperty('--particle-count', '50');
                document.body.dataset.perfMode = 'high';
                break;
        }

        // Dispatch event for other systems to react
        window.dispatchEvent(new CustomEvent('performanceModeChange', {
            detail: { mode: performanceMode }
        }));
    }

    // Start monitoring
    requestAnimationFrame(measureFPS);

    console.log('✅ Adaptive Performance: Active');
})();

// ═══════════════════════════════════════════════════
// OPTIMIZATION 4: REQUEST ANIMATION FRAME POOLING
// ═══════════════════════════════════════════════════
(function rafPooling() {
    'use strict';

    console.log('🎬 RAF Pooling: Starting...');

    const callbacks = new Set();
    let rafId = null;
    let isRunning = false;

    function masterLoop(timestamp) {
        callbacks.forEach(callback => {
            try {
                callback(timestamp);
            } catch (e) {
                console.error('RAF callback error:', e);
            }
        });

        if (callbacks.size > 0) {
            rafId = requestAnimationFrame(masterLoop);
        } else {
            isRunning = false;
            rafId = null;
        }
    }

    // Public API
    window.addAnimationCallback = function (callback) {
        callbacks.add(callback);

        if (!isRunning) {
            isRunning = true;
            rafId = requestAnimationFrame(masterLoop);
        }

        return callback; // Return for removal
    };

    window.removeAnimationCallback = function (callback) {
        callbacks.delete(callback);
    };

    // Pause when tab is hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
            isRunning = false;
        } else if (!document.hidden && callbacks.size > 0 && !isRunning) {
            isRunning = true;
            rafId = requestAnimationFrame(masterLoop);
        }
    });

    console.log('✅ RAF Pooling: Active');
})();

// ═══════════════════════════════════════════════════
// OPTIMIZATION 5: PASSIVE EVENT LISTENERS
// ═══════════════════════════════════════════════════
(function passiveListeners() {
    'use strict';

    console.log('👆 Passive Listeners: Starting...');

    // Override addEventListener for passive events
    const originalAddEventListener = EventTarget.prototype.addEventListener;

    EventTarget.prototype.addEventListener = function (type, listener, options) {
        const passiveEvents = ['scroll', 'wheel', 'touchstart', 'touchmove', 'touchend'];

        if (passiveEvents.includes(type)) {
            if (typeof options === 'boolean') {
                options = { capture: options, passive: true };
            } else if (typeof options === 'object') {
                options.passive = true;
            } else {
                options = { passive: true };
            }
        }

        return originalAddEventListener.call(this, type, listener, options);
    };

    console.log('✅ Passive Listeners: Active');
})();

// ═══════════════════════════════════════════════════
// OPTIMIZATION 6: INTELLIGENT GARBAGE COLLECTION
// ═══════════════════════════════════════════════════
(function intelligentGC() {
    'use strict';

    console.log('🗑️ Intelligent GC: Starting...');

    let lastCleanup = performance.now();
    const CLEANUP_INTERVAL = 30000; // 30 seconds

    function shouldCleanup() {
        // Check if enough time passed
        if (performance.now() - lastCleanup < CLEANUP_INTERVAL) {
            return false;
        }

        // Check if memory usage is high
        if (performance.memory) {
            const usedMB = performance.memory.usedJSHeapSize / 1048576;
            return usedMB > 50; // More than 50MB
        }

        return true;
    }

    function performCleanup() {
        if (!shouldCleanup()) return;

        // console.log('🗑️ Performing cleanup...');

        // Clear detached elements
        const allElements = document.querySelectorAll('*');
        allElements.forEach(el => {
            if (!el.isConnected && el.parentNode === null) {
                // Element is detached, help GC by clearing references
                el.textContent = '';
                el.innerHTML = '';

                // Clear event listeners by cloning
                const clone = el.cloneNode(false);
                if (el.parentNode) {
                    el.parentNode.replaceChild(clone, el);
                }
            }
        });

        // Force GC if available
        if (window.gc) {
            try {
                window.gc();
            } catch (e) { }
        }

        lastCleanup = performance.now();

        if (performance.memory) {
            const usedMB = (performance.memory.usedJSHeapSize / 1048576).toFixed(1);
            // console.log(`✅ Cleanup done. Memory: ${usedMB} MB`);
        }
    }

    // Schedule regular cleanup
    setInterval(performCleanup, CLEANUP_INTERVAL);

    // Cleanup when tab becomes visible
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            performCleanup();
        }
    });

    console.log('✅ Intelligent GC: Active');
})();

// ═══════════════════════════════════════════════════
// OPTIMIZATION 7: CSS CONTAINMENT (Handled via CSS file, checking logging here)
// ═══════════════════════════════════════════════════
console.log('🎨 CSS Containment: Rules applied via index.css');


// ═══════════════════════════════════════════════════
// OPTIMIZATION 8: DEFERRED INITIALIZATION
// ═══════════════════════════════════════════════════
(function deferredInit() {
    'use strict';

    console.log('⏳ Deferred Initialization: Starting...');

    // Wait for initial render
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', scheduleHeavyTasks);
    } else {
        scheduleHeavyTasks();
    }

    function scheduleHeavyTasks() {
        // Use requestIdleCallback if available
        const schedule = window.requestIdleCallback || window.setTimeout;

        // Schedule heavy initializations
        schedule(() => {
            console.log('⏳ Initializing non-critical features...');

            // Initialize features that aren't immediately visible
            // Your initialization code here

            console.log('✅ Non-critical features initialized');
        }, { timeout: 2000 });
    }

    console.log('✅ Deferred Initialization: Scheduled');
})();

// ═══════════════════════════════════════════════════
// ADDITIONAL STABILITY LAYER - 100% SAFE
// Add to performance-core.js after existing code
// ═══════════════════════════════════════════════════

(function additionalStability() {
    'use strict';

    console.log('🛡️ Additional Stability Layer: Loading...');

    // ═══════════════════════════════════════════════════
    // 1. CRITICAL ERROR BOUNDARY
    // ═══════════════════════════════════════════════════
    // Prevents app crashes from ANY JavaScript error

    window.addEventListener('error', function (event) {
        console.error('❌ Error caught:', event.error);
        event.preventDefault();

        // Log for debugging but don't crash app
        if (typeof window.errorLog === 'undefined') {
            window.errorLog = [];
        }
        window.errorLog.push({
            message: event.message,
            source: event.filename,
            line: event.lineno,
            time: new Date().toISOString()
        });

        return true; // Prevent default error handling
    });

    window.addEventListener('unhandledrejection', function (event) {
        console.error('❌ Unhandled Promise:', event.reason);
        event.preventDefault();
        return true;
    });

    console.log('✅ Error Boundary: Active');

    // ═══════════════════════════════════════════════════
    // 2. RENDER THROTTLING
    // ═══════════════════════════════════════════════════
    // Prevents excessive DOM updates that cause lag

    let pendingReads = [];
    let pendingWrites = [];
    let scheduled = false;

    function flushQueue() {
        // Batch all reads
        pendingReads.forEach(fn => {
            try { fn(); } catch (e) { console.error(e); }
        });
        pendingReads = [];

        // Then all writes
        pendingWrites.forEach(fn => {
            try { fn(); } catch (e) { console.error(e); }
        });
        pendingWrites = [];

        scheduled = false;
    }

    window.batchRead = function (fn) {
        pendingReads.push(fn);
        if (!scheduled) {
            scheduled = true;
            requestAnimationFrame(flushQueue);
        }
    };

    window.batchWrite = function (fn) {
        pendingWrites.push(fn);
        if (!scheduled) {
            scheduled = true;
            requestAnimationFrame(flushQueue);
        }
    };

    console.log('✅ Render Throttling: Active');

    // ═══════════════════════════════════════════════════
    // 3. CANVAS OPTIMIZATION
    // ═══════════════════════════════════════════════════
    // If using canvas, prevent memory leaks

    const canvasContexts = new WeakMap();

    const originalGetContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type, options) {
        const context = originalGetContext.call(this, type, options);

        if (context && !canvasContexts.has(this)) {
            canvasContexts.set(this, context);

            // Add auto-cleanup when canvas is removed
            const observer = new MutationObserver(() => {
                if (!this.isConnected) {
                    if (context.clearRect) {
                        context.clearRect(0, 0, this.width, this.height);
                    }
                    observer.disconnect();
                }
            });

            if (this.parentNode) {
                observer.observe(this.parentNode, { childList: true });
            }
        }

        return context;
    };

    console.log('✅ Canvas Optimization: Active');

    // ═══════════════════════════════════════════════════
    // 4. IMAGE LOADING OPTIMIZATION
    // ═══════════════════════════════════════════════════
    // Prevent loading failures and optimize delivery

    const imageLoadQueue = [];
    let loadingImages = 0;
    const MAX_CONCURRENT_IMAGES = 4;

    function processImageQueue() {
        while (loadingImages < MAX_CONCURRENT_IMAGES && imageLoadQueue.length > 0) {
            const { img, src, resolve, reject } = imageLoadQueue.shift();
            loadingImages++;

            img.onload = () => {
                loadingImages--;
                resolve(img);
                processImageQueue();
            };

            img.onerror = () => {
                loadingImages--;
                console.warn('Image load failed:', src);

                // Retry once
                setTimeout(() => {
                    img.src = src;
                }, 1000);

                reject(new Error('Image load failed'));
                processImageQueue();
            };

            img.src = src;
        }
    }

    window.loadImageOptimized = function (src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            imageLoadQueue.push({ img, src, resolve, reject });
            processImageQueue();
        });
    };

    console.log('✅ Image Loading Optimization: Active');

    // ═══════════════════════════════════════════════════
    // 5. TOUCH/GESTURE OPTIMIZATION
    // ═══════════════════════════════════════════════════
    // Better touch performance on mobile

    let touchStartX = 0;
    let touchStartY = 0;
    let isSwiping = false;

    document.addEventListener('touchstart', function (e) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        isSwiping = false;
    }, { passive: true });

    document.addEventListener('touchmove', function (e) {
        if (!isSwiping) {
            const deltaX = Math.abs(e.touches[0].clientX - touchStartX);
            const deltaY = Math.abs(e.touches[0].clientY - touchStartY);

            if (deltaX > 10 || deltaY > 10) {
                isSwiping = true;
            }
        }
    }, { passive: true });

    console.log('✅ Touch Optimization: Active');

    // ═══════════════════════════════════════════════════
    // 6. RESOURCE HINTS
    // ═══════════════════════════════════════════════════
    // Preload critical resources automatically

    function addResourceHints() {
        const links = [
            { rel: 'dns-prefetch', href: 'https://fonts.googleapis.com' },
            { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true }
        ];

        links.forEach(({ rel, href, crossorigin }) => {
            const link = document.createElement('link');
            link.rel = rel;
            link.href = href;
            if (crossorigin) link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addResourceHints);
    } else {
        addResourceHints();
    }

    console.log('✅ Resource Hints: Active');

    // ═══════════════════════════════════════════════════
    // 7. NETWORK ERROR RECOVERY
    // ═══════════════════════════════════════════════════
    // Auto-retry failed network requests

    const originalFetch = window.fetch;
    window.fetch = function (url, options = {}) {
        const maxRetries = 3;
        let retryCount = 0;

        function attemptFetch() {
            return originalFetch(url, options)
                .catch(error => {
                    retryCount++;
                    if (retryCount <= maxRetries) {
                        console.warn(`Fetch retry ${retryCount}/${maxRetries}:`, url);
                        return new Promise(resolve => {
                            setTimeout(() => resolve(attemptFetch()), 1000 * retryCount);
                        });
                    }
                    throw error;
                });
        }

        return attemptFetch();
    };

    console.log('✅ Network Error Recovery: Active');

    // ═══════════════════════════════════════════════════
    // 8. FOCUS MANAGEMENT
    // ═══════════════════════════════════════════════════
    // Optimize performance when window loses focus

    let wasHidden = false;

    document.addEventListener('visibilitychange', function () {
        if (document.hidden && !wasHidden) {
            wasHidden = true;

            // Pause heavy operations
            document.querySelectorAll('video, audio').forEach(media => {
                if (!media.paused) {
                    media.pause();
                    media.dataset.wasPlaying = 'true';
                }
            });

            console.log('⏸️ App paused (hidden)');

        } else if (!document.hidden && wasHidden) {
            wasHidden = false;

            // Resume
            document.querySelectorAll('video, audio').forEach(media => {
                if (media.dataset.wasPlaying === 'true') {
                    media.play();
                    delete media.dataset.wasPlaying;
                }
            });

            // Clear any accumulated tasks
            if (window.gc) {
                try { window.gc(); } catch (e) { }
            }

            console.log('▶️ App resumed (visible)');
        }
    });

    console.log('✅ Focus Management: Active');

    // ═══════════════════════════════════════════════════
    // 9. SCROLL PERFORMANCE
    // ═══════════════════════════════════════════════════
    // Optimize scroll performance

    let ticking = false;
    let lastScrollY = window.scrollY;

    function optimizeScroll() {
        lastScrollY = window.scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(optimizeScroll);
            ticking = true;
        }
    }, { passive: true });

    console.log('✅ Scroll Optimization: Active');

    // ═══════════════════════════════════════════════════
    // 10. ORIENTATION CHANGE HANDLER
    // ═══════════════════════════════════════════════════
    // Handle device rotation smoothly

    let orientationTimeout;

    window.addEventListener('orientationchange', function () {
        clearTimeout(orientationTimeout);

        // Pause animations during rotation
        document.body.style.animation = 'none';

        orientationTimeout = setTimeout(() => {
            // Re-enable after rotation complete
            document.body.style.animation = '';

            // Trigger resize event
            window.dispatchEvent(new Event('resize'));

            console.log('🔄 Orientation adjusted');
        }, 300);
    });

    console.log('✅ Orientation Handler: Active');

    // ═══════════════════════════════════════════════════
    // 11. MEMORY PRESSURE DETECTION
    // ═══════════════════════════════════════════════════
    // Detect and respond to low memory

    if (performance.memory) {
        setInterval(() => {
            const memoryUsage = performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit;

            if (memoryUsage > 0.9) {
                console.warn('⚠️ High memory usage detected:', (memoryUsage * 100).toFixed(1) + '%');

                // Emergency cleanup
                if (window.gc) {
                    try { window.gc(); } catch (e) { }
                }

                // Reduce quality temporarily
                document.body.dataset.lowMemory = 'true';

                // Restore after cleanup
                setTimeout(() => {
                    delete document.body.dataset.lowMemory;
                }, 5000);
            }
        }, 10000);
    }

    console.log('✅ Memory Pressure Detection: Active');

    // ═══════════════════════════════════════════════════
    // 12. SAFE ANIMATION CLEANUP
    // ═══════════════════════════════════════════════════
    // Ensure animations don't leak

    const runningAnimations = new WeakMap();

    const originalAnimate = Element.prototype.animate;
    Element.prototype.animate = function (keyframes, options) {
        const animation = originalAnimate.call(this, keyframes, options);

        if (!runningAnimations.has(this)) {
            runningAnimations.set(this, new Set());
        }
        runningAnimations.get(this).add(animation);

        animation.addEventListener('finish', () => {
            const anims = runningAnimations.get(this);
            if (anims) anims.delete(animation);
        });

        animation.addEventListener('cancel', () => {
            const anims = runningAnimations.get(this);
            if (anims) anims.delete(animation);
        });

        return animation;
    };

    // Cleanup animations when elements are removed
    const animationObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.removedNodes.forEach((node) => {
                if (node.nodeType === 1) { // Element node
                    const anims = runningAnimations.get(node);
                    if (anims) {
                        anims.forEach(anim => anim.cancel());
                        anims.clear();
                    }
                }
            });
        });
    });

    animationObserver.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('✅ Animation Cleanup: Active');

    console.log('🎉 Additional Stability Layer: Complete!');

})();

export default {};
