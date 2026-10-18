import { Environment, Lightformer } from "@react-three/drei";

/**
 * StageLighting
 * High-end studio lighting setup with soft key light, cyan rim light, violet fill,
 * and internal Lightformers without external CDN/HDR preset fetches.
 */
export default function StageLighting() {
  return (
    <>
      {/* Soft Ambient base illumination */}
      <ambientLight color="#0c0d18" intensity={0.8} />

      {/* Main Soft Key Light with contact shadows */}
      <directionalLight
        position={[3.5, 6.0, 4.5]}
        intensity={2.2}
        color="#f4f4fa"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={18}
        shadow-camera-left={-4}
        shadow-camera-right={4}
        shadow-camera-top={4}
        shadow-camera-bottom={-4}
        shadow-bias={-0.0002}
      />

      {/* Cyan Rim Light highlighting the avatar contours from behind */}
      <directionalLight
        position={[-3.8, 2.8, -2.5]}
        intensity={3.2}
        color="#06b6d4"
      />

      {/* Violet Fill Light providing atmospheric contrast */}
      <directionalLight
        position={[3.2, 2.0, -2.0]}
        intensity={1.8}
        color="#8b5cf6"
      />

      {/* Subtle Front Chest Fill */}
      <pointLight position={[0, 1.4, 2.5]} intensity={0.6} color="#38bdf8" />

      {/* Internal Environment Reflections via Lightformers */}
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          {/* Top Soft Violet Overhead Light */}
          <Lightformer
            form="rect"
            intensity={1.5}
            color="#8b5cf6"
            position={[0, 6, 0]}
            scale={[12, 12, 1]}
            target={[0, 0, 0]}
          />

          {/* Left Cyan Edge Strip */}
          <Lightformer
            form="rect"
            intensity={2.5}
            color="#06b6d4"
            position={[-6, 2, 2]}
            scale={[4, 10, 1]}
            target={[0, 1, 0]}
          />

          {/* Right Fuchsia / Violet Accent */}
          <Lightformer
            form="rect"
            intensity={2.0}
            color="#d946ef"
            position={[6, 2, -2]}
            scale={[4, 10, 1]}
            target={[0, 1, 0]}
          />

          {/* Floor Reflection Fill */}
          <Lightformer
            form="rect"
            intensity={0.6}
            color="#18182b"
            position={[0, -2, 0]}
            scale={[15, 15, 1]}
            target={[0, 0, 0]}
          />
        </group>
      </Environment>
    </>
  );
}
