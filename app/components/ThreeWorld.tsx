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
  Environment,
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
      {/* Main room box */}
      <mesh position={[0, 3, 0]} receiveShadow>
        <boxGeometry args={[14, 7, 14]} />
        <meshStandardMaterial
          color="#010b18"
          side={THREE.BackSide}
          metalness={0.4}
          roughness={0.9}
        />
      </mesh>

      {/* Ceiling light panel */}
      <mesh position={[0, 6.45, 0]}>
        <boxGeometry args={[3.5, 0.05, 1.8]} />
        <meshBasicMaterial color="#bae6fd" />
      </mesh>
      <mesh position={[0, 6.42, 0]}>
        <boxGeometry args={[3.8, 0.06, 2.1]} />
        <meshStandardMaterial color="#1e3a5f" metalness={0.8} roughness={0.3} />
      </mesh>

      {/* Ceiling edge strips */}
      <LightStrip position={[0, 6.48, 0]} rotation={[Math.PI / 2, 0, 0]} size={[11, 0.1]} color="#7dd3fc" opacity={0.7} />

      {/* Wall accent strips */}
      <LightStrip position={[0, 4.2, -6.92]} size={[9, 0.06]} color="#60a5fa" opacity={0.8} />
      <LightStrip position={[0, 1.1, -6.92]} size={[9, 0.06]} color="#38bdf8" opacity={0.6} />
      <LightStrip position={[-6.92, 4.2, 0]} rotation={[0, Math.PI / 2, 0]} size={[9, 0.06]} color="#818cf8" opacity={0.7} />
      <LightStrip position={[6.92, 4.2, 0]} rotation={[0, -Math.PI / 2, 0]} size={[9, 0.06]} color="#38bdf8" opacity={0.7} />
      <LightStrip position={[0, 4.2, 6.92]} rotation={[0, Math.PI, 0]} size={[9, 0.06]} color="#60a5fa" opacity={0.8} />

      {/* Floor edge glow */}
      <LightStrip position={[0, 0.03, -6.8]} size={[8, 0.04]} color="#0ea5e9" opacity={0.5} />
      <LightStrip position={[-6.8, 0.03, 0]} rotation={[0, Math.PI / 2, 0]} size={[8, 0.04]} color="#0ea5e9" opacity={0.5} />
      <LightStrip position={[6.8, 0.03, 0]} rotation={[0, -Math.PI / 2, 0]} size={[8, 0.04]} color="#0ea5e9" opacity={0.5} />
    </group>
  );
}

function WallArtPanel({ position, rotation, color = "#38bdf8" }: {
  position: [number, number, number];
  rotation: [number, number, number];
  color?: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      (ref.current.material as THREE.MeshStandardMaterial).emissiveIntensity =
        0.15 + Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
    }
  });
  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <boxGeometry args={[1.8, 1.1, 0.04]} />
      <meshStandardMaterial
        color="#0a1628"
        metalness={0.9}
        roughness={0.2}
        emissive={color}
        emissiveIntensity={0.15}
      />
    </mesh>
  );
}

function NeonPillars() {
  const pillars: [number, number, number][] = [
    [-5.5, 2, -5.5],
    [5.5, 2, -5.5],
    [-5.5, 2, 5.5],
    [5.5, 2, 5.5],
  ];
  const colors = ["#38bdf8", "#818cf8", "#34d399", "#f472b6"];

  return (
    <group>
      {pillars.map((pos, i) => (
        <group key={i}>
          <mesh castShadow position={pos}>
            <boxGeometry args={[0.3, 4, 0.3]} />
            <meshStandardMaterial
              color="#0a1628"
              metalness={1}
              roughness={0.2}
              emissive={colors[i]}
              emissiveIntensity={0.4}
            />
          </mesh>
          <mesh position={[pos[0], pos[1] + 2.1, pos[2]]}>
            <sphereGeometry args={[0.13, 16, 16]} />
            <meshBasicMaterial color={colors[i]} />
          </mesh>
          <pointLight
            position={[pos[0], pos[1] + 1.5, pos[2]]}
            intensity={2}
            color={colors[i]}
            distance={4}
          />
        </group>
      ))}
    </group>
  );
}

function Platform() {
  return (
    <group>
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2.2, 2.5, 0.5, 64]} />
        <meshStandardMaterial
          color="#0a1628"
          metalness={0.95}
          roughness={0.2}
          emissive="#0369a1"
          emissiveIntensity={0.25}
        />
      </mesh>
      {/* Glowing ring */}
      <mesh position={[0, 0.66, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.3, 0.04, 8, 64]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
    </group>
  );
}

