"use client";


const images = [
  "/casua.jpg",
  "/casual2.jpg",
  "/casual3.jpg",
  "/casual4.jpg",
  "/casual5.jpg",
  "/casual6.jpg",
  "/casual7.jpg",
  "/casual8.jpg",
  "/casual9.jpg",
  "/casual10.jpg",
]

import Image from "next/image";
import {
  Github,
  Linkedin,
  Youtube,
  User,
  QrCode,
  X,
  Music,
  Pause
} from "lucide-react";

import { FaXTwitter } from "react-icons/fa6";

import { ExperienceItem } from "./components/ExperienceItem";
import { GithubGraph } from "./components/GithubGraph";
import { TechStack } from "./components/TechStack";
import { NeuralNetworkSim } from "./components/NeuralNetworkSim";

import { useState, useEffect, useMemo, useRef } from "react";
import { useTheme } from "next-themes";

import { QRCodeSVG } from "qrcode.react";

import { ThemeToggle } from "./components/ThemeToggle";

import { motion, AnimatePresence } from "framer-motion";

import {
  FiGithub,
  FiExternalLink,
  FiShoppingCart,
  FiX,
  FiMaximize2
} from "react-icons/fi";

import {
  SiReact,
  SiSolidity,
  SiNextdotjs,
  SiMongodb,
  SiTailwindcss,
  SiNodedotjs,
  SiEthereum,
  SiSupabase,
  SiStripe,
  SiMysql
} from "react-icons/si";
import { h1 } from "framer-motion/client";

// Define types
interface Project {
  id: number;
  title: string;
  shortDesc: string;
  fullDesc: string;
  tech: string[];
  techIcons: Record<string, React.ReactNode>;
  category: string;
  gradient: string;
  icon: React.ReactNode;
  mediaType: "video" | "image";
  mediaUrl?: string;
  thumbnail?: string;
  images?: string[];
  stats: Record<string, string>;
  links: {
    github?: string;
    demo?: string;
  };
}

const DiscordIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1971.3728.2914a.077.077 0 01-.0066.1277 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
  </svg>
);

export default function Home() {
  const [time, setTime] = useState<string>("");
  const [showQR, setShowQR] = useState(false);
  const [mode, setMode] = useState<"profile" | "projects">("profile");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const { setTheme, resolvedTheme } = useTheme();
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [isLofiPlaying, setIsLofiPlaying] = useState(false);
  const [lofiVolume, setLofiVolume] = useState(1);
  const lofiRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (lofiRef.current) {
      lofiRef.current.volume = lofiVolume;
    }
  }, [lofiVolume]);

  useEffect(() => {
    return () => {
      if (lofiRef.current) {
        lofiRef.current.pause();
        lofiRef.current = null;
      }
    };
  }, []);

  const toggleLofi = () => {
    if (!lofiRef.current) {
      lofiRef.current = new Audio("/trackk.mp3");
      lofiRef.current.loop = true;
      lofiRef.current.volume = lofiVolume;
    }

    if (isLofiPlaying) {
      lofiRef.current.pause();
    } else {
      lofiRef.current.play().catch(e => console.error("Lofi play failed:", e));
    }
    setIsLofiPlaying(!isLofiPlaying);
  };

  const starPositions = useMemo(() => {
    return [...Array(50)].map(() => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 5,
    }));
  }, []);

