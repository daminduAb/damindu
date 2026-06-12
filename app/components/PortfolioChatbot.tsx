"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageCircle, Bot, User, Minus } from "lucide-react";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

function TypewriterText({ text, onDone }: { text: string; onDone?: () => void }) {
    const [displayed, setDisplayed] = useState("");
    const [done, setDone] = useState(false);
    const indexRef = useRef(0);

    useEffect(() => {
        setDisplayed("");
        setDone(false);
        indexRef.current = 0;

        const interval = setInterval(() => {
            if (indexRef.current < text.length) {
                setDisplayed(text.slice(0, indexRef.current + 1));
                indexRef.current++;
            } else {
                clearInterval(interval);
                setDone(true);
                onDone?.();
            }
        }, 18);

        return () => clearInterval(interval);
    }, [text]);

    return (
        <span>
            {displayed}
            {!done && (
                <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.5 }}
                    className="inline-block w-[2px] h-[14px] bg-current ml-[1px] align-middle"
                />
            )}
        </span>
    );
}

function ToneRipple({ trigger }: { trigger: boolean }) {
    return (
        <AnimatePresence>
            {trigger && (
                <>
                    {[0, 1, 2].map((i) => (
                        <motion.span
                            key={i}
                            className="absolute inset-0 rounded-full border border-blue-400 dark:border-blue-500"
                            initial={{ scale: 1, opacity: 0.6 }}
                            animate={{ scale: 2.5 + i * 0.5, opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8, delay: i * 0.15, ease: "easeOut" }}
                        />
                    ))}
                </>
            )}
        </AnimatePresence>
    );
}

function ThinkingDots() {
    return (
        <div className="flex items-center gap-1 px-4 py-3">
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500"
                    animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                />
            ))}
        </div>
    );
}

// --- Sound helpers using Web Audio API (no files needed) ---
function createAudioContext(): AudioContext | null {
    try {
        return new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
        return null;
    }
}

function playSendSound() {
    const ctx = createAudioContext();
    if (!ctx) return;

    // Short ascending "whoosh" tone
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "sine";
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.18);
    osc.onended = () => ctx.close();
}

function playReceiveSound() {
    const ctx = createAudioContext();
    if (!ctx) return;

    // Soft double-ping "notification" tone
    const playPing = (startTime: number, freq: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.12, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

        osc.start(startTime);
        osc.stop(startTime + 0.35);
    };

    playPing(ctx.currentTime, 620);
    playPing(ctx.currentTime + 0.18, 820);

    setTimeout(() => ctx.close(), 800);
}

