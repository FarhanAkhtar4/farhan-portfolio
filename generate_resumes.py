#!/usr/bin/env python3
"""
ATS-Friendly Resume Generator for Farhan Akhtar Makandar
Generates 6 tailored, ATS-optimized resumes as clean PDFs.
ATS-friendly: simple layout, standard headings, no graphics, keyword-rich.
"""

from fpdf import FPDF
import os

OUTPUT_DIR = "/home/z/my-project/public/resumes"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ---------------------------------------------------------------------------
# Shared Data
# ---------------------------------------------------------------------------

NAME = "Farhan Akhtar Makandar"
EMAIL = "farhanmakandar01@outlook.com"
PHONE = "+91 7349123558"
LOCATION = "Karnataka, India"
LINKEDIN = "linkedin.com/in/farhan-akhtar-ba942126a"
GITHUB = "github.com/FarhanAkhtar4"
HF = "huggingface.co/FarhanAkhtar11"

SHARED_EXPERIENCE = [
    {
        "title": "Research Intern - AI/ML",
        "company": "NIT Calicut",
        "period": "Jun 2024 - Dec 2024",
        "bullets": [
            "Developed and evaluated transformer-based models for complex predictive tasks using PyTorch, achieving rigorous performance benchmarks",
            "Collaborated on cutting-edge AI research focused on neural network optimization and deep learning applications for engineering problems",
            "Conducted comprehensive data analysis, feature engineering, and model validation using scientific computing libraries",
            "Assisted in documenting research findings and preparing technical reports for publication",
        ],
    }
]

SHARED_EDUCATION = [
    {
        "degree": "B.E. in Artificial Intelligence & Machine Learning",
        "school": "Yenepoya Institute of Technology, Moodbidri (VTU)",
        "period": "Expected 2026",
    },
]

SHARED_CERTS = [
    "IBM Python for Data Science (Credly Verified)",
    "Machine Learning with Python - IBM Cognitive Class",
    "Deep Learning Fundamentals - IBM Cognitive Class",
    "Accelerating Deep Learning with GPUs - IBM Cognitive Class",
    "Supervised Machine Learning - Coursera",
    "Building RAG Agents with LLMs - NVIDIA",
    "AWS Generative AI Essentials - AWS",
    "AWS Prompt Engineering - AWS",
    "Oracle Cloud Infrastructure 2025 AI Foundations Associate",
    "Accenture Data Analytics Simulation - Forage",
    "MongoDB Atlas - MongoDB University",
    "HTML Training - IIT Bombay",
]

# ---------------------------------------------------------------------------
# Resume Definitions (each with tailored content)
# ---------------------------------------------------------------------------

