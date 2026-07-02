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
  "/casual11.jpg",
  "/casual12.jpg",
]

import Image from "next/image";
import {
  Github,
  Linkedin,
  User,
  QrCode,
  X,
  Music,
  Pause,
  Car,
} from "lucide-react";

import { FaXTwitter } from "react-icons/fa6";

import { ExperienceItem } from "./components/ExperienceItem";
import { GithubGraph } from "./components/GithubGraph";
import { TechStack } from "./components/TechStack";
import { NeuralNetworkSim } from "./components/NeuralNetworkSim";

import { useState, useEffect, useMemo, useRef } from "react";

import { QRCodeSVG } from "qrcode.react";

import { ThemeToggle } from "./components/ThemeToggle";

import { motion, AnimatePresence } from "framer-motion";

import { PortfolioChatbot } from "./components/PortfolioChatbot";
import BootLoader from "./components/BootLoader";

import {
  FiGithub,
  FiExternalLink,
  FiShoppingCart,
  FiX,
  FiMaximize2,
  FiMessageCircle
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
  SiMysql,
  SiPython,
  SiFastapi,
  SiOpenai,
  SiTypescript,
  SiPostgresql,
  SiDocker,
  SiSpringboot,
  SiPytorch,
  SiFlask,
  SiScikitlearn,
} from "react-icons/si";

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
  const [booted, setBooted] = useState(false);
  const [time, setTime] = useState<string>("");
  const [showQR, setShowQR] = useState(false);
  const [mode, setMode] = useState<"profile" | "projects">("profile");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
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
  //     const [selected, setSelected] = useState<any>(null);
  //     const certificates = [
  //   {
  //     title: "AWS Cloud Practitioner",
  //     issuer: "Amazon Web Services",
  //     image: "/certificates/aws.jpg",
  //   },
  //   {
  //     title: "Blockchain Development",
  //     issuer: "Coursera",
  //     image: "/certificates/blockchain.jpg",
  //   },
  //   {
  //     title: "AI & Machine Learning",
  //     issuer: "Google",
  //     image: "/certificates/ai.jpg",
  //   },
  //   {
  //     title: "DevOps Engineering",
  //     issuer: "Udemy",
  //     image: "/certificates/devops.jpg",
  //   },
  //   {
  //     title: "Cyber Security",
  //     issuer: "Cisco",
  //     image: "/certificates/cybersecurity.jpg",
  //   },
  // ];



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
      gradient: "from-blue-500/30 via-purple-500/20 to-indigo-600/30",
      icon: <SiEthereum className="w-6 h-6 text-blue-500" />,
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
      gradient: "from-emerald-500/30 via-teal-400/20 to-green-600/30",
      icon: <FiShoppingCart className="w-6 h-6 text-emerald-500" />,
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
      tech: ["React", "Node.js", "MongoDB", "Mysql"],
      techIcons: {
        "React": <SiReact className="text-blue-400" />,
        "Node.js": <SiNodedotjs className="text-green-600" />,
        "MongoDB": <SiMongodb className="text-green-500" />,
        "Mysql": <SiMysql className="text-blue-600" />
      },
      category: "sustainability",
      gradient: "from-green-500/30 via-lime-400/20 to-emerald-600/30",
      icon: <SiNodedotjs className="w-6 h-6 text-green-500" />,
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
    },
    {
      id: 4,
      title: "WhatsApp AI Shop Agent",
      shortDesc: "Intelligent shopping assistant on WhatsApp",
      fullDesc: "A fully AI-powered WhatsApp chatbot for online shops. Customers can search products, check availability, place orders, and get instant replies in any language — all through WhatsApp chat. Built with vector search for smart product matching, conversation memory, product image support, and real-time MongoDB product management. Uses Meta Cloud API for production-grade WhatsApp messaging.",
      tech: ["Python", "FastAPI", "MongoDB", "Pinecone", "Groq AI"],
      techIcons: {
        "Python": <SiPython className="text-yellow-400" />,
        "FastAPI": <SiFastapi className="text-teal-400" />,
        // "MongoDB": <SiMongodb className="text-green-500" />,
        // "Pinecone": <SiPinecone className="text-blue-500" />,
        "Groq AI": <SiOpenai className="text-purple-400" />
      },
      category: "ai",
      gradient: "from-purple-500/30 via-violet-400/20 to-pink-600/30",
      icon: <FiMessageCircle className="w-6 h-6 text-purple-500" />,
      mediaType: "video",
      mediaUrl: "/whatsapp-bot.mp4",
      thumbnail: "/whatsapp-thumb.jpg",
      stats: {
        products: "100K+",
        languages: "10+",
        response: "<5s"
      },
      links: {
        github: "https://github.com/daminduAb/AI-WhatsApp-shopping-agent-.git",
        demo: "#"
      }
    },
    {
      id: 5,
      title: "Vahana.lk",
      shortDesc: "AI-powered vehicle marketplace for Sri Lanka",
      fullDesc: "A full-stack vehicle marketplace with AI photo-based car recognition powered by a custom EfficientNet-B0 model trained on 7 vehicle classes. Features location-based search with PostGIS, JWT-secured Spring Boot backend, and a clean Next.js 14 frontend. Achieves 74.4% top-1 and 97.6% top-5 accuracy.",
      tech: ["Next.js", "Spring Boot", "FastAPI", "PyTorch", "PostgreSQL", "Docker"],
      techIcons: {
        "Next.js": <SiNextdotjs className="text-black dark:text-white" />,
        "Spring Boot": <SiSpringboot className="text-green-500" />,
        "FastAPI": <SiFastapi className="text-teal-400" />,
        "PyTorch": <SiPytorch className="text-orange-500" />,
        "PostgreSQL": <SiPostgresql className="text-blue-400" />,
        "Docker": <SiDocker className="text-blue-500" />,
      },
      category: "ai / marketplace",
      gradient: "from-orange-500/30 via-amber-400/20 to-red-500/30",
      icon: <Car className="w-6 h-6 text-orange-500" />,
      mediaType: "image",
      images: [],
      stats: {
        "top-1 acc": "74.4%",
        "top-5 acc": "97.6%",
        "classes": "7",
      },
      links: {
        github: "https://github.com/daminduAb/Vahana.lk.git",
        demo: "#"
      }
    },
    {
      id: 6,
      title: "HospitalQ",
      shortDesc: "AI-powered hospital queue management system",
      fullDesc: "A full-stack hospital queue management system with real-time patient tracking, role-based access for admins, doctors, and patients, and an ML-powered wait-time prediction engine built with Python, Flask, and scikit-learn. Features 13+ pages, priority scheduling, and live analytics dashboards with Chart.js.",
      tech: ["Java", "MySQL", "Flask", "scikit-learn", "Python", "Chart.js"],
      techIcons: {
        "Java": <span className="font-bold text-red-500 text-xs">Java</span>,
        "MySQL": <SiMysql className="text-blue-600" />,
        "Flask": <SiFlask className="text-gray-600 dark:text-gray-300" />,
        "scikit-learn": <SiScikitlearn className="text-orange-400" />,
        "Python": <SiPython className="text-yellow-400" />,
        "Chart.js": <span className="font-bold text-pink-400 text-xs">Chart</span>,
      },
      category: "healthcare / ai",
      gradient: "from-red-500/30 via-rose-400/20 to-pink-500/30",
      icon: <span className="font-bold text-red-500 text-sm">Java</span>,
      mediaType: "image",
      images: [],
      stats: {
        "User Roles": "3",
        "Pages": "13+",
        "ML Endpoints": "4",
      },
      links: {
        github: "https://github.com/daminduAb/hospital.git",
        demo: "#"
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
    <>
    {!booted && <BootLoader onFinish={() => setBooted(true)} />}
    <div className={`relative flex min-h-screen flex-col items-center bg-white dark:bg-black px-5 pt-16 text-black dark:text-white selection:bg-black dark:selection:bg-white selection:text-white dark:selection:text-black pb-36 sm:px-8 sm:pt-24 overflow-x-hidden transition-colors duration-300 ${!booted ? "invisible" : ""}`}>
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

      <AnimatePresence mode="wait">
        {mode === "projects" ? (
          /* Projects View */
          <motion.main
            key="projects"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex w-full max-w-5xl flex-col items-start text-left px-0 mx-auto"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 w-full"
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
                  className="group relative rounded-2xl border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-500 bg-white dark:bg-zinc-900/70 backdrop-blur-sm overflow-hidden cursor-pointer shadow-sm hover:shadow-xl dark:hover:shadow-black/40 transition-shadow duration-300"
                  onClick={() => setSelectedProject(project)}
                >
                  {/* Gradient Overlay */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  />

                  {/* Media Thumbnail */}
                  <div className={`relative h-44 bg-gradient-to-br ${project.gradient} dark:brightness-75`}>
                    {/* large faded icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-[80px] opacity-10 group-hover:opacity-20 transition-opacity duration-500 scale-110">
                        {project.icon}
                      </div>
                    </div>
                    {/* centered icon + label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                      <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 dark:bg-black/20 backdrop-blur-sm border border-white/30 dark:border-white/10 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <span className="text-2xl">{project.icon}</span>
                      </div>
                      <span className="text-[11px] font-medium text-black/50 dark:text-white/40 tracking-wider uppercase">{project.mediaType === "video" ? "Demo available" : project.images && project.images.length > 0 ? `${project.images.length} screenshots` : "In development"}</span>
                    </div>

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
          /* Profile — macOS style */
          <motion.main
            key="profile"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="w-full max-w-[680px] mx-auto"
          >

            {/* ── HEADER ─────────────────────────────────────────── */}
            <div className="mb-10 flex items-start gap-4">
              {/* Avatar */}
              <button
                onClick={() => setShowEasterEgg(!showEasterEgg)}
                aria-label="Toggle Aura Mode"
                className="group relative h-[60px] w-[60px] sm:h-[72px] sm:w-[72px] flex-shrink-0 overflow-hidden rounded-full ring-1 ring-black/10 dark:ring-white/10 transition-all duration-300 active:scale-95 hover:ring-black/25 dark:hover:ring-white/25"
              >
                <Image
                  src="/my.png"
                  alt="Damindu"
                  fill
                  className={`object-cover transition-all duration-500 ${showEasterEgg ? "grayscale-0" : "grayscale"} group-hover:grayscale-0`}
                  priority
                />
              </button>

              {/* Name block */}
              <div className="flex-1 min-w-0 pt-1">
                <h1 className="text-[17px] sm:text-[22px] font-semibold tracking-[-0.02em] text-black dark:text-white leading-tight truncate">
                  Damindu Abeygunasekara
                </h1>
                <p className="mt-0.5 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Full-Stack · AI · Blockchain
                </p>
                <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-gray-400 dark:text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gray-400 dark:bg-gray-500 opacity-60" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gray-400 dark:bg-gray-500" />
                    </span>
                    Open to work
                  </span>
                  <span className="text-gray-300 dark:text-gray-700">·</span>
                  <span className="font-mono tabular-nums">{time || "00:00:00"} IST</span>
                  <span className="text-gray-300 dark:text-gray-700">·</span>
                  <button
                    onClick={toggleLofi}
                    className="flex items-center gap-1 hover:text-black dark:hover:text-white transition-colors"
                  >
                    {isLofiPlaying ? <Pause size={10} fill="currentColor" /> : <Music size={10} />}
                    <span>{isLofiPlaying ? "Lofi on" : "Lofi"}</span>
                  </button>
                  <AnimatePresence>
                    {isLofiPlaying && (
                      <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: 40, opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="overflow-hidden">
                        <input type="range" min="0" max="1" step="0.01" value={lofiVolume}
                          onChange={(e) => setLofiVolume(parseFloat(e.target.value))}
                          className="h-[2px] w-9 cursor-pointer appearance-none rounded-full bg-gray-200 dark:bg-zinc-700 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-2.5 [&::-webkit-slider-thumb]:w-2.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gray-500 dark:[&::-webkit-slider-thumb]:bg-gray-400"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* ── BIO ────────────────────────────────────────────── */}
            <div className="mb-10 space-y-3 text-[14px] sm:text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
              <p>
                CS undergraduate at the University of Kelaniya with a strong interest in
                full-stack development, blockchain technologies, and artificial intelligence.
              </p>
              <p>
                I build real-world software — decentralized apps, AI systems, and modern web platforms —
                with a focus on shipping things that actually work.
              </p>
            </div>

            {/* ── NEURAL SIM ─────────────────────────────────────── */}
            <div className="mb-10">
              <NeuralNetworkSim />
            </div>

            {/* ── DIVIDER UTIL ───────────────────────────────────── */}
            {/* Each section uses the same pattern below */}

            {/* ── EXPERIENCE ─────────────────────────────────────── */}
            <section className="mb-10 sm:mb-14">
              <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500">Experience</p>
              <div className="divide-y divide-gray-100 dark:divide-zinc-800/80">
                <ExperienceItem title="Ballerina Competition – Finalist" role="Member of team Axionic" collapsible={true} link="https://www.youtube.com/watch?v=hUZeVqmaUMY">
                  <div className="space-y-1.5 text-[14px]">
                    <p>Participated in a national-level ballerina competition</p>
                    <p>Selected as a finalist among many competitors</p>
                    <p>Demonstrated dedication, creativity, and performance skills</p>
                  </div>
                </ExperienceItem>
                <ExperienceItem title="Rotaract Club of University of Kelaniya" role="PR Coordinator" collapsible={true} link="https://m.facebook.com/story.php?story_fbid=pfbid05a2sLVZQEmyHfqwsS3FZoo4E9uifrVJBprHsWkXNyn8sN4KbXjxxBBzr53n7bQp5l&id=100064802406023&mibextid=CDWPTG">
                  <div className="space-y-1.5 text-[14px]">
                    <p>Managed social media communication and public relations</p>
                    <p>Promoted club events and community service projects</p>
                    <p>Designed digital promotional content</p>
                    <p>Coordinated communication between members and external partners</p>
                  </div>
                </ExperienceItem>
                <ExperienceItem title="University Hackathons & Tech Events" role="Participant & Organizer" collapsible={true} link="https://www.facebook.com/share/p/1aSPghpvuu/">
                  <div className="space-y-1.5 text-[14px]">
                    <p>Participated in multiple university-level hackathons, collaborating in diverse teams to design, prototype, and deploy innovative solutions under tight deadlines.</p>
                    <p>Organized and led tech workshops on AI, Web3, and Full-Stack Development.</p>
                    <p>Worked on AI-powered apps, blockchain voting systems, and interactive web experiences using Next.js, React, Solidity, and Tailwind CSS.</p>
                    <p>Contributed to community knowledge sharing through technical tutorials, demo sessions, and mentoring.</p>
                  </div>
                </ExperienceItem>
              </div>
            </section>

            {/* ── IN BETWEEN ─────────────────────────────────────── */}
            <section className="mb-10 sm:mb-14">
              <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500">In Between</p>
              <div className="rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/30 px-4 py-4 sm:px-6 sm:py-5">
                <ExperienceItem title="Beyond Academics & Technical Work" role="" collapsible={true}>
                  <div className="space-y-3 text-[14px]">
                    <p>Outside of my academic and technical work, I explore creative and collaborative activities — sports, video editing, photo editing, and organizing music and university events.</p>
                    <p>These experiences have shaped my ability to work with diverse teams, manage responsibilities, and approach challenges with creativity and adaptability.</p>
                    <p className="font-medium text-black dark:text-white">Combining technical knowledge with creativity and teamwork leads to building better ideas and more meaningful projects.</p>
                  </div>
                </ExperienceItem>
              </div>
            </section>

            {/* ── EDUCATION ──────────────────────────────────────── */}
            <section className="mb-10 sm:mb-14">
              <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500">Education</p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 gap-1">
                <div>
                  <p className="text-[14px] sm:text-[15px] font-medium text-black dark:text-white">University of Kelaniya</p>
                  <p className="mt-0.5 text-[13px] text-gray-500 dark:text-gray-400">BSc Computer Science · Data Science</p>
                </div>
                <span className="text-[11px] text-gray-400 dark:text-gray-500 flex-shrink-0">Undergraduate</span>
              </div>
              <div className="h-px bg-gray-100 dark:bg-zinc-800" />
            </section>

            {/* ── GITHUB ─────────────────────────────────────────── */}
            <section className="mb-10 sm:mb-14">
              <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500">GitHub Contributions</p>
              <GithubGraph />
            </section>

            {/* ── TECH STACK ─────────────────────────────────────── */}
            <section className="mb-10 sm:mb-14">
              <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500">Tech Stack</p>
              <p className="mb-6 text-[15px] text-gray-500 dark:text-gray-400">
                Generalist at heart — here&apos;s the core stack I&apos;ve spent the most time with.
              </p>
              <TechStack />
            </section>

            {/* ── WRITINGS ───────────────────────────────────────── */}
            <section className="mb-10 sm:mb-14">
              <div className="mb-5 flex items-baseline justify-between">
                <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500">Writings</p>
                <a href="https://medium.com/@adaminduprasadith" target="_blank" rel="noopener noreferrer"
                  className="text-[11px] text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors">
                  Medium →
                </a>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-zinc-800/80">
                {[
                  { title: "Fine-tuning vs RAG: Stop Guessing, Start Choosing Wisely", tag: "AI / LLM", date: "Jun 2025", url: "https://medium.com/@adaminduprasadith/fine-tuning-vs-rag-stop-guessing-start-choosing-wisely-b593678643fe" },
                  { title: "Attention Is All You Need — But Do You Actually Understand It?", tag: "AI / LLM", date: "Jun 2025", url: "https://medium.com/@adaminduprasadith/attention-is-all-you-need-but-do-you-actually-understand-it-587ab5202b5d" },
                  { title: "Learn SOLID Principles in 2 Hours — Complete Beginner Guide with Python Examples", tag: "Python", date: "May 2025", url: "https://medium.com/@adaminduprasadith/learn-solid-principles-in-2-hours-complete-beginner-guide-with-python-examples-1a5ae787e7f0" },
                  { title: "What even is a machine learning model?", tag: "ML", date: "May 2025", url: "https://medium.com/@adaminduprasadith/what-even-is-a-machine-learning-model-e2d410e32a5e" },
                  { title: "Build Full-Stack Web Apps with the MERN Stack", tag: "Web Dev", date: "Apr 2025", url: "https://medium.com/@adaminduprasadith/build-full-stack-web-apps-with-the-mern-stack-5f6c20d4866f" },
                  { title: "Monorepo in GitHub", tag: "DevOps", date: "Apr 2025", url: "https://medium.com/@adaminduprasadith/monorepo-in-github-e18ccddb83d8" },
                  { title: "Jenkins Made Simple: A Beginner-Friendly Guide for Developers", tag: "DevOps", date: "Apr 2025", url: "https://medium.com/@adaminduprasadith/jenkins-made-simple-a-beginner-friendly-guide-for-developers-9807a6bf869b" },
                  { title: "FastAPI: Build Lightning-Fast APIs with Minimal Code", tag: "Python", date: "Apr 2025", url: "https://medium.com/@adaminduprasadith/fastapi-build-lightning-fast-apis-with-minimal-code-84dff1f6ca2f" },
                  { title: "Microservices Made Simple: A Beginner-Friendly Guide", tag: "Architecture", date: "Apr 2025", url: "https://medium.com/@adaminduprasadith/microservices-made-simple-a-beginner-friendly-guide-64300d1f042e" },
                ].map((article) => (
                  <a
                    key={article.url}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start gap-3 py-3.5 transition-opacity hover:opacity-70"
                  >
                    <span className="w-[52px] sm:w-[72px] flex-shrink-0 text-[11px] text-gray-400 dark:text-gray-500 pt-[2px]">{article.date}</span>
                    <span className="flex-1 min-w-0 text-[13px] sm:text-[14px] text-black dark:text-white leading-snug">{article.title}</span>
                    <span className="flex-shrink-0 text-[11px] text-gray-400 dark:text-gray-500 hidden sm:block pt-[2px]">{article.tag}</span>
                  </a>
                ))}
              </div>
            </section>

            {/* ── GALLERY ────────────────────────────────────────── */}
            <section className="mb-10 sm:mb-14">
              <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500">A Bit About Me</p>
              <p className="mb-5 text-[14px] sm:text-[15px] leading-relaxed text-gray-500 dark:text-gray-400">
                Outside of technology I enjoy being active on the cricket field — teamwork, discipline,
                staying focused under pressure. The same principles I bring to every build.
              </p>
              <div className="w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
                <div className="flex w-max animate-infinite-scroll">
                  {[...images, ...images].map((img, i) => (
                    <div key={i} className="relative mx-2 h-[120px] w-[120px] sm:h-[160px] sm:w-[160px] flex-shrink-0 overflow-hidden rounded-xl grayscale hover:grayscale-0 transition-all duration-500 ring-1 ring-black/5 dark:ring-white/5">
                      <Image src={img} alt="Gallery" fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-5 text-[14px] sm:text-[15px] leading-relaxed text-gray-500 dark:text-gray-400">
                Whether building or playing — always chasing a shared goal with great people.
              </p>
            </section>

            {/* ── CONTACT ────────────────────────────────────────── */}
            <section className="mb-10 sm:mb-14">
              <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500">Get in Touch</p>
              <div className="divide-y divide-gray-100 dark:divide-zinc-800/80">
                {[
                  { label: "LinkedIn", sub: "damindu-abeygunasekara", href: "https://www.linkedin.com/in/damindu-abeygunasekara-8193b1282/" },
                  { label: "Email", sub: "daminduprasadith05@gmail.com", href: "mailto:daminduprasadith05@gmail.com" },
                  { label: "GitHub", sub: "daminduAb", href: "https://github.com/daminduAb" },
                  { label: "X / Twitter", sub: "@DaminduP2001", href: "https://x.com/DaminduP2001" },
                  { label: "Medium", sub: "@adaminduprasadith", href: "https://medium.com/@adaminduprasadith" },
                ].map((item) => (
                  <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center justify-between gap-4 py-3.5 transition-opacity hover:opacity-60">
                    <span className="text-[14px] text-black dark:text-white flex-shrink-0">{item.label}</span>
                    <span className="text-[12px] sm:text-[13px] text-gray-400 dark:text-gray-500 truncate text-right">{item.sub}</span>
                  </a>
                ))}
              </div>
            </section>

          </motion.main>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-white/80 dark:bg-zinc-900/85 px-3 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl">

        {/* Mode toggle */}
        <button
          onClick={() => setMode(mode === "profile" ? "projects" : "profile")}
          title={`Switch to ${mode === "profile" ? "projects" : "profile"}`}
          className={`flex h-8 items-center gap-1.5 rounded-xl px-3 text-xs font-medium transition-all duration-200 ${
            mode === "profile"
              ? "bg-black dark:bg-white text-white dark:text-black"
              : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
          }`}
        >
          <User className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Profile</span>
        </button>
        <button
          onClick={() => setMode(mode === "projects" ? "profile" : "projects")}
          title="Projects"
          className={`flex h-8 items-center gap-1.5 rounded-xl px-3 text-xs font-medium transition-all duration-200 ${
            mode === "projects"
              ? "bg-black dark:bg-white text-white dark:text-black"
              : "text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5"
          }`}
        >
          <FiShoppingCart className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Projects</span>
        </button>

        <div className="mx-1 h-5 w-px bg-black/10 dark:bg-white/10" />

        {/* Social icons */}
        {[
          { href: "https://github.com/daminduAb", icon: <Github className="h-4 w-4" />, label: "GitHub" },
          { href: "https://www.linkedin.com/in/damindu-abeygunasekara-8193b1282/", icon: <Linkedin className="h-4 w-4" />, label: "LinkedIn" },
          { href: "https://x.com/DaminduP2001", icon: <FaXTwitter className="h-4 w-4" />, label: "X" },
          { href: "https://medium.com/@adaminduprasadith", icon: (
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
              <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
            </svg>
          ), label: "Medium" },
          { href: "https://discord.com/channels/@me/948819673997262879", icon: <DiscordIcon className="h-4 w-4" />, label: "Discord" },
        ].map((item) => (
          <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
            title={item.label}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-150">
            {item.icon}
          </a>
        ))}

        <div className="mx-1 h-5 w-px bg-black/10 dark:bg-white/10" />

        {/* QR */}
        <button onClick={() => setShowQR(true)} title="Resume QR"
          className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-150">
          <QrCode className="h-4 w-4" />
        </button>

        {/* Theme toggle */}
        <ThemeToggle />
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
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 20 }}
              className="relative w-full sm:max-w-4xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl bg-white dark:bg-zinc-900 shadow-2xl"
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
              <div className={`relative h-48 sm:h-80 bg-gradient-to-br ${selectedProject.gradient}`}>
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
              <div className="p-5 sm:p-8">
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
                  className="grid grid-cols-3 gap-2 sm:gap-4 mb-6"
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
      {/* AI Chatbot */}
      <PortfolioChatbot />
    </div>
    </>
  );
}