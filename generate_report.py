from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak, KeepTogether
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT
from datetime import datetime

OUTPUT = "G:/notes/damindu/Portfolio_Report_Damindu.pdf"

# ── Colours ──────────────────────────────────────────────────────────────────
BLACK      = colors.HexColor("#0a0a0a")
DARK_GRAY  = colors.HexColor("#1a1a1a")
MID_GRAY   = colors.HexColor("#555555")
LIGHT_GRAY = colors.HexColor("#aaaaaa")
BORDER     = colors.HexColor("#e0e0e0")
BG_LIGHT   = colors.HexColor("#f7f7f7")
BG_DARK    = colors.HexColor("#111111")
ACCENT     = colors.HexColor("#222222")
WHITE      = colors.white

W, H = A4
MARGIN = 18 * mm

# ── Styles ───────────────────────────────────────────────────────────────────
base = getSampleStyleSheet()

def S(name, **kw):
    return ParagraphStyle(name, **kw)

cover_name = S("cover_name", fontSize=34, leading=40, textColor=WHITE,
               fontName="Helvetica-Bold", alignment=TA_LEFT, spaceAfter=4)
cover_role = S("cover_role", fontSize=13, leading=18, textColor=LIGHT_GRAY,
               fontName="Helvetica", alignment=TA_LEFT, spaceAfter=2)
cover_meta = S("cover_meta", fontSize=9, leading=13, textColor=LIGHT_GRAY,
               fontName="Helvetica", alignment=TA_LEFT)

h1 = S("H1", fontSize=18, leading=24, textColor=BLACK,
        fontName="Helvetica-Bold", spaceBefore=14, spaceAfter=6)
h2 = S("H2", fontSize=13, leading=18, textColor=DARK_GRAY,
        fontName="Helvetica-Bold", spaceBefore=10, spaceAfter=4)
h3 = S("H3", fontSize=10, leading=15, textColor=DARK_GRAY,
        fontName="Helvetica-Bold", spaceBefore=6, spaceAfter=2)
body = S("Body", fontSize=9.5, leading=15, textColor=MID_GRAY,
          fontName="Helvetica", spaceAfter=4)
body_dark = S("BodyDark", fontSize=9.5, leading=15, textColor=DARK_GRAY,
               fontName="Helvetica", spaceAfter=4)
bullet = S("Bullet", fontSize=9.5, leading=14, textColor=MID_GRAY,
            fontName="Helvetica", leftIndent=12, spaceAfter=2,
            bulletIndent=4)
code_style = S("Code", fontSize=8.5, leading=13, textColor=colors.HexColor("#1a1a1a"),
                fontName="Courier", backColor=BG_LIGHT, leftIndent=8,
                rightIndent=8, spaceBefore=4, spaceAfter=4)
label_s = S("Label", fontSize=8, leading=11, textColor=LIGHT_GRAY,
             fontName="Helvetica", spaceAfter=1)
section_num = S("SNum", fontSize=9, leading=12, textColor=LIGHT_GRAY,
                 fontName="Helvetica", spaceAfter=0)
toc_s = S("TOC", fontSize=10, leading=16, textColor=DARK_GRAY,
           fontName="Helvetica", leftIndent=0)
toc_sub = S("TOCSub", fontSize=9, leading=14, textColor=MID_GRAY,
             fontName="Helvetica", leftIndent=12)
caption = S("Cap", fontSize=8, leading=11, textColor=LIGHT_GRAY,
             fontName="Helvetica", alignment=TA_CENTER, spaceAfter=6)
right_s = S("Right", fontSize=8, leading=11, textColor=LIGHT_GRAY,
              fontName="Helvetica", alignment=TA_RIGHT)

# ── Helpers ──────────────────────────────────────────────────────────────────
def HR(color=BORDER, thickness=0.5, space=6):
    return HRFlowable(width="100%", thickness=thickness, color=color,
                      spaceAfter=space, spaceBefore=space)

def chip_table(items, bg=BG_LIGHT, fg=DARK_GRAY):
    """Render a row of small chips."""
    cells = [[Paragraph(i, S("chip", fontSize=8, leading=11, textColor=fg,
                              fontName="Helvetica-Bold"))] for i in items]
    t = Table([cells[i:i+6] for i in range(0, len(cells), 6)],
              hAlign="LEFT")
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), bg),
        ("BOX",        (0,0), (-1,-1), 0.4, BORDER),
        ("INNERGRID",  (0,0), (-1,-1), 0.3, BORDER),
        ("TOPPADDING",    (0,0), (-1,-1), 3),
        ("BOTTOMPADDING", (0,0), (-1,-1), 3),
        ("LEFTPADDING",   (0,0), (-1,-1), 6),
        ("RIGHTPADDING",  (0,0), (-1,-1), 6),
        ("ALIGN",         (0,0), (-1,-1), "CENTER"),
    ]))
    return t

