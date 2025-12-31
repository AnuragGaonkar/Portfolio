import React, { useRef, useState, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";

/* Ambient mist floating in the background */
function MistParticles() {
  const group = useRef();
  const { viewport } = useThree();

  const particles = useMemo(
    () =>
      new Array(70).fill(0).map((_, i) => ({
        id: i,
        baseX: (Math.random() - 0.5) * viewport.width * 1.6,
        baseY: (Math.random() - 0.5) * viewport.height * 1.6,
        z: -1.5 - Math.random() * 2,
        speed: 0.015 + Math.random() * 0.03,
        ampX: 0.5 + Math.random() * 0.5,
        ampY: 0.3 + Math.random() * 0.3,
        size: 0.09 + Math.random() * 0.07,
        opacity: 0.25 + Math.random() * 0.25,
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
            color="#c6d9d3"
            transparent
            opacity={p.opacity}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* Mist that appears at mouse/touch position and drifts away */
function ClickMist({ bursts }) {
  const group = useRef();

  useFrame((state, delta) => {
    if (!group.current) return;
    group.current.children.forEach((child) => {
      child.position.y += delta * 0.4;
      const mat = child.material;
      if (mat && mat.opacity !== undefined) {
        mat.opacity -= delta * 0.25;
        if (mat.opacity < 0) mat.opacity = 0;
      }
      child.scale.x += delta * 0.15;
      child.scale.y += delta * 0.15;
    });
  });

  return (
    <group ref={group}>
      {bursts.map((burst) =>
        burst.particles.map((p) => (
          <mesh key={p.id} position={[p.x, p.y, p.z]}>
            <sphereGeometry args={[p.size, 10, 10]} />
            <meshBasicMaterial
              color="#d8e6e1"
              transparent
              opacity={p.opacity}
              depthWrite={false}
            />
          </mesh>
        ))
      )}
    </group>
  );
}

function SceneContents() {
  const { viewport, camera, size } = useThree();
  const [bursts, setBursts] = useState([]);

  const screenToScene = useCallback(
    (clientX, clientY) => {
      const xNdc = (clientX / size.width) * 2 - 1;
      const yNdc = -(clientY / size.height) * 2 + 1;
      const distance = camera.position.z / 6;
      return [
        xNdc * viewport.width * 0.5 * distance,
        yNdc * viewport.height * 0.5 * distance,
      ];
    },
    [camera.position.z, size.width, size.height, viewport.width, viewport.height]
  );

  const spawnBurst = useCallback((x, y, strong) => {
    setBursts((prev) => {
      const idBase = performance.now();
      const count = strong ? 18 : 10;
      const particles = new Array(count).fill(0).map((_, i) => ({
        id: `${idBase}-${i}`,
        x: x + (Math.random() - 0.5) * 0.4,
        y: y + (Math.random() - 0.5) * 0.3,
        z: -0.3 - Math.random() * 0.5,
        size: 0.14 + Math.random() * 0.08,
        opacity: 0.9,
      }));
      const burst = { id: idBase, particles };
      return [...prev, burst].slice(-14);
    });
  }, []);

  const handlePointerDown = useCallback(
    (event) => {
      const [x, y] = screenToScene(event.clientX, event.clientY);
      spawnBurst(x, y, true);
    },
    [screenToScene, spawnBurst]
  );

  const handlePointerMove = useCallback(
    (event) => {
      if (event.pointerType === "mouse" && event.buttons !== 1) return;
      const [x, y] = screenToScene(event.clientX, event.clientY);
      spawnBurst(x, y, false);
    },
    [screenToScene, spawnBurst]
  );

  return (
    <>
      <ambientLight intensity={0.5} />
      <MistParticles />
      <ClickMist bursts={bursts} />

      {/* soft gradient wash over bg */}
      <Html fullscreen>
        <div className="hero-gradient-bg" />
      </Html>

      {/* big invisible plane capturing all pointer events inside canvas */}
      <mesh
        position={[0, 0, 0.1]}
        visible={false}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
      >
        <planeGeometry args={[viewport.width * 3, viewport.height * 3]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </>
  );
}

function HeroScene() {
  return (
    <Canvas
      className="hero-canvas"
      camera={{ position: [0, 0, 6], fov: 45 }}
      dpr={[1, 1.8]}
    >
      <SceneContents />
    </Canvas>
  );
}

export default HeroScene;
