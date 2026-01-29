export class ProductionOptimizer {
    constructor() {
        this.init();
    }

    init() {
        if (typeof window === 'undefined') return;
        this.limitDOMElements();
        this.optimizeAnimations();
        this.enableLazyLoading();
        this.preventMemoryLeaks();
        this.monitorPerformance();
    }

    limitDOMElements() {
        const MAX_ELEMENTS = 1500; // Increased for Three.js overlay tolerance
        let count = 0;

        // Safety shim for potential infinite loops creating elements
        const origCreate = document.createElement;
        document.createElement = function (tag) {
            count++;
            // Reset count periodically to avoid false positives in long sessions
            if (Math.random() < 0.001) count = document.getElementsByTagName('*').length;

            if (count > MAX_ELEMENTS) {
                // console.warn('DOM limit critical, attempting cleanup...');
                const temp = document.querySelectorAll('.temp, .cached, .particle');
                if (temp.length > 0) {
                    temp.forEach((el, i) => {
                        if (i < 20) el.remove();
                    });
                    count -= 20;
                }
            }
            return origCreate.call(this, tag);
        };
    }

    optimizeAnimations() {
        // Cap strictly logic loops, NOT the main styling
        // R3F has its own loop, this affects only DOM-based requestAnimationFrame spam
    }

    enableLazyLoading() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    // @ts-ignore
                    if (el.dataset.src) {
                        // @ts-ignore
                        el.src = el.dataset.src;
                        // @ts-ignore
                        delete el.dataset.src;
                    }
                }
            });
        });

        document.querySelectorAll('[data-src]').forEach(el => {
            observer.observe(el);
        });
    }

    preventMemoryLeaks() {
        const intervals = new Set();
        const timeouts = new Set();

        const origSetInterval = window.setInterval;
        // @ts-ignore
        window.setInterval = function (...args) {
            const id = origSetInterval(...args);
            intervals.add(id);
            return id;
        };

        const origClearInterval = window.clearInterval;
        // @ts-ignore
        window.clearInterval = function (id) {
            intervals.delete(id);
            return origClearInterval(id);
        };

        window.addEventListener('beforeunload', () => {
            // @ts-ignore
            intervals.forEach(id => clearInterval(id));
            timeouts.forEach(id => clearTimeout(id));
        });

        // Auto cleanup every 60s
        setInterval(() => {
            // @ts-ignore
            if (window.gc) window.gc();
        }, 60000);
    }

    monitorPerformance() {
        if (!performance || !performance.memory) return;

        setInterval(() => {
            // @ts-ignore
            const used = performance.memory.usedJSHeapSize;
            // @ts-ignore
            const limit = performance.memory.jsHeapSizeLimit;

            if (used / limit > 0.9) {
                console.warn('Memory critical! Triggering emergency purge.');
                // Emergency cleanup
                const particles = document.querySelectorAll('.star, .particle');
                particles.forEach((el, i) => {
                    if (i > particles.length / 2) el.remove();
                });
            }
        }, 30000);
    }
}

// Auto-initialize
new ProductionOptimizer();
