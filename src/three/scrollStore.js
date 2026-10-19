/**
 * scrollStore.js
 * Mutable scroll store for High-Performance 60/120fps animation scrub.
 * Scroll progress is updated by GSAP ScrollTrigger and read directly in R3F useFrame.
 * Does not trigger React component re-renders.
 */

export const scrollStore = {
  // Raw scrub progress from GSAP ScrollTrigger (0.0 to 1.0)
  progress: 0,

  // Smoothed damp value computed in useFrame
  smoothedProgress: 0,

  // Progress freeze state for visual debugging (?debug=1&p=0.xx)
  isFrozen: false,
  frozenProgress: null,

  // Current stage identifier
  currentStage: "sitIdle",

  // Normalized mouse coordinates (-1 to 1) for subtle parallax
  mouseX: 0,
  mouseY: 0,

  // Intersection status (pause canvas rendering when offscreen)
  isCanvasVisible: true,

  // Debug metrics
  fps: 60,
  bones: [],
  clips: [],

  // Lightweight subscribers (e.g. for debug overlay)
  listeners: new Set(),

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },

  notify() {
    this.listeners.forEach((fn) => {
      try {
        fn(this);
      } catch (err) {
        console.error("Error in scrollStore listener:", err);
      }
    });
  },
};
