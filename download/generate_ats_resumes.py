"""
ATS-Optimized Resume Generator
Generates 4 domain-specific resumes:
1. ML Engineer
2. Agentic AI Engineer
3. Generative AI Engineer
4. AI Engineer (General)

ATS Optimization:
- Single-column layout, no tables for text
- Standard section headings (ATS-friendly)
- Keyword-rich content matching job descriptions
- Clean Times New Roman font, proper margins
- No graphics, no columns, no fancy formatting
"""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# Register fonts
pdfmetrics.registerFont(TTFont('Times New Roman', '/usr/share/fonts/truetype/english/Times-New-Roman.ttf'))
registerFontFamily('Times New Roman', normal='Times New Roman', bold='Times New Roman')

OUTPUT_DIR = '/home/z/my-project/public/resumes'
os.makedirs(OUTPUT_DIR, exist_ok=True)

PORTFOLIO_URL = 'https://portfolio-rust-xi-38.vercel.app/'
GITHUB_URL = 'https://github.com/FarhanAkhtar4'
HF_URL = 'https://huggingface.co/FarhanAkhtar11'
HF_DEMO = 'https://huggingface.co/spaces/FarhanAkhtar11/SEISMIC_PREDICTOR'

# ========== SHARED DATA ==========

BASE_CONTACT = (
    'farhanmakandar01@outlook.com  |  +91 7349123558  |  '
    'Sirsi, Karnataka, India  |  '
    '<a href="https://portfolio-rust-xi-38.vercel.app/" color="#2563eb">Portfolio</a>  |  '
    '<a href="https://github.com/FarhanAkhtar4" color="#2563eb">GitHub</a>  |  '
    '<a href="https://huggingface.co/FarhanAkhtar11" color="#2563eb">Hugging Face</a>'
)

EDUCATION = [
    {
        'degree': 'B.E. in Artificial Intelligence &amp; Machine Learning',
        'school': 'Yenepoya Institute of Technology, Moodbidri (VTU)',
        'period': 'Expected 2026',
        'coursework': 'Deep Learning, Neural Networks, Data Structures &amp; Algorithms, Linear Algebra, Probability &amp; Statistics, DBMS',
    },
    {
        'degree': 'Pre-University Course (Science)',
        'school': 'M.E.S Pre-University College, Sirsi',
        'period': '2022',
    },
]

EXPERIENCE = {
    'role': 'Research Intern - AI/ML',
    'company': 'NIT Calicut, India',
    'period': 'Jun 2024 - Dec 2024',
    'bullets': [
        'Collaborated on cutting-edge AI research focused on neural network optimization and deep learning applications for engineering problems.',
        'Developed and evaluated transformer-based models for complex predictive tasks, achieving rigorous performance benchmarks.',
        'Conducted comprehensive data analysis and model validation using PyTorch and scientific computing libraries.',
        'Assisted in documenting research findings and preparing technical reports for publication.',
    ],
}

