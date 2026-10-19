/**
 * avatarConfig.js
 * Central configuration for the 3D Virtual Character Experience.
 * To swap with your own character later, replace the model paths below
 * with any character that uses standard Mixamo bone naming.
 */

export const AVATAR_CONFIG = {
  // Source model paths (Mixamo FBX files in centimeters -> scale 0.01)
  models: {
    skin: "/models/mixamo/T-Pose.fbx",
    sitIdle: "/models/mixamo/Sitting.fbx",
    sitToStand: "/models/mixamo/Sit_To_Stand.fbx",
    walk: "/models/mixamo/Walking.fbx",
  },

  // Units scale for Mixamo FBX (centimeters to meters)
  scale: 0.01,

  // Character seating & studio chair
  seat: {
    surfaceHeight: 0.47, // Cushion surface height from floor
    centerZ: -0.26, // Seat center (placed to avoid leg clipping during stand)
    chairBackHeight: 0.95,
    seatWidth: 0.52,
    seatDepth: 0.48,
  },

  // Side console / low table for laptop (stage left of avatar: positive X, outside walking path)
  sideTable: {
    width: 0.42,
    depth: 0.42,
    height: 0.54,
    x: 0.68, // Outside walking corridor (-0.4m to +0.4m)
    z: -0.18,
  },

  // Walk locomotion kinematics (straight forward toward camera)
  walk: {
    cycleDistance: 1.85, // 1 walk loop travels 1.85 m
    clipDuration: 1.02, // 1 cycle duration in seconds
    totalDistance: 2.20, // Total meters walked forward toward camera
  },

  // Transition corrections between clips
  transitions: {
    sitToStandZShift: 0.27, // Start pose offset of sitToStand relative to sitIdle
    sitToStandYShift: -0.045,
    crossfadeDuration: 0.25,
  },

  // Arm & hand twist angles for Arms-Spread pose (tPose with palms facing UP)
  // Rotations are applied along the longitudinal axis of each bone.
  // Standard Mixamo T-Pose has palms facing DOWN (-Y); a ~165-175° roll turns palms cleanly UP (+Y).
  armTwist: {
    // Rotation angles in radians
    leftForeArmRoll: Math.PI * 0.92, // Forearm roll turning palm up
    rightForeArmRoll: -Math.PI * 0.92,
    leftHandRoll: Math.PI * 0.08, // Hand fine alignment
    rightHandRoll: -Math.PI * 0.08,
  },

  // Digital twin aesthetic & materials
  materials: {
    bodyColor: "#0d0e12",
    roughness: 0.42,
    metalness: 0.65,
    rimColor: "#8da0af", // Steel-slate rim accent
    glowColor: "#121a22", // Deep architectural slate
    collarColor: "#eaeef1",
    floorColor: "#030508", // Seamless void matching page background
    floorRoughness: 0.3,
    floorMetalness: 0.7,
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
    // Lateral camera offset in early phase: -0.56 shifts avatar to ~65% of viewport width
    initialLateralOffset: -0.56,
    keyframes: {
      sit: {
        position: [-0.56, 1.25, 2.75],
        target: [-0.56, 0.95, -0.26],
      },
      stand: {
        position: [0.0, 1.45, 3.60],
        target: [0.0, 1.05, 0.20],
      },
      walkEnd: {
        position: [0.0, 1.60, 5.80],
        target: [0.0, 1.15, 2.20],
      },
      projects: {
        // Raised and pulled back so avatar, open hands, and cards all fit comfortably below navbar
        position: [0.0, 1.85, 6.70],
        target: [0.0, 1.28, 2.20],
      },
    },
  },

  // Total stage scroll height in viewport heights
  scrollTrackHeight: "1000vh",
};