RESUMES = {
    "ML_Engineer": {
        "title": "Machine Learning Engineer",
        "summary": (
            "Results-driven Machine Learning Engineer with 1+ year of research experience "
            "specializing in building production-ready ML systems using PyTorch, TensorFlow, "
            "and scikit-learn. Proven track record of achieving 22% accuracy improvement over "
            "traditional ML baselines through Temporal Fusion Transformer architecture. "
            "Strong foundation in statistical modeling, feature engineering, data pipelines, "
            "and model deployment. Passionate about bridging the gap between research "
            "prototypes and scalable ML systems."
        ),
        "skills": [
            "Programming: Python, SQL, R, C",
            "ML Frameworks: PyTorch, TensorFlow, Keras, scikit-learn, XGBoost",
            "Deep Learning: CNN, RNN, LSTM, GANs, Transformer Architectures",
            "Data Science: Pandas, NumPy, Matplotlib, Seaborn, Feature Engineering",
            "MLOps: Git/GitHub, Model Validation, Hyperparameter Tuning, Experiment Tracking",
            "Cloud & Tools: AWS, Oracle Cloud, MongoDB, Power BI, DAX",
            "Concepts: Statistical Modeling, Cross-Validation, Ensemble Methods, Time Series Analysis, EDA",
        ],
        "projects": [
            {
                "name": "Seismic Response Prediction",
                "desc": (
                    "Built Temporal Fusion Transformer (TFT) model achieving 22% improvement "
                    "over XGBoost and KNN baselines for seismic structural response prediction. "
                    "Performed exploratory data analysis using Pandas, NumPy, and Seaborn. "
                    "Implemented hyperparameter optimization and rigorous model evaluation pipeline."
                ),
                "tech": "PyTorch, Transformers, Time Series, Deep Learning, XGBoost",
            },
            {
                "name": "SAINT Model - Tabular Classification",
                "desc": (
                    "Implemented Self-Attention and Intersample Attention (SAINT) mechanism "
                    "for tabular data classification. Optimized feature interaction learning "
                    "through attention-based architecture on structured datasets."
                ),
                "tech": "PyTorch, Attention Mechanisms, Tabular Data, Deep Learning",
            },
            {
                "name": "Sales Analytics Dashboard",
                "desc": (
                    "Designed Power BI dashboard with advanced DAX formulas for real-time "
                    "sales analysis, KPI tracking, customer segmentation, and business "
                    "intelligence insights for stakeholder reporting."
                ),
                "tech": "Power BI, DAX, Data Analytics, Business Intelligence",
            },
        ],
        "keywords": [
            "machine learning engineer", "pytorch", "tensorflow", "scikit-learn", "xgboost",
            "deep learning", "transformer", "time series", "feature engineering",
            "model deployment", "data pipeline", "statistical modeling", "cross-validation",
            "hyperparameter tuning", "python", "sql", "ml systems", "production ml",
        ],
    },
    "AI_Engineer": {
        "title": "AI Engineer",
        "summary": (
            "AI Engineer with hands-on experience in designing and deploying end-to-end "
            "AI systems spanning machine learning, deep learning, and large language models. "
            "Demonstrated ability to build production-grade AI pipelines including data "
            "ingestion, model training, evaluation, and deployment. Skilled in transformer "
            "architectures, retrieval-augmented generation, and intelligent system design. "
            "Research experience at NIT Calicut on neural network optimization for "
            "real-world engineering problems."
        ),
        "skills": [
            "Programming: Python, SQL, C, R, HTML/CSS",
            "AI/ML: PyTorch, TensorFlow, Keras, scikit-learn, XGBoost, Transformers",
            "LLM & NLP: RAG Pipelines, Prompt Engineering, LLM Integration, Embeddings, Fine-Tuning",
            "Deep Learning: CNN, RNN, LSTM, GANs, Attention Mechanisms, SAINT",
            "Data Science: Pandas, NumPy, Matplotlib, Seaborn, Jupyter, Feature Engineering",
            "Agentic AI: Vector Databases, Agentic Workflows, LangChain, RAG Pipelines",
            "Cloud & DevOps: AWS, Oracle Cloud, MongoDB, Git/GitHub, Power BI, DAX",
        ],
        "projects": [
            {
                "name": "Agentic AI System - RAG Pipeline",
                "desc": (
                    "Engineered end-to-end RAG pipeline: document retrieval using vector "
                    "databases, LLM-based reasoning and response generation with context-aware "
                    "prompt engineering. Integrated vector database for efficient semantic search."
                ),
                "tech": "LLMs, RAG, Vector Database, Python, Prompt Engineering, LangChain",
            },
            {
                "name": "Seismic Response Prediction - TFT",
                "desc": (
                    "Developed Temporal Fusion Transformer achieving 22% improvement over "
                    "traditional ML baselines (XGBoost, KNN) for seismic structural response "
                    "prediction. Comprehensive EDA and model evaluation."
                ),
                "tech": "PyTorch, Transformers, Time Series, Deep Learning",
            },
            {
                "name": "SAINT Model - Attention-Based Classification",
                "desc": (
                    "Built Self-Attention and Intersample Attention model for tabular data "
                    "classification with performance optimization through attention architecture."
                ),
                "tech": "PyTorch, Attention Mechanisms, Tabular Data",
            },
        ],
        "keywords": [
            "ai engineer", "artificial intelligence", "machine learning", "deep learning",
            "large language models", "rag", "retrieval augmented generation", "transformers",
            "pytorch", "tensorflow", "vector database", "prompt engineering", "langchain",
            "embeddings", "fine-tuning", "nlp", "ai pipeline", "production ai",
        ],
    },
    "GenAI_Engineer": {
        "title": "Generative AI Engineer",
        "summary": (
            "Generative AI Engineer specializing in building applications powered by "
            "large language models, retrieval-augmented generation, and prompt engineering. "
            "Hands-on experience with LLM fine-tuning, embedding models, vector databases, "
            "and production GenAI pipelines. NVIDIA-certified in Building RAG Agents with LLMs. "
            "AWS-trained in Generative AI Essentials and Prompt Engineering. Skilled in "
            "designing intelligent systems that leverage foundation models for real-world "
            "applications across document understanding, content generation, and conversational AI."
        ),
        "skills": [
            "Generative AI: LLM Fine-Tuning, Prompt Engineering, RAG Pipelines, Embeddings, Foundation Models",
            "LLM Frameworks: LangChain, LLM Integration, Agentic Workflows, Vector Databases",
            "ML/DL: PyTorch, TensorFlow, Keras, Transformers, CNN, RNN, LSTM, GANs",
            "Data & Analytics: Pandas, NumPy, Feature Engineering, Jupyter, EDA",
            "Programming: Python, SQL, C, R, HTML/CSS",
            "Cloud Platforms: AWS (GenAI, Prompt Engineering), Oracle Cloud, MongoDB",
            "Certifications: NVIDIA RAG Agents, AWS GenAI Essentials, AWS Prompt Engineering",
        ],
        "projects": [
            {
                "name": "Agentic AI System - RAG Pipeline",
                "desc": (
                    "Built production-grade RAG pipeline combining LLM-based retrieval, "
                    "reasoning, and response generation with vector database integration "
                    "for intelligent document understanding. Context-aware prompt engineering "
                    "for accurate, grounded responses."
                ),
                "tech": "LLMs, RAG, Vector Database, LangChain, Prompt Engineering, Python",
            },
            {
                "name": "Seismic Response Prediction - Transformer",
                "desc": (
                    "Developed Temporal Fusion Transformer for time-series prediction, "
                    "applying generative modeling techniques to engineering data. Achieved "
                    "22% improvement over traditional ML baselines."
                ),
                "tech": "PyTorch, Transformers, Time Series, Deep Learning",
            },
            {
                "name": "SAINT Model - Attention Mechanisms",
                "desc": (
                    "Implemented self-attention and intersample attention architecture "
                    "for tabular data classification, demonstrating advanced understanding "
                    "of attention-based generative and discriminative models."
                ),
                "tech": "PyTorch, Attention Mechanisms, Deep Learning",
            },
        ],
        "keywords": [
            "generative ai engineer", "genai", "large language models", "llm", "rag",
            "retrieval augmented generation", "prompt engineering", "fine-tuning",
            "embeddings", "vector database", "langchain", "foundation models",
            "conversational ai", "document understanding", "nvidia rag agents",
            "aws genai", "aws prompt engineering", "transformers", "attention mechanisms",
        ],
    },
    "Agentic_AI_Engineer": {
        "title": "Agentic AI Engineer",
        "summary": (
            "Agentic AI Engineer specializing in designing and deploying autonomous AI "
            "agent systems, multi-agent workflows, and RAG pipelines. NVIDIA-certified "
            "in Building RAG Agents with LLMs. Proven expertise in LangChain, vector "
            "databases, prompt engineering, and LLM reasoning chains. Experienced in "
            "building intelligent systems that combine retrieval, reasoning, and generation "
            "for complex document understanding and decision-making tasks. Strong foundation "
            "in transformer architectures and production ML system design."
        ),
        "skills": [
            "Agentic AI: Multi-Agent Systems, Autonomous Agents, Tool Use, Function Calling, Planning",
            "RAG: Retrieval-Augmented Generation, Vector Databases, Semantic Search, Chunking Strategies",
            "LLM: Prompt Engineering, Chain-of-Thought, ReAct, LLM Integration, Fine-Tuning",
            "Frameworks: LangChain, LLM Orchestrators, Agent Frameworks, Workflow Engines",
            "ML/DL: PyTorch, TensorFlow, Transformers, CNN, RNN, LSTM, Attention Mechanisms",
            "Data: Pandas, NumPy, Feature Engineering, Embeddings, Similarity Search",
            "Cloud: AWS, Oracle Cloud, MongoDB, Git/GitHub",
        ],
        "projects": [
            {
                "name": "Agentic AI System - Multi-Step RAG Pipeline",
                "desc": (
                    "Architected end-to-end agentic RAG system combining document retrieval "
                    "via vector database, multi-step LLM reasoning, and context-aware response "
                    "generation. Implemented agent planning with tool use for complex queries "
                    "requiring multi-document synthesis."
                ),
                "tech": "LLMs, RAG, Vector Database, LangChain, Prompt Engineering, Agent Framework",
            },
            {
                "name": "Seismic Response Prediction - TFT",
                "desc": (
                    "Built Temporal Fusion Transformer with attention-based architecture "
                    "for time-series prediction. Applied multi-head attention and variable "
                    "selection networks for interpretable predictions."
                ),
                "tech": "PyTorch, Transformers, Attention Mechanisms, Time Series",
            },
            {
                "name": "SAINT Model - Dual Attention Architecture",
                "desc": (
                    "Implemented Self-Attention and Intersample Attention mechanism, "
                    "demonstrating expertise in attention architectures applicable to "
                    "agentic reasoning and information retrieval systems."
                ),
                "tech": "PyTorch, Attention Mechanisms, Deep Learning",
            },
        ],
        "keywords": [
            "agentic ai", "ai agents", "autonomous agents", "multi-agent systems",
            "rag agents", "retrieval augmented generation", "langchain", "vector database",
            "prompt engineering", "chain-of-thought", "react agent", "tool use",
            "function calling", "agent planning", "llm reasoning", "semantic search",
            "nvidia rag agents", "agent framework", "workflow automation",
        ],
    },
    "Vibe_Coder": {
        "title": "AI-Powered Full-Stack Developer",
        "summary": (
            "AI-powered developer and ML engineer leveraging cutting-edge AI coding tools "
            "(Cursor, GitHub Copilot, ChatGPT) to build full-stack applications at "
            "unprecedented speed. Skilled in rapid prototyping and production deployment "
            "of AI-augmented web applications, dashboards, and ML systems. Combines "
            "strong software engineering fundamentals with deep AI/ML expertise to "
            "deliver end-to-end solutions. Experienced in prompt-driven development, "
            "AI-assisted debugging, and intelligent code generation for React, Next.js, "
            "Python, and cloud-native architectures."
        ),
        "skills": [
            "AI Coding Tools: Cursor, GitHub Copilot, ChatGPT, Claude, AI-Assisted Development",
            "Frontend: React, Next.js, TypeScript, Tailwind CSS, Framer Motion, Three.js, HTML/CSS",
            "Backend: Python, FastAPI, Node.js, REST APIs, Serverless Functions",
            "AI/ML: PyTorch, TensorFlow, LangChain, RAG, LLM Integration, Prompt Engineering",
            "Data: Pandas, NumPy, SQL, MongoDB, Power BI, Data Visualization",
            "Cloud & DevOps: AWS, Git/GitHub, Vercel, Docker, CI/CD",
            "Specialties: Rapid Prototyping, Vibe Coding, AI-Augmented Development, Full-Stack AI Apps",
        ],
        "projects": [
            {
                "name": "3D Portfolio Website",
                "desc": (
                    "Built production-ready 3D interactive portfolio using Next.js, React "
                    "Three Fiber, Framer Motion, and Tailwind CSS with glassmorphism design. "
                    "Implemented 3D particle field with custom GLSL shaders, animated stats, "
                    "contact form backend, and fully responsive layout. AI-assisted development "
                    "with Cursor and ChatGPT."
                ),
                "tech": "Next.js, React Three Fiber, Framer Motion, Tailwind CSS, TypeScript, GLSL",
            },
            {
                "name": "Agentic AI System",
                "desc": (
                    "Developed RAG pipeline with LLM reasoning, vector database integration, "
                    "and intelligent document understanding. Full-stack deployment with "
                    "AI-powered backend and interactive frontend."
                ),
                "tech": "Python, LangChain, RAG, Vector Database, LLMs, Prompt Engineering",
            },
            {
                "name": "Sales Analytics Dashboard",
                "desc": (
                    "Created Power BI dashboard with advanced DAX formulas for real-time "
                    "KPI tracking, customer segmentation, and business intelligence. "
                    "Rapidly prototyped using AI-assisted development workflows."
                ),
                "tech": "Power BI, DAX, Data Analytics, AI-Assisted Development",
            },
        ],
        "keywords": [
            "vibe coding", "ai developer", "cursor", "github copilot", "ai coding",
            "rapid prototyping", "full-stack developer", "next.js", "react", "typescript",
            "tailwind css", "python", "fastapi", "ai-assisted development", "chatgpt",
            "ai augmented development", "three.js", "framer motion", "vercel",
            "prompt-driven development", "intelligent code generation",
        ],
    },
    "AI_General": {
        "title": "AI & Machine Learning Engineer",
        "summary": (
            "Versatile AI & Machine Learning Engineer with comprehensive expertise spanning "
            "machine learning, deep learning, generative AI, agentic AI, and AI-powered "
            "software development. Research experience at NIT Calicut on transformer "
            "architectures for time-series prediction with 22% improvement over traditional "
            "baselines. Skilled in building end-to-end AI systems from research prototypes "
            "to production deployments. 11 industry certifications from IBM, NVIDIA, AWS, "
            "Oracle, and Coursera validating cross-domain AI proficiency."
        ),
        "skills": [
            "AI/ML: PyTorch, TensorFlow, Keras, scikit-learn, XGBoost, Transformers",
            "GenAI: LLM Fine-Tuning, RAG Pipelines, Prompt Engineering, LangChain, Vector Databases",
            "Agentic AI: Multi-Agent Systems, Autonomous Agents, Tool Use, Chain-of-Thought",
            "Deep Learning: CNN, RNN, LSTM, GANs, Attention Mechanisms, SAINT",
            "Data Science: Pandas, NumPy, Matplotlib, Seaborn, Feature Engineering, Jupyter",
            "Programming: Python, SQL, C, R, HTML/CSS, React, Next.js, TypeScript",
            "Cloud: AWS, Oracle Cloud, MongoDB, Git/GitHub, Power BI, Vercel",
        ],
        "projects": [
            {
                "name": "Seismic Response Prediction - TFT",
                "desc": (
                    "Temporal Fusion Transformer model achieving 22% improvement over XGBoost "
                    "and KNN for seismic structural response prediction. Full pipeline: EDA, "
                    "feature engineering, model training, and evaluation."
                ),
                "tech": "PyTorch, Transformers, Time Series, Deep Learning, Data Analysis",
            },
            {
                "name": "Agentic AI System - RAG Pipeline",
                "desc": (
                    "End-to-end RAG pipeline with vector database, LLM reasoning, and "
                    "context-aware response generation for intelligent document understanding."
                ),
                "tech": "LLMs, RAG, Vector Database, LangChain, Prompt Engineering",
            },
            {
                "name": "SAINT Model & Sales Analytics",
                "desc": (
                    "Attention-based classification model for tabular data and Power BI "
                    "dashboard with DAX formulas for real-time business intelligence."
                ),
                "tech": "PyTorch, Attention Mechanisms, Power BI, DAX",
            },
            {
                "name": "3D Portfolio Website",
                "desc": (
                    "Production-ready interactive portfolio with 3D particle field, custom "
                    "GLSL shaders, Framer Motion animations, and contact form backend."
                ),
                "tech": "Next.js, React Three Fiber, TypeScript, Tailwind CSS, GLSL",
            },
        ],
        "keywords": [
            "ai engineer", "machine learning engineer", "deep learning", "generative ai",
            "agentic ai", "transformers", "pytorch", "tensorflow", "rag", "langchain",
            "llm", "prompt engineering", "vector database", "nlp", "computer vision",
            "time series", "full-stack ai", "next.js", "python", "aws", "nvidia",
        ],
    },
}