def two_col(left_items, right_items):
    """Two-column layout using a Table."""
    rows = max(len(left_items), len(right_items))
    data = []
    for i in range(rows):
        l = left_items[i] if i < len(left_items) else Spacer(1,1)
        r = right_items[i] if i < len(right_items) else Spacer(1,1)
        data.append([l, r])
    t = Table(data, colWidths=[(W - 2*MARGIN)*0.49]*2, hAlign="LEFT")
    t.setStyle(TableStyle([
        ("VALIGN",        (0,0),(-1,-1), "TOP"),
        ("LEFTPADDING",   (0,0),(-1,-1), 0),
        ("RIGHTPADDING",  (0,0),(-1,-1), 4),
        ("TOPPADDING",    (0,0),(-1,-1), 0),
        ("BOTTOMPADDING", (0,0),(-1,-1), 0),
    ]))
    return t

def info_table(rows_data, col_widths=None):
    """Key-value table."""
    if col_widths is None:
        col_widths = [52*mm, (W - 2*MARGIN - 52*mm)]
    data = [[Paragraph(k, label_s), Paragraph(v, body_dark)] for k,v in rows_data]
    t = Table(data, colWidths=col_widths, hAlign="LEFT")
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), BG_LIGHT),
        ("BOX",           (0,0), (-1,-1), 0.5, BORDER),
        ("INNERGRID",     (0,0), (-1,-1), 0.3, BORDER),
        ("TOPPADDING",    (0,0), (-1,-1), 5),
        ("BOTTOMPADDING", (0,0), (-1,-1), 5),
        ("LEFTPADDING",   (0,0), (-1,-1), 8),
        ("RIGHTPADDING",  (0,0), (-1,-1), 8),
        ("VALIGN",        (0,0), (-1,-1), "TOP"),
    ]))
    return t

def section_header(number, title):
    return [
        Paragraph(f"SECTION {number}", section_num),
        Paragraph(title, h1),
        HR(BLACK, 1, 8),
    ]

def sub_header(title):
    return [Paragraph(title, h2)]

def b(text): return f"<b>{text}</b>"
def i(text): return f"<i>{text}</i>"
def code(text): return f"<font name='Courier'>{text}</font>"

# ── Cover page ────────────────────────────────────────────────────────────────
def cover_page():
    # Dark cover using a full-width table
    cover_data = [[
        Paragraph("PORTFOLIO WEBSITE", cover_meta),
        Paragraph("Technical Report", cover_meta),
    ]]
    top_bar = Table(cover_data, colWidths=[(W-2*MARGIN)*0.6, (W-2*MARGIN)*0.4])
    top_bar.setStyle(TableStyle([
        ("TEXTCOLOR", (0,0),(-1,-1), LIGHT_GRAY),
        ("ALIGN",     (1,0),(1,0),   "RIGHT"),
        ("TOPPADDING",    (0,0),(-1,-1), 0),
        ("BOTTOMPADDING", (0,0),(-1,-1), 0),
        ("LEFTPADDING",   (0,0),(-1,-1), 0),
        ("RIGHTPADDING",  (0,0),(-1,-1), 0),
    ]))

    hero = Table([[
        Paragraph("Damindu<br/>Abeygunasekara", cover_name),
    ]], colWidths=[W - 2*MARGIN])
    hero.setStyle(TableStyle([
        ("BACKGROUND",    (0,0),(-1,-1), BG_DARK),
        ("TOPPADDING",    (0,0),(-1,-1), 18),
        ("BOTTOMPADDING", (0,0),(-1,-1), 18),
        ("LEFTPADDING",   (0,0),(-1,-1), 16),
        ("RIGHTPADDING",  (0,0),(-1,-1), 16),
        ("BOX",           (0,0),(-1,-1), 0, BG_DARK),
    ]))

    meta_rows = [
        ("URL",         "Portfolio Website — Next.js / React"),
        ("Author",      "Damindu Abeygunasekara"),
        ("University",  "University of Kelaniya — BSc Computer Science"),
        ("Email",       "daminduprasadith05@gmail.com"),
        ("GitHub",      "github.com/daminduAb"),
        ("Medium",      "medium.com/@adaminduprasadith"),
        ("Date",        datetime.now().strftime("%B %d, %Y")),
        ("Version",     "1.0"),
    ]

    return [
        Spacer(1, 8*mm),
        top_bar,
        Spacer(1, 6*mm),
        hero,
        Spacer(1, 8*mm),
        Paragraph("A complete technical breakdown of architecture, components,<br/>"
                  "interactions, and design decisions behind the portfolio.", body),
        Spacer(1, 6*mm),
        info_table(meta_rows),
        Spacer(1, 10*mm),
        HR(BLACK, 1),
        PageBreak(),
    ]