export function PortfolioChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "Hey! 👋 I'm Damindu's AI assistant. Ask me anything about his skills, projects, or background!",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [ripple, setRipple] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isMinimized) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isLoading, isMinimized]);

    useEffect(() => {
        if (isOpen && !isMinimized) {
            setTimeout(() => inputRef.current?.focus(), 300);
            setHasUnread(false);
        }
    }, [isOpen, isMinimized]);

    const sendMessage = async () => {
        const trimmed = input.trim();
        if (!trimmed || isLoading) return;

        setRipple(true);
        setTimeout(() => setRipple(false), 1000);

        // Play send sound
        playSendSound();

        const userMessage: Message = {
            id: Date.now().toString(),
            role: "user",
            content: trimmed,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            const history = [
                ...messages.filter((m) => m.id !== "welcome"),
                userMessage,
            ].map((m) => ({ role: m.role, content: m.content }));

            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: history }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: "assistant",
                content: data.message || "Sorry, something went wrong.",
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);

            // Play receive sound
            playReceiveSound();

            if (!isOpen || isMinimized) setHasUnread(true);
        } catch (err) {
            console.error(err);
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: "assistant",
                    content: "Oops! Something went wrong. Please try again.",
                    timestamp: new Date(),
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatTime = (date: Date) =>
        date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    const handleOpen = () => {
        setIsOpen(true);
        setIsMinimized(false);
        setHasUnread(false);
    };

    const handleMinimize = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsMinimized(true);
    };

    const handleClose = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(false);
        setIsMinimized(false);
    };

    return (
        <>
            {/* Floating Chat Button — hidden when chat is open and NOT minimized */}
            <AnimatePresence>
                {(!isOpen || isMinimized) && (
                    <motion.div
                        key="chat-button"
                        drag
                        dragMomentum={false}
                        dragElastic={0}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", damping: 18, stiffness: 260 }}
                        className="fixed bottom-6 left-6 z-[100] touch-none cursor-grab active:cursor-grabbing"
                    >
                        <motion.button
                            onClick={handleOpen}
                            onPointerDown={(e) => e.stopPropagation()}
                            className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-black dark:bg-white text-white dark:text-black shadow-[0_4px_20px_rgba(0,0,0,0.25)] dark:shadow-[0_4px_20px_rgba(255,255,255,0.1)]"
                            whileHover={{ scale: 1.06 }}
                            whileTap={{ scale: 0.94 }}
                            aria-label="Open chat"
                        >
                            <ToneRipple trigger={ripple} />
                            <MessageCircle className="h-5 w-5" />
                            <AnimatePresence>
                                {hasUnread && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-black dark:bg-white border-2 border-white dark:border-black"
                                    />
                                )}
                            </AnimatePresence>
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="chat-window"
                        drag
                        dragMomentum={false}
                        dragElastic={0}
                        initial={{ opacity: 0, y: 40, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 40, scale: 0.9 }}
                        transition={{ type: "spring", damping: 22, stiffness: 200 }}
                        className="fixed bottom-[4.5rem] left-4 right-4 sm:left-6 sm:right-auto sm:w-[360px] z-[100] flex flex-col rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-white/90 dark:bg-zinc-900/95 shadow-[0_8px_40px_rgba(0,0,0,0.18)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl overflow-hidden touch-none"
                        style={{
                            maxWidth: "calc(100vw - 2rem)",
                            maxHeight: isMinimized ? "64px" : "400px",
                            transition: "max-height 0.35s cubic-bezier(0.4,0,0.2,1)",
                        }}
                    >
                        {/* Header — drag handle + minimize + close */}
                        <div
                            className="flex flex-shrink-0 items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 cursor-grab active:cursor-grabbing select-none"
                            onClick={() => isMinimized && handleOpen()}
                        >
                            <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-black dark:bg-white flex-shrink-0">
                                <Bot className="h-5 w-5 text-white dark:text-black" />
                                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white dark:border-zinc-900" />
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-black dark:text-white truncate">
                                    Damindu's Assistant
                                </p>
                                <p className="text-xs text-green-500">
                                    {isMinimized ? (hasUnread ? "New message ·" : "") + " Tap to expand" : "Online · Ask me anything"}
                                </p>
                            </div>

                            {/* Unread badge when minimized */}
                            <AnimatePresence>
                                {isMinimized && hasUnread && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-white text-[10px] font-bold flex-shrink-0"
                                    >
                                        1
                                    </motion.span>
                                )}
                            </AnimatePresence>

                            {/* Minimize button */}
                            <motion.button
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.9 }}
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={isMinimized ? handleOpen : handleMinimize}
                                className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors z-10"
                                aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
                            >
                                <Minus className="h-4 w-4" />
                            </motion.button>

                            {/* Close button */}
                            <motion.button
                                whileHover={{ scale: 1.15, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={handleClose}
                                className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors z-10"
                                aria-label="Close chat"
                            >
                                <X className="h-4 w-4" />
                            </motion.button>
                        </div>

                        {/* Body — hidden when minimized */}
                        <div
                            className="flex flex-col flex-1 overflow-hidden"
                            style={{
                                opacity: isMinimized ? 0 : 1,
                                pointerEvents: isMinimized ? "none" : "auto",
                                transition: "opacity 0.2s ease",
                            }}
                        >
                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth">
                                {messages.map((msg, idx) => {
                                    const isUser = msg.role === "user";
                                    const isLast = idx === messages.length - 1;

                                    return (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            transition={{ type: "spring", damping: 16, stiffness: 200 }}
                                            className={`flex items-end gap-2 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                                        >
                                            <div
                                                className={`flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-full ${isUser
                                                    ? "bg-black dark:bg-white text-white dark:text-black"
                                                    : "bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400"
                                                    }`}
                                            >
                                                {isUser
                                                    ? <User className="h-3.5 w-3.5" />
                                                    : <Bot className="h-3.5 w-3.5" />
                                                }
                                            </div>

                                            <div className={`flex flex-col gap-1 max-w-[75%] ${isUser ? "items-end" : "items-start"}`}>
                                                <div
                                                    className={`relative px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${isUser
                                                        ? "bg-black dark:bg-white text-white dark:text-black rounded-br-sm"
                                                        : "bg-gray-100 dark:bg-zinc-800 text-black dark:text-white rounded-bl-sm"
                                                        }`}
                                                >
                                                    {!isUser && isLast && !isLoading ? (
                                                        <TypewriterText text={msg.content} />
                                                    ) : (
                                                        msg.content
                                                    )}

                                                    {isUser && isLast && (
                                                        <AnimatePresence>
                                                            <motion.span
                                                                className="absolute inset-0 rounded-2xl bg-white/20 dark:bg-black/20"
                                                                initial={{ opacity: 0.6 }}
                                                                animate={{ opacity: 0 }}
                                                                transition={{ duration: 0.6 }}
                                                            />
                                                        </AnimatePresence>
                                                    )}
                                                </div>

                                                <span className="text-[10px] text-gray-400 dark:text-gray-600 px-1">
                                                    {formatTime(msg.timestamp)}
                                                </span>
                                            </div>
                                        </motion.div>
                                    );
                                })}

                                <AnimatePresence>
                                    {isLoading && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 10 }}
                                            className="flex items-end gap-2"
                                        >
                                            <div className="flex-shrink-0 flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-zinc-800">
                                                <Bot className="h-3.5 w-3.5 text-gray-600 dark:text-gray-400" />
                                            </div>
                                            <div className="bg-gray-100 dark:bg-zinc-800 rounded-2xl rounded-bl-sm">
                                                <ThinkingDots />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div ref={messagesEndRef} />
                            </div>

                            {/* Suggested questions */}
                            {messages.length === 1 && (
                                <div className="px-4 pb-2 flex flex-wrap gap-2">
                                    {["What are his skills?", "Tell me about his projects", "Where did he study?"].map((q) => (
                                        <button
                                            key={q}
                                            onClick={() => {
                                                setInput(q);
                                                setTimeout(() => inputRef.current?.focus(), 50);
                                            }}
                                            className="text-xs px-3 py-1.5 rounded-full border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white transition-all"
                                        >
                                            {q}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Input */}
                            <div className="px-3 py-3 border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                                <div className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 px-3 py-2 focus-within:border-gray-400 dark:focus-within:border-zinc-500 transition-colors">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        placeholder="Ask about Damindu..."
                                        disabled={isLoading}
                                        className="flex-1 bg-transparent text-sm text-black dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none disabled:opacity-50"
                                    />
                                    <motion.button
                                        onClick={sendMessage}
                                        disabled={!input.trim() || isLoading}
                                        whileTap={{ scale: 0.9 }}
                                        className="relative flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-black dark:bg-white text-white dark:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                                    >
                                        <ToneRipple trigger={ripple} />
                                        <Send className="h-3.5 w-3.5" />
                                    </motion.button>
                                </div>
                                <p className="text-center text-[10px] text-gray-300 dark:text-gray-600 mt-2">
                                    Powered by Groq AI · Answers based on Damindu's profile
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}