function Chair() {
  return (
    <group position={[0, 0.65, 2.2]}>
      {/* Seat */}
      <mesh castShadow>
        <boxGeometry args={[1.0, 0.1, 1.0]} />
        <meshStandardMaterial color="#111827" metalness={0.4} roughness={0.6} />
      </mesh>
      {/* Backrest */}
      <mesh position={[0, 0.55, -0.45]} castShadow>
        <boxGeometry args={[1.0, 1.0, 0.1]} />
        <meshStandardMaterial color="#111827" metalness={0.4} roughness={0.6} />
      </mesh>
      {/* Armrests */}
      <mesh position={[-0.52, 0.2, -0.1]} castShadow>
        <boxGeometry args={[0.08, 0.1, 0.7]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.52, 0.2, -0.1]} castShadow>
        <boxGeometry args={[0.08, 0.1, 0.7]} />
        <meshStandardMaterial color="#1e293b" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Legs */}
      {([ [-0.4, -0.45, 0.4], [0.4, -0.45, 0.4], [-0.4, -0.45, -0.4], [0.4, -0.45, -0.4] ] as [number,number,number][]).map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.9, 8]} />
          <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}
      {/* Emissive strip on backrest */}
      <mesh position={[0, 0.55, -0.39]}>
        <boxGeometry args={[0.9, 0.06, 0.02]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>
    </group>
  );
}

function Bookshelf({ position, rotation = [0, 0, 0] as [number, number, number] }: {
  position: [number, number, number];
  rotation?: [number, number, number];
}) {
  const bookColors = [
    "#ef4444", "#3b82f6", "#10b981", "#f59e0b",
    "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16",
    "#f97316", "#6366f1", "#14b8a6", "#e11d48",
  ];
  return (
    <group position={position} rotation={rotation}>
      {/* Frame */}
      <mesh castShadow>
        <boxGeometry args={[2.0, 2.8, 0.42]} />
        <meshStandardMaterial color="#0f172a" metalness={0.6} roughness={0.5} />
      </mesh>
      {/* Interior back */}
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[1.8, 2.6, 0.02]} />
        <meshStandardMaterial color="#020617" />
      </mesh>
      {/* Shelves */}
      {[0, 1, 2, 3].map((shelf) => (
        <group key={shelf} position={[0, -0.9 + shelf * 0.65, 0.06]}>
          <mesh>
            <boxGeometry args={[1.8, 0.06, 0.32]} />
            <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.4} />
          </mesh>
          {bookColors.slice(shelf * 3, shelf * 3 + 3).map((color, b) => (
            <mesh key={b} position={[-0.52 + b * 0.38, 0.22, 0.02]} castShadow>
              <boxGeometry args={[0.28, 0.42, 0.28]} />
              <meshStandardMaterial
                color={color}
                roughness={0.85}
                emissive={color}
                emissiveIntensity={0.12}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

function Plant() {
  const ref = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });
  return (
    <group ref={ref} position={[2.1, 0.78, -0.6]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.14, 0.1, 0.22, 10]} />
        <meshStandardMaterial color="#78350f" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.16, 0]}>
        <cylinderGeometry args={[0.15, 0.12, 0.08, 10]} />
        <meshStandardMaterial color="#451a03" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
        <meshStandardMaterial color="#166534" />
      </mesh>
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          position={[
            Math.sin((i / 5) * Math.PI * 2) * 0.16,
            0.32 + i * 0.06,
            Math.cos((i / 5) * Math.PI * 2) * 0.16,
          ]}
          rotation={[
            Math.random() * 0.5,
            (i / 5) * Math.PI * 2,
            Math.PI / 4,
          ]}
          castShadow
        >
          <sphereGeometry args={[0.1 - i * 0.01, 8, 8]} />
          <meshStandardMaterial
            color="#15803d"
            roughness={0.9}
            emissive="#14532d"
            emissiveIntensity={0.15}
          />
        </mesh>
      ))}
    </group>
  );
}

function Rug() {
  return (
    <mesh position={[0, 0.016, 1.2]} receiveShadow rotation={[0, 0, 0]}>
      <boxGeometry args={[4.5, 0.025, 3.2]} />
      <meshStandardMaterial
        color="#172554"
        roughness={0.98}
        emissive="#1d4ed8"
        emissiveIntensity={0.04}
      />
    </mesh>
  );
}