# ---------------------------------------------------------------------------
# PDF Generator (ATS-Friendly: clean text, no graphics, standard headings)
# ---------------------------------------------------------------------------


class ATSResume(FPDF):
    def __init__(self):
        super().__init__()
        self.set_auto_page_break(auto=True, margin=15)

    def header_section(self, name, title, email, phone, location, linkedin, github):
        # Name
        self.set_font("Helvetica", "B", 18)
        self.cell(0, 9, name, new_x="LMARGIN", new_y="NEXT")
        # Title
        self.set_font("Helvetica", "", 11)
        self.cell(0, 6, title, new_x="LMARGIN", new_y="NEXT")
        # Contact line
        self.set_font("Helvetica", "", 9)
        contact = f"{email}  |  {phone}  |  {location}"
        self.cell(0, 5, contact, new_x="LMARGIN", new_y="NEXT")
        links = f"{linkedin}  |  {github}  |  {HF}"
        self.cell(0, 5, links, new_x="LMARGIN", new_y="NEXT")
        # Line separator
        self.ln(3)
        self.set_draw_color(80, 80, 80)
        self.set_line_width(0.4)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(5)

    def section_heading(self, text):
        self.ln(3)
        self.set_font("Helvetica", "B", 11)
        self.set_text_color(0, 0, 0)
        self.cell(0, 7, text.upper(), new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(100, 100, 100)
        self.set_line_width(0.3)
        self.line(10, self.get_y(), 200, self.get_y())
        self.ln(3)

    def body_text(self, text):
        self.set_font("Helvetica", "", 10)
        self.set_text_color(30, 30, 30)
        self.multi_cell(0, 5, text)
        self.ln(1)

    def bullet(self, text):
        self.set_font("Helvetica", "", 10)
        self.set_text_color(30, 30, 30)
        x = self.get_x()
        self.cell(6, 5, "-")  # bullet
        self.multi_cell(0, 5, text)
        self.ln(0.5)

    def experience_block(self, title, company, period, bullets):
        self.set_font("Helvetica", "B", 10)
        self.set_text_color(0, 0, 0)
        self.cell(0, 6, f"{title}  -  {company}", new_x="LMARGIN", new_y="NEXT")
        self.set_font("Helvetica", "I", 9)
        self.set_text_color(80, 80, 80)
        self.cell(0, 5, period, new_x="LMARGIN", new_y="NEXT")
        self.ln(1)
        for b in bullets:
            self.bullet(b)

    def project_block(self, name, desc, tech):
        self.set_font("Helvetica", "B", 10)
        self.set_text_color(0, 0, 0)
        self.cell(0, 6, name, new_x="LMARGIN", new_y="NEXT")
        self.set_font("Helvetica", "", 9.5)
        self.set_text_color(30, 30, 30)
        self.multi_cell(0, 5, desc)
        self.set_font("Helvetica", "I", 9)
        self.set_text_color(80, 80, 80)
        self.cell(0, 5, f"Technologies: {tech}", new_x="LMARGIN", new_y="NEXT")
        self.ln(1)

    def skill_list(self, skills):
        self.set_font("Helvetica", "", 10)
        self.set_text_color(30, 30, 30)
        for s in skills:
            self.cell(6, 5, "-")
            self.cell(0, 5, s, new_x="LMARGIN", new_y="NEXT")
        self.ln(1)

    def edu_block(self, degree, school, period):
        self.set_font("Helvetica", "B", 10)
        self.set_text_color(0, 0, 0)
        self.cell(0, 6, degree, new_x="LMARGIN", new_y="NEXT")
        self.set_font("Helvetica", "", 9.5)
        self.cell(0, 5, f"{school}  |  {period}", new_x="LMARGIN", new_y="NEXT")
        self.ln(1)

    def cert_list(self, certs):
        self.set_font("Helvetica", "", 9.5)
        self.set_text_color(30, 30, 30)
        for c in certs:
            self.cell(6, 5, "-")
            self.cell(0, 5, c, new_x="LMARGIN", new_y="NEXT")


def generate_resume(key, data):
    pdf = ATSResume()
    pdf.add_page()

    # Header
    pdf.header_section(
        NAME, data["title"], EMAIL, PHONE, LOCATION, LINKEDIN, GITHUB
    )

    # Professional Summary
    pdf.section_heading("Professional Summary")
    pdf.body_text(data["summary"])

    # Skills (ATS keywords - flat list for easy parsing)
    pdf.section_heading("Technical Skills")
    pdf.skill_list(data["skills"])

    # Experience
    pdf.section_heading("Professional Experience")
    for exp in SHARED_EXPERIENCE:
        pdf.experience_block(exp["title"], exp["company"], exp["period"], exp["bullets"])

    # Projects
    pdf.section_heading("Projects")
    for proj in data["projects"]:
        pdf.project_block(proj["name"], proj["desc"], proj["tech"])

    # Education
    pdf.section_heading("Education")
    for edu in SHARED_EDUCATION:
        pdf.edu_block(edu["degree"], edu["school"], edu["period"])

    # Certifications
    pdf.section_heading("Certifications")
    pdf.cert_list(SHARED_CERTS)

    # Save
    filename = f"Farhan_Akhtar_{key}.pdf"
    filepath = os.path.join(OUTPUT_DIR, filename)
    pdf.output(filepath)
    print(f"  Generated: {filename}")
    return filepath


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    print("Generating 6 ATS-friendly resumes...")
    print("=" * 50)
    for key, data in RESUMES.items():
        generate_resume(key, data)
    print("=" * 50)
    print(f"All resumes saved to: {OUTPUT_DIR}")
