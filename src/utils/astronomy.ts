import type { CelestialObjectId } from '../data/objects'
import { celestialObjects } from '../data/objects'

// Position calculator for celestial objects
// Returns [x, y, z] position in 3D space

// Global speed factor to tune the overall animation speed
const GLOBAL_SPEED_FACTOR = 0.02;

export const getObjectPosition = (
    id: CelestialObjectId,
    currentTime: Date
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

    // 3. Special Case: Moon orbits Earth
    if (id === 'moon') {
        // Calculate Earth's position first
        const earth = celestialObjects.find(o => o.id === 'earth');
        if (earth) {
            const time = currentTime.getTime() / 1000;
            const earthAngle = (time * earth.science.orbitSpeed * GLOBAL_SPEED_FACTOR) + earth.science.orbitPhase;
            const earthX = Math.cos(earthAngle) * earth.science.orbitRadius;
            const earthZ = Math.sin(earthAngle) * earth.science.orbitRadius;

            // Calculate Moon's local orbit around Earth
            // Use Moon's own parameters for the offset
            const moonAngle = (time * obj.science.orbitSpeed * GLOBAL_SPEED_FACTOR) + obj.science.orbitPhase;
            // Moon orbit radius should be small relative to Earth's solar orbit
            // If data has large radius (like 80 for Sun orbit), we might need to override/clamp it or ensure data is correct.
            // Let's assume data.orbitRadius IS the local distance from Earth. check data first?
            // Actually, usually data might be "distance from sun". 
            // BUT for this fix, let's treat obj.science.orbitRadius as "Distance from Earth"
            // We need to ensure it's reasonable (e.g. 5-10 units).
            const moonRadius = obj.science.orbitRadius;

            const moonX = Math.cos(moonAngle) * moonRadius;
            const moonZ = Math.sin(moonAngle) * moonRadius;

            return [earthX + moonX, 0, earthZ + moonZ];
        }
    }

    // 4. Standard Planetary Orbital Logic
    // We use the standardized parameters from objects.ts
    const time = currentTime.getTime() / 1000;
    const { orbitRadius, orbitSpeed, orbitInclination, orbitPhase } = obj.science;

    // Calculate angle based on time, speed, and phase
    // angle = (time * speed * factor) + phase
    const angle = (time * orbitSpeed * GLOBAL_SPEED_FACTOR) + orbitPhase;

    // Calculate position
    const x = Math.cos(angle) * orbitRadius;
    const z = Math.sin(angle) * orbitRadius;

    // Orbital Inclination: Simple tilt on Z-axis primarily
    // y = sin(angle) * inclination_amplitude
    const y = Math.sin(angle) * (orbitInclination || 0);

    return [x, y, z];
};
