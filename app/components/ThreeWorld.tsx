"use client";

import React, { Suspense, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Float,
  Grid,
  Html,
  OrbitControls,
  RoundedBox,
  Sparkles,
  Text,
} from "@react-three/drei";

type PanelKey = "about" | "skills" | "projects";

function LightStrip({
  position = [0, 0, 0] as [number, number, number],
  rotation = [0, 0, 0] as [number, number, number],
  size = [4, 0.08] as [number, number],
  color = "#38bdf8",
  opacity = 0.9,
}) {
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={size} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
}

function RoomShell() {
  return (
    <group>
      <mesh position={[0, 3, 0]} receiveShadow>
        <boxGeometry args={[12, 6, 12]} />
        <meshStandardMaterial
          color="#020617"
          side={THREE.BackSide}
          metalness={0.35}
          roughness={0.95}
        />
      </mesh>

      <LightStrip
        position={[0, 5.7, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        size={[8.5, 0.08]}
        color="#60a5fa"
      />
      <LightStrip position={[0, 3.2, -5.92]} size={[7.5, 0.08]} />
      <LightStrip
        position={[-5.92, 3.2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        size={[7.5, 0.08]}
      />
      <LightStrip
        position={[5.92, 3.2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        size={[7.5, 0.08]}
      />
    </group>
  );
}

function NeonPillars() {
  const pillars = [
    [-4.5, 1.5, -4.5],
    [4.5, 1.5, -4.5],
    [-4.5, 1.5, 4.5],
    [4.5, 1.5, 4.5],
  ];

  return (
    <group>
      {pillars.map((pos, i) => (
        <group key={i}>
          <mesh castShadow position={pos as [number, number, number]}>
            <boxGeometry args={[0.28, 3, 0.28]} />
            <meshStandardMaterial
              color="#0f172a"
              metalness={1}
              roughness={0.25}
              emissive="#0ea5e9"
              emissiveIntensity={0.35}
            />
          </mesh>

          <mesh position={[pos[0], pos[1] + 1.6, pos[2]]}>
            <sphereGeometry args={[0.11, 16, 16]} />
            <meshBasicMaterial color="#7dd3fc" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function Platform() {
  return (
    <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[1.8, 2.1, 0.45, 64]} />
      <meshStandardMaterial
        color="#0f172a"
        metalness={0.95}
        roughness={0.22}
        emissive="#082f49"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

function Keyboard() {
  return (
    <group position={[0, 0.83, 1.05]}>
      <mesh castShadow>
        <boxGeometry args={[1.6, 0.08, 0.6]} />
        <meshStandardMaterial
          color="#111827"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

function MousePad() {
  return (
    <group position={[1.15, 0.82, 0.9]}>
      <mesh receiveShadow>
        <boxGeometry args={[0.7, 0.04, 0.8]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} />
      </mesh>

      <mesh position={[0, 0.05, 0]} castShadow>
        <boxGeometry args={[0.18, 0.08, 0.26]} />
        <meshStandardMaterial
          color="#1e293b"
          metalness={0.7}
          roughness={0.35}
        />
      </mesh>
    </group>
  );
}

function Desk() {
  return (
    <group position={[0, 0.65, 0]}>
      <mesh receiveShadow castShadow>
        <boxGeometry args={[4.2, 0.15, 2]} />
        <meshStandardMaterial
          color="#111827"
          metalness={0.75}
          roughness={0.32}
        />
      </mesh>

      {[
        [-1.8, -0.7, -0.75],
        [1.8, -0.7, -0.75],
        [-1.8, -0.7, 0.75],
        [1.8, -0.7, 0.75],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} castShadow>
          <boxGeometry args={[0.12, 1.4, 0.12]} />
          <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function ScreenContent({ activePanel }: { activePanel: PanelKey }) {
  if (activePanel === "about") {
    return (
      <div className="h-full w-full rounded-xl border border-cyan-400/30 bg-slate-950/90 p-4 text-left text-slate-100">
        <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-300">
          developer.profile
        </p>
        <h2 className="mt-2 text-xl font-bold text-white">Damindu Prasadith</h2>
        <p className="mt-2 text-sm text-slate-300">
          Frontend-focused developer building interactive web experiences with
          modern UI, animation, and 3D scenes.
        </p>

        <div className="mt-4 rounded-lg border border-cyan-500/20 bg-slate-900/80 p-3 font-mono text-xs leading-6 text-cyan-200">
          <p>
            <span className="text-sky-400">const</span> profile = {"{"}
          </p>
          <p className="pl-4">
            name: <span className="text-emerald-300">"Damindu"</span>,
          </p>
          <p className="pl-4">
            role: <span className="text-emerald-300">"Creative Developer"</span>,
          </p>
          <p className="pl-4">
            focus: <span className="text-emerald-300">"React, Next.js, UI/UX"</span>,
          </p>
          <p className="pl-4">
            style: <span className="text-emerald-300">"Immersive interfaces"</span>,
          </p>
          <p>{"}"}</p>
        </div>
      </div>
    );
  }

  if (activePanel === "skills") {
    return (
      <div className="h-full w-full rounded-xl border border-cyan-400/30 bg-slate-950/90 p-4 text-left text-slate-100">
        <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-300">
          tech.stack
        </p>
        <h2 className="mt-2 text-xl font-bold text-white">Skills</h2>

        <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
          {[
            "React",
            "Next.js",
            "TypeScript",
            "Tailwind CSS",
            "Three.js",
            "React Three Fiber",
            "Framer Motion",
            "UI Design",
          ].map((item) => (
            <div
              key={item}
              className="rounded-lg border border-sky-500/20 bg-slate-900/70 px-3 py-2 text-cyan-200"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-lg border border-cyan-500/20 bg-slate-900/80 p-3 font-mono text-xs text-slate-300">
          <p>&gt; npm run skills</p>
          <p className="mt-1 text-cyan-300">
            UI engineering • 3D scenes • interaction design • animations
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full rounded-xl border border-cyan-400/30 bg-slate-950/90 p-4 text-left text-slate-100">
      <p className="text-[10px] uppercase tracking-[0.35em] text-cyan-300">
        selected.work
      </p>
      <h2 className="mt-2 text-xl font-bold text-white">Projects</h2>

      <div className="mt-4 space-y-3">
        {[
          {
            title: "3D Portfolio Room",
            desc: "Interactive immersive room with clickable panels and animated scene elements.",
          },
          {
            title: "Neural Landscape",
            desc: "Visual side feature using react-three-fiber and live surface rendering.",
          },
          {
            title: "Modern UI Experiences",
            desc: "Clean interface work using React, TypeScript, Tailwind, and motion.",
          },
        ].map((project) => (
          <div
            key={project.title}
            className="rounded-lg border border-sky-500/20 bg-slate-900/70 p-3"
          >
            <p className="font-semibold text-cyan-200">{project.title}</p>
            <p className="mt-1 text-sm text-slate-300">{project.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Computer({
  activePanel,
}: {
  activePanel: PanelKey;
}) {
  const screenGlow = useMemo(() => {
    if (activePanel === "about") return "#22d3ee";
    if (activePanel === "skills") return "#818cf8";
    return "#38bdf8";
  }, [activePanel]);

  return (
    <group position={[0, 1.05, 0]}>
      <Desk />

      <group position={[0, 0.95, -0.15]}>
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[2.45, 1.55, 0.12]} />
          <meshStandardMaterial
            color="#020617"
            metalness={0.9}
            roughness={0.2}
            emissive={screenGlow}
            emissiveIntensity={0.12}
          />
        </mesh>

        <mesh position={[0, 0, 0.07]}>
          <planeGeometry args={[2.15, 1.25]} />
          <meshBasicMaterial color="#031525" />
        </mesh>

        <Html transform distanceFactor={2.4} position={[0, 0, 0.085]}>
          <div className="h-[240px] w-[410px] overflow-hidden rounded-xl">
            <ScreenContent activePanel={activePanel} />
          </div>
        </Html>

        <mesh position={[0, -0.98, -0.02]} castShadow>
          <boxGeometry args={[0.18, 0.7, 0.18]} />
          <meshStandardMaterial color="#111827" metalness={0.8} roughness={0.25} />
        </mesh>

        <mesh position={[0, -1.33, 0.05]} castShadow receiveShadow>
          <boxGeometry args={[0.75, 0.08, 0.45]} />
          <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.28} />
        </mesh>
      </group>

      <Keyboard />
      <MousePad />
    </group>
  );
}

function HologramPanel({
  position = [0, 0, 0] as [number, number, number],
  rotation = [0, 0, 0] as [number, number, number],
  title = "DAMINDU'S ROOM",
  subtitle = "Interactive immersive environment",
  panelKey,
  activePanel,
  onClick,
}: {
  position?: [number, number, number];
  rotation?: [number, number, number];
  title?: string;
  subtitle?: string;
  panelKey: PanelKey;
  activePanel: PanelKey;
  onClick: (panel: PanelKey) => void;
}) {
  const isActive = activePanel === panelKey;
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.position.y =
      position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.03;
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={rotation}
      onClick={() => onClick(panelKey)}
    >
      <Float speed={1.6} rotationIntensity={0.12} floatIntensity={0.2}>
        <RoundedBox args={[2.4, 1.45, 0.08]} radius={0.08} smoothness={4}>
          <meshStandardMaterial
            color={isActive ? "#0b1b2c" : "#07111f"}
            metalness={0.85}
            roughness={0.18}
            emissive={isActive ? "#38bdf8" : "#0ea5e9"}
            emissiveIntensity={isActive ? 0.55 : 0.18}
          />
        </RoundedBox>

        <mesh position={[0, 0, 0.05]}>
          <planeGeometry args={[2.1, 1.15]} />
          <meshBasicMaterial
            color={isActive ? "#67e8f9" : "#38bdf8"}
            transparent
            opacity={isActive ? 0.2 : 0.12}
          />
        </mesh>

        <Text
          position={[0, -0.92, 0.05]}
          fontSize={0.12}
          color={isActive ? "#7dd3fc" : "#94a3b8"}
          anchorX="center"
          anchorY="middle"
        >
          CLICK
        </Text>

        <Html transform distanceFactor={4.8} position={[0, 0, 0.08]}>
          <button
            onClick={() => onClick(panelKey)}
            className={`w-48 rounded-2xl border px-4 py-3 text-center shadow-2xl backdrop-blur-md transition ${
              isActive
                ? "border-cyan-300/50 bg-sky-950/80"
                : "border-sky-400/30 bg-slate-950/60"
            }`}
          >
            <p className="text-xs font-semibold tracking-[0.35em] text-sky-300">
              {title}
            </p>
            <p className="mt-2 text-[11px] leading-4 text-slate-300">
              {subtitle}
            </p>
          </button>
        </Html>
      </Float>
    </group>
  );
}

function Scene() {
  const [activePanel, setActivePanel] = useState<PanelKey>("about");

  return (
    <>
      <color attach="background" args={["#020617"]} />
      <fog attach="fog" args={["#020617", 8, 22]} />

      <ambientLight intensity={0.45} />
      <hemisphereLight
        intensity={0.6}
        color={"#60a5fa"}
        groundColor={"#020617"}
      />

      <spotLight
        position={[0, 7, 2]}
        angle={0.35}
        penumbra={1}
        intensity={30}
        color="#60a5fa"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      <pointLight position={[0, 2, 4]} intensity={3} color="#a78bfa" />

      <RoomShell />
      <NeonPillars />
      <Platform />
      <Computer activePanel={activePanel} />

      <HologramPanel
        position={[-3.2, 2.05, -2.3]}
        rotation={[0, 0.45, 0]}
        title="ABOUT ME"
        subtitle="Click to show personal profile and intro."
        panelKey="about"
        activePanel={activePanel}
        onClick={setActivePanel}
      />

      <HologramPanel
        position={[3.2, 1.8, -2.6]}
        rotation={[0, -0.45, 0]}
        title="SKILLS"
        subtitle="Click to show technologies and development stack."
        panelKey="skills"
        activePanel={activePanel}
        onClick={setActivePanel}
      />

      <HologramPanel
        position={[0, 2.25, -4.3]}
        rotation={[0, 0, 0]}
        title="PROJECTS"
        subtitle="Click to show selected works and experiments."
        panelKey="projects"
        activePanel={activePanel}
        onClick={setActivePanel}
      />

      <Grid
        position={[0, 0.02, 0]}
        args={[12, 12]}
        cellSize={0.5}
        cellThickness={0.5}
        cellColor={"#1d4ed8"}
        sectionSize={2}
        sectionThickness={1.2}
        sectionColor={"#38bdf8"}
        fadeDistance={18}
        fadeStrength={1}
        infiniteGrid={false}
      />

      <Sparkles
        count={140}
        scale={[10, 5, 10]}
        size={2.2}
        speed={0.25}
        noise={1}
        color={"#7dd3fc"}
      />

      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.55}
        scale={12}
        blur={2.8}
        far={12}
      />

      <OrbitControls
        enablePan={false}
        minDistance={5.5}
        maxDistance={9.5}
        minPolarAngle={Math.PI / 3.4}
        maxPolarAngle={Math.PI / 2.05}
        autoRotate
        autoRotateSpeed={0.35}
      />
    </>
  );
}

export default function ThreeWorld() {
  return (
    <div className="h-full w-full overflow-hidden rounded-2xl bg-black">
      <Canvas shadows camera={{ position: [0, 2.2, 8], fov: 50 }}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}