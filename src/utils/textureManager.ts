import * as THREE from 'three';

/**
 * Shared LoadingManager for the entire application.
 * Controls the Splash Screen and ensures no "white asteroids" appear.
 */
export const textureLoadingManager = new THREE.LoadingManager();

// We will attach listeners in App.tsx to control UI state
