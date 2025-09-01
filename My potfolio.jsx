import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Moon,
  Sun,
  Download,
  Search,
  MapPin,
  BookOpen,
  Star,
  ArrowUpRight,
  Layers,
  Link as LinkIcon,
  Filter,
  Sparkles,
  Rocket,
  GraduationCap,
  FileText,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";

/**
 * Advanced single-file React portfolio for Arnav Adarsh
 * - Tailwind CSS UI
 * - shadcn/ui components
 * - Framer Motion animations
 * - Recharts radar for skills
 * - Search + filterable projects grid with modal
 * - Dark/Light theme toggle (localStorage persisted)
 * - Section scroll-spy, smooth nav
 * - SEO tags + JSON-LD schema
 * - Download resume, external links
 *
 * NOTE: Replace any dummy images with your own if desired.
 */

// -----------------------------
// Theme utilities
// -----------------------------
const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "light";
    return localStorage.getItem("theme") || "light";
  });
  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);
  return { theme, setTheme } as const;
};

const Section = ({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) => (
  <section id={id} className={`scroll-mt-24 ${className}`}>{children}</section>
);

const useScrollSpy = (ids: string[]) => {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const handler = () => {
      const offsets = ids.map((id) => {
        const el = document.getElementById(id);
        if (!el) return { id, top: Number.MAX_SAFE_INTEGER };
        const rect = el.getBoundingClientRect();
        return { id, top: Math.abs(rect.top) };
      });
      offsets.sort((a, b) => a.top - b.top);
      setActive(offsets[0].id);
    };
    handler();
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, [ids]);
  return active;
};

// -----------------------------
// Data (edit to update content)
// -----------------------------
const LINKS = {
  email: "arnav94732@gmail.com",
  linkedin: "https://www.linkedin.com/in/arnav-adarsh-b5a0a3279/",
  github: "https://github.com/Arnav94732",
  resume: "/MY_Resume.pdf", // ensure this path/file is hosted with your site
};

const education = {
  school: "Kalinga Institute of Industrial Technology (KIIT)",
  location: "Bhubaneswar, Odisha",
  program: "B.Tech in Computer Science & Engineering",
  period: "Sep 2022 – Present",
  coursework: [
    "Data Structures",
    "Database Management",
    "Artificial Intelligence",
    "Machine Learning",
    "Deep Learning",
    "Data Mining",
  ],
};

const experience = [
  {
    title: "Research Intern",
    company: "KIIT University",
    period: "Jan 2024 – Present",
    bullets: [
      "Built an IoT-based student performance tracking system with real-time dashboards for early interventions.",
      "Led data collection, EDA, and visualization pipeline; implemented anomaly detection for at‑risk trends.",
      "Co-authored ICICC‑2025 paper: ‘A Smart Sensory Driven Model to Track Student Performance and Enhance Educational Outcome’.",
    ],
  },
];

const certifications = [
  { org: "Udemy", title: "The Complete Full-Stack Web Development by Angela Yu" },
  { org: "Coursera", title: "Ethical Decision Making for Success in the Tech Industry" },
  { org: "Coursera", title: "Business for Good: Fundamentals of Corporate Responsibility" },
  { org: "Coursera", title: "Developing a Winning Marketing Strategy" },
];

const publications = [
  {
    title:
      "A Smart Sensory Driven Model to Track Student Performance and Enhance Educational Outcome (ICICC‑2025)",
    link: "https://drive.google.com/file/d/1OUQz84eIlkrwCKr9k-RXNFzP6XeuaZSb/view",
  },
];

const skills = {
  languages: ["Python", "Java", "C++", "JavaScript", "HTML", "CSS", "SQL"],
  frameworks: ["React", "TensorFlow/Keras", "scikit-learn", "Pandas", "NumPy", "Matplotlib"],
  tools: ["Git", "VS Code", "Eclipse", "Hugging Face"],
};

const skillRadar = [
  { label: "Python", A: 92 },
  { label: "JavaScript", A: 80 },
  { label: "SQL", A: 76 },
  { label: "ML", A: 85 },
  { label: "DL", A: 70 },
  { label: "React", A: 78 },
];

const projectTags = {
  WEB: "Web",
  ML: "ML",
  SQL: "SQL",
  IOT: "IoT",
  JS: "JavaScript",
  PY: "Python",
};

type Project = {
  title: string;
  desc: string;
  stack: string[];
  tags: string[];
  links: { github?: string; demo?: string };
  highlights?: string[];
};

