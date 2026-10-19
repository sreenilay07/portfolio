import { Environment, Lightformer } from "@react-three/drei";

/**
 * StageLighting
 * Architectural studio lighting setup derived from portfolio.mp4:
 * - Horizon fog blending floor seamlessly into #030508
 * - Clean neutral daylight key light
 * - Cool steel-slate rim light
 * - Subtle warm bronze fill reflection
 */
export default function StageLighting() {
  return (
    <>
      {/* Horizon Fog blending floor into page background (#030508) */}
      <fog attach="fog" args={["#030508", 7, 22]} />

      {/* Ambient base illumination */}
      <ambientLight color="#05080c" intensity={0.7} />

      {/* Main Soft Key Light */}
      <directionalLight
        position={[4.0, 7.0, 5.0]}
        intensity={2.2}
        color="#eaeef1"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.1}
        shadow-camera-far={28}
        shadow-camera-left={-14}
        shadow-camera-right={14}
        shadow-camera-top={14}
        shadow-camera-bottom={-14}
        shadow-bias={-0.0001}
        shadow-radius={2}
      />

      {/* Steel Slate Rim Light outlining avatar silhouette */}
      <directionalLight
        position={[-4.5, 3.2, -3.0]}
        intensity={1.8}
        color="#8da0af"
      />

      {/* Subtle Warm Bronze Atmospheric Fill */}
      <directionalLight
        position={[3.8, 2.5, -2.5]}
        intensity={0.8}
        color="#c59b7b"
      />

      {/* Front Fill */}
      <pointLight position={[0, 1.4, 2.8]} intensity={0.3} color="#eaeef1" />

      {/* Reflections via Lightformers (Quiet Architectural Environment) */}
      <Environment resolution={256}>
        <group rotation={[-Math.PI / 3, 0, 1]}>
          <Lightformer
            form="rect"
            intensity={1.0}
            color="#eaeef1"
            position={[0, 7, 0]}
            scale={[12, 12, 1]}
            target={[0, 0, 0]}
          />

          <Lightformer
            form="rect"
            intensity={1.2}
            color="#8da0af"
            position={[-6, 2, 2]}
            scale={[3, 10, 1]}
            target={[0, 1, 0]}
          />

          <Lightformer
            form="rect"
            intensity={0.6}
            color="#c59b7b"
            position={[6, 2, -2]}
            scale={[3, 10, 1]}
            target={[0, 1, 0]}
          />

          <Lightformer
            form="rect"
            intensity={0.3}
            color="#05080c"
            position={[0, -2, 0]}
            scale={[16, 16, 1]}
            target={[0, 0, 0]}
          />
        </group>
      </Environment>
    </>
  );
}