ALL_PROJECTS = {
    'seismic': {
        'title': 'Seismic Response Prediction Using Temporal Fusion Transformer',
        'tags': 'PyTorch | Transformers | Time Series',
        'demo': f'<a href="{HF_DEMO}" color="#2563eb">Live Demo</a> | <a href="{GITHUB_URL}" color="#2563eb">GitHub</a>',
        'bullets': [
            'Engineered a Temporal Fusion Transformer (TFT) model achieving 22% higher accuracy than XGBoost and KNN baselines for seismic structural response prediction.',
            'Performed Exploratory Data Analysis (EDA) using Pandas, NumPy, and Seaborn; implemented complex neural network architectures with PyTorch.',
            'Executed hyperparameter optimization and rigorous model evaluation for production deployment readiness.',
            'Deployed interactive model on Hugging Face Spaces for real-time seismic prediction.',
        ],
    },
    'agentic': {
        'title': 'Agentic AI System - RAG Pipeline with LLM Reasoning',
        'tags': 'LLMs | RAG | Vector Database | Prompt Engineering',
        'demo': f'<a href="{GITHUB_URL}" color="#2563eb">GitHub</a>',
        'bullets': [
            'Built end-to-end RAG pipeline: document retrieval via vector database, LLM reasoning, and context-aware response generation.',
            'Integrated vector database for efficient semantic search and implemented prompt engineering for optimized outputs.',
            'Designed agentic workflow combining retrieval, reasoning, and generation modules for intelligent document understanding.',
        ],
    },
    'saint': {
        'title': 'SAINT Model - Attention-Based Tabular Data Classification',
        'tags': 'PyTorch | Attention Mechanisms | Tabular Data',
        'demo': f'<a href="{GITHUB_URL}" color="#2563eb">GitHub</a>',
        'bullets': [
            'Implemented Self-Attention and Intersample Attention (SAINT) mechanisms for structured tabular data classification.',
            'Achieved improved feature interaction learning through attention-based architecture optimization.',
        ],
    },
    'dashboard': {
        'title': 'Interactive Sales Analytics Dashboard with Power BI',
        'tags': 'Power BI | DAX | Data Analytics',
        'demo': f'<a href="{GITHUB_URL}" color="#2563eb">GitHub</a>',
        'bullets': [
            'Designed a Power BI dashboard utilizing advanced DAX formulas for real-time sales analysis and KPI tracking.',
            'Implemented customer segmentation visualizations, enabling actionable business insights for stakeholders.',
        ],
    },
}

ALL_CERTS = [
    'Oracle Cloud Infrastructure 2025 AI Foundations Associate (Oracle University)',
    'Building RAG Agents with LLMs (NVIDIA DLI)',
    'Generative AI Essentials (AWS Skill Builder)',
    'Prompt Engineering (AWS Skill Builder)',
    'Python for Data Science (IBM)',
    'Machine Learning with Python (IBM Cognitive Class)',
    'Deep Learning Fundamentals (IBM Cognitive Class)',
    'Accelerating Deep Learning with GPUs (IBM Cognitive Class)',
    'Supervised Machine Learning (Coursera)',
    'MongoDB Atlas (MongoDB University)',
    'Accenture Data Analytics Simulation (Forage)',
    'HTML Training (IIT Bombay - Spoken Tutorial Project)',
]

LANGUAGES = 'English (Professional) | Kannada (Native) | Hindi (Fluent) | Urdu (Fluent)'


# ========== RESUME CONFIGURATIONS ==========

