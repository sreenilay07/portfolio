import { useRef } from "react";
import StageLighting from "./StageLighting";
import StageFurniture from "./StageFurniture";
import AvatarModel from "./AvatarModel";
import ProjectHologramCards from "./ProjectHologramCards";
import CameraController from "./CameraController";

/**
 * HeroScene
 * Composes the 3D scene elements: lights, furniture, avatar,
 * hand-anchored project holograms, and camera controller.
 */
export default function HeroScene({ onSelectProject }) {
  const rightHandBoneRef = useRef(null);
  const leftHandBoneRef = useRef(null);

  return (
    <>
      <StageLighting />
      <CameraController />
      <StageFurniture />
      <AvatarModel
        rightHandBoneRef={rightHandBoneRef}
        leftHandBoneRef={leftHandBoneRef}
      />
      <ProjectHologramCards
        rightHandBoneRef={rightHandBoneRef}
        leftHandBoneRef={leftHandBoneRef}
        onSelectProject={onSelectProject}
      />
    </>
  );
}
