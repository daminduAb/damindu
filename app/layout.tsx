import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./providers";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const BASE_URL = "https://damindu-two.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Damindu Abeygunasekara — Full-Stack · AI · Blockchain Developer",
    template: "%s | Damindu Abeygunasekara",
  },
  description:
    "CS undergraduate at the University of Kelaniya. I build full-stack web apps, decentralized applications, and AI systems with React, Next.js, Solidity, Python, and more.",
  keywords: [
    "Damindu Abeygunasekara",
    "Full-Stack Developer",
    "Blockchain Developer",
    "AI Developer",
    "React",
    "Next.js",
    "Solidity",
    "Python",
    "University of Kelaniya",
    "Sri Lanka developer",
    "portfolio",
  ],
  authors: [{ name: "Damindu Abeygunasekara", url: BASE_URL }],
  creator: "Damindu Abeygunasekara",
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "Damindu Abeygunasekara",
    title: "Damindu Abeygunasekara — Full-Stack · AI · Blockchain Developer",
    description:
      "CS undergraduate at the University of Kelaniya. I build full-stack web apps, decentralized applications, and AI systems.",
    images: [
      {
        url: "/my.png",
        width: 800,
        height: 800,
        alt: "Damindu Abeygunasekara",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@DaminduP2001",
    creator: "@DaminduP2001",
    title: "Damindu Abeygunasekara — Full-Stack · AI · Blockchain Developer",
    description:
      "CS undergraduate at the University of Kelaniya. I build full-stack web apps, decentralized applications, and AI systems.",
    images: ["/my.png"],
  },
  alternates: {
    canonical: BASE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  verification: {
    google: "haeySdwWeKWZjj8OYgXVC7QWoDQOyRYrMxwV7JPrnAw",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Damindu Abeygunasekara",
  url: BASE_URL,
  image: `${BASE_URL}/my.png`,
  jobTitle: "Full-Stack · AI · Blockchain Developer",
  description:
    "CS undergraduate at the University of Kelaniya with a strong interest in full-stack development, blockchain technologies, and artificial intelligence.",
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of Kelaniya",
  },
  sameAs: [
    "https://github.com/daminduAb",
    "https://www.linkedin.com/in/damindu-abeygunasekara-8193b1282/",
    "https://x.com/DaminduP2001",
    "https://medium.com/@adaminduprasadith",
  ],
  knowsAbout: [
    "React",
    "Next.js",
    "Node.js",
    "Solidity",
    "Ethereum",
    "Python",
    "FastAPI",
    "MongoDB",
    "Artificial Intelligence",
    "Blockchain",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${dmSans.variable} antialiased transition-colors duration-300`}
      >
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
