import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { ExternalLink, Github, BookOpen, Sparkles, Users } from "lucide-react";
import { projectsData } from "../data/projects";
import { AVATAR_CONFIG } from "./avatarConfig";
import { scrollStore } from "./scrollStore";

/**
 * ProjectHologramCards
 * Renders chapter-aware holographic cards hovering above the avatar's open palms:
 * - Emphasizes active project chapter while others remain unobtrusive/hidden
 * - Alternates: Left Hand / Right Hand based on index
 * - Light beam anchor from palm to bottom edge of card
 * - Clean high-contrast typography, verified live links only
 */
export default function ProjectHologramCards({
  rightHandBoneRef,
  leftHandBoneRef,
  onSelectProject,
}) {
  const cardGroupRefs = useRef([]);
  const htmlElementRefs = useRef([]);
  const beamRefs = useRef([]);

  // Temp vectors to avoid garbage collection
  const rightHandPos = useMemo(() => new THREE.Vector3(), []);
  const leftHandPos = useMemo(() => new THREE.Vector3(), []);
  const targetCardPos = useMemo(() => new THREE.Vector3(), []);

  const [projStart, projEnd] = AVATAR_CONFIG.timeline.projectReveal;
  const numProjects = projectsData.length;
  const segmentDuration = (projEnd - projStart) / numProjects;

  const CARD_WORLD_HEIGHT = 0.98;
  const CARD_HALF_HEIGHT = CARD_WORLD_HEIGHT * 0.5;
  const FLOAT_ABOVE_PALM = 0.3;

  useFrame(({ clock }) => {
    const progress = scrollStore.smoothedProgress;
    const time = clock.getElapsedTime();

    // If outside project reveal range, hide all cards and beams immediately
    if (progress < projStart - 0.02 || progress > projEnd + 0.02) {
      projectsData.forEach((_, idx) => {
        const beam = beamRefs.current[idx];
        const htmlEl = htmlElementRefs.current[idx];
        if (beam) beam.visible = false;
        if (htmlEl) {
          htmlEl.style.display = "none";
          htmlEl.style.opacity = "0";
          htmlEl.style.pointerEvents = "none";
        }
      });
      return;
    }

    // Get current world positions of both hand bones with fallback
    if (rightHandBoneRef?.current) {
      rightHandBoneRef.current.getWorldPosition(rightHandPos);
    } else {
      rightHandPos.set(-0.72, 1.44, 2.2);
    }

    if (leftHandBoneRef?.current) {
      leftHandBoneRef.current.getWorldPosition(leftHandPos);
    } else {
      leftHandPos.set(0.72, 1.44, 2.2);
    }

    projectsData.forEach((_, idx) => {
      const cardGroup = cardGroupRefs.current[idx];
      const beam = beamRefs.current[idx];
      const htmlEl = htmlElementRefs.current[idx];
      if (!cardGroup) return;

      const segStart = projStart + idx * segmentDuration;
      const segEnd = segStart + segmentDuration;
      const fadeDuration = segmentDuration * 0.18;

      const isActive =
        progress >= segStart - 0.01 && progress <= segEnd + 0.01;

      if (!isActive) {
        if (beam) beam.visible = false;
        if (htmlEl) {
          htmlEl.style.display = "none";
          htmlEl.style.opacity = "0";
          htmlEl.style.pointerEvents = "none";
        }
        return;
      }

      if (beam) beam.visible = true;

      // Alternating hands
      const isRightHand = idx % 2 === 0;
      const handPos = isRightHand ? rightHandPos : leftHandPos;

      // Compute smooth chapter envelope
      let alpha;
      if (progress < segStart) {
        alpha = Math.max(0, (progress - (segStart - 0.01)) / 0.01);
      } else if (progress < segStart + fadeDuration) {
        alpha = (progress - segStart) / fadeDuration;
      } else if (progress > segEnd - fadeDuration && progress <= segEnd) {
        alpha = (segEnd - progress) / fadeDuration;
      } else if (progress > segEnd) {
        alpha = Math.max(0, 1 - (progress - segEnd) / 0.01);
      } else {
        alpha = 1;
      }
      alpha = THREE.MathUtils.clamp(alpha, 0, 1);

      // Card hover micro-animation
      const hoverY = Math.sin(time * 2.2 + idx * 1.5) * 0.02;
      const floatX = Math.cos(time * 1.8 + idx) * 0.01;

      const cardCenterY =
        handPos.y + FLOAT_ABOVE_PALM + CARD_HALF_HEIGHT + hoverY;

      targetCardPos.set(
        handPos.x + floatX,
        cardCenterY,
        handPos.z + 0.05
      );
      cardGroup.position.copy(targetCardPos);

      // Card entrance scale
      const baseScale = 0.26;
      const currentScale = baseScale * THREE.MathUtils.lerp(0.85, 1.0, alpha);
      cardGroup.scale.set(currentScale, currentScale, currentScale);

      // Light beam from palm to bottom edge of card
      const cardBottomY = cardCenterY - CARD_HALF_HEIGHT;
      const beamHeight = Math.max(0.05, cardBottomY - handPos.y);

      if (beam) {
        beam.position.set(handPos.x, handPos.y + beamHeight * 0.5, handPos.z);
        beam.scale.set(1, beamHeight, 1);
        if (beam.material) {
          beam.material.opacity = alpha * 0.45;
        }
      }

      if (htmlEl) {
        htmlEl.style.display = alpha > 0.01 ? "block" : "none";
        htmlEl.style.opacity = alpha.toFixed(3);
        htmlEl.style.pointerEvents = alpha > 0.35 ? "auto" : "none";
      }
    });
  });

  return (
    <group>
      {projectsData.map((project, idx) => {
        const isRightHand = idx % 2 === 0;
        const beamColor = isRightHand ? "#c59b7b" : "#8da0af";
        const accentBorder = "border-white/[0.12] shadow-black/50";
        const accentText = "text-[#c59b7b]";
        const techList = project.technologies || project.tech || [];
        const hasLiveUrl = Boolean(project.liveUrl);

        return (
          <group key={project.id}>
            {/* Glowing Light Beam from Palm to Card Bottom */}
            <mesh
              ref={(el) => (beamRefs.current[idx] = el)}
              position={[0, 0, 0]}
              visible={false}
            >
              <cylinderGeometry args={[0.06, 0.018, 1, 16, 1, true]} />
              <meshBasicMaterial
                color={beamColor}
                transparent
                opacity={0.35}
                side={THREE.DoubleSide}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>

            {/* Floating Holographic Card Group */}
            <group
              ref={(el) => (cardGroupRefs.current[idx] = el)}
              position={[0, 0, 0]}
              scale={[0.26, 0.26, 0.26]}
            >
              <Html
                transform
                position={[0, 0, 0]}
                style={{
                  pointerEvents: "auto",
                  userSelect: "none",
                  width: "360px",
                }}
              >
                <div
                  ref={(el) => {
                    htmlElementRefs.current[idx] = el;
                  }}
                  style={{
                    display: "none",
                    opacity: 0,
                    pointerEvents: "none",
                    background: "rgba(8, 13, 18, 0.94)",
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    transition: "opacity 0.15s ease-out",
                  }}
                  className={`w-[360px] rounded-2xl border ${accentBorder} shadow-2xl p-5 overflow-hidden text-zinc-100 flex flex-col gap-3 group transition-colors pointer-events-auto select-none`}
                >
                  {/* Card Header Tag */}
                  <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
                    <div
                      className={`flex items-center gap-1.5 text-xs font-mono font-bold ${accentText}`}
                    >
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                      <span>
                        CHAPTER 0{idx + 1} // 0{numProjects}
                      </span>
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10 text-zinc-300 font-semibold">
                      {project.category || techList[0]}
                    </span>
                  </div>

                  {/* Project Cover Image */}
                  <div className="relative h-36 rounded-xl overflow-hidden bg-zinc-950 border border-white/10">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                    <div className="absolute bottom-2.5 left-3 right-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-extrabold font-display text-white leading-tight">
                          {project.title}
                        </h3>
                        {project.role && project.role.includes("Team") && (
                          <span className="text-[10px] font-mono bg-[#c59b7b]/20 text-[#c59b7b] border border-[#c59b7b]/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Users className="w-2.5 h-2.5" />
                            Team of 4
                          </span>
                        )}
                      </div>
                      <p className={`text-[11px] font-mono font-medium ${accentText} truncate mt-0.5`}>
                        {project.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-zinc-300 leading-relaxed line-clamp-2 font-sans font-normal">
                    {project.description}
                  </p>

                  {/* Tech Stack Badges */}
                  <div className="flex flex-wrap gap-1.5">
                    {techList.slice(0, 4).map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[11px] bg-zinc-900 border border-white/10 text-zinc-200 px-2.5 py-0.5 rounded-md font-mono font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className={`grid ${hasLiveUrl ? "grid-cols-3" : "grid-cols-2"} gap-2 pt-2 border-t border-white/10`}>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#080d12] hover:bg-[#121a22] text-[#eaeef1] hover:text-white border border-white/10 text-xs font-semibold transition-all cursor-pointer pointer-events-auto shadow-sm"
                    >
                      <Github className="w-3.5 h-3.5" />
                      Code
                    </a>
                    {hasLiveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#eaeef1] hover:bg-white text-[#030508] text-xs font-semibold transition-all cursor-pointer pointer-events-auto shadow-sm"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Live
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProject(project);
                      }}
                      className="flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[#121a22] hover:bg-[#1a2530] text-[#eaeef1] border border-white/10 text-xs font-bold transition-all cursor-pointer pointer-events-auto focus:outline-none shadow-sm"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-[#c59b7b]" />
                      Case
                    </button>
                  </div>
                </div>
              </Html>
            </group>
          </group>
        );
      })}
    </group>
  );
}
