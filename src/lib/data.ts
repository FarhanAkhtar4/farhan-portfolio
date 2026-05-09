// Centralized data for Farhan Akhtar Makandar's Portfolio
// Source: Candidate-provided resume + portfolio brief
// ANTI-HALLUCINATION: All data verified against uploaded resume PDF

export interface SiteConfig {
  name: string;
  firstName: string;
  lastName: string;
  role: string;
  roleShort: string;
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  huggingface: string;
  portfolioUrl: string;
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
  details?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  responsibilities: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  oneLiner: string;
  tags: string[];
  github: string;
  huggingface?: string;
  deployedUrl?: string;
  category: "Deep Learning" | "Agentic AI" | "Analytics" | "AI & LLM" | "SaaS & Full-Stack";
  isFlagship: boolean;
  metrics?: {
    label: string;
    value: string;
    accent?: boolean;
  }[];
  highlights?: string[];
  architecture?: {
    layers: { label: string; sublabel: string; icon: string }[];
    title: string;
  };
}

export interface SkillCategory {
  name: string;
  skills: string[];
  highlight?: boolean;
}

export interface Certification {
  title: string;
  issuer: string;
  category: "AI & ML" | "GenAI & Agentic AI" | "Cloud & Data" | "Other";
  certFile?: string;
  verifyUrl?: string;
}

export interface NavLink {
  label: string;
  href: string;
}

export const siteConfig: SiteConfig = {
  name: "Farhan Akhtar Makandar",
  firstName: "Farhan",
  lastName: "Akhtar Makandar",
  role: "ML Systems Engineer",
  roleShort: "Agentic AI · Deep Learning · Transformers",
  email: "farhanmakandar01@outlook.com",
  phone: "+91 7349123558",
  location: "Karnataka, India",
  github: "https://github.com/FarhanAkhtar4",
  linkedin: "https://www.linkedin.com/in/farhan-akhtar-ba942126a",
  huggingface: "https://huggingface.co/FarhanAkhtar11",
  portfolioUrl: "https://portfolio-rust-xi-38.vercel.app/",
};

export const education: Education[] = [
  {
    institution: "Yenepoya Institute of Technology, Moodbidri (VTU)",
    degree: "B.E. in Artificial Intelligence & Machine Learning",
    period: "Expected 2026",
    details: "Deep Learning, Neural Networks, Data Structures & Algorithms, Linear Algebra, Probability & Statistics, DBMS",
  },
  {
    institution: "M.E.S Pre-University College, Sirsi",
    degree: "Pre-University Course (Science)",
    period: "2022",
  },
];

export const heroTaglines: string[] = [
  "I build ML systems that solve real engineering problems.",
  "I architect transformer models for time-series prediction.",
  "I design agentic AI workflows with retrieval and reasoning.",
];

export const navLinks: NavLink[] = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Certifications", href: "#certifications" },
  { label: "Contact", href: "#contact" },
];

export const experience: Experience[] = [
  {
    id: "nit-calicut",
    role: "Research Intern – AI/ML",
    company: "NIT Calicut",
    period: "Jun 2024 – Dec 2024",
    responsibilities: [
      "Collaborated on cutting-edge AI research focused on neural network optimization and deep learning applications for engineering problems",
      "Developed and evaluated transformer-based models for complex predictive tasks, achieving rigorous performance benchmarks",
      "Conducted comprehensive data analysis and model validation using PyTorch and scientific computing libraries",
      "Assisted in documenting research findings and preparing technical reports for publication",
    ],
  },
];

