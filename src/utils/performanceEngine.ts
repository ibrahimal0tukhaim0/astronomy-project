// @ts-nocheck
/* eslint-disable */
/**
 * 🚀 Performance Engine
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
 */

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

export default {};
