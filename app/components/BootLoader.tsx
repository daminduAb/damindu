"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BOOT_LINES = [
  "BIOS v2.4.1 — NeuralHost Systems",
  "Checking memory integrity................. OK",
  "Loading kernel modules..................... OK",
  "Initializing GPU render pipeline.......... OK",
  "Mounting encrypted volume /dev/nvme0n1.... OK",
  "Starting neural landscape engine.......... OK",
  "Verifying identity signature.............. OK",
  "Awaiting operator confirmation.",
];

const HACK_LINES = [
  "$ sudo access --level=root --target=portfolio",
  "  [██████████████████████████] 100%",
  "root@neuralhost:~$ decrypt -k ~/.ssh/id_ed25519 payload.enc",
  "  Decrypting... AES-256-GCM",
  "  0xF3A1 → 0x00AC → 0x88B2 → 0x1D4E",
  "root@neuralhost:~$ ./inject portfolio.core --verbose",
  "  Loading assets................. [DONE]",
  "  Hydrating components........... [DONE]",
  "  Mounting DOM tree.............. [DONE]",
  "  Establishing WebGL context..... [DONE]",
  "root@neuralhost:~$ chmod +x session && ./session --user=visitor",
  "  Session ID: 0xDA4B9F21",
  "  Access level: FULL",
  "  ████████████████████████████████ GRANTED",
  "",
  "  Welcome, Visitor. Initializing interface...",
];

type Phase = "booting" | "prompt" | "hacking" | "done";

export default function BootLoader({ onFinish }: { onFinish: () => void }) {
  const [phase, setPhase] = useState<Phase>("booting");
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [hackLines, setHackLines] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [shake, setShake] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [timestamp, setTimestamp] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTimestamp(new Date().toISOString().slice(0, 19) + "Z");
  }, []);

  // auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [bootLines, hackLines]);

  // Phase 1: boot lines
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setBootLines((p) => [...p, BOOT_LINES[i]]);
      i++;
      if (i === BOOT_LINES.length) {
        clearInterval(id);
        setTimeout(() => setPhase("prompt"), 600);
      }
    }, 260);
    return () => clearInterval(id);
  }, []);

  // focus input when prompt appears
  useEffect(() => {
    if (phase === "prompt") inputRef.current?.focus();
  }, [phase]);

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim().toUpperCase() !== "CONFIRM") {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setInput("");
      return;
    }
    setPhase("hacking");
    let i = 0;
    const id = setInterval(() => {
      if (i >= HACK_LINES.length) { clearInterval(id); return; }
      setHackLines((p) => [...p, HACK_LINES[i]]);
      i++;
      if (i === HACK_LINES.length) {
        clearInterval(id);
        setTimeout(() => {
          setExiting(true);
          setTimeout(onFinish, 800);
        }, 600);
      }
    }, 110);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col bg-[#0a0a0a] font-mono text-green-400 overflow-hidden"
      animate={exiting ? { opacity: 0, scale: 1.04 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* scanline overlay */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.06)_2px,rgba(0,0,0,0.06)_4px)]" />
      {/* corner decorations */}
      <div className="absolute top-4 left-4 text-green-900 text-[10px] select-none">NeuralHost v2.4.1</div>
      <div className="absolute top-4 right-4 text-green-900 text-[10px] select-none tabular-nums">{timestamp}</div>

      <div className="flex-1 overflow-y-auto px-6 py-12 sm:px-16 sm:py-16 max-w-3xl mx-auto w-full">

        {/* ASCII logo */}
        <pre className="mb-8 text-[10px] leading-tight text-green-700 select-none hidden sm:block">
{`  ██████╗  █████╗ ███╗   ███╗██╗███╗   ██╗██████╗ ██╗   ██╗
  ██╔══██╗██╔══██╗████╗ ████║██║████╗  ██║██╔══██╗██║   ██║
  ██║  ██║███████║██╔████╔██║██║██╔██╗ ██║██║  ██║██║   ██║
  ██║  ██║██╔══██║██║╚██╔╝██║██║██║╚██╗██║██║  ██║██║   ██║
  ██████╔╝██║  ██║██║ ╚═╝ ██║██║██║ ╚████║██████╔╝╚██████╔╝
  ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚═╝╚═╝  ╚═══╝╚═════╝  ╚═════╝ `}
        </pre>

        {/* boot lines */}
        <div className="space-y-[3px] text-sm mb-4">
          {bootLines.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className={
                line.includes("OK") ? "text-green-400" :
                line.includes("Awaiting") ? "text-yellow-400 mt-4" : "text-green-600"
              }
            >
              {line.includes("OK")
                ? <><span className="text-green-600">[  </span><span className="text-green-300">OK</span><span className="text-green-600">  ] </span>{line.slice(9)}</>
                : line
              }
            </motion.p>
          ))}
        </div>

        {/* prompt phase */}
        <AnimatePresence>
          {(phase === "prompt" || phase === "hacking") && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {phase === "prompt" && (
                <div className="mt-6 mb-2">
                  <p className="text-yellow-400 text-sm mb-1">
                    ┌─ AUTHORIZATION REQUIRED ──────────────────────┐
                  </p>
                  <p className="text-yellow-400 text-sm mb-1">
                    │  Type <span className="text-white font-bold">CONFIRM</span> to initialize your session.    │
                  </p>
                  <p className="text-yellow-400 text-sm mb-4">
                    └────────────────────────────────────────────────┘
                  </p>
                  <motion.form
                    onSubmit={handleConfirm}
                    animate={shake ? { x: [0, -8, 8, -6, 6, 0] } : {}}
                    transition={{ duration: 0.4 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-green-500">visitor@neuralhost:~$</span>
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="flex-1 bg-transparent outline-none text-white caret-green-400 text-sm tracking-wider"
                      spellCheck={false}
                      autoComplete="off"
                    />
                  </motion.form>
                  {shake && (
                    <p className="text-red-400 text-xs mt-2 ml-[168px]">
                      bash: command not found — type exactly: CONFIRM
                    </p>
                  )}
                </div>
              )}

              {/* hack lines */}
              {phase === "hacking" && (
                <div className="mt-4 space-y-[2px]">
                  <p className="text-green-500 text-sm mb-3">
                    visitor@neuralhost:~$ CONFIRM
                  </p>
                  {hackLines.filter(Boolean).map((line, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.05 }}
                      className={
                        line.startsWith("$") || line.startsWith("root") ? "text-green-400 text-[13px]" :
                        line.includes("GRANTED") ? "text-white font-bold text-[13px] mt-2" :
                        line.includes("Welcome") ? "text-green-300 text-[13px] mt-2" :
                        "text-green-700 text-[12px]"
                      }
                    >
                      {line}
                    </motion.p>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* blinking cursor */}
        {phase !== "hacking" && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block w-2 h-4 bg-green-400 mt-1"
          />
        )}

        <div ref={bottomRef} />
      </div>
    </motion.div>
  );
}