# ── Table of Contents ─────────────────────────────────────────────────────────
def toc():
    entries = [
        ("1", "Project Overview",           "3"),
        ("",  "Purpose · Tech Stack · Stack Diagram", ""),
        ("2", "File & Folder Architecture", "4"),
        ("",  "Directory tree · Key files", ""),
        ("3", "Boot Sequence — BootLoader",  "5"),
        ("",  "Phases · CONFIRM flow · Hacking animation", ""),
        ("4", "Main Page (page.tsx)",        "6"),
        ("",  "Profile mode · Projects mode · State management", ""),
        ("5", "3D Room — ThreeWorld.tsx",    "8"),
        ("",  "Scene graph · Components · Lighting · Interactivity", ""),
        ("6", "UI Components",               "10"),
        ("",  "Navbar · ThemeToggle · PortfolioChatbot · ExperienceItem", ""),
        ("7", "Supplementary Components",    "12"),
        ("",  "GithubGraph · TechStack · NeuralNetworkSim", ""),
        ("8", "Blog / Writings Section",     "13"),
        ("",  "Medium integration · Article list", ""),
        ("9", "Styling & Animation",         "14"),
        ("",  "Tailwind · Framer Motion · Dark mode", ""),
        ("10","Performance & Deployment",    "15"),
        ("",  "Next.js optimisations · Build · Vercel", ""),
    ]
    items = []
    for num, title, page in entries:
        if num:
            row = Table([[
                Paragraph(f"{num}.  {b(title)}", toc_s),
                Paragraph(page, right_s),
            ]], colWidths=[(W-2*MARGIN)*0.88, (W-2*MARGIN)*0.12])
            row.setStyle(TableStyle([
                ("LEFTPADDING",   (0,0),(-1,-1), 0),
                ("RIGHTPADDING",  (0,0),(-1,-1), 0),
                ("TOPPADDING",    (0,0),(-1,-1), 1),
                ("BOTTOMPADDING", (0,0),(-1,-1), 1),
            ]))
            items.append(row)
        else:
            items.append(Paragraph(title, toc_sub))
        items.append(Spacer(1, 1))
    return (
        section_header("—", "Table of Contents") +
        items +
        [PageBreak()]
    )

# ── Section 1 — Overview ──────────────────────────────────────────────────────
def section_overview():
    tech_stack = [
        ("Framework",  "Next.js 14 (App Router)"),
        ("Language",   "TypeScript"),
        ("Styling",    "Tailwind CSS v3"),
        ("Animation",  "Framer Motion"),
        ("3D Engine",  "Three.js via React Three Fiber + Drei"),
        ("Chatbot",    "Custom AI assistant (PortfolioChatbot)"),
        ("Theme",      "next-themes (dark / light)"),
        ("QR Code",    "qrcode.react"),
        ("Icons",      "lucide-react · react-icons"),
        ("Hosting",    "Vercel (recommended)"),
    ]
    return (
        section_header("1", "Project Overview") +
        [
        Paragraph("Damindu Abeygunasekara's portfolio is a "
                  f"{b('single-page Next.js 14 application')} that combines a cinematic "
                  "3D room, an interactive terminal boot sequence, an AI chatbot, "
                  "and a macOS-inspired profile layout into one cohesive experience.", body),
        Spacer(1,4),
        Paragraph(b("Goals"), h3),
        Paragraph("· Showcase projects, skills, and writings in a memorable, interactive way.", bullet),
        Paragraph("· Provide a professional, scannable CV-style profile.", bullet),
        Paragraph("· Demonstrate frontend engineering depth (Three.js, Framer Motion, "
                  "Web Audio API, custom hooks).", bullet),
        Spacer(1,6),
        Paragraph(b("Core Tech Stack"), h3),
        info_table(tech_stack),
        Spacer(1,8),
        Paragraph(b("High-Level Data Flow"), h3),
        Paragraph("The application runs entirely client-side after the initial server render. "
                  "On first load the BootLoader intercepts the viewport. Once the user types "
                  f"{code('CONFIRM')}, the main page is revealed. All subsequent navigation "
                  "(Profile ↔ Projects) is handled by React state — no page reloads.", body),
        PageBreak(),
        ]
    )

# ── Section 2 — Architecture ──────────────────────────────────────────────────
def section_arch():
    tree = [
        ("app/", "Next.js App Router root"),
        ("  page.tsx", "Main entry — all profile & project UI"),
        ("  layout.tsx", "Root layout — font, meta, providers"),
        ("  providers.tsx", "ThemeProvider wrapper (next-themes)"),
        ("  components/", "All reusable UI components"),
        ("    BootLoader.tsx", "Interactive terminal preloader"),
        ("    ThreeWorld.tsx", "Full 3D room scene (Three.js / R3F)"),
        ("    PortfolioChatbot.tsx", "Floating AI chat assistant"),
        ("    ThemeToggle.tsx", "Sun/Moon icon button in navbar"),
        ("    ExperienceItem.tsx", "Collapsible experience card"),
        ("    GithubGraph.tsx", "GitHub contribution heatmap"),
        ("    TechStack.tsx", "Animated tech logo grid"),
        ("    NeuralNetworkSim.tsx", "Animated neural network canvas"),
        ("public/", "Static assets (images, audio)"),
        ("  my.png", "Profile photo"),
        ("  casua*.jpg", "Gallery images (12 photos)"),
        ("  trackk.mp3", "Lofi background audio"),
        ("  *.mp4 / *.png", "Project media"),
    ]
    return (
        section_header("2", "File & Folder Architecture") +
        [
        Paragraph("The project follows Next.js 14 App Router conventions. "
                  "All components live in app/components/ and are imported "
                  "directly into page.tsx.", body),
        Spacer(1,4),
        info_table(tree, col_widths=[68*mm, W - 2*MARGIN - 68*mm]),
        Spacer(1,8),
        Paragraph(b("Key Architectural Decisions"), h3),
        Paragraph(f"· {b('App Router')} — server components at the layout level; "
                  "page.tsx is a client component (\"use client\").", bullet),
        Paragraph(f"· {b('Single page, dual mode')} — Profile and Projects live in "
                  "the same component, toggled by a React state variable.", bullet),
        Paragraph(f"· {b('No external state library')} — useState + useRef + "
                  "useEffect cover all state needs.", bullet),
        Paragraph(f"· {b('No database')} — All content is hardcoded in TypeScript "
                  "data arrays (projects, articles).", bullet),
        PageBreak(),
        ]
    )