const projects: Project[] = [
  {
    title: "FraudSense",
    desc:
      "Data-driven financial anomaly detection. Managed severe class imbalance (0.2% fraud), compared classical ML and deep models, and delivered real-time scoring.",
    stack: ["Python", "XGBoost", "SMOTE", "scikit-learn", "Pandas", "NumPy", "Matplotlib"],
    tags: [projectTags.ML, projectTags.PY],
    links: { github: "https://github.com/Arnav94732/Fraud-Sense" },
    highlights: [
      "99.9% Accuracy, AUC 1.00 (simulation)",
      "< 5ms detection latency on GPU (Colab)",
    ],
  },
  {
    title: "Mini E‑Commerce",
    desc:
      "Feature‑complete mini storefront with product listings, cart management, and responsive UI.",
    stack: ["JavaScript", "HTML", "CSS"],
    tags: [projectTags.WEB, projectTags.JS],
    links: { github: "https://github.com/Arnav94732/Mini-E-Commerce" },
  },
  {
    title: "Student Performance Tracker",
    desc:
      "IoT‑driven analytics pipeline capturing sensory signals, surfacing anomalies via dashboards to support early interventions.",
    stack: ["IoT", "Python", "Data Visualization"],
    tags: [projectTags.IOT, projectTags.ML],
    links: { github: "#" },
  },
  {
    title: "Weather Application",
    desc:
      "Responsive weather app with geotargeted search and API integration; supports 1,500+ cities.",
    stack: ["JavaScript", "HTML", "CSS", "REST API"],
    tags: [projectTags.WEB, projectTags.JS],
    links: { github: "https://github.com/Arnav94732/Weather-Application", demo: "https://weather-application-vercel.vercel.app" },
  },
  {
    title: "SQL Music Store Analysis",
    desc: "Analytical SQL project uncovering listener behavior, trends, and performance via joins and window functions.",
    stack: ["SQL"],
    tags: [projectTags.SQL],
    links: { github: "https://github.com/Arnav94732/SQL_Music_Store_Analysis" },
  },
  {
    title: "Portfolio (v1)",
    desc: "First iteration of personal portfolio in JavaScript.",
    stack: ["JavaScript", "HTML", "CSS"],
    tags: [projectTags.WEB, projectTags.JS],
    links: { github: "https://github.com/Arnav94732/Portfolio" },
  },
];

// -----------------------------
// UI Helpers
// -----------------------------
const SectionHeading = ({ icon: Icon, children }: { icon?: any; children: React.ReactNode }) => (
  <div className="flex items-center gap-2">
    {Icon ? <Icon className="h-5 w-5" /> : null}
    <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{children}</h2>
  </div>
);

const Chip = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium">
    {children}
  </span>
);

// -----------------------------
// Components
// -----------------------------
const ThemeToggle: React.FC<{ theme: string; setTheme: (t: string) => void }> = ({ theme, setTheme }) => (
  <Button
    variant="ghost"
    className="rounded-2xl"
    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    aria-label="Toggle theme"
  >
    {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
  </Button>
);

const Navbar: React.FC<{ active: string; themeState: ReturnType<typeof useTheme> }> = ({ active, themeState }) => {
  const items = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "certs", label: "Certifications" },
    { id: "contact", label: "Contact" },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 backdrop-blur bg-white/70 dark:bg-gray-900/70 border-b">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Rocket className="h-5 w-5" />
          <span className="font-semibold">Arnav Adarsh</span>
        </div>
        <div className="hidden md:flex items-center gap-1">
          {items.map((it) => (
            <Button
              key={it.id}
              variant={active === it.id ? "default" : "ghost"}
              className="rounded-2xl"
              onClick={() => scrollTo(it.id)}
            >
              {it.label}
            </Button>
          ))}
          <a href={LINKS.resume} download className="ml-2">
            <Button className="rounded-2xl" variant="secondary">
              <Download className="h-4 w-4 mr-1" /> Resume
            </Button>
          </a>
          <ThemeToggle theme={themeState.theme} setTheme={themeState.setTheme} />
        </div>
        <div className="md:hidden flex items-center gap-2">
          <a href={LINKS.resume} download>
            <Button size="sm" variant="secondary" className="rounded-xl">
              <Download className="h-4 w-4" />
            </Button>
          </a>
          <ThemeToggle theme={themeState.theme} setTheme={themeState.setTheme} />
        </div>
      </div>
    </nav>
  );
};

