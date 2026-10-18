/**
 * avatarConfig.js
 * Central configuration for the 3D Virtual Character Experience.
 * To swap with your own character later, replace the model paths below
 * with any character that uses standard Mixamo bone naming.
 */

export const AVATAR_CONFIG = {
  // Source model paths (all FBX files in centimeters -> scale 0.01)
  models: {
    skin: "/models/mixamo/T-Pose.fbx",
    sitIdle: "/models/mixamo/Sitting.fbx",
    sitToStand: "/models/mixamo/Sit_To_Stand.fbx",
    walk: "/models/mixamo/Walking.fbx",
  },

  // Units scale for Mixamo FBX (centimeters to meters)
  scale: 0.01,

  // Character physical dimensions & seating alignment
  seat: {
    surfaceHeight: 0.47, // ~47 cm from ground
    centerZ: -0.24, // seat center relative to avatar root origin
    chairBackHeight: 0.95,
    seatWidth: 0.52,
    seatDepth: 0.50,
  },

  desk: {
    height: 0.72,
    width: 1.40,
    depth: 0.65,
    centerZ: 0.32,
  },

  // Walk locomotion kinematics
  walk: {
    cycleDistance: 1.85, // 1 walk loop travels 1.85 m
    clipDuration: 1.02, // 1 cycle duration in seconds
    totalDistance: 2.20, // Total meters walked forward toward camera
  },

  // Transition corrections between clips
  transitions: {
    sitToStandZShift: 0.27, // Start pose of sitToStand is ~0.27m forward of sitIdle
    sitToStandYShift: -0.045,
    crossfadeDuration: 0.25,
  },

  // Arm twists for Arms-Spread (T-Pose with palms up)
  // T-Pose has arms out sideways. These rotations twist forearm and hand so palms face UP.
  armTwist: {
    leftForeArm: { x: 0, y: -Math.PI / 2, z: 0 },
    rightForeArm: { x: 0, y: Math.PI / 2, z: 0 },
    leftHand: { x: 0, y: -0.25, z: 0 },
    rightHand: { x: 0, y: 0.25, z: 0 },
  },

  // Avatar material & digital twin aesthetic
  materials: {
    bodyColor: "#12131a",
    roughness: 0.35,
    metalness: 0.75,
    rimColor: "#06b6d4", // Cyan rim
    glowColor: "#8b5cf6", // Violet glow
    wireframeJoints: false,
    collarColor: "#e4e4e7",
  },

  // Normalized scroll timeline ranges (0.00 to 1.00)
  timeline: {
    sitIdle: [0.00, 0.12],
    sitToStand: [0.12, 0.30],
    walk: [0.30, 0.55],
    armsSpread: [0.55, 0.62],
    projectReveal: [0.62, 0.95],
    stageEnd: [0.95, 1.00],
  },

  // Camera keyframe coordinates [x, y, z] and lookAt targets [x, y, z]
  camera: {
    fov: 35,
    maxMouseParallax: 0.15,
    keyframes: {
      sit: {
        position: [0.0, 1.25, 2.75],
        target: [0.0, 0.92, -0.24],
      },
      stand: {
        position: [0.0, 1.45, 3.60],
        target: [0.0, 1.05, 0.20],
      },
      walkEnd: {
        position: [0.0, 1.55, 5.40],
        target: [0.0, 1.10, 2.20],
      },
      projects: {
        position: [0.0, 1.48, 5.20],
        target: [0.0, 1.15, 2.20],
      },
    },
  },

  // Total stage scroll height in viewport heights
  scrollTrackHeight: "1000vh",
};
