import { useEffect, useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useFBX } from "@react-three/drei";
import * as THREE from "three";
import * as SkeletonUtils from "three/examples/jsm/utils/SkeletonUtils.js";
import { AVATAR_CONFIG } from "./avatarConfig";
import { scrollStore } from "./scrollStore";

/**
 * AvatarModel
 * Loads the Mixamo FBX skin and animation clips, cleans hips root motion for walk,
 * blends between sitIdle -> sitToStand -> walk -> armsSpread, and scrubs animations
 * directly with smooth damping.
 */
export default function AvatarModel({ rightHandBoneRef, leftHandBoneRef }) {
  const groupRef = useRef(null);
  const mixerRef = useRef(null);
  const actionsRef = useRef({});
  const [hasNeck, setHasNeck] = useState(false);

  // Bones refs for post-animation procedural palm twists & breathing
  const bonesRef = useRef({
    rightHand: null,
    leftHand: null,
    rightForeArm: null,
    leftForeArm: null,
    spine: null,
    neck: null,
  });

  // 1. Load FBX Assets via drei useFBX
  const skinFbx = useFBX(AVATAR_CONFIG.models.skin);
  const sitFbx = useFBX(AVATAR_CONFIG.models.sitIdle);
  const standFbx = useFBX(AVATAR_CONFIG.models.sitToStand);
  const walkFbx = useFBX(AVATAR_CONFIG.models.walk);

  // 2. Clone the skin hierarchy with SkeletonUtils to retain clean bone binding
  const avatarScene = useMemo(() => {
    return SkeletonUtils.clone(skinFbx);
  }, [skinFbx]);

  // 3. Traverse hierarchy, find bones, and apply digital twin styling inside useEffect
  useEffect(() => {
    if (!avatarScene) return;

    const discoveredBones = [];
    let foundNeck = false;

    avatarScene.traverse((child) => {
      if (child.isBone) {
        discoveredBones.push(child.name);
        const nameLower = child.name.toLowerCase();

        if (
          nameLower.includes("righthand") &&
          !nameLower.includes("thumb") &&
          !nameLower.includes("index") &&
          !nameLower.includes("middle") &&
          !nameLower.includes("ring") &&
          !nameLower.includes("pinky")
        ) {
          bonesRef.current.rightHand = child;
          if (rightHandBoneRef) rightHandBoneRef.current = child;
        } else if (
          nameLower.includes("lefthand") &&
          !nameLower.includes("thumb") &&
          !nameLower.includes("index") &&
          !nameLower.includes("middle") &&
          !nameLower.includes("ring") &&
          !nameLower.includes("pinky")
        ) {
          bonesRef.current.leftHand = child;
          if (leftHandBoneRef) leftHandBoneRef.current = child;
        } else if (nameLower.includes("rightforearm")) {
          bonesRef.current.rightForeArm = child;
        } else if (nameLower.includes("leftforearm")) {
          bonesRef.current.leftForeArm = child;
        } else if (nameLower.includes("spine2") || nameLower.includes("spine")) {
          if (!bonesRef.current.spine) bonesRef.current.spine = child;
        } else if (nameLower.includes("neck")) {
          bonesRef.current.neck = child;
          foundNeck = true;
        }
      }

      if (child.isMesh || child.isSkinnedMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Digital Twin Material Styling
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color(AVATAR_CONFIG.materials.bodyColor),
          roughness: AVATAR_CONFIG.materials.roughness,
          metalness: AVATAR_CONFIG.materials.metalness,
          emissive: new THREE.Color(AVATAR_CONFIG.materials.glowColor),
          emissiveIntensity: 0.12,
        });
      }
    });

    setHasNeck(foundNeck);
    scrollStore.bones = discoveredBones;
  }, [avatarScene, rightHandBoneRef, leftHandBoneRef]);

  // 4. Extract, Clean, and Retarget Animation Clips
  useEffect(() => {
    if (!avatarScene) return;

    const mixer = new THREE.AnimationMixer(avatarScene);
    mixerRef.current = mixer;

    // Sit Idle Clip
    const sitRaw = sitFbx.animations?.[0];
    const sitIdleClip = sitRaw ? sitRaw.clone() : new THREE.AnimationClip("sitIdle", 0.95, []);
    sitIdleClip.name = "sitIdle";

    // Sit To Stand Clip
    const standRaw = standFbx.animations?.[0];
    const sitToStandClip = standRaw ? standRaw.clone() : new THREE.AnimationClip("sitToStand", 2.25, []);
    sitToStandClip.name = "sitToStand";

    // Walk Clip - Clean Root Motion (strip X and Z translations on Hips, preserve Y bobbing)
    const walkRaw = walkFbx.animations?.[0];
    const walkClip = walkRaw ? walkRaw.clone() : new THREE.AnimationClip("walk", 1.02, []);
    walkClip.name = "walk";

    for (const track of walkClip.tracks) {
      if (track.name.toLowerCase().includes("hips.position")) {
        const initialX = track.values[0];
        const initialZ = track.values[2];
        for (let i = 0; i < track.values.length / 3; i++) {
          track.values[i * 3 + 0] = initialX; // Freeze lateral displacement
          track.values[i * 3 + 2] = initialZ; // Freeze forward displacement (driven by code)
          // track.values[i * 3 + 1] remains intact for natural walking bounce
        }
      }
    }

    // T-Pose Clip (static rest pose for arms spread)
    const tPoseRaw = skinFbx.animations?.[0];
    const tPoseClip = tPoseRaw ? tPoseRaw.clone() : new THREE.AnimationClip("tPose", 1.0, []);
    tPoseClip.name = "tPose";

    scrollStore.clips = [sitIdleClip.name, sitToStandClip.name, walkClip.name, tPoseClip.name];

    // Create Mixer Actions
    const sitAction = mixer.clipAction(sitIdleClip);
    const standAction = mixer.clipAction(sitToStandClip);
    const walkAction = mixer.clipAction(walkClip);
    const tPoseAction = mixer.clipAction(tPoseClip);

    // Prepare actions for scrubbing
    [sitAction, standAction, walkAction, tPoseAction].forEach((action) => {
      action.play();
      action.paused = true;
      action.setEffectiveWeight(0);
    });

    actionsRef.current = {
      sitIdle: sitAction,
      sitToStand: standAction,
      walk: walkAction,
      tPose: tPoseAction,
      clips: {
        sitIdle: sitIdleClip,
        sitToStand: sitToStandClip,
        walk: walkClip,
        tPose: tPoseClip,
      },
    };

    return () => {
      mixer.stopAllAction();
      mixer.uncacheRoot(avatarScene);
    };
  }, [avatarScene, sitFbx, standFbx, walkFbx, skinFbx]);

  // 5. Scrubbing & Kinematic State Updates in useFrame
  useFrame(({ clock }, delta) => {
    const mixer = mixerRef.current;
    const actions = actionsRef.current;
    const group = groupRef.current;
    if (!mixer || !actions.sitIdle || !group) return;

    // Smooth damp progress (12 damper speed for reactive yet silky motion)
    scrollStore.smoothedProgress = THREE.MathUtils.damp(
      scrollStore.smoothedProgress,
      scrollStore.progress,
      12,
      delta
    );
    const p = scrollStore.smoothedProgress;

    // Determine current stage for debug and state trackers
    if (p < 0.12) scrollStore.currentStage = "sitIdle";
    else if (p < 0.30) scrollStore.currentStage = "sitToStand";
    else if (p < 0.55) scrollStore.currentStage = "walk";
    else if (p < 0.62) scrollStore.currentStage = "armsSpread";
    else if (p < 0.95) scrollStore.currentStage = "projectReveal";
    else scrollStore.currentStage = "stageEnd";

    // -------------------------------------------------------------
    // STAGE A: Sit Idle (0.00 to 0.12)
    // -------------------------------------------------------------
    // Idle loops subtly while user views the hero copy
    const sitWeight = 1 - THREE.MathUtils.smoothstep(p, 0.08, 0.15);
    actions.sitIdle.setEffectiveWeight(Math.max(0, sitWeight));
    if (sitWeight > 0.01) {
      const sitDuration = actions.clips.sitIdle.duration;
      // Loop with clock time and subtle scrub influence
      actions.sitIdle.time = (clock.getElapsedTime() * 0.85 + p * 2) % sitDuration;
    }

    // -------------------------------------------------------------
    // STAGE B: Sit To Stand (0.12 to 0.30)
    // -------------------------------------------------------------
    let standWeight = 0;
    if (p >= 0.08 && p <= 0.35) {
      const inBlend = THREE.MathUtils.smoothstep(p, 0.08, 0.14);
      const outBlend = 1 - THREE.MathUtils.smoothstep(p, 0.28, 0.34);
      standWeight = inBlend * outBlend;
    }
    actions.sitToStand.setEffectiveWeight(Math.max(0, standWeight));
    if (standWeight > 0.01) {
      const standProgress = THREE.MathUtils.clamp((p - 0.12) / (0.30 - 0.12), 0, 1);
      actions.sitToStand.time = standProgress * actions.clips.sitToStand.duration;
    }

    // -------------------------------------------------------------
    // STAGE C: Walk toward camera (0.30 to 0.55)
    // -------------------------------------------------------------
    let walkWeight = 0;
    if (p >= 0.28 && p <= 0.58) {
      const inBlend = THREE.MathUtils.smoothstep(p, 0.28, 0.33);
      const outBlend = 1 - THREE.MathUtils.smoothstep(p, 0.51, 0.56);
      walkWeight = inBlend * outBlend;
    }
    actions.walk.setEffectiveWeight(Math.max(0, walkWeight));

    let walkDistanceMeters = 0;
    if (p >= 0.30) {
      const walkNormProgress = THREE.MathUtils.clamp((p - 0.30) / (0.55 - 0.30), 0, 1);
      // Ease out deceleration near the end of walk
      const easedWalkProgress = THREE.MathUtils.smoothstep(walkNormProgress, 0, 1);
      walkDistanceMeters = easedWalkProgress * AVATAR_CONFIG.walk.totalDistance;

      if (walkWeight > 0.01) {
        // Precise phase tying: 1 cycle = cycleDistance (1.85m), clipDuration (1.02s)
        const cycleProgress = (walkDistanceMeters % AVATAR_CONFIG.walk.cycleDistance) / AVATAR_CONFIG.walk.cycleDistance;
        actions.walk.time = cycleProgress * actions.clips.walk.duration;
      }
    }

    // -------------------------------------------------------------
    // STAGE D: Arms Spread (T-Pose with palms up) (0.55 to 1.00)
    // -------------------------------------------------------------
    const tPoseWeight = THREE.MathUtils.smoothstep(p, 0.51, 0.58);
    actions.tPose.setEffectiveWeight(Math.max(0, tPoseWeight));
    actions.tPose.time = 0; // Hold rest t-pose base

    // -------------------------------------------------------------
    // GROUP POSITION & TRANSITION CORRECTIONS
    // -------------------------------------------------------------
    // Correct +0.27m Z shift between sitIdle and sitToStand to prevent popping
    const sitToStandBlend = THREE.MathUtils.smoothstep(p, 0.09, 0.16);
    const zInitialOffset = (1 - sitToStandBlend) * -AVATAR_CONFIG.transitions.sitToStandZShift;
    const yInitialOffset = (1 - sitToStandBlend) * -AVATAR_CONFIG.transitions.sitToStandYShift;

    // Total root group position
    group.position.x = 0;
    group.position.y = yInitialOffset;
    group.position.z = zInitialOffset + walkDistanceMeters;

    // Update mixer tracks
    mixer.update(0);

    // -------------------------------------------------------------
    // 6. POST-ANIMATION PROCEDURAL PALM TWISTS & BREATHING
    // -------------------------------------------------------------
    // Mixamo forearm roll twists so palms face UP in arms-spread pose
    if (tPoseWeight > 0.01) {
      const armTwist = AVATAR_CONFIG.armTwist;
      const leftForeArm = bonesRef.current.leftForeArm;
      const rightForeArm = bonesRef.current.rightForeArm;
      const leftHand = bonesRef.current.leftHand;
      const rightHand = bonesRef.current.rightHand;
      const spine = bonesRef.current.spine;

      // Forearm twist around long axis
      if (leftForeArm) {
        leftForeArm.rotation.y += armTwist.leftForeArm.y * tPoseWeight;
      }
      if (rightForeArm) {
        rightForeArm.rotation.y += armTwist.rightForeArm.y * tPoseWeight;
      }
      if (leftHand) {
        leftHand.rotation.y += armTwist.leftHand.y * tPoseWeight;
      }
      if (rightHand) {
        rightHand.rotation.y += armTwist.rightHand.y * tPoseWeight;
      }

      // Subtle breathing motion while holding pose
      const breathing = Math.sin(clock.getElapsedTime() * 1.8) * 0.018 * tPoseWeight;
      if (spine) {
        spine.rotation.x += breathing * 0.5;
      }
      if (leftForeArm && rightForeArm) {
        leftForeArm.rotation.z += breathing * 0.4;
        rightForeArm.rotation.z -= breathing * 0.4;
      }
    }
  });

  return (
    <group ref={groupRef} scale={AVATAR_CONFIG.scale}>
      <primitive object={avatarScene} />

      {/* Thin silver/white collar detail on neck */}
      {hasNeck && (
        <group position={[0, 1.48, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.075, 0.006, 16, 32]} />
            <meshStandardMaterial
              color={AVATAR_CONFIG.materials.collarColor}
              metalness={0.9}
              roughness={0.15}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}