const Hero: React.FC = () => (
  <Section id="home" className="pt-28">
    <div className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-8 items-center">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-extrabold tracking-tight"
        >
          Hi, I’m Arnav.
        </motion.h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          B.Tech CSE @ KIIT • Building with <strong>ML</strong>, <strong>Web</strong>, and <strong>Data</strong>.
          I love turning ideas into fast, delightful products.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={`mailto:${LINKS.email}`}>
            <Button className="rounded-2xl"><Mail className="h-4 w-4 mr-2" /> Email</Button>
          </a>
          <a href={LINKS.github} target="_blank" rel="noreferrer">
            <Button variant="outline" className="rounded-2xl"><Github className="h-4 w-4 mr-2" /> GitHub</Button>
          </a>
          <a href={LINKS.linkedin} target="_blank" rel="noreferrer">
            <Button variant="outline" className="rounded-2xl"><Linkedin className="h-4 w-4 mr-2" /> LinkedIn</Button>
          </a>
        </div>
        <div className="mt-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <MapPin className="h-4 w-4" /> Bhubaneswar, Odisha • Open to internships
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative"
      >
        <div className="aspect-square max-w-md mx-auto rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border shadow-inner" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="h-10 w-10" />
        </div>
      </motion.div>
    </div>
  </Section>
);

const About: React.FC = () => (
  <Section id="about" className="py-12">
    <div className="max-w-5xl mx-auto px-4">
      <SectionHeading icon={BookOpen}>About Me</SectionHeading>
      <p className="mt-4 leading-7 text-gray-700 dark:text-gray-300">
        I’m a Computer Science undergraduate passionate about building resilient, human‑centered software. My work spans
        <strong> machine learning</strong> (FraudSense), <strong>IoT analytics</strong> (Student Performance Tracker), and
        <strong> web applications</strong> (Mini E‑Commerce, Weather App). I enjoy moving from idea → prototype → polished product,
        with a focus on performance, accessibility, and impact.
      </p>
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <Card className="rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400"><Star className="h-4 w-4" /> Focus</div>
            <p className="mt-2 text-sm">ML systems, data visualization, and full‑stack web experiences.</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400"><Layers className="h-4 w-4" /> Stack</div>
            <p className="mt-2 text-sm">Python, JS/TS, React, SQL; scikit‑learn, XGBoost, TensorFlow, Tailwind.</p>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400"><Rocket className="h-4 w-4" /> Goal</div>
            <p className="mt-2 text-sm">Ship useful tools, learn continuously, and contribute to impactful teams.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  </Section>
);