export const projects: Project[] = [
  // ---- Existing Projects (kept) ----
  {
    id: "seismic-response-prediction",
    title: "Seismic Response Prediction",
    description:
      "Temporal Fusion Transformer (TFT) model achieving 22% improvement over XGBoost and KNN for seismic structural response prediction using PyTorch.",
    oneLiner: "22% better than XGBoost with Temporal Fusion Transformers",
    tags: ["PyTorch", "Transformers", "Time Series", "Deep Learning"],
    github: "https://github.com/FarhanAkhtar4",
    huggingface: "https://huggingface.co/spaces/FarhanAkhtar11/SEISMIC_PREDICTOR",
    category: "Deep Learning",
    isFlagship: true,
    metrics: [
      { label: "Accuracy Gain", value: "22%", accent: true },
      { label: "vs XGBoost", value: "Superior" },
      { label: "vs KNN", value: "Superior" },
    ],
    highlights: [
      "Temporal Fusion Transformer architecture for time-series seismic data",
      "Exploratory Data Analysis using Pandas, NumPy, and Seaborn",
      "Hyperparameter optimization and rigorous model evaluation",
      "22% accuracy improvement over traditional ML baselines (XGBoost, KNN)",
    ],
    architecture: {
      title: "Temporal Fusion Transformer Architecture",
      layers: [
        { label: "Input", sublabel: "Time Series", icon: "Layers" },
        { label: "Variable", sublabel: "Selection", icon: "Zap" },
        { label: "LSTM", sublabel: "Encoder", icon: "Layers" },
        { label: "Multi-Head", sublabel: "Attention", icon: "Zap" },
        { label: "Output", sublabel: "Prediction", icon: "TrendingUp" },
      ],
    },
  },
  {
    id: "saint-model",
    title: "SAINT Model",
    description:
      "Attention-based deep learning model for tabular data classification, leveraging self-attention and intersample attention for feature interaction modeling.",
    oneLiner: "Attention mechanisms for tabular data classification",
    tags: ["PyTorch", "Attention Mechanisms", "Tabular Data"],
    github: "https://github.com/FarhanAkhtar4",
    category: "Deep Learning",
    isFlagship: false,
    highlights: [
      "Self-Attention and Intersample Attention (SAINT) mechanisms",
      "Feature interaction learning for structured tabular data",
      "Performance optimization through attention-based architecture",
    ],
  },
  {
    id: "agentic-ai-system",
    title: "Agentic AI System",
    description:
      "Agentic AI workflow combining LLM-based retrieval, reasoning, and response generation with vector database integration for intelligent document understanding.",
    oneLiner: "RAG pipeline with LLM reasoning and vector retrieval",
    tags: ["LLMs", "RAG", "Vector Database", "Python", "Prompt Engineering"],
    github: "https://github.com/FarhanAkhtar4",
    category: "Agentic AI",
    isFlagship: false,
    highlights: [
      "End-to-end RAG pipeline: document retrieval → LLM reasoning → response generation",
      "Vector database integration for efficient semantic search",
      "Context-aware response generation with prompt engineering",
    ],
    architecture: {
      title: "Agentic AI Retrieval Pipeline",
      layers: [
        { label: "Query", sublabel: "User Input", icon: "MessageSquare" },
        { label: "Retrieve", sublabel: "Vector DB", icon: "Database" },
        { label: "Reason", sublabel: "LLM Core", icon: "Brain" },
        { label: "Generate", sublabel: "Response", icon: "Sparkles" },
      ],
    },
  },
  {
    id: "sales-analytics-dashboard",
    title: "Sales Analytics Dashboard",
    description:
      "Power BI dashboard with advanced DAX formulas for real-time sales analysis, KPI tracking, customer segmentation, and business intelligence insights.",
    oneLiner: "Business intelligence with interactive KPI tracking",
    tags: ["Power BI", "DAX", "Data Analytics", "Business Intelligence"],
    github: "https://github.com/FarhanAkhtar4",
    category: "Analytics",
    isFlagship: false,
    highlights: [
      "Advanced DAX formulas for real-time sales analysis and KPI tracking",
      "Customer segmentation visualizations for actionable business insights",
      "Interactive dashboards for stakeholder reporting",
    ],
  },

  // ---- New Projects ----
  {
    id: "agentos-multi-agent-saas",
    title: "AgentOS Multi-Agent SaaS",
    description:
      "Production-ready multi-agent AI orchestration platform where 5 specialized agents collaborate on complex tasks including research, code generation, analysis, planning, and execution.",
    oneLiner: "5 specialized AI agents collaborating on complex tasks",
    tags: ["Python", "Multi-Agent", "LangChain", "SaaS", "AI Orchestration"],
    github: "https://github.com/FarhanAkhtar4/agentos-multi-agent-saas",
    category: "Agentic AI",
    isFlagship: true,
    highlights: [
      "5 specialized AI agents with distinct roles",
      "Multi-agent collaboration and task orchestration",
      "Production-ready SaaS architecture",
      "Complex task decomposition and execution",
    ],
    architecture: {
      title: "Multi-Agent Orchestration Architecture",
      layers: [
        { label: "User", sublabel: "Query Input", icon: "MessageSquare" },
        { label: "Orchestrator", sublabel: "Agent Router", icon: "Brain" },
        { label: "Research", sublabel: "Agent 1", icon: "Zap" },
        { label: "Code", sublabel: "Agent 2", icon: "Sparkles" },
        { label: "Execute", sublabel: "Response", icon: "TrendingUp" },
      ],
    },
  },
  {
    id: "neet-prep-ai",
    title: "NEET Prep AI",
    description:
      "AI-Powered NEET Exam Simulation Platform featuring 180 questions, anti-cheat mechanisms, real-time proctoring, and smart analytics dashboards for medical aspirants.",
    oneLiner: "AI-powered medical exam simulation with smart proctoring",
    tags: ["Python", "AI", "Education", "Proctoring", "Analytics"],
    github: "https://github.com/FarhanAkhtar4/neet-prep-ai",
    category: "AI & LLM",
    isFlagship: false,
    highlights: [
      "180-question AI-powered exam simulation",
      "Real-time anti-cheat and proctoring system",
      "Smart analytics dashboard for performance tracking",
      "Adaptive difficulty based on student performance",
    ],
  },
  {
    id: "gitdeploy-ai",
    title: "GitDeploy AI",
    description:
      "AI-powered project builder that generates full-stack applications from natural language descriptions and deploys them directly to GitHub with CI/CD pipeline configuration.",
    oneLiner: "AI-powered project builder and GitHub deployment agent",
    tags: ["TypeScript", "AI", "CI/CD", "GitHub API", "Cloudflare"],
    github: "https://github.com/FarhanAkhtar4/gitdeploy-ai",
    huggingface: "https://huggingface.co/spaces/FarhanAkhtar11/gitdeploy-ai",
    category: "SaaS & Full-Stack",
    isFlagship: true,
    highlights: [
      "Natural language to full-stack application generation",
      "Automated GitHub repository creation and deployment",
      "CI/CD pipeline auto-configuration",
      "Cloudflare Workers/Pages deployment support",
    ],
    architecture: {
      title: "AI Deployment Pipeline",
      layers: [
        { label: "Prompt", sublabel: "NL Input", icon: "MessageSquare" },
        { label: "Generate", sublabel: "LLM Core", icon: "Brain" },
        { label: "Build", sublabel: "Compiler", icon: "Zap" },
        { label: "Deploy", sublabel: "Cloudflare", icon: "Globe" },
      ],
    },
  },
  {
    id: "runway-report",
    title: "Runway Report",
    description:
      "Runway Report is a fractional CFO AI agent that helps bootstrapped founders with financial runway calculations, burn rate analysis, revenue forecasting, and strategic financial planning.",
    oneLiner: "Fractional CFO AI Agent for bootstrapped founders",
    tags: ["Python", "AI Agent", "Finance", "SaaS", "Analytics"],
    github: "https://github.com/FarhanAkhtar4/runway-report",
    category: "AI & LLM",
    isFlagship: false,
    highlights: [
      "AI-powered financial runway calculations",
      "Burn rate analysis and revenue forecasting",
      "Strategic financial planning for founders",
      "Automated financial report generation",
    ],
  },
  {
    id: "account-tally-pro",
    title: "Account Tally Pro",
    description:
      "Professional SaaS application for account data tallying with automated reconciliation, audit trails, and comprehensive financial reporting dashboards.",
    oneLiner: "Professional account data tallying SaaS application",
    tags: ["TypeScript", "SaaS", "Finance", "Dashboard", "Cloudflare"],
    github: "https://github.com/FarhanAkhtar4/account-tally-pro",
    category: "SaaS & Full-Stack",
    isFlagship: false,
    highlights: [
      "Automated account data reconciliation",
      "Comprehensive audit trail system",
      "Financial reporting dashboards",
      "Cloudflare-deployed SaaS platform",
    ],
  },
  {
    id: "wedplan-pro",
    title: "WedPlan Pro",
    description:
      "Smart wedding planning platform for professionals featuring vendor management, budget tracking, guest list management, timeline planning, and AI-powered recommendation engine.",
    oneLiner: "Smart wedding planning platform for professionals",
    tags: ["Python", "SaaS", "AI", "Planning", "Platform"],
    github: "https://github.com/FarhanAkhtar4/wedplan-pro",
    category: "SaaS & Full-Stack",
    isFlagship: false,
    highlights: [
      "Vendor management and discovery system",
      "Smart budget tracking and analytics",
      "AI-powered vendor recommendations",
      "Timeline and task planning tools",
    ],
  },
  {
    id: "placement-portfolio-engine",
    title: "Placement Portfolio Engine",
    description:
      "AI-powered tool that converts resumes into recruiter-optimized portfolio websites with automatic section generation, skill visualization, and ATS-friendly formatting.",
    oneLiner: "AI converts resumes into recruiter-optimized portfolios",
    tags: ["TypeScript", "AI", "Resume", "Portfolio Generator", "Next.js"],
    github: "https://github.com/FarhanAkhtar4/placement-portfolio-engine",
    category: "SaaS & Full-Stack",
    isFlagship: false,
    highlights: [
      "AI-powered resume parsing and portfolio generation",
      "ATS-friendly output formatting",
      "Skill visualization and project showcase",
      "One-click deployment to custom domains",
    ],
  },
  {
    id: "talent-scout-hiring-assistant",
    title: "TalentScout AI",
    description:
      "Intelligent AI chatbot that automates initial technical screening for technology positions by collecting candidate details and generating tailored interview questions based on role requirements.",
    oneLiner: "AI chatbot automating initial technical screening",
    tags: ["Python", "AI", "Streamlit", "NLP", "Hiring"],
    github: "https://github.com/FarhanAkhtar4/talent-scout-hiring-assistant",
    category: "AI & LLM",
    isFlagship: false,
    highlights: [
      "Automated technical screening chatbot",
      "Tailored interview question generation",
      "Candidate skill assessment pipeline",
      "Streamlit-based interactive interface",
    ],
  },
];