# ── Section 3 — BootLoader ────────────────────────────────────────────────────
def section_boot():
    phases = [
        ("Phase 1 — Boot lines",
         "8 pre-defined strings are appended to state one by one on a 260 ms interval, "
         "simulating a Linux kernel boot. Each line with [OK] renders in green."),
        ("Phase 2 — CONFIRM prompt",
         "After the last boot line, a 600 ms delay fires, then phase switches to 'prompt'. "
         "A yellow ASCII border box appears asking the user to type CONFIRM. "
         "An <input> receives focus automatically."),
        ("Phase 3 — Hacking animation",
         "On form submit the input is compared (case-insensitive) to 'CONFIRM'. "
         "Wrong input: the form shakes (x-axis keyframes) and shows a red bash error. "
         "Correct input: phase switches to 'hacking'. 15 lines of simulated shell "
         "commands (sudo access, AES decrypt, ./inject) are appended at 110 ms intervals."),
        ("Phase 4 — Exit",
         "After the last hack line, a 600 ms pause triggers setExiting(true), "
         "which animates the container to opacity:0 + scale:1.04 over 700 ms, "
         "then calls onFinish() — setting booted=true in page.tsx, "
         "which removes the BootLoader and reveals the portfolio."),
    ]
    return (
        section_header("3", "Boot Sequence — BootLoader.tsx") +
        [
        Paragraph("The BootLoader is a fullscreen fixed overlay (z-index 200) rendered "
                  "before the portfolio when booted===false. It creates an immersive "
                  "hacker-terminal first impression.", body),
        Spacer(1,4),
        ] +
        [item
         for title, desc in phases
         for item in [
             Paragraph(b(title), h3),
             Paragraph(desc, body),
             Spacer(1,3),
         ]] +
        [
        Paragraph(b("Visual Design Elements"), h3),
        Paragraph("· CSS scanline overlay — repeating-linear-gradient every 4px creates CRT effect.", bullet),
        Paragraph("· ASCII logo — large DAMINDU text rendered in a <pre> block, hidden on mobile.", bullet),
        Paragraph("· Monospace font — entire component uses font-mono (Courier New).", bullet),
        Paragraph("· Color coding — green = OK lines, yellow = prompt border, white = GRANTED, red = error.", bullet),
        Paragraph("· Auto-scroll — useRef + scrollIntoView keeps the latest line visible.", bullet),
        Spacer(1,4),
        Paragraph(b("State Variables"), h3),
        info_table([
            ("phase",     "'booting' | 'prompt' | 'hacking' | 'done'"),
            ("bootLines", "string[] — lines shown during boot phase"),
            ("hackLines", "string[] — lines shown during hacking phase"),
            ("input",     "string — controlled input value"),
            ("shake",     "boolean — triggers x-axis shake animation on wrong input"),
            ("exiting",   "boolean — triggers fade-out animation before onFinish()"),
        ]),
        PageBreak(),
        ]
    )

