import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { AVATAR_CONFIG } from "./avatarConfig";
import { scrollStore } from "./scrollStore";

/**
 * CameraController
 * Smoothly dollies and tracks the camera across the scroll timeline.
 * Keyframes are defined in avatarConfig.js.
 * - Early phase (0.00 to 0.12): shifts camera laterally so avatar is at ~65% width on the right,
 *   leaving the left 45% exclusively for the Hero text.
 * - Mid phase (0.12 to 0.30): eases back to centered for walk and arms spread.
 * - Project phase (0.62 to 0.95): raised and pulled back to frame full body, hands, and floating card.
 */
export default function CameraController() {
  const { camera } = useThree();
  const kf = AVATAR_CONFIG.camera.keyframes;
  const currentPosRef = useRef(new THREE.Vector3(...kf.sit.position));
  const currentTargetRef = useRef(new THREE.Vector3(...kf.sit.target));
  const targetPosRef = useRef(new THREE.Vector3(...kf.sit.position));
  const targetLookRef = useRef(new THREE.Vector3(...kf.sit.target));
  const parallaxRef = useRef({ x: 0, y: 0 });

  useFrame((_, delta) => {
    const p = scrollStore.smoothedProgress;
    const kf = AVATAR_CONFIG.camera.keyframes;
    const targetPos = targetPosRef.current;
    const targetLook = targetLookRef.current;
    const currentPos = currentPosRef.current;
    const currentTarget = currentTargetRef.current;

    // Segmented camera interpolation across timeline stages
    if (p < 0.12) {
      // Sit Idle: Lateral offset applied so avatar is at ~65% viewport width on right
      targetPos.set(...kf.sit.position);
      targetLook.set(...kf.sit.target);
    } else if (p < 0.30) {
      // Sit to Stand: Smoothly ease lateral offset back to centered
      const t = THREE.MathUtils.smoothstep(p, 0.12, 0.30);
      targetPos.lerpVectors(
        new THREE.Vector3(...kf.sit.position),
        new THREE.Vector3(...kf.stand.position),
        t
      );
      targetLook.lerpVectors(
        new THREE.Vector3(...kf.sit.target),
        new THREE.Vector3(...kf.stand.target),
        t
      );
    } else if (p < 0.55) {
      // Walk: Camera dollies back, keeping full body in frame
      const t = THREE.MathUtils.smoothstep(p, 0.30, 0.55);
      targetPos.lerpVectors(
        new THREE.Vector3(...kf.stand.position),
        new THREE.Vector3(...kf.walkEnd.position),
        t
      );
      targetLook.lerpVectors(
        new THREE.Vector3(...kf.stand.target),
        new THREE.Vector3(...kf.walkEnd.target),
        t
      );
    } else {
      // Arms Spread & Project Reveal: Raised and pulled back framing
      const t = THREE.MathUtils.smoothstep(p, 0.55, 0.65);
      targetPos.lerpVectors(
        new THREE.Vector3(...kf.walkEnd.position),
        new THREE.Vector3(...kf.projects.position),
        t
      );
      targetLook.lerpVectors(
        new THREE.Vector3(...kf.walkEnd.target),
        new THREE.Vector3(...kf.projects.target),
        t
      );
    }

    // Subtle mouse parallax (clamped to max 0.15m)
    const maxParallax = AVATAR_CONFIG.camera.maxMouseParallax;
    const targetParallaxX = scrollStore.mouseX * maxParallax;
    const targetParallaxY = -scrollStore.mouseY * (maxParallax * 0.6);

    parallaxRef.current.x = THREE.MathUtils.damp(
      parallaxRef.current.x,
      targetParallaxX,
      6,
      delta
    );
    parallaxRef.current.y = THREE.MathUtils.damp(
      parallaxRef.current.y,
      targetParallaxY,
      6,
      delta
    );

    if (scrollStore.isFrozen) {
      currentPos.copy(targetPos);
      currentTarget.copy(targetLook);
      camera.position.copy(currentPos);
      camera.lookAt(currentTarget);
      return;
    }

    // Apply smoothed position
    currentPos.x = THREE.MathUtils.damp(
      currentPos.x,
      targetPos.x + parallaxRef.current.x,
      8,
      delta
    );
    currentPos.y = THREE.MathUtils.damp(
      currentPos.y,
      targetPos.y + parallaxRef.current.y,
      8,
      delta
    );
    currentPos.z = THREE.MathUtils.damp(currentPos.z, targetPos.z, 8, delta);
    camera.position.copy(currentPos);

    // Apply smoothed lookAt target
    currentTarget.x = THREE.MathUtils.damp(currentTarget.x, targetLook.x, 8, delta);
    currentTarget.y = THREE.MathUtils.damp(currentTarget.y, targetLook.y, 8, delta);
    currentTarget.z = THREE.MathUtils.damp(currentTarget.z, targetLook.z, 8, delta);
    camera.lookAt(currentTarget);
  });

  return null;
}