//cetificates
    const [selected, setSelected] = useState<any>(null);
    const certificates = [
  {
    title: "AWS Cloud Practitioner",
    issuer: "Amazon Web Services",
    image: "/certificates/aws.jpg",
  },
  {
    title: "Blockchain Development",
    issuer: "Coursera",
    image: "/certificates/blockchain.jpg",
  },
  {
    title: "AI & Machine Learning",
    issuer: "Google",
    image: "/certificates/ai.jpg",
  },
  {
    title: "DevOps Engineering",
    issuer: "Udemy",
    image: "/certificates/devops.jpg",
  },
  {
    title: "Cyber Security",
    issuer: "Cisco",
    image: "/certificates/cybersecurity.jpg",
  },
];

  

  // Projects data
  const projectss: Project[] = [
    {
      id: 1,
      title: "Blockchain Voting System",
      shortDesc: "Secure decentralized voting platform",
      fullDesc: "A revolutionary decentralized voting system ensuring transparency and immutability. Users authenticate via MetaMask, with each vote permanently recorded on the Ethereum blockchain. Features include real-time vote tracking, fraud detection, and verifiable results.",
      tech: ["React", "Solidity", "Tailwind", "Ethereum"],
      techIcons: {
        React: <SiReact className="text-blue-400" />,
        Solidity: <SiSolidity className="text-gray-600 dark:text-gray-400" />,
        Tailwind: <SiTailwindcss className="text-cyan-500" />,
        Ethereum: <SiEthereum className="text-blue-600" />
      },
      category: "blockchain",
      gradient: "",
      icon: <FiShoppingCart className="w-6 h-6" />,
      mediaType: "video",
      mediaUrl: "voting-system-demo.mp4",
      thumbnail: "casual2.jpg",
      stats: {
        users: "1.2K+",
        votes: "5.4K+",
        uptime: "99.9%"
      },
      links: {
        github: "https://github.com/prasindu/myDAPP.git",
        demo: "https://my-dapp-prasindus-projects-8a9c175b.vercel.app/"
      }
    },
    {
      id: 2,
      title: "E-Commerce Platform",
      shortDesc: "Full-stack shopping platform",
      fullDesc: "A comprehensive e-commerce solution with advanced features including JWT authentication, real-time inventory management, secure payment processing with Stripe, and an intuitive admin dashboard with analytics. Supports multiple vendors and automated order tracking.",
      tech: ["Next.js", "Supabase", "Tailwind", "Stripe"],
      techIcons: {
        "Next.js": <SiNextdotjs className="text-black dark:text-white" />,
        "Supabase": <SiSupabase className="text-green-500" />,
        "Tailwind": <SiTailwindcss className="text-cyan-500" />,
        "Stripe": <SiStripe className="text-orange-500" />
      },
      category: "ecommerce",
      gradient: "",
      icon: <FiShoppingCart className="w-6 h-6" />,
      mediaType: "image",
      images: [
        "/1.png",
        "/3.png",
        "/4.png"
      ],
      stats: {
        products: "500+",
        orders: "2.3K+",
        revenue: "$45K+"
      },
      links: {
        github: "https://github.com/daminduAb/AS-techno.git",
        demo: "https://rk-mobile-lk.vercel.app/"
      }
    },
    {
      id: 3,
      title: "Eco Green Platform",
      shortDesc: "Sustainability awareness system",
      fullDesc: "An innovative platform promoting environmental consciousness through gamification. Users earn rewards for eco-friendly actions, track their carbon footprint, and participate in community challenges. Features AI-powered recommendations for sustainable living.",
      tech: ["React", "Node.js", "MongoDB","Mysql"],
      techIcons: {
        "React": <SiReact className="text-blue-400" />,
        "Node.js": <SiNodedotjs className="text-green-600" />,
        "MongoDB": <SiMongodb className="text-green-500" />,
        "Mysql": <SiMysql className="text-blue-600" />
      },
      category: "sustainability",
      gradient: "",
      icon: <FiShoppingCart className="w-6 h-6" />,
      mediaType: "video",
      mediaUrl: "/ecogreen.mp4",
      thumbnail: "/casual2.jpg",
      stats: {
        users: "3.2K+",
        actions: "15K+",
        trees: "1.2K+"
      },
      links: {
        github: " https://lnkd.in/gY3P_ZbT",
        demo: "https://lnkd.in/g87efjCQ"
      }
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100
      }
    }
  };

  return (
    <div className={`relative flex min-h-screen flex-col items-center bg-white dark:bg-black px-3 pt-16 text-black dark:text-white selection:bg-black dark:selection:bg-white selection:text-white dark:selection:text-black pb-32 sm:px-4 sm:pt-24 sm:pb-40 overflow-x-hidden transition-colors duration-300`}>
      {/* Easter Egg Effects */}
      <AnimatePresence>
        {showEasterEgg && (
          <>
            {/* Bluish Aura Edge Effect */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] pointer-events-none shadow-[inset_0_0_150px_rgba(29,78,216,0.5)] dark:shadow-[inset_0_0_150px_rgba(59,130,246,0.4)] transition-opacity duration-1000"
            />
            {/* Twinkling Stars Background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
            >
              {starPositions.map((pos, i) => (
                <motion.div
                  key={i}
                  className="absolute h-[2px] w-[2px] bg-blue-500 dark:bg-white rounded-full shadow-[0_0_4px_rgba(59,130,246,0.8)] dark:shadow-[0_0_3px_white]"
                  style={{
                    top: pos.top,
                    left: pos.left,
                  }}
                  animate={{
                    opacity: [0.2, 1, 0.2],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: pos.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: pos.delay,
                  }}
                />
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {/* Theme Toggle in Top Right */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <AnimatePresence mode="wait">
        {mode === "projects" ? (
          /* Projects View */
          <motion.main
            key="projects"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex w-full max-w-6xl flex-col items-start text-left px-4 sm:px-0 mx-auto"
          >
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
            >
              {projectss.map((project) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  whileHover={{ 
                    y: -8,
                    transition: { type: "spring", stiffness: 300 }
                  }}
                  onHoverStart={() => setHoveredProject(project.id)}
                  onHoverEnd={() => setHoveredProject(null)}
                  className="group relative rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/50 backdrop-blur-sm overflow-hidden cursor-pointer"
                  onClick={() => setSelectedProject(project)}
                >
                  {/* Gradient Overlay */}
                  <motion.div 
                    className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  />
                  
                  {/* Media Thumbnail */}
                  <div className="relative h-40 bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900">
                    {project.mediaType === "video" ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FiShoppingCart className="w-12 h-12 text-white drop-shadow-lg opacity-50 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center gap-2">
                        {project.images?.map((_, idx) => (
                          <div key={idx} className="w-2 h-2 rounded-full bg-white/50" />
                        ))}
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    <motion.div 
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm text-xs font-medium flex items-center gap-1"
                    >
                      {project.icon}
                      <span className="capitalize">{project.category}</span>
                    </motion.div>

                    {/* Expand Icon */}
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: hoveredProject === project.id ? 1 : 0 }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-black/50 backdrop-blur-sm text-white"
                    >
                      <FiMaximize2 className="w-4 h-4" />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-semibold bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent">
                        {project.title}
                      </h3>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {project.shortDesc}
                    </p>

                    {/* Tech Stack with Icons */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech) => (
                        <motion.div
                          key={tech}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className="flex items-center gap-1 px-2 py-1 rounded-full bg-zinc-100 dark:bg-zinc-700 text-xs"
                        >
                          <span className="text-sm">{project.techIcons[tech]}</span>
                          <span>{tech}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-4 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
                      {Object.entries(project.stats).map(([key, value]) => (
                        <div key={key} className="text-center">
                          <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{key}</div>
                          <div className="text-sm font-semibold">{value}</div>
                        </div>
                      ))}
                    </div>

                    {/* Links */}
                    <div className="flex gap-3">
                      {project.links.github && (
                        <motion.a
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          href={project.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FiGithub className="w-4 h-4" />
                          <span>Code</span>
                        </motion.a>
                      )}
                      {project.links.demo && (
                        <motion.a
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          href={project.links.demo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-600 transition-colors"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <FiExternalLink className="w-4 h-4" />
                          <span>Demo</span>
                        </motion.a>
                      )}
                    </div>
                  </div>

                  {/* Animated Border */}
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-0 group-hover:opacity-100"
                    style={{ color: project.gradient.includes('purple') ? '#8b5cf6' : '#10b981' }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hoveredProject === project.id ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.main>
        ) : (
          /* Human Mode - Original View */
          <motion.main
            key="profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex w-full max-w-2xl flex-col items-center text-center"
          >
            {/* Profile Image - Easter Egg Trigger */}
            <button
              onClick={() => setShowEasterEgg(!showEasterEgg)}
              className="group relative mb-2 h-40 w-40 grayscale filter sm:h-56 sm:w-56 overflow-hidden cursor-pointer transition-all duration-500 hover:grayscale-0 active:scale-95"
              aria-label="Toggle Aura Mode"
            >
              <Image
                src="/my.png"
                alt="Profile"
                fill
                className={`object-contain transition-all duration-700 ${showEasterEgg ? 'grayscale-0 scale-105' : 'grayscale'}`}
                priority
              />
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white via-white/60 to-transparent dark:from-black dark:via-black/60 backdrop-blur-[1px]" />

              {/* Subtle Glow on Hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[inset_0_0_20px_rgba(59,130,246,0.3)] rounded-full pointer-events-none" />
            </button>

            {/* Hero Text */}
            <h1 className="mb-4 text-5xl font-bold tracking-tight sm:text-7xl">
              Damindu Abeygunasekara
            </h1>

            {/* Phonetic Pronunciation */}
            <div className="mb-8 flex flex-wrap items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500 sm:text-sm">
              <span>/dæmɪnduː əbeɪɡunəsɛkərə/</span>
              <span className="text-gray-300 dark:text-gray-700">•</span>
              <span>noun</span>
              <span className="text-gray-300 dark:text-gray-700">•</span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="tabular-nums text-xs sm:text-sm">{time || "00:00:00"}</span>
                  <span className="text-[10px] uppercase tracking-wider sm:text-xs">IST</span>
                </div>

                <span className="text-gray-300 dark:text-gray-700">•</span>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-tight text-gray-400">fav</span>
                  <button
                    onClick={toggleLofi}
                    className="flex h-5 w-5 items-center justify-center rounded-full transition-all hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 hover:text-black dark:hover:text-white"
                    aria-label={isLofiPlaying ? "Pause Lofi" : "Play Lofi"}
                  >
                    {isLofiPlaying ? <Pause size={10} fill="currentColor" /> : <Music size={10} />}
                  </button>
                  <AnimatePresence>
                    {isLofiPlaying && (
                      <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 40, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="flex h-5 items-center overflow-hidden"
                      >
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={lofiVolume}
                          onChange={(e) => setLofiVolume(parseFloat(e.target.value))}
                          className="h-[2px] w-8 cursor-pointer appearance-none rounded-full bg-gray-200 dark:bg-zinc-800 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-400 dark:[&::-webkit-slider-thumb]:bg-zinc-500 hover:[&::-webkit-slider-thumb]:bg-black dark:hover:[&::-webkit-slider-thumb]:bg-white [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:h-2 [&::-moz-range-thumb]:w-2 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-gray-400 dark:[&::-moz-range-thumb]:bg-zinc-500 hover:[&::-moz-range-thumb]:bg-black dark:hover:[&::-moz-range-thumb]:bg-white transition-all"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="w-full space-y-4 text-left text-base leading-relaxed text-gray-600 dark:text-gray-400 sm:text-lg md:text-xl">
              <p>
                I am a Computer Science undergraduate at the University of Kelaniya with a strong interest in
                full-stack development, blockchain technologies, and artificial intelligence.
              </p>
              <p>
                I enjoy building real-world software solutions such as decentralized applications,
                AI systems, and modern web platforms. My goal is to become a skilled software engineer
                and contribute to innovative technology projects.
              </p>
            </div>

            <NeuralNetworkSim />

            {/* Experience Section */}
            <div className="mb-16 w-full text-left">
              <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Experience
              </h2>
              <div className="space-y-12">
                <ExperienceItem
                  title="Ballerina Competition – Finalist"
                  role="Member of team Axionic"
                  collapsible={true}
                  link="https://www.youtube.com/watch?v=hUZeVqmaUMY"
                >
                  <div className="space-y-2">
                    <p>Participated in a national-level ballerina competition</p>
                    <p>Selected as a finalist among many competitors</p>
                    <p>Demonstrated dedication, creativity, and performance skills</p>
                  </div>
                </ExperienceItem>

                <ExperienceItem
                  title="Rotaract Club of University of Kelaniya"
                  role="PR Coordinator"
                  collapsible={true}
                  link="https://m.facebook.com/story.php?story_fbid=pfbid05a2sLVZQEmyHfqwsS3FZoo4E9uifrVJBprHsWkXNyn8sN4KbXjxxBBzr53n7bQp5l&id=100064802406023&mibextid=CDWPTG"
                >
                  <div className="space-y-2">
                    <p>Managed social media communication and public relations</p> 
                    <p>Promoted club events and community service projects</p>
                    <p>Designed digital promotional content</p>
                    <p>Coordinated communication between members and external partners</p>
                  </div>
                </ExperienceItem>

                <ExperienceItem
  title="University Hackathons & Tech Events"
  role="Participant & Organizer"
  collapsible={true}
  link="https://www.facebook.com/share/p/1aSPghpvuu/"
>
  <div className="space-y-2">
    <p>Participated in multiple university-level hackathons, collaborating in diverse teams to design, prototype, and deploy innovative software and hardware solutions under tight deadlines.</p>
    <p>Organized and led tech workshops and events on topics like AI, Web3, and Full-Stack Development, enabling fellow students to learn hands-on skills and apply them in real projects.</p>
    <p>Worked on creative projects including AI-powered apps, blockchain voting systems, and interactive web experiences, gaining practical exposure to Next.js, React, Solidity, Tailwind CSS, and other modern technologies.</p>
    <p>Actively contributed to community knowledge sharing by writing technical tutorials, conducting demo sessions, and mentoring new participants in hackathons and coding competitions.</p>
  </div>
</ExperienceItem>
              </div>
            </div>

            {/* In Between These Experiences Section */}
            <div className="mb-16 w-full text-left">
              <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                In Between These Experiences
              </h2>
              <div className="rounded-xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8">
                <ExperienceItem
                  title="Beyond Academics & Technical Work"
                  role=""
                  collapsible={true}
                >
                  <div className="space-y-4">
                    <p>
                      Outside of my academic and technical work, I enjoy exploring creative and collaborative activities that help me develop new perspectives and skills. Being involved in different areas allows me to stay balanced, creative, and connected with people.
                    </p>

                    <p>
                      I actively participate in <span className="font-medium">sports</span>, which helps me maintain discipline, teamwork, and a competitive mindset. Sports have always been an important part of my lifestyle and help me stay energetic and focused.
                    </p>

                    <p>
                      I also enjoy <span className="font-medium">video editing and photo editing</span>, where I experiment with visual storytelling, creative design, and digital media production. These skills allow me to create engaging content for events, social media, and personal projects.
                    </p>

                    <p>
                      Organizing <span className="font-medium">music events and university events</span> has been another meaningful experience. Working with teams to plan and manage events has helped me develop strong communication, leadership, and coordination skills.
                    </p>

                    <p>
                      These experiences outside the classroom have shaped my ability to work with diverse teams, manage responsibilities, and approach challenges with creativity and adaptability.
                    </p>

                    <p className="font-medium text-black">
                      I believe that combining technical knowledge with creativity and teamwork leads to building better ideas, stronger communities, and more meaningful projects.
                    </p>
                  </div>
                </ExperienceItem>
              </div>
            </div>

            {/* Education Section */}
            <div className="mb-16 w-full text-left">
              <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Education
              </h2>
              <div className="space-y-12">
                <ExperienceItem
                  title="University of Kelaniya"
                  role="Bachelor of Science (BSc) in Computer Science (UG)"
                >
                  <p>Data Science</p>
                </ExperienceItem>
              </div>
            </div>

            {/* GitHub Contributions Section */}
            <div className="mb-16 w-full text-left">
              <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                GitHub Contributions
              </h2>
              <GithubGraph />
            </div>

            {/* Tech Stack Section */}
            <div className="mb-16 w-full text-left">
              <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Tech Stack
              </h2>
              <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
                I&apos;m a generalist at heart who can build with anything, but here&apos;s the core stack I&apos;ve spent the most time with:
              </p>
              <TechStack />
            </div>

            {/* Writings & Blogs Section */}
            {/* <div className="mb-16 w-full text-left">
  <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
    Writings & Blogs
  </h2>
  <p className="w-full text-lg leading-relaxed text-gray-600 dark:text-gray-400">
    I share my thoughts, experiences, and learnings on{" "}
    <a
      href="https://medium.com/@adityapatil24680"
      target="_blank"
      rel="noopener noreferrer"
      className="text-black dark:text-white underline underline-offset-4 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
    >
      Medium
    </a>
    . I prefer using an established platform rather than building a separate website so I can focus on what really matters: discussing technology, AI, full-stack development, and real-world project experiences.
  </p>
</div> */}

            <div className="mb-20 w-full">
      
      {/* Title */}
      <h2 className="mb-10 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
        Certificates
      </h2>

      {/* Certificate Grid */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">

        {certificates.map((cert, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ type: "spring", stiffness: 200 }}
            onClick={() => setSelected(cert)}
            className="cursor-pointer rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/40 dark:bg-white/5 backdrop-blur-lg p-4 shadow-md hover:shadow-xl transition"
          >
            
            {/* Image */}
            <div className="overflow-hidden rounded-xl">
              <img
                src={cert.image}
                alt={cert.title}
                className="h-40 w-full object-cover transition duration-500 hover:scale-110"
              />
            </div>

            {/* Text */}
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-black dark:text-white">
                {cert.title}
              </h3>
              <p className="text-xs text-gray-400">{cert.issuer}</p>
            </div>

          </motion.div>
        ))}

      </div> */}

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120 }}
              className="max-w-3xl rounded-2xl bg-white dark:bg-black p-4"
              onClick={(e) => e.stopPropagation()}
            >
              
              <img
                src={selected.image}
                alt={selected.title}
                className="rounded-xl w-full"
              />

              <div className="mt-4">
                <h3 className="text-lg font-bold text-black dark:text-white">
                  {selected.title}
                </h3>
                <p className="text-sm text-gray-500">
                  Issued by {selected.issuer}
                </p>
              </div>

            </motion.div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>

            {/* Thing about me Section */}
            <div className="mb-16 w-full text-left">
              <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Thing about me
              </h2>
              <div className="space-y-6">
                <p className="w-full text-lg leading-relaxed text-gray-600 dark:text-gray-400">
Outside of technology, I enjoy being active and spending time with my team on the cricket field. 
This photo captures one of my favorite moments — celebrating a tournament win with my teammates. 
Cricket has taught me many valuable lessons about teamwork, discipline, and staying focused under pressure.
</p>

               {/* <div className="w-full overflow-hidden py-6"> */}


                 <div className="w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      
      <div className="flex w-max animate-infinite-scroll">

        {/* First Row */}
        <div className="flex gap-12 py-6 pr-12">
          {images.map((img, index) => (
            <div
              key={index}
              className="relative h-[250px] w-[250px] grayscale hover:grayscale-0 transition-all duration-1600 sm:h-[320px] sm:w-[320px]"
              style={{
                maskImage: "radial-gradient(circle, black 40%, transparent 95%)",
                WebkitMaskImage: "radial-gradient(circle, black 40%, transparent 95%)",
              }}
            >
              <Image
                src={img}
                alt="Gallery image"
                fill
                className="object-contain object-center"
              />
            </div>
          ))}
        </div>

        {/* Duplicate Row (for infinite loop) */}
        <div className="flex gap-12 py-6 pr-12">
          {images.map((img, index) => (
            <div
              key={index + images.length}
              className="relative h-[250px] w-[250px] grayscale hover:grayscale-0 transition-all duration-1600 sm:h-[320px] sm:w-[320px]"
              style={{
                maskImage: "radial-gradient(circle, black 40%, transparent 95%)",
                WebkitMaskImage: "radial-gradient(circle, black 40%, transparent 95%)",
              }}
            >
              <Image
                src={img}
                alt="Gallery image"
                fill
                className="object-contain object-center"
              />
            </div>
          ))}
        </div>

      </div>
    </div>
  
 

                <p className="w-full text-lg leading-relaxed text-gray-600 dark:text-gray-400">
Just like in software development, success in sports comes from collaboration, strategy, and trust in the people around you. 
Whether I'm building projects or playing a match, I always enjoy working together toward a shared goal and celebrating the results.
</p>
              </div>
            </div>

            {/* Get in Touch Section */}
            <div className="mb-16 w-full text-left">
              <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-gray-400">
                Get in Touch
              </h2>
              <div className="space-y-4">
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Connect with me on{" "}
                  <a
                    href="https://www.linkedin.com/in/damindu-abeygunasekara-8193b1282/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-black dark:text-white underline underline-offset-4 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    LinkedIn
                  </a>{" "}
                  or{" "} shoot an {" "}
                  <a
                    href="mailto:daminduprasadith05@gmail.com"
                    className="text-black dark:text-white underline underline-offset-4 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    email
                  </a>
                </p>
              </div>
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      {/* Glass Island Navbar */}
      <nav className="fixed bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full border border-gray-200 dark:border-zinc-700 bg-white/70 dark:bg-zinc-900/80 px-4 py-3 shadow-sm backdrop-blur-md transition-all hover:bg-white/90 dark:hover:bg-zinc-900 sm:gap-6 sm:px-6">
        {/* Mode Toggle Switch */}
        <div className="flex items-center">
          <button
            onClick={() => setMode(mode === "profile" ? "projects" : "profile")}
            className="group relative flex h-7 w-12 cursor-pointer rounded-full bg-gray-200 dark:bg-zinc-700 p-1 transition-colors duration-200 ease-in-out hover:bg-gray-300 dark:hover:bg-zinc-600 focus:outline-none"
            role="switch"
            aria-checked={mode === "profile"}
            title={`Switch to ${mode === "profile" ? "projects" : "profile"} `}
          >
            <div
              className={`flex h-5 w-5 transform items-center justify-center rounded-full bg-white dark:bg-white shadow-sm transition duration-200 ease-in-out ${
                mode === "projects" ? "translate-x-5" : "translate-x-0"
              }`}
            >
              {mode === "profile" ? (
                <User className="h-3 w-3 text-black" />
              ) : (
                <FiShoppingCart className="h-3 w-3 text-black" />
              )}
            </div>
          </button>
        </div>
        <button
          onClick={() => setShowQR(true)}
          className="text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors hover:scale-110"
          aria-label="Show QR Code"
        >
          <QrCode className="h-5 w-5" />
        </button>
        <div className="h-6 w-px bg-gray-200 dark:bg-zinc-700" />
        <a
          href="https://github.com/daminduAb"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors hover:scale-110"
        >
          <Github className="h-5 w-5" />
        </a>
        <a
          href="https://www.linkedin.com/in/damindu-abeygunasekara-8193b1282/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors hover:scale-110"
        >
          <Linkedin className="h-5 w-5" />
        </a>
        <a
          href="https://x.com/DaminduP2001"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors hover:scale-110"
        >
          <FaXTwitter className="h-5 w-5" />
        </a>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors hover:scale-110"
        >
          <Youtube className="h-5 w-5" />
        </a>
        <a
          href="https://discord.com/channels/@me/948819673997262879"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors hover:scale-110"
        >
          <DiscordIcon className="h-5 w-5" />
        </a>
      </nav>

      {/* QR Code Modal */}
      {showQR && (
        
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20 dark:bg-white/5 backdrop-blur-sm"
          onClick={() => setShowQR(false)}
        >
          <div
            className="relative rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowQR(false)}
              className="absolute -right-3 -top-3 rounded-full bg-black dark:bg-white p-2 text-white dark:text-black transition-transform hover:scale-110"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="rounded-lg bg-white p-2">
              
              <QRCodeSVG
                value="https://drive.google.com/file/d/1VcpkDS7aSSjpa6XS9ZADWbywQPhQhOk2/view?usp=sharing"
                size={200}
              />
            </div>
          </div>
        </div>
      )}

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-colors"
              >
                <FiX className="w-5 h-5" />
              </motion.button>

              {/* Media Section */}
              <div className={`relative h-80 bg-gradient-to-br ${selectedProject.gradient}`}>
                {selectedProject.mediaType === "video" ? (
                  <video
                   key={selectedProject.mediaUrl}
                    src={selectedProject.mediaUrl}
                    poster={selectedProject.thumbnail}
                    controls
                    autoPlay
                    loop
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex h-full">
                    {selectedProject.images?.map((img, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex-1 bg-cover bg-center"
                        style={{ backgroundImage: `url(${img})` }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Details Section */}
              <div className="p-8">
                <motion.h2 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-3xl font-bold mb-4 bg-gradient-to-r from-zinc-900 to-zinc-600 dark:from-white dark:to-zinc-400 bg-clip-text text-transparent"
                >
                  {selectedProject.title}
                </motion.h2>

                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed"
                >
                  {selectedProject.fullDesc}
                </motion.p>

                {/* Tech Stack */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mb-6"
                >
                  <h3 className="text-lg font-semibold mb-3">Technologies Used</h3>
                  <div className="flex flex-wrap gap-3">
                    {selectedProject.tech.map((tech) => (
                      <motion.div
                        key={tech}
                        whileHover={{ scale: 1.1 }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800"
                      >
                        <span className="text-xl">{selectedProject.techIcons[tech]}</span>
                        <span>{tech}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Stats */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="grid grid-cols-3 gap-4 mb-6"
                >
                  {Object.entries(selectedProject.stats).map(([key, value]) => (
                    <div key={key} className="text-center p-4 rounded-lg bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-700">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{value}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">{key}</div>
                    </div>
                  ))}
                </motion.div>

                {/* Action Buttons */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex gap-4"
                >
                  {selectedProject.links.github && (
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={selectedProject.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-zinc-900 dark:bg-zinc-700 text-white hover:bg-zinc-800 dark:hover:bg-zinc-600 transition-colors"
                    >
                      <FiGithub className="w-5 h-5" />
                      <span>View Source Code</span>
                    </motion.a>
                  )}
                  {selectedProject.links.demo && (
                    <motion.a
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      href={selectedProject.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-zinc-900 dark:bg-zinc-700 text-white hover:bg-zinc-800 dark:hover:bg-zinc-600 transition-colors"
                    >
                      <FiExternalLink className="w-5 h-5" />
                      <span>Live Demo</span>
                    </motion.a>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}