const Skills: React.FC = () => (
  <Section id="skills" className="py-12">
    <div className="max-w-6xl mx-auto px-4">
      <SectionHeading icon={Sparkles}>Skills</SectionHeading>
      <div className="grid lg:grid-cols-2 gap-8 mt-6">
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <h3 className="font-semibold">Toolbox</h3>
            <div className="mt-4 grid md:grid-cols-3 gap-3 text-sm">
              <div>
                <h4 className="font-medium mb-1">Languages</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.languages.map((s) => (
                    <Chip key={s}>{s}</Chip>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-1">Frameworks</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.frameworks.map((s) => (
                    <Chip key={s}>{s}</Chip>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-1">Tools</h4>
                <div className="flex flex-wrap gap-2">
                  {skills.tools.map((s) => (
                    <Chip key={s}>{s}</Chip>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Proficiency Snapshot</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={skillRadar} cx="50%" cy="50%" outerRadius="80%">
                  <PolarGrid />
                  <PolarAngleAxis dataKey="label" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Skill" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </Section>
);

const ProjectCard: React.FC<{ p: Project; onOpen: (p: Project) => void }> = ({ p, onOpen }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
    <Card className="rounded-2xl h-full">
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-semibold">{p.title}</h3>
            <div className="flex gap-2">
              {p.links.github && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a href={p.links.github} target="_blank" rel="noreferrer" className="inline-flex">
                        <Button variant="ghost" size="icon" className="rounded-xl"><Github className="h-4 w-4" /></Button>
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>GitHub</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              {p.links.demo && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <a href={p.links.demo} target="_blank" rel="noreferrer" className="inline-flex">
                        <Button variant="ghost" size="icon" className="rounded-xl"><ExternalLink className="h-4 w-4" /></Button>
                      </a>
                    </TooltipTrigger>
                    <TooltipContent>Live Demo</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>
          <p className="text-sm mt-2 text-gray-600 dark:text-gray-300">{p.desc}</p>
          {p.highlights && (
            <ul className="mt-3 text-sm list-disc ml-5 space-y-1">
              {p.highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {p.stack.map((s) => (
            <Badge key={s} variant="secondary" className="rounded-full">{s}</Badge>
          ))}
        </div>
        <div className="mt-4">
          <Button onClick={() => onOpen(p)} className="rounded-2xl w-full">Details</Button>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const Projects: React.FC = () => {
  const [query, setQuery] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [open, setOpen] = useState<Project | null>(null);

  const tagList = useMemo(() => Array.from(new Set(projects.flatMap((p) => p.tags))), []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return projects.filter((p) => {
      const matchesQuery = !q || `${p.title} ${p.desc} ${p.stack.join(" ")}`.toLowerCase().includes(q);
      const matchesTags = activeTags.length === 0 || activeTags.every((t) => p.tags.includes(t));
      return matchesQuery && matchesTags;
    });
  }, [query, activeTags]);

  const toggleTag = (t: string) => {
    setActiveTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  return (
    <Section id="projects" className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <SectionHeading icon={Layers}>Projects</SectionHeading>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search projects, stacks..."
                className="pl-8 rounded-2xl w-64"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="rounded-2xl"><Filter className="h-4 w-4 mr-2" /> Filter</Button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {tagList.map((t) => (
            <Button
              key={t}
              size="sm"
              variant={activeTags.includes(t) ? "default" : "secondary"}
              className="rounded-full"
              onClick={() => toggleTag(t)}
            >
              {t}
            </Button>
          ))}
          {activeTags.length > 0 && (
            <Button size="sm" variant="ghost" className="rounded-full" onClick={() => setActiveTags([])}>
              Clear
            </Button>
          )}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {filtered.map((p) => (
            <ProjectCard key={p.title} p={p} onOpen={setOpen} />
          ))}
        </div>

        <Dialog open={!!open} onOpenChange={() => setOpen(null)}>
          <DialogContent className="rounded-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {open?.title}
                {open?.links?.github && (
                  <a href={open.links.github} target="_blank" rel="noreferrer" className="inline-flex">
                    <Badge className="rounded-full ml-2"><Github className="h-3 w-3 mr-1" /> GitHub</Badge>
                  </a>
                )}
                {open?.links?.demo && (
                  <a href={open.links.demo} target="_blank" rel="noreferrer" className="inline-flex">
                    <Badge className="rounded-full ml-2"><ExternalLink className="h-3 w-3 mr-1" /> Live</Badge>
                  </a>
                )}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <p className="text-sm text-gray-700 dark:text-gray-300">{open?.desc}</p>
              {open?.highlights && (
                <ul className="text-sm list-disc ml-5 space-y-1">
                  {open.highlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              )}
              <div className="flex flex-wrap gap-2 mt-2">
                {open?.stack.map((s) => (
                  <Badge key={s} variant="secondary" className="rounded-full">{s}</Badge>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Section>
  );
};

const Experience: React.FC = () => (
  <Section id="experience" className="py-12">
    <div className="max-w-5xl mx-auto px-4">
      <SectionHeading icon={FileText}>Experience</SectionHeading>
      <div className="mt-6 space-y-6">
        {experience.map((e, i) => (
          <Card key={i} className="rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-lg font-semibold">{e.title} · {e.company}</h3>
                <span className="text-sm text-gray-500 dark:text-gray-400">{e.period}</span>
              </div>
              <ul className="mt-3 ml-5 list-disc text-sm space-y-1">
                {e.bullets.map((b, bi) => (
                  <li key={bi}>{b}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </Section>
);

const Education: React.FC = () => (
  <Section id="education" className="py-12">
    <div className="max-w-5xl mx-auto px-4">
      <SectionHeading icon={GraduationCap}>Education</SectionHeading>
      <Card className="rounded-2xl mt-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-lg font-semibold">{education.program}</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">{education.period}</span>
          </div>
          <div className="mt-1 text-sm text-gray-600 dark:text-gray-300">{education.school} · {education.location}</div>
          <div className="mt-4">
            <h4 className="font-medium">Relevant Coursework</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {education.coursework.map((c) => (
                <Badge key={c} variant="secondary" className="rounded-full">{c}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  </Section>
);

const Certifications: React.FC = () => (
  <Section id="certs" className="py-12">
    <div className="max-w-5xl mx-auto px-4">
      <SectionHeading icon={CheckCircle2}>Certifications</SectionHeading>
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        {certifications.map((c, i) => (
          <Card key={i} className="rounded-2xl">
            <CardContent className="p-6">
              <div className="text-sm text-gray-500 dark:text-gray-400">{c.org}</div>
              <div className="font-medium">{c.title}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      {publications.length > 0 && (
        <div className="mt-10">
          <SectionHeading icon={BookOpen}>Publication</SectionHeading>
          <ul className="mt-4 list-disc ml-6 space-y-2">
            {publications.map((p, i) => (
              <li key={i} className="text-sm">
                <a className="text-indigo-600 hover:underline" href={p.link} target="_blank" rel="noreferrer">
                  {p.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  </Section>
);

const Contact: React.FC = () => {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState<string | null>(null);

  const canSend = name.trim() && email.includes("@");
  const send = () => {
    const body = encodeURIComponent(`Hi Arnav,%0D%0A%0D%0A${msg}%0D%0A%0D%0A— ${name}`);
    window.location.href = `mailto:${LINKS.email}?subject=Portfolio%20Contact&body=${body}`;
    setOk("Opening your email client…");
  };

  return (
    <Section id="contact" className="py-12">
      <div className="max-w-3xl mx-auto px-4">
        <SectionHeading icon={Mail}>Get in Touch</SectionHeading>
        <Card className="rounded-2xl mt-6">
          <CardContent className="p-6 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm">Your Name</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} className="rounded-2xl mt-1" />
              </div>
              <div>
                <label className="text-sm">Email</label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-2xl mt-1" />
              </div>
            </div>
            <div>
              <label className="text-sm">Message</label>
              <textarea
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                className="mt-1 w-full min-h-[120px] rounded-2xl border px-3 py-2 bg-transparent"
                placeholder="What would you like to build together?"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button disabled={!canSend} onClick={send} className="rounded-2xl">
                Send <ArrowUpRight className="h-4 w-4 ml-1" />
              </Button>
              {ok && <span className="text-sm text-gray-500">{ok}</span>}
            </div>
            <div className="pt-2 text-sm text-gray-500 dark:text-gray-400">
              Prefer LinkedIn? DM me at {" "}
              <a className="text-indigo-600 hover:underline" href={LINKS.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>.
            </div>
          </CardContent>
        </Card>
      </div>
    </Section>
  );
};

const Footer: React.FC = () => (
  <footer className="py-10 border-t">
    <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
      <div className="text-sm text-gray-500 dark:text-gray-400">© {new Date().getFullYear()} Arnav Adarsh</div>
      <div className="flex items-center gap-3">
        <a href={LINKS.github} target="_blank" rel="noreferrer" className="inline-flex"><Github className="h-5 w-5" /></a>
        <a href={LINKS.linkedin} target="_blank" rel="noreferrer" className="inline-flex"><Linkedin className="h-5 w-5" /></a>
        <a href={`mailto:${LINKS.email}`} className="inline-flex"><Mail className="h-5 w-5" /></a>
      </div>
    </div>
  </footer>
);

// -----------------------------
// SEO + JSON-LD
// -----------------------------
const Seo: React.FC = () => (
  <>
    <title>Arnav Adarsh — Portfolio</title>
    <meta name="description" content="Arnav Adarsh | B.Tech CSE @ KIIT — ML, Web, and Data projects including FraudSense, Mini E‑Commerce, Weather App." />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <script type="application/ld+json" dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Arnav Adarsh",
        sameAs: [LINKS.github, LINKS.linkedin],
        email: LINKS.email,
        jobTitle: "Student | Developer",
        alumniOf: education.school,
        url: typeof window !== 'undefined' ? window.location.href : 'https://example.com',
      }),
    }} />
  </>
);

// -----------------------------
// Root component
// -----------------------------
export default function Portfolio() {
  const themeState = useTheme();
  const sections = ["home", "about", "skills", "projects", "experience", "education", "certs", "contact"];
  const active = useScrollSpy(sections);

  useEffect(() => {
    // Smooth hash navigation support
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '');
      const el = document.getElementById(id);
      setTimeout(() => el?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
      <Seo />
      <Navbar active={active} themeState={themeState} />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Education />
      <Certifications />
      <Contact />
      <Footer />
    </div>
  );
}