RESUMES = {
    'ml_engineer': {
        'filename': 'Farhan_Akhtar_ML_Engineer.pdf',
        'title': 'Farhan_Akhtar_ML_Engineer',
        'headline': 'Machine Learning Engineer',
        'summary': (
            'Machine Learning Engineer with research experience at NIT Calicut, specializing in deep learning, '
            'predictive modeling, and transformer architectures. Proven ability to build production-grade ML systems '
            'with measurable results, including a Temporal Fusion Transformer achieving 22% improvement over traditional '
            'ML baselines. Skilled in PyTorch, TensorFlow, Scikit-learn, and end-to-end ML pipelines from data '
            'preprocessing through model deployment. Proficient in statistical analysis, feature engineering, and '
            'model optimization for real-world engineering applications.'
        ),
        'skills': {
            'Programming': 'Python, SQL, C, R, HTML/CSS',
            'ML &amp; Deep Learning': 'PyTorch, TensorFlow, Keras, Scikit-learn, XGBoost, Transformers, CNN, RNN, LSTM, GANs',
            'Data Science &amp; Analytics': 'Pandas, NumPy, Matplotlib, Seaborn, Feature Engineering, Jupyter, Power BI, DAX',
            'Cloud &amp; Tools': 'AWS, Oracle Cloud, MongoDB, Git/GitHub, Hugging Face',
        },
        'projects_order': ['seismic', 'saint', 'agentic', 'dashboard'],
        'certs_order': [
            'Oracle Cloud Infrastructure 2025 AI Foundations Associate (Oracle University)',
            'Python for Data Science (IBM)',
            'Machine Learning with Python (IBM Cognitive Class)',
            'Deep Learning Fundamentals (IBM Cognitive Class)',
            'Accelerating Deep Learning with GPUs (IBM Cognitive Class)',
            'Supervised Machine Learning (Coursera)',
            'MongoDB Atlas (MongoDB University)',
            'Accenture Data Analytics Simulation (Forage)',
        ],
    },
    'agentic_ai': {
        'filename': 'Farhan_Akhtar_Agentic_AI_Engineer.pdf',
        'title': 'Farhan_Akhtar_Agentic_AI_Engineer',
        'headline': 'Agentic AI Engineer',
        'summary': (
            'Agentic AI Engineer specializing in building autonomous AI systems that combine LLM reasoning with '
            'retrieval-augmented generation pipelines. Experienced in designing multi-step agentic workflows that '
            'integrate vector databases, prompt engineering, and context-aware response generation for complex '
            'document understanding tasks. Strong foundation in transformer architectures and deep learning from '
            'research at NIT Calicut. Proficient in LangChain, vector databases, embedding models, and fine-tuning '
            'strategies for building production-grade AI agents that reason, retrieve, and generate.'
        ),
        'skills': {
            'Agentic AI &amp; LLMs': 'RAG Pipelines, Prompt Engineering, LLM Integration, Vector Databases, Agentic Workflows, LangChain, Fine-Tuning, Embeddings, AI Agents',
            'Deep Learning': 'PyTorch, Transformers, LSTM, Attention Mechanisms, Neural Networks',
            'Programming': 'Python, SQL, C, R',
            'Cloud &amp; Tools': 'AWS, Oracle Cloud, MongoDB, Git/GitHub, Hugging Face',
        },
        'projects_order': ['agentic', 'seismic', 'saint', 'dashboard'],
        'certs_order': [
            'Building RAG Agents with LLMs (NVIDIA DLI)',
            'Oracle Cloud Infrastructure 2025 AI Foundations Associate (Oracle University)',
            'Generative AI Essentials (AWS Skill Builder)',
            'Prompt Engineering (AWS Skill Builder)',
            'Deep Learning Fundamentals (IBM Cognitive Class)',
            'Python for Data Science (IBM)',
            'Machine Learning with Python (IBM Cognitive Class)',
            'Supervised Machine Learning (Coursera)',
        ],
    },
    'genai': {
        'filename': 'Farhan_Akhtar_GenAI_Engineer.pdf',
        'title': 'Farhan_Akhtar_GenAI_Engineer',
        'headline': 'Generative AI Engineer',
        'summary': (
            'Generative AI Engineer with expertise in large language models, retrieval-augmented generation, '
            'and prompt engineering. Certified by NVIDIA in Building RAG Agents with LLMs and AWS in Generative AI '
            'Essentials. Skilled in designing end-to-end generative AI pipelines including document ingestion, '
            'embedding generation, semantic retrieval, and context-aware response synthesis. Strong deep learning '
            'foundation with hands-on experience building transformer models and deploying them on Hugging Face '
            'Spaces. Passionate about building AI systems that generate, reason, and interact intelligently.'
        ),
        'skills': {
            'Generative AI &amp; LLMs': 'RAG Pipelines, Prompt Engineering, LLM Integration, Fine-Tuning, Embeddings, Vector Databases, LangChain, Hugging Face',
            'Deep Learning': 'PyTorch, TensorFlow, Keras, Transformers, CNN, RNN, LSTM, GANs',
            'Programming': 'Python, SQL, C, R, HTML/CSS',
            'Cloud &amp; Data': 'AWS, Oracle Cloud, MongoDB, Pandas, NumPy, Matplotlib, Power BI',
        },
        'projects_order': ['agentic', 'seismic', 'saint', 'dashboard'],
        'certs_order': [
            'Building RAG Agents with LLMs (NVIDIA DLI)',
            'Generative AI Essentials (AWS Skill Builder)',
            'Prompt Engineering (AWS Skill Builder)',
            'Oracle Cloud Infrastructure 2025 AI Foundations Associate (Oracle University)',
            'Deep Learning Fundamentals (IBM Cognitive Class)',
            'Accelerating Deep Learning with GPUs (IBM Cognitive Class)',
            'Machine Learning with Python (IBM Cognitive Class)',
            'Python for Data Science (IBM)',
        ],
    },
    'ai_engineer': {
        'filename': 'Farhan_Akhtar_AI_Engineer.pdf',
        'title': 'Farhan_Akhtar_AI_Engineer',
        'headline': 'AI Engineer',
        'summary': (
            'AI Engineer with research experience at NIT Calicut and a comprehensive skill set spanning machine '
            'learning, deep learning, generative AI, and agentic AI systems. Built production-grade solutions including '
            'a Temporal Fusion Transformer achieving 22% improvement over baselines and an end-to-end RAG pipeline '
            'for intelligent document understanding. Certified by Oracle (AI Foundations), NVIDIA (RAG Agents), and AWS '
            '(Generative AI). Proficient in the full AI/ML stack from data engineering and model development through '
            'deployment on cloud platforms and Hugging Face Spaces.'
        ),
        'skills': {
            'AI &amp; ML': 'PyTorch, TensorFlow, Keras, Scikit-learn, XGBoost, Transformers, CNN, RNN, LSTM, GANs',
            'LLM &amp; Agentic AI': 'RAG Pipelines, Prompt Engineering, LLM Integration, Vector Databases, Agentic Workflows, LangChain, Fine-Tuning, Embeddings',
            'Data Science': 'Pandas, NumPy, Matplotlib, Seaborn, Feature Engineering, Jupyter',
            'Cloud &amp; Tools': 'AWS, Oracle Cloud, MongoDB, Git/GitHub, Power BI, DAX, Hugging Face',
            'Programming': 'Python, SQL, C, R, HTML/CSS',
        },
        'projects_order': ['seismic', 'agentic', 'saint', 'dashboard'],
        'certs_order': ALL_CERTS,
    },
}


