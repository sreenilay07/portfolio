import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows, Html } from "@react-three/drei";
import * as THREE from "three";
import { AVATAR_CONFIG } from "./avatarConfig";
import { personalInfo } from "../data/personalInfo";

/**
 * StageFurniture
 * Renders the chair, desk, laptop, floating holographic ID card,
 * and reflective dark glossy floor with contact shadows.
 */
export default function StageFurniture() {
  const badgeRef = useRef(null);
  const glowEdgeMaterial = new THREE.MeshBasicMaterial({
    color: AVATAR_CONFIG.materials.rimColor,
    wireframe: true,
    transparent: true,
    opacity: 0.25,
  });

  // Micro-floating animation for the holographic badge
  useFrame(({ clock }) => {
    if (badgeRef.current) {
      badgeRef.current.position.y =
        1.15 + Math.sin(clock.getElapsedTime() * 1.5) * 0.025;
      badgeRef.current.rotation.y =
        Math.PI * 0.12 + Math.sin(clock.getElapsedTime() * 0.8) * 0.04;
    }
  });

  const seatY = AVATAR_CONFIG.seat.surfaceHeight;
  const seatZ = AVATAR_CONFIG.seat.centerZ;
  const deskZ = AVATAR_CONFIG.desk.centerZ;
  const deskY = AVATAR_CONFIG.desk.height;

  return (
    <group>
      {/* ============================================================ */}
      {/* 1. Glossy Dark Floor with Subtle Grid                        */}
      {/* ============================================================ */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.005, 1.5]}
        receiveShadow
      >
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial
          color="#08080c"
          roughness={0.18}
          metalness={0.85}
        />
      </mesh>

      {/* Subtle floor grid lines */}
      <gridHelper
        args={[30, 30, "#8b5cf6", "#1e1e2d"]}
        position={[0, 0, 1.5]}
      />

      {/* Soft Contact Shadows beneath furniture and avatar */}
      <ContactShadows
        position={[0, 0, 1.5]}
        opacity={0.7}
        scale={12}
        blur={2}
        far={4}
        color="#000000"
      />

      {/* ============================================================ */}
      {/* 2. Executive Studio Chair                                    */}
      {/* ============================================================ */}
      <group position={[0, 0, 0]}>
        {/* Castor Base Hub */}
        <mesh position={[0, 0.05, seatZ]} castShadow>
          <cylinderGeometry args={[0.08, 0.10, 0.08, 16]} />
          <meshStandardMaterial color="#18181f" metalness={0.9} roughness={0.2} />
        </mesh>

        {/* 5-Leg Base */}
        {[0, 72, 144, 216, 288].map((angle, idx) => {
          const rad = (angle * Math.PI) / 180;
          return (
            <mesh
              key={idx}
              position={[
                Math.sin(rad) * 0.22,
                0.035,
                seatZ + Math.cos(rad) * 0.22,
              ]}
              rotation={[0, rad, 0]}
              castShadow
            >
              <boxGeometry args={[0.04, 0.025, 0.26]} />
              <meshStandardMaterial
                color="#121318"
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>
          );
        })}

        {/* Hydraulic Cylinder */}
        <mesh position={[0, 0.25, seatZ]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.35, 16]} />
          <meshStandardMaterial color="#272732" metalness={0.95} roughness={0.1} />
        </mesh>

        {/* Seat Cushion (Top surface at seatY = 0.47) */}
        <mesh position={[0, seatY - 0.04, seatZ]} castShadow receiveShadow>
          <boxGeometry
            args={[
              AVATAR_CONFIG.seat.seatWidth,
              0.08,
              AVATAR_CONFIG.seat.seatDepth,
            ]}
          />
          <meshStandardMaterial
            color="#14141c"
            metalness={0.4}
            roughness={0.5}
          />
        </mesh>

        {/* Seat Cushion Emissive Rim Accent */}
        <mesh position={[0, seatY - 0.04, seatZ]}>
          <boxGeometry
            args={[
              AVATAR_CONFIG.seat.seatWidth + 0.005,
              0.085,
              AVATAR_CONFIG.seat.seatDepth + 0.005,
            ]}
          />
          <primitive object={glowEdgeMaterial} attach="material" />
        </mesh>

        {/* Chair Backrest */}
        <group position={[0, seatY + 0.32, seatZ - 0.22]}>
          <mesh castShadow receiveShadow rotation={[-0.08, 0, 0]}>
            <boxGeometry args={[0.46, 0.60, 0.06]} />
            <meshStandardMaterial
              color="#14141c"
              metalness={0.4}
              roughness={0.5}
            />
          </mesh>

          {/* Cyan Glow outline seam on backrest */}
          <mesh rotation={[-0.08, 0, 0]}>
            <boxGeometry args={[0.465, 0.605, 0.065]} />
            <primitive object={glowEdgeMaterial} attach="material" />
          </mesh>
        </group>

        {/* Left Armrest */}
        <group position={[-0.26, seatY + 0.16, seatZ]}>
          <mesh position={[0, -0.08, 0]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.20, 8]} />
            <meshStandardMaterial color="#20202a" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.02, 0]} castShadow>
            <boxGeometry args={[0.06, 0.03, 0.28]} />
            <meshStandardMaterial color="#101116" roughness={0.6} />
          </mesh>
        </group>

        {/* Right Armrest */}
        <group position={[0.26, seatY + 0.16, seatZ]}>
          <mesh position={[0, -0.08, 0]} castShadow>
            <cylinderGeometry args={[0.015, 0.015, 0.20, 8]} />
            <meshStandardMaterial color="#20202a" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.02, 0]} castShadow>
            <boxGeometry args={[0.06, 0.03, 0.28]} />
            <meshStandardMaterial color="#101116" roughness={0.6} />
          </mesh>
        </group>
      </group>

      {/* ============================================================ */}
      {/* 3. Obsidian Modern Minimalist Desk                           */}
      {/* ============================================================ */}
      <group position={[0, 0, deskZ]}>
        {/* Smoked glass / obsidian desktop surface (top at deskY = 0.72) */}
        <mesh position={[0, deskY - 0.02, 0]} castShadow receiveShadow>
          <boxGeometry
            args={[
              AVATAR_CONFIG.desk.width,
              0.04,
              AVATAR_CONFIG.desk.depth,
            ]}
          />
          <meshPhysicalMaterial
            color="#0b0c10"
            metalness={0.8}
            roughness={0.15}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Emissive cyan rim along desk perimeter */}
        <mesh position={[0, deskY - 0.02, 0]}>
          <boxGeometry
            args={[
              AVATAR_CONFIG.desk.width + 0.005,
              0.045,
              AVATAR_CONFIG.desk.depth + 0.005,
            ]}
          />
          <primitive object={glowEdgeMaterial} attach="material" />
        </mesh>

        {/* Left Matte Metal Leg */}
        <mesh
          position={[-AVATAR_CONFIG.desk.width / 2 + 0.06, (deskY - 0.04) / 2, 0]}
          castShadow
        >
          <boxGeometry args={[0.04, deskY - 0.04, AVATAR_CONFIG.desk.depth - 0.1]} />
          <meshStandardMaterial color="#181820" metalness={0.85} roughness={0.3} />
        </mesh>

        {/* Right Matte Metal Leg */}
        <mesh
          position={[AVATAR_CONFIG.desk.width / 2 - 0.06, (deskY - 0.04) / 2, 0]}
          castShadow
        >
          <boxGeometry args={[0.04, deskY - 0.04, AVATAR_CONFIG.desk.depth - 0.1]} />
          <meshStandardMaterial color="#181820" metalness={0.85} roughness={0.3} />
        </mesh>

        {/* ============================================================ */}
        {/* 4. Open Modern Laptop on Desk                                */}
        {/* ============================================================ */}
        <group position={[0, deskY, 0]}>
          {/* Base Chassis */}
          <mesh position={[0, 0.005, 0.04]} castShadow>
            <boxGeometry args={[0.32, 0.008, 0.22]} />
            <meshStandardMaterial color="#1f2029" metalness={0.9} roughness={0.25} />
          </mesh>

          {/* Glowing Trackpad */}
          <mesh position={[0, 0.0095, 0.09]}>
            <planeGeometry args={[0.10, 0.06]} />
            <meshStandardMaterial
              color="#090a0f"
              roughness={0.3}
              metalness={0.8}
            />
          </mesh>

          {/* Tilted Screen Display */}
          <group position={[0, 0.009, -0.06]} rotation={[0.22, 0, 0]}>
            {/* Screen lid / back */}
            <mesh position={[0, 0.10, 0]} castShadow>
              <boxGeometry args={[0.32, 0.20, 0.006]} />
              <meshStandardMaterial
                color="#12131a"
                metalness={0.9}
                roughness={0.25}
              />
            </mesh>

            {/* Glowing Screen Content */}
            <mesh position={[0, 0.10, 0.0035]}>
              <planeGeometry args={[0.30, 0.18]} />
              <meshBasicMaterial color="#0e1526" />
            </mesh>

            {/* Cyan code glow stripe on screen */}
            <mesh position={[-0.04, 0.10, 0.004]}>
              <planeGeometry args={[0.18, 0.12]} />
              <meshBasicMaterial color="#06b6d4" transparent opacity={0.6} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ============================================================ */}
      {/* 5. Floating Holographic ID Card near Avatar                  */}
      {/* ============================================================ */}
      <group ref={badgeRef} position={[-0.60, 1.15, 0.0]}>
        {/* Glass badge backing */}
        <mesh>
          <planeGeometry args={[0.36, 0.22]} />
          <meshPhysicalMaterial
            color="#09090f"
            transmission={0.85}
            opacity={0.95}
            transparent
            roughness={0.2}
            ior={1.5}
            thickness={0.02}
          />
        </mesh>

        {/* Cyan Emissive Border Frame */}
        <mesh position={[0, 0, 0.002]}>
          <planeGeometry args={[0.365, 0.225]} />
          <primitive object={glowEdgeMaterial} attach="material" />
        </mesh>

        {/* HTML Content inside Badge */}
        <Html
          transform
          distanceFactor={1.2}
          position={[0, 0, 0.005]}
          style={{
            pointerEvents: "none",
            userSelect: "none",
            width: "280px",
          }}
        >
          <div className="p-3 rounded-xl border border-cyan-500/30 bg-zinc-950/80 backdrop-blur-md shadow-2xl flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden border border-violet-500/40 shrink-0 bg-zinc-900">
              <img
                src={personalInfo.avatarUrl || "/avatar.png"}
                alt={personalInfo.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "/avatar.png";
                }}
              />
            </div>
            <div className="overflow-hidden">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-semibold">
                  ONLINE
                </span>
              </div>
              <h4 className="text-white font-bold text-xs font-display truncate">
                {personalInfo.name}
              </h4>
              <p className="text-[10px] text-zinc-400 font-mono truncate">
                AI &amp; Full-Stack Eng.
              </p>
            </div>
          </div>
        </Html>
      </group>
    </group>
  );
}