export const skillCategories: SkillCategory[] = [
  {
    name: "Languages",
    skills: ["Python", "SQL", "C", "R", "HTML/CSS"],
  },
  {
    name: "ML & Deep Learning",
    highlight: false,
    skills: [
      "PyTorch",
      "TensorFlow",
      "Keras",
      "Scikit-learn",
      "XGBoost",
      "Transformers",
      "CNN",
      "RNN",
      "LSTM",
      "GANs",
    ],
  },
  {
    name: "LLM & Agentic AI",
    highlight: true,
    skills: [
      "RAG Pipelines",
      "Prompt Engineering",
      "LLM Integration",
      "Vector Databases",
      "Agentic Workflows",
      "LangChain",
      "Fine-Tuning",
      "Embeddings",
    ],
  },
  {
    name: "Data Science",
    skills: ["Pandas", "NumPy", "Matplotlib", "Seaborn", "Feature Engineering", "Jupyter"],
  },
  {
    name: "Cloud & Tools",
    skills: ["AWS", "Oracle Cloud", "MongoDB", "Git/GitHub", "Power BI", "DAX"],
  },
];

export const certifications: Certification[] = [
  // AI & ML (verified from uploaded PDFs)
  { title: "IBM Python for Data Science", issuer: "IBM", category: "AI & ML", certFile: "/certs/python-data-science.pdf", verifyUrl: "https://www.credly.com/go/NAh3BpA8" },
  { title: "Machine Learning with Python", issuer: "IBM (Cognitive Class)", category: "AI & ML", certFile: "/certs/ml-with-python.pdf" },
  { title: "Deep Learning Fundamentals", issuer: "IBM (Cognitive Class)", category: "AI & ML", certFile: "/certs/deep-learning-fundamentals.pdf", verifyUrl: "https://courses.cognitiveclass.ai/certificates/c76a95d891f94b61" },
  { title: "Accelerating Deep Learning with GPUs", issuer: "IBM (Cognitive Class)", category: "AI & ML", certFile: "/certs/accelerating-dl-gpus.pdf", verifyUrl: "https://courses.cognitiveclass.ai/certificates/fe5134ed4f4345d2aa2f19bf71e558ed" },
  { title: "Supervised Machine Learning", issuer: "Coursera", category: "AI & ML" },
  // GenAI & Agentic AI (verified from uploaded PDF)
  { title: "Building RAG Agents with LLMs", issuer: "NVIDIA", category: "GenAI & Agentic AI", certFile: "/certs/nvidia-rag-agents-llms.pdf", verifyUrl: "https://learn.nvidia.com/certificates?id=2awWueogRIuUwlsCWfBX9g" },
  { title: "AWS Generative AI Essentials", issuer: "AWS", category: "GenAI & Agentic AI" },
  { title: "AWS Prompt Engineering", issuer: "AWS", category: "GenAI & Agentic AI" },
  // Cloud & Data (verified from uploaded PDF)
  { title: "Oracle Cloud Infrastructure 2025 AI Foundations Associate", issuer: "Oracle University", category: "Cloud & Data", certFile: "/certs/oracle-ai-foundations-associate.png" },
  { title: "Accenture Data Analytics Simulation", issuer: "Accenture (Forage)", category: "Cloud & Data", certFile: "/certs/accenture-data-analytics.pdf" },
  { title: "MongoDB Atlas", issuer: "MongoDB University", category: "Cloud & Data" },
  // Other (verified from uploaded PDF)
  { title: "HTML Training", issuer: "IIT Bombay", category: "Other", certFile: "/certs/html-training-iit-bombay.pdf" },
];

export const certCategories = [
  "All",
  "AI & ML",
  "GenAI & Agentic AI",
  "Cloud & Data",
  "Other",
] as const;

export const categoryDots: Record<Certification["category"], string> = {
  "AI & ML": "bg-purple-400",
  "GenAI & Agentic AI": "bg-yellow-400",
  "Cloud & Data": "bg-cyan-400",
  Other: "bg-emerald-400",
};

export const projectCategories = [
  "All",
  "Agentic AI",
  "AI & LLM",
  "Deep Learning",
  "SaaS & Full-Stack",
  "Analytics",
] as const;