# ========== STYLES ==========

def get_styles():
    return {
        'name': ParagraphStyle('Name', fontName='Times New Roman', fontSize=18, leading=22, alignment=TA_CENTER, spaceAfter=2, textColor=colors.HexColor('#1a1a2e')),
        'headline': ParagraphStyle('Headline', fontName='Times New Roman', fontSize=11, leading=14, alignment=TA_CENTER, spaceAfter=4, textColor=colors.HexColor('#4a4a6a')),
        'contact': ParagraphStyle('Contact', fontName='Times New Roman', fontSize=9, leading=12, alignment=TA_CENTER, spaceAfter=4, textColor=colors.HexColor('#444444')),
        'section': ParagraphStyle('Section', fontName='Times New Roman', fontSize=11, leading=14, spaceBefore=10, spaceAfter=3, textColor=colors.black),
        'body': ParagraphStyle('Body', fontName='Times New Roman', fontSize=9.5, leading=13, alignment=TA_LEFT, spaceAfter=2, textColor=colors.HexColor('#333333')),
        'bullet': ParagraphStyle('Bullet', fontName='Times New Roman', fontSize=9.2, leading=12.5, leftIndent=12, bulletIndent=0, spaceAfter=1.5, textColor=colors.HexColor('#333333')),
        'skill_label': ParagraphStyle('SkillLabel', fontName='Times New Roman', fontSize=9.2, leading=12, spaceAfter=1, textColor=colors.black),
        'skill_body': ParagraphStyle('SkillBody', fontName='Times New Roman', fontSize=9.2, leading=12, leftIndent=8, spaceAfter=2, textColor=colors.HexColor('#444444')),
        'meta_left': ParagraphStyle('MetaLeft', fontName='Times New Roman', fontSize=9.5, leading=12, spaceAfter=0, textColor=colors.black),
        'meta_right': ParagraphStyle('MetaRight', fontName='Times New Roman', fontSize=9.5, leading=12, alignment=2, spaceAfter=0, textColor=colors.HexColor('#555555')),
        'sub_meta': ParagraphStyle('SubMeta', fontName='Times New Roman', fontSize=9, leading=12, textColor=colors.HexColor('#555555'), spaceAfter=2),
    }