function FloatingOrbs() {
  const orbs = [
    { pos: [-3.5, 3.5, -2.5] as [number,number,number], color: "#38bdf8", speed: 1.2 },
    { pos: [3.5, 4.0, -3.0] as [number,number,number], color: "#818cf8", speed: 0.9 },
    { pos: [-4.0, 3.0, 2.0] as [number,number,number], color: "#34d399", speed: 1.5 },
    { pos: [4.0, 3.5, 1.5] as [number,number,number], color: "#f472b6", speed: 1.1 },
  ];

  return (
    <>
      {orbs.map((orb, i) => {
        const ref = useRef<THREE.Group>(null);
        useFrame((state) => {
          if (!ref.current) return;
          ref.current.position.y =
            orb.pos[1] + Math.sin(state.clock.elapsedTime * orb.speed + i) * 0.25;
        });
        return (
          <group key={i} ref={ref} position={orb.pos}>
            <mesh>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshBasicMaterial color={orb.color} />
            </mesh>
            <mesh>
              <torusGeometry args={[0.22, 0.018, 8, 32]} />
              <meshBasicMaterial color={orb.color} transparent opacity={0.6} />
            </mesh>
            <pointLight intensity={1.5} color={orb.color} distance={3} />
          </group>
        );
      })}
    </>
  );
}

function Keyboard() {
  return (
    <group position={[0, 0.83, 1.1]}>
      <mesh castShadow>
        <boxGeometry args={[1.7, 0.07, 0.58]} />
        <meshStandardMaterial color="#111827" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Key rows visual */}
      {[0, 1, 2].map((row) => (
        <mesh key={row} position={[0, 0.045, -0.15 + row * 0.15]}>
          <boxGeometry args={[1.5, 0.01, 0.1]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.18} />
        </mesh>
      ))}
    </group>
  );
}

function MousePad() {
  return (
    <group position={[1.2, 0.82, 0.9]}>
      <mesh receiveShadow>
        <boxGeometry args={[0.75, 0.035, 0.85]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.85}
          emissive="#0369a1"
          emissiveIntensity={0.08}
        />
      </mesh>
      {/* Mouse */}
      <mesh position={[0, 0.055, 0]} castShadow>
        <boxGeometry args={[0.2, 0.09, 0.28]} />
        <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.1, -0.07]}>
        <boxGeometry args={[0.18, 0.02, 0.02]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

function Desk() {
  return (
    <group position={[0, 0.65, 0]}>
      {/* Desk surface */}
      <mesh receiveShadow castShadow>
        <boxGeometry args={[4.8, 0.14, 2.1]} />
        <meshStandardMaterial
          color="#111827"
          metalness={0.8}
          roughness={0.28}
          emissive="#0369a1"
          emissiveIntensity={0.04}
        />
      </mesh>
      {/* Front edge glow strip */}
      <mesh position={[0, 0.08, 1.06]}>
        <boxGeometry args={[4.6, 0.04, 0.02]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.5} />
      </mesh>
      {/* Legs */}
      {([ [-2.1, -0.75, -0.8], [2.1, -0.75, -0.8], [-2.1, -0.75, 0.8], [2.1, -0.75, 0.8] ] as [number,number,number][]).map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <boxGeometry args={[0.13, 1.5, 0.13]} />
          <meshStandardMaterial color="#0a1628" metalness={0.9} roughness={0.25} />
        </mesh>
      ))}
    </group>
  );
}