# ── Section 4 — page.tsx ──────────────────────────────────────────────────────
def section_page():
    states = [
        ("booted",          "boolean — false until BootLoader calls onFinish()"),
        ("mode",            "'profile' | 'projects' — which view is active"),
        ("time",            "string — IST clock updated every 1 s via setInterval"),
        ("showQR",          "boolean — QR code modal visibility"),
        ("showEasterEgg",   "boolean — starfield + blue aura overlay toggle"),
        ("selectedProject", "Project | null — opens project detail modal"),
        ("hoveredProject",  "number | null — card hover highlight"),
        ("isLofiPlaying",   "boolean — lofi audio play state"),
        ("lofiVolume",      "number 0–1 — audio volume from range slider"),
    ]
    return (
        section_header("4", "Main Page — page.tsx") +
        [
        Paragraph("page.tsx is the central client component (~1 040 lines). "
                  "It manages all global state, renders both views, "
                  "and hosts the navbar, modals, and chatbot.", body),
        Spacer(1,4),
        Paragraph(b("State Management"), h3),
        info_table(states),
        Spacer(1,8),
        Paragraph(b("Profile Mode"), h3),
        Paragraph("The profile view is a 680px-wide centered column styled after macOS "
                  "app aesthetics — minimal color, generous whitespace, hairline dividers.", body),
        Paragraph("Sections (top to bottom):", body_dark),
        Paragraph("1. Header — 72px round avatar + name + role + status dot + IST clock + lofi player", bullet),
        Paragraph("2. Bio — two short paragraphs about background and goals", bullet),
        Paragraph("3. NeuralNetworkSim — animated canvas neural network", bullet),
        Paragraph("4. Experience — three ExperienceItem collapsible entries", bullet),
        Paragraph("5. In Between — bordered card with personal interests", bullet),
        Paragraph("6. Education — single row (University of Kelaniya)", bullet),
        Paragraph("7. GitHub Contributions — GithubGraph heatmap", bullet),
        Paragraph("8. Tech Stack — TechStack animated logo grid", bullet),
        Paragraph("9. Writings — 9 real Medium articles as list rows (date · title · tag)", bullet),
        Paragraph("10. Gallery — infinite-scroll strip of 12 grayscale photos", bullet),
        Paragraph("11. Contact — five social/email links as list rows", bullet),
        Spacer(1,6),
        Paragraph(b("Projects Mode"), h3),
        Paragraph("A CSS grid (1–3 columns responsive) of project cards. "
                  "Each card shows: category badge, thumbnail area, title, "
                  "short description, tech icons, stats grid, and GitHub/Demo links. "
                  "Clicking opens a full modal with a video/image hero.", body),
        Paragraph("Projects: Blockchain Voting System · E-Commerce Platform · "
                  "Eco Green Platform · WhatsApp AI Shop Agent", body),
        Spacer(1,6),
        Paragraph(b("Easter Egg"), h3),
        Paragraph("Clicking the profile avatar toggles showEasterEgg. "
                  "When active: a blue inset shadow covers the viewport edges, "
                  "and 50 twinkling star dots (randomised position, duration, delay) "
                  "are rendered as fixed absolutely-positioned divs.", body),
        Spacer(1,6),
        Paragraph(b("Lofi Player"), h3),
        Paragraph("An HTMLAudioElement is created lazily on first play "
                  "(stored in a useRef to survive re-renders). "
                  "It loops /public/trackk.mp3. Volume is controlled by "
                  "a range input that slides in/out with an AnimatePresence transition.", body),
        PageBreak(),
        ]
    )

# ── Section 5 — ThreeWorld ────────────────────────────────────────────────────
def section_three():
    components = [
        ("RoomShell",      "14×7×14 unit box (BackSide) = walls/ceiling/floor. "
                           "Ceiling light panel, 5 neon wall strips."),
        ("NeonPillars",    "4 corner pillars, each a different accent color "
                           "(cyan/purple/green/pink) with a sphere cap and a pointLight."),
        ("Platform",       "Cylinder under the desk with a glowing torus ring edge."),
        ("Rug",            "Flat box under the desk area with faint blue emissive glow."),
        ("Chair",          "Box seat + backrest + 4 cylinder legs + neon strip on backrest."),
        ("Desk",           "Wide box surface with 4 leg meshes and a front edge glow strip."),
        ("MainMonitor",    "Bezel box + screen plane + Html overlay (ScreenContent) + "
                           "stand neck/base. pointLight pulses the screen color."),
        ("SideMonitor",    "Smaller rotated monitor showing a simulated terminal "
                           "with git status output via Html."),
        ("Plant",          "Pot cylinder + 5 sphere leaves, slowly sways via useFrame."),
        ("MousePad",       "Box pad + mouse box + thin emissive scroll-wheel line."),
        ("Keyboard",       "Box body + 3 translucent key-row planes."),
        ("Bookshelf",      "Frame box + 4 shelves + up to 12 colored book meshes."),
        ("WallArtPanel",   "Thin emissive box on wall, pulses emissiveIntensity in useFrame."),
        ("FloatingOrbs",   "4 orbs (sphere + torus ring + pointLight), each bobbing "
                           "on a sin wave via useFrame."),
        ("HologramPanel",  "RoundedBox + Float + Html button — 3 panels (About/Skills/Projects). "
                           "Clicking sets activePanel state → changes ScreenContent."),
    ]
    return (
        section_header("5", "3D Room — ThreeWorld.tsx") +
        [
        Paragraph("ThreeWorld.tsx renders a fully interactive 3D room using "
                  f"{b('React Three Fiber')} (R3F) — a React renderer for Three.js. "
                  "The Canvas component from R3F replaces the standard Three.js "
                  "setup/render loop boilerplate.", body),
        Spacer(1,4),
        Paragraph(b("Canvas Setup"), h3),
        info_table([
            ("camera",   "position [0, 2.5, 9], fov 50"),
            ("shadows",  "enabled — shadow-mapSize 2048×2048 on spotLight"),
            ("fog",      "linear fog #010b18, near 10, far 26"),
            ("background","color #010b18 (near-black)"),
        ]),
        Spacer(1,6),
        Paragraph(b("Lighting"), h3),
        Paragraph("· ambientLight — 0.3 intensity, blue tint (#1e40af)", bullet),
        Paragraph("· hemisphereLight — sky #60a5fa / ground #010b18", bullet),
        Paragraph("· spotLight — ceiling position [0,8,1], angle 0.38, penumbra 1, "
                  "intensity 40, casts shadows", bullet),
        Paragraph("· 4 accent pointLights — purple/green/pink/blue at room corners", bullet),
        Paragraph("· Per-object pointLights on NeonPillars and FloatingOrbs", bullet),
        Paragraph("· Desk lamp warm pointLight (#fef3c7)", bullet),
        Spacer(1,6),
        Paragraph(b("Scene Components"), h3),
        info_table(components, col_widths=[44*mm, W - 2*MARGIN - 44*mm]),
        Spacer(1,6),
        Paragraph(b("Interactivity"), h3),
        Paragraph("Three HologramPanel components each have an onClick handler that "
                  "calls setActivePanel(panelKey). The activePanel state is passed down "
                  "to the Computer component → MainMonitor → ScreenContent, which "
                  "renders one of three HTML panels (About / Skills / Projects) "
                  "inside an R3F <Html transform> overlay.", body),
        Spacer(1,4),
        Paragraph(b("Drei Helpers Used"), h3),
        chip_table(["ContactShadows","Float","Grid","Html","OrbitControls",
                    "RoundedBox","Sparkles","Text"]),
        Spacer(1,6),
        Paragraph(b("OrbitControls"), h3),
        info_table([
            ("autoRotate",     "true — speed 0.3"),
            ("minDistance",    "5  /  maxDistance: 10"),
            ("minPolarAngle",  "PI/3.8  (can't look below desk)"),
            ("maxPolarAngle",  "PI/2.1  (can't go underground)"),
            ("enablePan",      "false"),
        ]),
        PageBreak(),
        ]
    )