# ========== BUILDER ==========

def build_resume(config, styles):
    s = styles
    story = []

    # Name
    story.append(Paragraph('<b>FARHAN AKHTAR MAKANDAR</b>', s['name']))
    # Domain headline
    story.append(Paragraph(config['headline'], s['headline']))
    # Contact
    story.append(Paragraph(BASE_CONTACT, s['contact']))
    # Divider
    story.append(HRFlowable(width="100%", thickness=1, color=colors.black, spaceAfter=2))

    # Professional Summary
    story.append(Paragraph('<b>PROFESSIONAL SUMMARY</b>', s['section']))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#999999'), spaceAfter=3))
    story.append(Paragraph(config['summary'], s['body']))

    # Education
    story.append(Paragraph('<b>EDUCATION</b>', s['section']))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#999999'), spaceAfter=3))
    for edu in EDUCATION:
        story.append(Paragraph(f'<b>{edu["degree"]}</b>  {edu.get("period", "")}', s['meta_left']))
        story.append(Paragraph(edu['school'], s['sub_meta']))
        if 'coursework' in edu:
            story.append(Paragraph(f'Relevant Coursework: {edu["coursework"]}', s['sub_meta']))

    # Experience
    story.append(Paragraph('<b>PROFESSIONAL EXPERIENCE</b>', s['section']))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#999999'), spaceAfter=3))
    story.append(Paragraph(f'<b>{EXPERIENCE["role"]}</b>  {EXPERIENCE["period"]}', s['meta_left']))
    story.append(Paragraph(EXPERIENCE['company'], s['sub_meta']))
    for b in EXPERIENCE['bullets']:
        story.append(Paragraph(b, s['bullet'], bulletText='\u2022'))

    # Projects
    story.append(Paragraph('<b>ACADEMIC PROJECTS</b>', s['section']))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#999999'), spaceAfter=3))
    for pid in config['projects_order']:
        p = ALL_PROJECTS[pid]
        story.append(Paragraph(f'<b>{p["title"]}</b>', s['body']))
        story.append(Paragraph(f'{p["tags"]}  |  {p["demo"]}', ParagraphStyle('Tags', parent=s['sub_meta'], fontSize=8.5)))
        for b in p['bullets']:
            story.append(Paragraph(b, s['bullet'], bulletText='\u2022'))
        story.append(Spacer(1, 2))

    # Skills
    story.append(Paragraph('<b>TECHNICAL SKILLS</b>', s['section']))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#999999'), spaceAfter=3))
    for label, vals in config['skills'].items():
        story.append(Paragraph(f'<b>{label}:</b> {vals}', s['skill_body']))

    # Certifications
    story.append(Paragraph('<b>CERTIFICATIONS</b>', s['section']))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#999999'), spaceAfter=3))
    for c in config['certs_order']:
        story.append(Paragraph(c, s['bullet'], bulletText='\u2022'))

    # Languages
    story.append(Paragraph('<b>LANGUAGES</b>', s['section']))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#999999'), spaceAfter=3))
    story.append(Paragraph(LANGUAGES, s['body']))

    return story


def generate_all():
    styles = get_styles()
    for key, config in RESUMES.items():
        output_path = os.path.join(OUTPUT_DIR, config['filename'])
        doc = SimpleDocTemplate(
            output_path,
            pagesize=A4,
            topMargin=1.2*cm,
            bottomMargin=1.2*cm,
            leftMargin=1.5*cm,
            rightMargin=1.5*cm,
            title=config['title'],
            author='Z.ai',
            creator='Z.ai',
            subject=f'Resume - {config["headline"]} - Farhan Akhtar Makandar',
        )
        story = build_resume(config, styles)
        doc.build(story)
        print(f'Generated: {output_path}')


if __name__ == '__main__':
    generate_all()
