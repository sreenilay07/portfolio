import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { ExternalLink, Github, BookOpen, Sparkles } from "lucide-react";
import { projectsData } from "../data/projects";
import { AVATAR_CONFIG } from "./avatarConfig";
import { scrollStore } from "./scrollStore";

/**
 * ProjectHologramCards
 * Renders glass/holographic project cards hovering above the avatar's open palms.
 * Alternates between Right Hand and Left Hand every project.
 * Shows glowing light beams from palms to cards.
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

  useFrame(({ clock }) => {
    const progress = scrollStore.smoothedProgress;
    const time = clock.getElapsedTime();

    // If completely outside project reveal range, ensure everything is hidden immediately
    if (progress < projStart - 0.03 || progress > projEnd + 0.03) {
      projectsData.forEach((_, idx) => {
        const cardGroup = cardGroupRefs.current[idx];
        const beam = beamRefs.current[idx];
        const htmlEl = htmlElementRefs.current[idx];
        if (cardGroup) cardGroup.visible = false;
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
    // In Mixamo (character facing +Z):
    // Character's right hand is at viewer's left (negative X ~ -0.72m)
    // Character's left hand is at viewer's right (positive X ~ +0.72m)
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

    projectsData.forEach((project, idx) => {
      const cardGroup = cardGroupRefs.current[idx];
      const beam = beamRefs.current[idx];
      const htmlEl = htmlElementRefs.current[idx];
      if (!cardGroup) return;

      const segStart = projStart + idx * segmentDuration;
      const segEnd = segStart + segmentDuration;

      // Check if project is in active range
      const isActive = progress >= segStart - 0.015 && progress <= segEnd + 0.015;

      if (!isActive) {
        cardGroup.visible = false;
        if (beam) beam.visible = false;
        if (htmlEl) {
          htmlEl.style.display = "none";
          htmlEl.style.opacity = "0";
          htmlEl.style.pointerEvents = "none";
        }
        return;
      }

      cardGroup.visible = true;
      if (beam) beam.visible = true;

      // Project alternates:
      // Project 0 -> Right hand (viewer's left)
      // Project 1 -> Left hand (viewer's right)
      // Project 2 -> Right hand (viewer's left)
      const isRightHand = idx % 2 === 0;
      const handPos = isRightHand ? rightHandPos : leftHandPos;

      // Calculate smooth dissolve & scale envelope
      let alpha;
      const fadeDuration = segmentDuration * 0.2;
      if (progress < segStart) {
        alpha = Math.max(0, (progress - (segStart - 0.015)) / 0.015);
      } else if (progress < segStart + fadeDuration) {
        alpha = (progress - segStart) / fadeDuration;
      } else if (progress > segEnd - fadeDuration && progress <= segEnd) {
        alpha = (segEnd - progress) / fadeDuration;
      } else if (progress > segEnd) {
        alpha = Math.max(0, 1 - (progress - segEnd) / 0.015);
      } else {
        alpha = 1;
      }
      alpha = THREE.MathUtils.clamp(alpha, 0, 1);

      // Card hovering micro-motion
      const hoverY = Math.sin(time * 2.2 + idx * 1.5) * 0.025;
      const floatX = Math.cos(time * 1.8 + idx) * 0.012;

      // Rise height above open palm
      const riseHeight = 0.42 + hoverY + (1 - alpha) * -0.15;

      // Position card directly over the hand
      targetCardPos.set(
        handPos.x + floatX,
        handPos.y + riseHeight,
        handPos.z + 0.06
      );
      cardGroup.position.copy(targetCardPos);

      // Card scale entrance
      const scale = THREE.MathUtils.lerp(0.65, 1.0, alpha);
      cardGroup.scale.set(scale, scale, scale);

      // Position and orient light beam from hand to card
      if (beam) {
        beam.position.set(handPos.x, handPos.y + riseHeight * 0.5, handPos.z);
        beam.scale.set(1, riseHeight, 1);
        if (beam.material) {
          beam.material.opacity = alpha * 0.45;
        }
      }

      // Update inner HTML element style directly on DOM element
      if (htmlEl) {
        htmlEl.style.display = alpha > 0.01 ? "block" : "none";
        htmlEl.style.opacity = alpha.toFixed(3);
        htmlEl.style.pointerEvents = alpha > 0.3 ? "auto" : "none";
      }
    });
  });

  return (
    <group>
      {projectsData.map((project, idx) => {
        const isRightHand = idx % 2 === 0;
        const beamColor = isRightHand ? "#06b6d4" : "#8b5cf6";

        return (
          <group key={project.id}>
            {/* Glowing Light Beam from Palm to Card */}
            <mesh
              ref={(el) => (beamRefs.current[idx] = el)}
              position={[0, 0, 0]}
              visible={false}
            >
              <cylinderGeometry args={[0.08, 0.02, 1, 16, 1, true]} />
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
              visible={false}
            >
              {/* Subtle 3D Glass Plane backing */}
              <mesh position={[0, 0, -0.005]}>
                <planeGeometry args={[0.68, 0.82]} />
                <meshPhysicalMaterial
                  color="#09090f"
                  roughness={0.2}
                  metalness={0.9}
                  transmission={0.8}
                  transparent
                  opacity={0.3}
                />
              </mesh>

              {/* Glowing Border Frame */}
              <lineSegments position={[0, 0, 0]}>
                <edgesGeometry args={[new THREE.PlaneGeometry(0.68, 0.82)]} />
                <lineBasicMaterial
                  color={beamColor}
                  transparent
                  opacity={0.7}
                  linewidth={2}
                />
              </lineSegments>

              {/* Interactive Rich HTML Card */}
              <Html
                transform
                distanceFactor={2.2}
                position={[0, 0, 0.005]}
                style={{
                  pointerEvents: "auto",
                  userSelect: "none",
                  width: "320px",
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
                    transition: "opacity 0.15s ease-out",
                  }}
                  className="w-[320px] rounded-2xl glass-panel border border-white/10 bg-zinc-950/90 backdrop-blur-xl shadow-2xl p-4.5 overflow-hidden text-zinc-100 flex flex-col gap-2.5 group hover:border-violet-500/40 transition-colors pointer-events-auto"
                >
                  {/* Card Header Tag */}
                  <div className="flex items-center justify-between pb-1 border-b border-white/5">
                    <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-cyan-400">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                      <span>PROJECT 0{idx + 1} // 0{numProjects}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/5 text-zinc-400">
                      {project.tech[0]}
                    </span>
                  </div>

                  {/* Project Cover Image */}
                  <div className="relative h-32 rounded-xl overflow-hidden bg-zinc-900 border border-white/5">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
                    <div className="absolute bottom-2 left-2.5 right-2.5">
                      <h3 className="text-base font-bold font-display text-white leading-tight">
                        {project.title}
                      </h3>
                      <p className="text-[10px] font-mono text-cyan-400 truncate">
                        {project.tagline}
                      </p>
                    </div>
                  </div>

                  {/* Brief Description */}
                  <p className="text-[11px] text-zinc-400 leading-relaxed line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tech stack chips */}
                  <div className="flex flex-wrap gap-1">
                    {project.tech.slice(0, 3).map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] bg-zinc-900/90 border border-white/5 text-zinc-400 px-2 py-0.5 rounded font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech.length > 3 && (
                      <span className="text-[10px] bg-zinc-900/90 border border-white/5 text-zinc-500 px-1.5 py-0.5 rounded font-mono">
                        +{project.tech.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Card Action Buttons */}
                  <div className="grid grid-cols-3 gap-1.5 pt-2 border-t border-white/5">
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/5 text-xs font-semibold transition-all cursor-pointer pointer-events-auto"
                    >
                      <Github className="w-3.5 h-3.5" />
                      Code
                    </a>
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 py-1.5 rounded-lg bg-violet-600/10 hover:bg-violet-600 hover:text-white border border-violet-500/20 text-violet-400 hover:border-violet-500 text-xs font-semibold transition-all cursor-pointer pointer-events-auto"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Live
                    </a>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProject(project);
                      }}
                      className="flex items-center justify-center gap-1 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-dashed border-cyan-500/40 hover:border-cyan-400 text-cyan-400 hover:text-cyan-300 text-xs font-semibold transition-all cursor-pointer pointer-events-auto focus:outline-none"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
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