# ── Section 6 — UI Components ─────────────────────────────────────────────────
def section_ui():
    return (
        section_header("6", "UI Components") +
        [
        # Navbar
        Paragraph(b("Navbar"), h2),
        Paragraph("Fixed bottom-center floating pill — glass morphism style "
                  "(backdrop-blur-xl, bg-white/80 dark:bg-zinc-900/85, subtle border).", body),
        Paragraph("Contains (left to right):", body_dark),
        Paragraph("· Profile button — fills black when mode==='profile'", bullet),
        Paragraph("· Projects button — fills black when mode==='projects'", bullet),
        Paragraph("· Separator line", bullet),
        Paragraph("· Social links — GitHub, LinkedIn, X, Medium (SVG), Discord", bullet),
        Paragraph("· Separator line", bullet),
        Paragraph("· QR button — opens resume QR modal", bullet),
        Paragraph("· ThemeToggle — Sun/Moon icon", bullet),
        Spacer(1,6),

        # ThemeToggle
        Paragraph(b("ThemeToggle"), h2),
        Paragraph("A 32×32 px icon button inside the navbar. Uses next-themes "
                  "useTheme() hook. Renders Sun icon in dark mode, Moon in light mode. "
                  "Skips render until mounted (avoids hydration mismatch).", body),
        Spacer(1,6),

        # Chatbot
        Paragraph(b("PortfolioChatbot"), h2),
        Paragraph("Floating chat assistant positioned bottom-left (bottom-6 left-6). "
                  "Built entirely from scratch — no external chat SDK.", body),
        Paragraph(b("Sub-components:"), h3),
        Paragraph("· TypewriterText — character-by-character typing with a blinking cursor "
                  "(18 ms interval)", bullet),
        Paragraph("· ToneRipple — 3 concentric animated rings that pulse on open", bullet),
        Paragraph("· ThinkingDots — 3 bouncing dots shown while waiting for reply", bullet),
        Spacer(1,3),
        Paragraph(b("State:"), h3),
        info_table([
            ("isOpen",      "boolean — chat window visible"),
            ("isMinimized", "boolean — collapsed to header bar only"),
            ("messages",    "Message[] — chat history"),
            ("hasUnread",   "boolean — notification dot on button"),
            ("ripple",      "boolean — triggers ToneRipple on open"),
        ]),
        Spacer(1,3),
        Paragraph(b("Audio:"), h3),
        Paragraph("Uses Web Audio API (no audio files). playSendSound() creates a "
                  "short ascending sine wave (440→880 Hz, 180 ms). "
                  "playReceiveSound() creates two soft pings at 880 and 1046 Hz.", body),
        Spacer(1,3),
        Paragraph(b("Chat Window:"), h3),
        Paragraph("Max-height animates between 64px (minimized) and 400px (open) "
                  "via CSS transition. Frosted glass background "
                  "(backdrop-blur-xl). Message bubbles: user = black/white, "
                  "assistant = gray.", body),
        Spacer(1,6),

        # ExperienceItem
        Paragraph(b("ExperienceItem"), h2),
        Paragraph("Collapsible section used for Experience entries. "
                  "Props: title, role, collapsible (boolean), link (optional URL). "
                  "When collapsible=true, an expand/collapse arrow toggles a children div "
                  "with a smooth height animation via Framer Motion AnimatePresence.", body),
        PageBreak(),
        ]
    )

