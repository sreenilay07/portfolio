import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { AVATAR_CONFIG } from "./avatarConfig";
import { scrollStore } from "./scrollStore";

/**
 * StageFurniture
 * Renders:
 * - Studio chair (positioned behind avatar; front walking path 100% free of obstacles)
 * - Side console table (stage left of avatar at x = 0.68m) with open laptop
 * - Near-black navy floor with thin subtle violet grid, soft radial glow under avatar,
 *   and smooth horizon fade
 */
export default function StageFurniture() {
  const floorMeshRef = useRef(null);
  const floorMatRef = useRef(null);
  const radialGlowRef = useRef(null);
  const gridRef = useRef(null);

  const glowEdgeMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: AVATAR_CONFIG.materials.rimColor,
        wireframe: true,
        transparent: true,
        opacity: 0.35,
      }),
    []
  );

  // Custom soft radial glow material under the avatar
  const radialGlowMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uColorInner: { value: new THREE.Color("#1c2f44") },
        uColorOuter: { value: new THREE.Color("#05080c") },
        uOpacity: { value: 0.18 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColorInner;
        uniform vec3 uColorOuter;
        uniform float uOpacity;
        varying vec2 vUv;
        void main() {
          float dist = distance(vUv, vec2(0.5));
          if (dist > 0.5) discard;
          float factor = 1.0 - smoothstep(0.0, 0.5, dist);
          vec3 col = mix(uColorOuter, uColorInner, factor);
          gl_FragColor = vec4(col, factor * factor * uOpacity);
        }
      `,
    });
  }, []);

  const seatY = AVATAR_CONFIG.seat.surfaceHeight;
  const seatZ = AVATAR_CONFIG.seat.centerZ;
  const st = AVATAR_CONFIG.sideTable;

  // Frame animations: floor and glow fade near stage end (0.95 to 1.00)
  useFrame(() => {
    const p = scrollStore.smoothedProgress;
    let fade = 1.0;
    if (p > 0.95) {
      fade = THREE.MathUtils.clamp(1 - (p - 0.95) / 0.05, 0, 1);
    }

    if (radialGlowRef.current) {
      radialGlowRef.current.material.uniforms.uOpacity.value = 0.22 * fade;
    }
    if (floorMatRef.current) {
      floorMatRef.current.opacity = fade;
    }
    if (gridRef.current) {
      gridRef.current.visible = fade > 0.02;
    }
  });

  return (
    <group>
      {/* ============================================================ */}
      {/* 1. Near-Black Navy Floor with Thin Subtle Grid               */}
      {/* ============================================================ */}
      <mesh
        ref={floorMeshRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.005, 2.0]}
        receiveShadow
      >
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial
          ref={floorMatRef}
          color={AVATAR_CONFIG.materials.floorColor}
          roughness={AVATAR_CONFIG.materials.floorRoughness}
          metalness={AVATAR_CONFIG.materials.floorMetalness}
          transparent
          opacity={1}
        />
      </mesh>

      {/* Thin, low-opacity muted architectural grid lines */}
      <gridHelper
        ref={gridRef}
        args={[40, 40, "#1c2f44", "#080d12"]}
        position={[0, 0.001, 2.0]}
      />

      {/* Soft radial cyan/violet glow strictly under and around the avatar */}
      <mesh
        ref={radialGlowRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.003, 1.2]}
      >
        <planeGeometry args={[7.5, 7.5]} />
        <primitive object={radialGlowMaterial} attach="material" />
      </mesh>

      {/* Ground Contact Shadows beneath character and furniture */}
      <ContactShadows
        position={[0, 0.002, 1.5]}
        opacity={0.65}
        scale={12}
        blur={2.5}
        far={5}
        color="#000000"
      />

      {/* ============================================================ */}
      {/* 2. Executive Studio Chair (Behind Avatar at z = -0.26m)      */}
      {/* ============================================================ */}
      <group position={[0, 0, 0]}>
        {/* Castor Base Hub */}
        <mesh position={[0, 0.05, seatZ]} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 0.08, 16]} />
          <meshStandardMaterial color="#16171f" metalness={0.9} roughness={0.2} />
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
              <boxGeometry args={[0.04, 0.025, 0.24]} />
              <meshStandardMaterial
                color="#12131a"
                metalness={0.9}
                roughness={0.2}
              />
            </mesh>
          );
        })}

        {/* Hydraulic Cylinder */}
        <mesh position={[0, 0.25, seatZ]} castShadow>
          <cylinderGeometry args={[0.028, 0.028, 0.35, 16]} />
          <meshStandardMaterial color="#232430" metalness={0.95} roughness={0.1} />
        </mesh>

        {/* Seat Cushion (Top surface at seatY = 0.47m) */}
        <mesh position={[0, seatY - 0.04, seatZ]} castShadow receiveShadow>
          <boxGeometry
            args={[
              AVATAR_CONFIG.seat.seatWidth,
              0.08,
              AVATAR_CONFIG.seat.seatDepth,
            ]}
          />
          <meshStandardMaterial
            color="#13141c"
            metalness={0.35}
            roughness={0.55}
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
            <boxGeometry args={[0.46, 0.58, 0.05]} />
            <meshStandardMaterial
              color="#13141c"
              metalness={0.35}
              roughness={0.55}
            />
          </mesh>

          {/* Cyan Glow outline seam on backrest */}
          <mesh rotation={[-0.08, 0, 0]}>
            <boxGeometry args={[0.465, 0.585, 0.055]} />
            <primitive object={glowEdgeMaterial} attach="material" />
          </mesh>
        </group>

        {/* Left Armrest */}
        <group position={[-0.26, seatY + 0.16, seatZ]}>
          <mesh position={[0, -0.08, 0]} castShadow>
            <cylinderGeometry args={[0.014, 0.014, 0.2, 8]} />
            <meshStandardMaterial color="#1e1f2a" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.02, 0]} castShadow>
            <boxGeometry args={[0.055, 0.028, 0.26]} />
            <meshStandardMaterial color="#0f1016" roughness={0.6} />
          </mesh>
        </group>

        {/* Right Armrest */}
        <group position={[0.26, seatY + 0.16, seatZ]}>
          <mesh position={[0, -0.08, 0]} castShadow>
            <cylinderGeometry args={[0.014, 0.014, 0.2, 8]} />
            <meshStandardMaterial color="#1e1f2a" metalness={0.8} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.02, 0]} castShadow>
            <boxGeometry args={[0.055, 0.028, 0.26]} />
            <meshStandardMaterial color="#0f1016" roughness={0.6} />
          </mesh>
        </group>
      </group>

      {/* ============================================================ */}
      {/* 3. Side Console Table (Stage Left of Avatar, at x = 0.68m)   */}
      {/*    Walking corridor (-0.4m to +0.4m) is COMPLETELY free!     */}
      {/* ============================================================ */}
      <group position={[st.x, 0, st.z]}>
        {/* Table Top Surface (Height 0.54m) */}
        <mesh position={[0, st.height - 0.015, 0]} castShadow receiveShadow>
          <boxGeometry args={[st.width, 0.03, st.depth]} />
          <meshPhysicalMaterial
            color="#090a10"
            metalness={0.85}
            roughness={0.15}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
          />
        </mesh>

        {/* Glowing Cyan Perimeter Edge */}
        <mesh position={[0, st.height - 0.015, 0]}>
          <boxGeometry args={[st.width + 0.005, 0.035, st.depth + 0.005]} />
          <primitive object={glowEdgeMaterial} attach="material" />
        </mesh>

        {/* Minimalist Matte Metal Pillar Base */}
        <mesh position={[0, (st.height - 0.03) / 2, 0]} castShadow>
          <cylinderGeometry args={[0.035, 0.045, st.height - 0.03, 16]} />
          <meshStandardMaterial color="#15161f" metalness={0.9} roughness={0.25} />
        </mesh>

        {/* Weighted Base Plate */}
        <mesh position={[0, 0.015, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.2, 0.025, 24]} />
          <meshStandardMaterial color="#111218" metalness={0.9} roughness={0.25} />
        </mesh>

        {/* ============================================================ */}
        {/* 4. Open Laptop on Side Table (Angled towards avatar)         */}
        {/* ============================================================ */}
        <group
          position={[-0.02, st.height, 0.02]}
          rotation={[0, -0.45, 0]}
        >
          {/* Base Chassis */}
          <mesh position={[0, 0.005, 0.03]} castShadow>
            <boxGeometry args={[0.28, 0.008, 0.2]} />
            <meshStandardMaterial color="#1c1d26" metalness={0.9} roughness={0.25} />
          </mesh>

          {/* Trackpad */}
          <mesh position={[0, 0.0095, 0.075]}>
            <planeGeometry args={[0.08, 0.05]} />
            <meshStandardMaterial
              color="#090a0f"
              roughness={0.3}
              metalness={0.8}
            />
          </mesh>

          {/* Tilted Screen Display */}
          <group position={[0, 0.009, -0.055]} rotation={[0.22, 0, 0]}>
            {/* Screen Lid */}
            <mesh position={[0, 0.09, 0]} castShadow>
              <boxGeometry args={[0.28, 0.18, 0.006]} />
              <meshStandardMaterial
                color="#111218"
                metalness={0.9}
                roughness={0.25}
              />
            </mesh>

            {/* Glowing Screen Content */}
            <mesh position={[0, 0.09, 0.0035]}>
              <planeGeometry args={[0.26, 0.16]} />
              <meshBasicMaterial color="#0c1222" />
            </mesh>

            {/* Steel-slate code lines glow */}
            <mesh position={[-0.03, 0.09, 0.004]}>
              <planeGeometry args={[0.15, 0.1]} />
              <meshBasicMaterial color="#8da0af" transparent opacity={0.4} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}
