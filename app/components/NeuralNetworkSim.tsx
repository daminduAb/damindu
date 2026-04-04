"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Grid } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { Play, Square } from "lucide-react";
import BootLoader from "./BootLoader";
import ThreeWorld from "./ThreeWorld";
const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

type Weights = {
  wIH: number[][];
  wHO: number[];
  bH: number[];
  bO: number;
};

const forward = (x1: number, x2: number, weights: Weights) => {
  const h = weights.wIH[0].map((_, i) => {
    const sum = x1 * weights.wIH[0][i] + x2 * weights.wIH[1][i] + weights.bH[i];
    return sigmoid(sum);
  });

  const outSum =
    h.reduce((acc, val, i) => acc + val * weights.wHO[i], 0) + weights.bO;

  return sigmoid(outSum);
};

const Surface = ({ weights }: { weights: Weights }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const segments = 50;

  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(12, 12, segments, segments);
  }, []);

  useFrame(() => {
    if (!meshRef.current) return;

    const positions = meshRef.current.geometry.attributes.position;

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);

      const inputX = x / 3;
      const inputY = y / 3;

      const z = forward(inputX, inputY, weights) * 5 - 2.5;

      positions.setZ(i, z);
    }

    positions.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2, 0, 0]}>
      <meshStandardMaterial
        color="#3b82f6"
        wireframe
        transparent
        opacity={0.4}
        side={THREE.DoubleSide}
        emissive="#3b82f6"
        emissiveIntensity={0.2}
      />
    </mesh>
  );
};

export function NeuralNetworkSim() {
  const [isBooting, setIsBooting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const [wIH, setWIH] = useState([
    [1, 1, 1],
    [-1, -1, -1],
  ]);

  const [wHO, setWHO] = useState([1, -1, 1]);
  const [bH] = useState([0, 0, 0]);
  const [bO, setBO] = useState(0);

  const [isAuto, setIsAuto] = useState(false);

  const weights: Weights = { wIH, wHO, bH, bO };

  const handleBootFinish = () => {
    setIsBooting(false);
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isAuto || !isOpen) return;

    const interval = setInterval(() => {
      setWIH((prev) =>
        prev.map((row) =>
          row.map((v) => {
            const delta = (Math.random() - 0.5) * 0.1;
            return Math.max(-3, Math.min(3, v + delta));
          })
        )
      );

      setWHO((prev) =>
        prev.map((v) => {
          const delta = (Math.random() - 0.5) * 0.1;
          return Math.max(-3, Math.min(3, v + delta));
        })
      );
    }, 100);

    return () => clearInterval(interval);
  }, [isAuto, isOpen]);

  const updateWeightIH = (i: number, j: number, val: number) => {
    const newW = [...wIH];
    newW[i] = [...newW[i]];
    newW[i][j] = val;
    setWIH(newW);
  };

  const updateWeightHO = (i: number, val: number) => {
    const newW = [...wHO];
    newW[i] = val;
    setWHO(newW);
  };

  return (
    <div className="mb-4 w-full flex justify-start py-6">

      {isBooting && <BootLoader onFinish={handleBootFinish} />}

      {!isOpen ? (
        <button
          onClick={() => setIsBooting(true)}
          className="group flex items-center gap-3 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all duration-300"
        >
          <span className="text-sm underline underline-offset-8 decoration-gray-200 dark:decoration-zinc-800 group-hover:decoration-blue-500">
            Damindu's Room
          </span>
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-5xl rounded-2xl border bg-white/40 p-6 backdrop-blur-md dark:bg-black/40"
        >
          <div className="mb-4 flex justify-between">
            <h3 className="text-xs uppercase tracking-widest text-gray-400">
              Damindu's Room
            </h3>

            
             

              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsAuto(false);
                }}
                className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-white transition hover:bg-zinc-700" >
                Close
              </button>
            </div>
          

            <div className="h-[400px] w-[auto] p-3">
                <div className="h-full overflow-hidden rounded-2xl border border-zinc-800 bg-black">
                  <ThreeWorld />
                </div>
              </div>
        </motion.div>
      )}
    </div>
  );
}