# ── Section 7 — Supplementary Components ─────────────────────────────────────
def section_supp():
    return (
        section_header("7", "Supplementary Components") +
        [
        Paragraph(b("GithubGraph"), h2),
        Paragraph("Fetches GitHub contribution data for user daminduAb and renders "
                  "a heatmap calendar grid (similar to GitHub's contribution chart). "
                  "Uses the react-activity-calendar library.", body),
        Spacer(1,6),

        Paragraph(b("TechStack"), h2),
        Paragraph("An animated grid of technology logos. Each logo is rendered as "
                  "an SVG icon from react-icons. Logos include: React, Next.js, "
                  "TypeScript, Tailwind CSS, Three.js, Python, FastAPI, MongoDB, "
                  "Solidity, Node.js, Supabase, MySQL, Stripe, OpenAI, and more.", body),
        Paragraph("Hover interaction: individual logos scale up or glow on hover "
                  "using Framer Motion whileHover.", body),
        Spacer(1,6),

        Paragraph(b("NeuralNetworkSim"), h2),
        Paragraph("An HTML5 Canvas animation that draws an animated neural network "
                  "topology — nodes connected by weighted edges. "
                  "Each frame uses requestAnimationFrame to update node pulse states "
                  "and edge opacity, creating a living network visualization. "
                  "Rendered between the bio section and experience on the profile page.", body),
        PageBreak(),
        ]
    )

# ── Section 8 — Blog ──────────────────────────────────────────────────────────
def section_blog():
    articles = [
        ("Jun 2025", "AI / LLM",    "Fine-tuning vs RAG: Stop Guessing, Start Choosing Wisely"),
        ("Jun 2025", "AI / LLM",    "Attention Is All You Need — But Do You Actually Understand It?"),
        ("May 2025", "Python",      "Learn SOLID Principles in 2 Hours — Complete Beginner Guide"),
        ("May 2025", "ML",          "What even is a machine learning model?"),
        ("Apr 2025", "Web Dev",     "Build Full-Stack Web Apps with the MERN Stack"),
        ("Apr 2025", "DevOps",      "Monorepo in GitHub"),
        ("Apr 2025", "DevOps",      "Jenkins Made Simple: A Beginner-Friendly Guide for Developers"),
        ("Apr 2025", "Python",      "FastAPI: Build Lightning-Fast APIs with Minimal Code"),
        ("Apr 2025", "Architecture","Microservices Made Simple: A Beginner-Friendly Guide"),
    ]
    tbl_data = [["Date", "Tag", "Title"]] + articles
    tbl = Table(tbl_data, colWidths=[22*mm, 28*mm, W - 2*MARGIN - 50*mm], hAlign="LEFT")
    tbl.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,0),  DARK_GRAY),
        ("TEXTCOLOR",     (0,0), (-1,0),  WHITE),
        ("FONTNAME",      (0,0), (-1,0),  "Helvetica-Bold"),
        ("FONTSIZE",      (0,0), (-1,-1), 8.5),
        ("LEADING",       (0,0), (-1,-1), 13),
        ("BACKGROUND",    (0,1), (-1,-1), BG_LIGHT),
        ("ROWBACKGROUNDS",(0,1), (-1,-1), [WHITE, BG_LIGHT]),
        ("BOX",           (0,0), (-1,-1), 0.5, BORDER),
        ("INNERGRID",     (0,0), (-1,-1), 0.3, BORDER),
        ("TOPPADDING",    (0,0), (-1,-1), 5),
        ("BOTTOMPADDING", (0,0), (-1,-1), 5),
        ("LEFTPADDING",   (0,0), (-1,-1), 7),
        ("RIGHTPADDING",  (0,0), (-1,-1), 7),
        ("TEXTCOLOR",     (0,1), (-1,-1), MID_GRAY),
        ("TEXTCOLOR",     (2,1), (-1,-1), DARK_GRAY),
    ]))
    return (
        section_header("8", "Blog / Writings Section") +
        [
        Paragraph("The Writings section fetches no data at runtime — all 9 articles "
                  "are hardcoded as a TypeScript array. Each entry links directly "
                  "to the Medium article URL. The section uses a macOS list-row style: "
                  "date left · title center · tag right, separated by hairline dividers.", body),
        Spacer(1,6),
        Paragraph(b("Medium Profile:"), h3),
        Paragraph("medium.com/@adaminduprasadith", code_style),
        Spacer(1,6),
        Paragraph(b("Article List"), h3),
        tbl,
        PageBreak(),
        ]
    )

# ── Section 9 — Styling & Animation ──────────────────────────────────────────
def section_style():
    return (
        section_header("9", "Styling & Animation") +
        [
        Paragraph(b("Tailwind CSS"), h2),
        Paragraph("All styles are utility-first Tailwind classes. No custom CSS files "
                  "except globals.css (which defines the animate-infinite-scroll keyframe "
                  "for the gallery strip).", body),
        Paragraph("Dark mode uses the class strategy — a dark class on <html> toggles "
                  "all dark: prefixed utilities. next-themes manages this automatically.", body),
        Spacer(1,6),

        Paragraph(b("Framer Motion"), h2),
        Paragraph("Used throughout for:", body_dark),
        Paragraph("· Page transitions — AnimatePresence + motion.main with "
                  "opacity/y enter/exit on mode switch", bullet),
        Paragraph("· Card hover — whileHover={{ y: -4 }} on project cards", bullet),
        Paragraph("· BootLoader shake — animate={{ x: [0,-8,8,-6,6,0] }} on wrong CONFIRM", bullet),
        Paragraph("· Chatbot window — spring damping 22/stiffness 200 open/close", bullet),
        Paragraph("· Easter egg stars — individual opacity/scale ping animations", bullet),
        Paragraph("· Lofi volume slider — width 0→48 AnimatePresence slide", bullet),
        Spacer(1,6),

        Paragraph(b("Dark Mode System"), h2),
        info_table([
            ("Provider",   "ThemeProvider from next-themes wraps the app in providers.tsx"),
            ("Strategy",   "class — adds dark class to <html>"),
            ("Toggle",     "ThemeToggle component in navbar — Sun ↔ Moon icon"),
            ("Persistence","next-themes stores preference in localStorage automatically"),
            ("SSR",        "useTheme returns undefined on server; mounted state guards the render"),
        ]),
        Spacer(1,6),

        Paragraph(b("Infinite Gallery Scroll"), h2),
        Paragraph("The photo gallery uses a CSS animation defined in globals.css:", body),
        Paragraph("@keyframes infinite-scroll { from { transform: translateX(0); } "
                  "to { transform: translateX(-50%); } }", code_style),
        Paragraph("The image list is duplicated (images + images) so the loop "
                  "is seamless. A mask-image linear-gradient fades the edges.", body),
        PageBreak(),
        ]
    )

