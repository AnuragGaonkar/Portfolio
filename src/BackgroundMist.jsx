import React, { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

function MistLayer() {
  const group = useRef();
  const { viewport } = useThree();

  const particles = useMemo(
    () =>
      new Array(120).fill(0).map((_, i) => ({
        id: i,
        baseX: (Math.random() - 0.5) * viewport.width * 2.4,
        baseY: (Math.random() - 0.5) * viewport.height * 2.4,
        z: -2 - Math.random() * 3,
        speed: 0.01 + Math.random() * 0.02,
        ampX: 0.6 + Math.random() * 0.6,
        ampY: 0.4 + Math.random() * 0.4,
        size: 0.12 + Math.random() * 0.08,
        opacity: 0.18 + Math.random() * 0.18,
      })),
    [viewport.width, viewport.height]
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!group.current) return;
    group.current.children.forEach((child, index) => {
      const p = particles[index];
      child.position.x = p.baseX + Math.sin(t * p.speed) * p.ampX;
      child.position.y = p.baseY + Math.cos(t * p.speed * 0.9) * p.ampY;
    });
  });

  return (
    <group ref={group}>
      {particles.map((p) => (
        <mesh key={p.id} position={[p.baseX, p.baseY, p.z]}>
          <sphereGeometry args={[p.size, 12, 12]} />
          <meshBasicMaterial
            color="#c9dcd6"
            transparent
            opacity={p.opacity}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function BackgroundMist() {
  return (
    <Canvas
      className="bg-mist-canvas"
      camera={{ position: [0, 0, 8], fov: 50 }}
      dpr={[1, 1.8]}
    >
      <ambientLight intensity={0.4} />
      <MistLayer />
    </Canvas>
  );
}

export default BackgroundMist;