function ScreenContent({ activePanel }: { activePanel: PanelKey }) {
  if (activePanel === "about") {
    return (
      <div className="h-full w-full rounded-xl border border-cyan-400/30 bg-slate-950/95 p-4 text-left text-slate-100">
        <p className="text-[9px] uppercase tracking-[0.35em] text-cyan-300">
          developer.profile
        </p>
        <h2 className="mt-1.5 text-lg font-bold text-white">Damindu Prasadith</h2>
        <p className="mt-1.5 text-[11px] text-slate-300 leading-5">
          CS undergrad at University of Kelaniya. Building full-stack apps,
          blockchain systems, and AI-powered solutions.
        </p>
        <div className="mt-3 rounded-lg border border-cyan-500/20 bg-slate-900/80 p-3 font-mono text-[10px] leading-5 text-cyan-200">
          <p><span className="text-sky-400">const</span> profile = {"{"}</p>
          <p className="pl-3">name: <span className="text-emerald-300">"Damindu"</span>,</p>
          <p className="pl-3">role: <span className="text-emerald-300">"Full-Stack Dev"</span>,</p>
          <p className="pl-3">focus: <span className="text-emerald-300">"React · AI · Web3"</span>,</p>
          <p className="pl-3">uni: <span className="text-emerald-300">"Kelaniya · CS"</span>,</p>
          <p>{"}"}</p>
        </div>
        <div className="mt-2 flex gap-2">
          {["Open to Work", "Sri Lanka"].map((tag) => (
            <span key={tag} className="rounded-full border border-sky-500/30 bg-sky-900/30 px-2 py-0.5 text-[9px] text-sky-300">
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (activePanel === "skills") {
    return (
      <div className="h-full w-full rounded-xl border border-cyan-400/30 bg-slate-950/95 p-4 text-left text-slate-100">
        <p className="text-[9px] uppercase tracking-[0.35em] text-cyan-300">tech.stack</p>
        <h2 className="mt-1.5 text-lg font-bold text-white">Skills</h2>
        <div className="mt-3 grid grid-cols-2 gap-1.5 text-[10px]">
          {["React", "Next.js", "TypeScript", "Tailwind CSS", "Three.js", "Solidity", "Python · FastAPI", "MongoDB"].map((item) => (
            <div key={item} className="rounded-lg border border-sky-500/20 bg-slate-900/70 px-2 py-1.5 text-cyan-200 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400 flex-shrink-0" />
              {item}
            </div>
          ))}
        </div>
        <div className="mt-2 rounded-lg border border-cyan-500/20 bg-slate-900/80 p-2 font-mono text-[9px] text-slate-300">
          <span className="text-cyan-300">$</span> UI · 3D · Blockchain · AI agents · APIs
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full rounded-xl border border-cyan-400/30 bg-slate-950/95 p-4 text-left text-slate-100">
      <p className="text-[9px] uppercase tracking-[0.35em] text-cyan-300">selected.work</p>
      <h2 className="mt-1.5 text-lg font-bold text-white">Projects</h2>
      <div className="mt-3 space-y-2">
        {[
          { title: "Blockchain Voting", desc: "Decentralized voting on Ethereum with MetaMask auth.", color: "#38bdf8" },
          { title: "AI WhatsApp Agent", desc: "Vector-search shopping bot via Meta Cloud API.", color: "#818cf8" },
          { title: "E-Commerce Platform", desc: "Full-stack with Supabase, Next.js & Stripe.", color: "#34d399" },
        ].map((project) => (
          <div key={project.title} className="rounded-lg border border-sky-500/20 bg-slate-900/70 p-2">
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full flex-shrink-0" style={{ background: project.color }} />
              <p className="font-semibold text-[11px] text-cyan-200">{project.title}</p>
            </div>
            <p className="mt-0.5 text-[9px] text-slate-400 pl-3">{project.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MainMonitor({ activePanel }: { activePanel: PanelKey }) {
  const screenGlow = useMemo(() => {
    if (activePanel === "about") return "#22d3ee";
    if (activePanel === "skills") return "#818cf8";
    return "#34d399";
  }, [activePanel]);

  return (
    <group position={[0, 0.95, -0.2]}>
      {/* Bezel */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.6, 1.6, 0.1]} />
        <meshStandardMaterial
          color="#020617"
          metalness={0.9}
          roughness={0.18}
          emissive={screenGlow}
          emissiveIntensity={0.15}
        />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 0, 0.056]}>
        <planeGeometry args={[2.35, 1.38]} />
        <meshBasicMaterial color="#020d1a" />
      </mesh>
      <Html transform distanceFactor={2.5} position={[0, 0, 0.07]}>
        <div className="h-[240px] w-[430px] overflow-hidden rounded-lg">
          <ScreenContent activePanel={activePanel} />
        </div>
      </Html>
      {/* Screen glow */}
      <pointLight position={[0, 0, 0.5]} intensity={4} color={screenGlow} distance={3} />
      {/* Stand neck */}
      <mesh position={[0, -1.0, -0.02]} castShadow>
        <boxGeometry args={[0.16, 0.72, 0.16]} />
        <meshStandardMaterial color="#111827" metalness={0.85} roughness={0.22} />
      </mesh>
      {/* Stand base */}
      <mesh position={[0, -1.38, 0.08]} castShadow>
        <boxGeometry args={[0.85, 0.07, 0.48]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.25} />
      </mesh>
    </group>
  );
}

function SideMonitor() {
  return (
    <group position={[-1.6, 0.75, -0.6]} rotation={[0, 0.45, 0]}>
      {/* Bezel */}
      <mesh castShadow>
        <boxGeometry args={[1.5, 1.0, 0.08]} />
        <meshStandardMaterial color="#020617" metalness={0.9} roughness={0.2} emissive="#818cf8" emissiveIntensity={0.12} />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[1.35, 0.88]} />
        <meshBasicMaterial color="#05010f" />
      </mesh>
      <Html transform distanceFactor={4.0} position={[0, 0, 0.055]}>
        <div className="w-[260px] h-[165px] overflow-hidden rounded-md bg-slate-950/95 p-2 font-mono text-[8px] text-purple-300 border border-purple-500/20">
          <p className="text-purple-400 text-[7px] mb-1">// terminal</p>
          <p><span className="text-green-400">➜</span> <span className="text-blue-300">~/projects</span></p>
          <p className="text-slate-400">git status</p>
          <p className="text-green-300">On branch main</p>
          <p className="text-slate-400">Changes staged:</p>
          <p className="text-green-400">  + portfolio.tsx</p>
          <p className="text-green-400">  + ThreeWorld.tsx</p>
          <p><span className="text-green-400">➜</span> npm run dev</p>
          <p className="text-cyan-300">▲ Next.js ready</p>
          <p className="text-slate-500">localhost:3000</p>
        </div>
      </Html>
      {/* Stand */}
      <mesh position={[0, -0.62, 0]}>
        <boxGeometry args={[0.1, 0.45, 0.1]} />
        <meshStandardMaterial color="#111827" metalness={0.8} />
      </mesh>
      <mesh position={[0, -0.85, 0.04]}>
        <boxGeometry args={[0.5, 0.05, 0.28]} />
        <meshStandardMaterial color="#1e293b" metalness={0.85} />
      </mesh>
    </group>
  );
}

function Computer({ activePanel }: { activePanel: PanelKey }) {
  return (
    <group position={[0, 1.05, 0]}>
      <Desk />
      <MainMonitor activePanel={activePanel} />
      <SideMonitor />
      <Plant />
      <Keyboard />
      <MousePad />
      {/* Desk lamp */}
      <group position={[-1.9, 0.82, -0.3]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.06, 0.1, 0.12, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.42, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.7, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[0.15, 0.72, 0]} rotation={[0, 0, -Math.PI / 5]}>
          <coneGeometry args={[0.14, 0.3, 16]} />
          <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.3} emissive="#fde68a" emissiveIntensity={0.3} />
        </mesh>
        <pointLight position={[0.25, 0.65, 0]} intensity={5} color="#fef3c7" distance={2.5} />
      </group>
      {/* Cable management box */}
      <mesh position={[1.9, 0.77, -0.8]} castShadow>
        <boxGeometry args={[0.4, 0.12, 0.25]} />
        <meshStandardMaterial color="#0f172a" metalness={0.7} roughness={0.4} />
      </mesh>
    </group>
  );
}

function HologramPanel({
  position = [0, 0, 0] as [number, number, number],
  rotation = [0, 0, 0] as [number, number, number],
  title = "PANEL",
  subtitle = "",
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
      position[1] + Math.sin(state.clock.elapsedTime * 1.8 + panelKey.length) * 0.04;
  });

  const activeColor = panelKey === "about" ? "#22d3ee" : panelKey === "skills" ? "#818cf8" : "#34d399";

  return (
    <group ref={groupRef} position={position} rotation={rotation} onClick={() => onClick(panelKey)}>
      <Float speed={1.4} rotationIntensity={0.08} floatIntensity={0.15}>
        <RoundedBox args={[2.5, 1.5, 0.09]} radius={0.08} smoothness={4}>
          <meshStandardMaterial
            color={isActive ? "#0b1b2c" : "#060f1c"}
            metalness={0.85}
            roughness={0.18}
            emissive={isActive ? activeColor : "#0ea5e9"}
            emissiveIntensity={isActive ? 0.6 : 0.2}
          />
        </RoundedBox>

        {/* Glow overlay */}
        <mesh position={[0, 0, 0.052]}>
          <planeGeometry args={[2.25, 1.3]} />
          <meshBasicMaterial
            color={isActive ? activeColor : "#38bdf8"}
            transparent
            opacity={isActive ? 0.18 : 0.08}
          />
        </mesh>

        {/* Corner accents */}
        {([ [-1.1, 0.62], [1.1, 0.62], [-1.1, -0.62], [1.1, -0.62] ] as [number,number][]).map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0.055]}>
            <boxGeometry args={[0.18, 0.04, 0.01]} />
            <meshBasicMaterial color={isActive ? activeColor : "#38bdf8"} />
          </mesh>
        ))}

        <Html transform distanceFactor={4.5} position={[0, 0, 0.09]}>
          <button
            onClick={() => onClick(panelKey)}
            className={`w-52 rounded-2xl border px-4 py-3 text-center shadow-2xl backdrop-blur-md transition-all ${
              isActive
                ? "border-cyan-300/50 bg-sky-950/85"
                : "border-sky-400/25 bg-slate-950/65 hover:bg-slate-950/80"
            }`}
          >
            <p className="text-xs font-bold tracking-[0.3em] text-sky-300">{title}</p>
            <p className="mt-1.5 text-[10px] leading-4 text-slate-400">{subtitle}</p>
            <div className={`mt-2 h-0.5 rounded-full transition-all ${isActive ? "bg-cyan-400/70" : "bg-slate-700/50"}`} />
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
      <color attach="background" args={["#010b18"]} />
      <fog attach="fog" args={["#010b18", 10, 26]} />

      <ambientLight intensity={0.3} color="#1e40af" />
      <hemisphereLight intensity={0.5} color={"#60a5fa"} groundColor={"#010b18"} />

      {/* Main ceiling spot */}
      <spotLight
        position={[0, 8, 1]}
        angle={0.38}
        penumbra={1}
        intensity={40}
        color="#bae6fd"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Colored accent lights */}
      <pointLight position={[-5, 3, -4]} intensity={5} color="#818cf8" />
      <pointLight position={[5, 3, -4]} intensity={5} color="#34d399" />
      <pointLight position={[0, 2, 5]} intensity={4} color="#f472b6" />
      <pointLight position={[0, 5, 0]} intensity={8} color="#60a5fa" />

      <RoomShell />
      <NeonPillars />
      <Platform />
      <Rug />
      <Chair />
      <Computer activePanel={activePanel} />
      <FloatingOrbs />

      {/* Bookshelves */}
      <Bookshelf position={[-6.6, 1.4, -1.5]} rotation={[0, Math.PI / 2, 0]} />
      <Bookshelf position={[-6.6, 1.4, 2.5]} rotation={[0, Math.PI / 2, 0]} />

      {/* Wall art panels */}
      <WallArtPanel position={[3.5, 3.5, -6.85]} rotation={[0, 0, 0]} color="#38bdf8" />
      <WallArtPanel position={[6.82, 3.5, -1.5]} rotation={[0, -Math.PI / 2, 0]} color="#818cf8" />

      {/* Hologram panels */}
      <HologramPanel
        position={[-3.4, 2.3, -2.8]}
        rotation={[0, 0.5, 0]}
        title="ABOUT ME"
        subtitle="Personal profile and intro"
        panelKey="about"
        activePanel={activePanel}
        onClick={setActivePanel}
      />

      <HologramPanel
        position={[3.4, 2.1, -3.0]}
        rotation={[0, -0.5, 0]}
        title="SKILLS"
        subtitle="Tech stack and expertise"
        panelKey="skills"
        activePanel={activePanel}
        onClick={setActivePanel}
      />

      <HologramPanel
        position={[0, 2.5, -5.2]}
        rotation={[0, 0, 0]}
        title="PROJECTS"
        subtitle="Selected works and builds"
        panelKey="projects"
        activePanel={activePanel}
        onClick={setActivePanel}
      />

      <Grid
        position={[0, 0.02, 0]}
        args={[14, 14]}
        cellSize={0.5}
        cellThickness={0.4}
        cellColor={"#1e3a8a"}
        sectionSize={2.5}
        sectionThickness={1.0}
        sectionColor={"#1d4ed8"}
        fadeDistance={20}
        fadeStrength={1.2}
        infiniteGrid={false}
      />

      <Sparkles
        count={180}
        scale={[12, 6, 12]}
        size={2.5}
        speed={0.2}
        noise={1.2}
        color={"#7dd3fc"}
      />

      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.7}
        scale={14}
        blur={3}
        far={14}
      />

      <OrbitControls
        enablePan={false}
        minDistance={5}
        maxDistance={10}
        minPolarAngle={Math.PI / 3.8}
        maxPolarAngle={Math.PI / 2.1}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </>
  );
}

export default function ThreeWorld() {
  return (
    <div className="h-full w-full overflow-hidden rounded-2xl bg-black">
      <Canvas shadows camera={{ position: [0, 2.5, 9], fov: 50 }}>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
