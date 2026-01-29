import type { CelestialObjectId } from '../types'
import { celestialObjects } from '../data/objects'

// Position calculator for celestial objects
// Returns [x, y, z] position in 3D space

// Global speed factor to tune the overall animation speed
const GLOBAL_SPEED_FACTOR = 0.16;

export const getObjectPosition = (
    id: CelestialObjectId,
    currentTime: Date,
    marathonMode: boolean = false
): [number, number, number] => {
    // Force Re-Calc


    // 1. Find the object data
    const obj = celestialObjects.find(o => o.id === id);
    if (!obj) return [0, 0, 0];

    // 2. Special Fixed Objects
    // Sun is always fixed at center
    if (id === 'sun') return [0, 0, 0];

    // Static Objects (Stars/Constellations)
    // If orbitRadius is 0, we use the initialPosition from data
    // This allows adding Sirius, Al-Tariq, Orion, etc. just by updating objects.ts
    // without modifying code here.
    if (obj.science.orbitRadius === 0) {
        // Special case for Al-Tariq pulse if needed, otherwise just return position
        if (id === 'al-tariq') {
            const time = currentTime.getTime() / 1000;
            const pulse = Math.sin(time * 2) * 0.5;
            return [obj.initialPosition[0], obj.initialPosition[1] + pulse, obj.initialPosition[2]];
        }
        return obj.initialPosition;
    }

    // 3. Marathon Mode Logic (Alignment)
    if (marathonMode) {
        // Planets align on X-axis
        const planets = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
        if (planets.includes(id)) {
            // Align on X axis based on radius
            // We use orbitRadius as the distance from Sun (0,0,0)
            return [obj.science.orbitRadius, 0, 0];
        }

        // Moon aligns relative to Earth (Fixed offset)
        if (id === 'moon') {
            const earth = celestialObjects.find(o => o.id === 'earth');
            if (earth) {
                // Determine Earth's marathon position
                const earthX = earth.science.orbitRadius;
                // Place moon slightly offset on X or Z
                // X offset makes it "in line", Z offset makes it visible "beside"
                return [earthX + obj.science.orbitRadius, 0, 0];
            }
        }

        // Stars/Sun/Comet stay in their original spot (or standard logic)
        // Fall through to standard logic for non-planets? 
        // Logic below handles static objects (stars) correctly.
        // Logic below handles standard orbiting (comet).
        // If we want Comet to free-roam, we let it fall through.
    }

    // 4. Special Case: Moon orbits Earth (Standard)
    if (id === 'moon') {
        // Calculate Earth's position first
        // Note: passing false for recursive call to ensure Moon orbits the *moving* Earth if not in marathon
        const earthPos = getObjectPosition('earth', currentTime, false);
        const time = currentTime.getTime() / 1000;

        // Calculate Moon's local orbit
        const moonRadius = obj.science.orbitRadius;
        const moonAngle = (time * obj.science.orbitSpeed * GLOBAL_SPEED_FACTOR) + obj.science.orbitPhase;

        const moonX = Math.cos(moonAngle) * moonRadius;
        const moonZ = Math.sin(moonAngle) * moonRadius;

        return [earthPos[0] + moonX, 0, earthPos[2] + moonZ];
    }

    // 5. Standard Planetary Orbital Logic
    // We use the standardized parameters from objects.ts
    const time = currentTime.getTime() / 1000;
    const { orbitRadius, orbitSpeed, orbitInclination, orbitPhase } = obj.science;

    // Calculate angle based on time, speed, and phase
    // angle = (time * speed * factor) + phase
    const angle = (time * orbitSpeed * GLOBAL_SPEED_FACTOR) + orbitPhase;

    // Calculate position
    // Elliptical Orbit Logic:
    // x = r * cos(angle)
    // z = r * sin(angle) * (1 - eccentricity) -> squashes the circle into ellipse

    const ecc = obj.science.eccentricity || 0;

    // For visual simplicity, we squash Z axis. 
    // Real Keplerian orbits are complex; this creates the visual effect of an ellipse.
    // For Halley (high eccentricity), we might want to offset the center (Sun) too?
    // Ellipse with focus at origin: r(theta) = p / (1 + e*cos(theta))
    // Let's stick to simple scaling for now as requested "Orbit Group".

    let x = Math.cos(angle) * orbitRadius;
    let z = Math.sin(angle) * orbitRadius;

    if (ecc > 0) {
        // Simple squashing centered at Sun
        // To make it look like sun is at focus, we need to shift.
        // Shift factor ~ eccentricity * radius
        x = (Math.cos(angle) * orbitRadius) + (ecc * orbitRadius * 0.5);
        z = Math.sin(angle) * orbitRadius * (1 - ecc);
    }

    // Orbital Inclination: Simple tilt on Z-axis primarily
    // y = sin(angle) * inclination_amplitude
    const y = Math.sin(angle) * (orbitInclination || 0);

    return [x, y, z];
};
