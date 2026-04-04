"use client";

import { useEffect, useState } from "react";

const bootLines = [
  "[  OK  ] Booting NeuralOS v1.0...",
  "[  OK  ] Checking kernel modules...",
  "[  OK  ] Initializing GPU renderer...",
  "[  OK  ] Loading environment assets...",
  "[  OK  ] Connecting neural landscape...",
  "[  OK  ] Starting 3D engine...",
  "[ DONE ] Entering Linux workspace...",
];

export default function BootLoader({ onFinish }: { onFinish: () => void }) {
  const [lines, setLines] = useState<string[]>([]);

  useEffect(() => {
    let i = 0;

    const interval = setInterval(() => {
      setLines((prev) => [...prev, bootLines[i]]);
      i++;

      if (i === bootLines.length) {
        clearInterval(interval);

        setTimeout(() => {
          onFinish();
        }, 1500);
      }
    }, 700);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black text-green-400 font-mono z-50 flex items-center justify-center">
      <div className="text-sm space-y-1">
        {lines.map((line, i) => (
          <p key={i}>{line}</p>
        ))}
        <span className="animate-pulse">█</span>
      </div>
    </div>
  );
}