# ── Section 10 — Performance & Deployment ─────────────────────────────────────
def section_perf():
    return (
        section_header("10", "Performance & Deployment") +
        [
        Paragraph(b("Next.js Optimisations"), h2),
        Paragraph(f"· {b('next/image')} — all images use the Image component "
                  "for automatic WebP conversion, lazy loading, and size optimisation.", bullet),
        Paragraph(f"· {b('Dynamic imports')} — ThreeWorld is conditionally rendered "
                  "only when the 3D room section is visible; R3F uses Suspense fallback.", bullet),
        Paragraph(f"· {b('Font')} — system fonts via Tailwind (font-sans, font-mono) "
                  "— no external font download.", bullet),
        Paragraph(f"· {b('Client components')} — only page.tsx and components that need "
                  "browser APIs are marked 'use client'. Layout is a server component.", bullet),
        Spacer(1,6),

        Paragraph(b("Build"), h2),
        Paragraph("npm run build — Next.js 14 static + SSR hybrid.", body),
        Paragraph("npm run dev — local dev server on localhost:3000.", body),
        Spacer(1,6),

        Paragraph(b("Recommended Deployment — Vercel"), h2),
        Paragraph("1. Push to GitHub repository.", bullet),
        Paragraph("2. Import repository in Vercel dashboard.", bullet),
        Paragraph("3. Framework preset: Next.js (auto-detected).", bullet),
        Paragraph("4. No environment variables required.", bullet),
        Paragraph("5. Vercel auto-deploys on every git push to main.", bullet),
        Spacer(1,8),

        Paragraph(b("Summary"), h2),
        Paragraph("Damindu's portfolio is a technically sophisticated single-page "
                  "application that blends a cinematic 3D environment, "
                  "a terminal preloader with user interaction, "
                  "a macOS-inspired profile layout, an AI chatbot, "
                  "and a complete writings section — all built with "
                  "Next.js 14, TypeScript, Tailwind CSS, Framer Motion, "
                  "and React Three Fiber.", body),
        Spacer(1,6),
        HR(BLACK, 1),
        Spacer(1,4),
        Paragraph(f"Report generated on {datetime.now().strftime('%B %d, %Y at %H:%M')} "
                  f"· Damindu Abeygunasekara · daminduprasadith05@gmail.com",
                  caption),
        ]
    )

# ── Build PDF ─────────────────────────────────────────────────────────────────
def build():
    def on_page(canvas, doc):
        canvas.saveState()
        # Header bar
        canvas.setFillColor(BG_DARK)
        canvas.rect(0, H - 10*mm, W, 10*mm, fill=1, stroke=0)
        canvas.setFont("Helvetica", 7)
        canvas.setFillColor(LIGHT_GRAY)
        canvas.drawString(MARGIN, H - 6.5*mm, "Damindu Abeygunasekara — Portfolio Technical Report")
        canvas.drawRightString(W - MARGIN, H - 6.5*mm,
                               datetime.now().strftime("%Y"))
        # Footer
        canvas.setFillColor(BG_LIGHT)
        canvas.rect(0, 0, W, 8*mm, fill=1, stroke=0)
        canvas.setFillColor(LIGHT_GRAY)
        canvas.drawString(MARGIN, 3*mm, "Confidential — Personal Portfolio Documentation")
        canvas.drawRightString(W - MARGIN, 3*mm, f"Page {doc.page}")
        canvas.restoreState()

    doc = SimpleDocTemplate(
        OUTPUT,
        pagesize=A4,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=14*mm, bottomMargin=14*mm,
        title="Portfolio Technical Report — Damindu Abeygunasekara",
        author="Damindu Abeygunasekara",
        subject="Portfolio Website Documentation",
    )

    story = (
        cover_page() +
        toc() +
        section_overview() +
        section_arch() +
        section_boot() +
        section_page() +
        section_three() +
        section_ui() +
        section_supp() +
        section_blog() +
        section_style() +
        section_perf()
    )

    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
    print(f"PDF saved: {OUTPUT}")

build()
