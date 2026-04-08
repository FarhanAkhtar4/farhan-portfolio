"""
Generate the main resume.pdf with Agentic AI / GenAI focused summary and skills.
This replaces the existing resume in public/resume.pdf
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

pdfmetrics.registerFont(TTFont('Times New Roman', '/usr/share/fonts/truetype/english/Times-New-Roman.ttf'))
registerFontFamily('Times New Roman', normal='Times New Roman', bold='Times New Roman')

output_path = '/home/z/my-project/public/resume.pdf'

doc = SimpleDocTemplate(
    output_path, pagesize=A4,
    topMargin=1.2*cm, bottomMargin=1.2*cm, leftMargin=1.5*cm, rightMargin=1.5*cm,
    title='Farhan_Akhtar_Makandar_Resume',
    author='Z.ai', creator='Z.ai',
    subject='Resume - Farhan Akhtar Makandar - Agentic AI & ML Engineer',
)

w = A4[0] - 3*cm

ns = ParagraphStyle('Name', fontName='Times New Roman', fontSize=20, leading=24, alignment=TA_CENTER, spaceAfter=2, textColor=colors.HexColor('#1a1a2e'))
cs = ParagraphStyle('Contact', fontName='Times New Roman', fontSize=9.5, leading=13, alignment=TA_CENTER, spaceAfter=4, textColor=colors.HexColor('#444444'))
ss = ParagraphStyle('Section', fontName='Times New Roman', fontSize=11.5, leading=14, spaceBefore=8, spaceAfter=3, textColor=colors.HexColor('#1a1a2e'))
bs = ParagraphStyle('Body', fontName='Times New Roman', fontSize=9.5, leading=13, alignment=TA_LEFT, spaceAfter=2, textColor=colors.HexColor('#333333'))
bls = ParagraphStyle('Bullet', fontName='Times New Roman', fontSize=9.2, leading=12.5, leftIndent=12, bulletIndent=0, spaceAfter=1.5, textColor=colors.HexColor('#333333'))
ml = ParagraphStyle('MetaL', fontName='Times New Roman', fontSize=9.5, leading=12, spaceAfter=0, textColor=colors.black)
mr = ParagraphStyle('MetaR', fontName='Times New Roman', fontSize=9.5, leading=12, alignment=2, spaceAfter=0, textColor=colors.HexColor('#555555'))
sm = ParagraphStyle('SubMeta', fontName='Times New Roman', fontSize=9, leading=12, textColor=colors.HexColor('#555555'), spaceAfter=2)
sk = ParagraphStyle('Skill', fontName='Times New Roman', fontSize=9.2, leading=12, leftIndent=8, spaceAfter=2, textColor=colors.HexColor('#444444'))

story = []

# Header
story.append(Paragraph('<b>FARHAN AKHTAR MAKANDAR</b>', ns))
story.append(Spacer(1, 2))
story.append(Paragraph(
    '<a href="mailto:farhanmakandar01@outlook.com" color="#2563eb">farhanmakandar01@outlook.com</a>'
    '  |  +91 7349123558  |  Sirsi, Karnataka, India  |  '
    '<a href="https://portfolio-rust-xi-38.vercel.app/" color="#2563eb">Portfolio</a>'
    '  |  <a href="https://github.com/FarhanAkhtar4" color="#2563eb">GitHub</a>'
    '  |  <a href="https://huggingface.co/FarhanAkhtar11" color="#2563eb">Hugging Face</a>',
    cs))
story.append(Spacer(1, 3))
story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#1a1a2e'), spaceAfter=4))

# Professional Summary - Agentic AI / GenAI focused
story.append(Paragraph('<b>PROFESSIONAL SUMMARY</b>', ss))
story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#cccccc'), spaceAfter=3))
story.append(Paragraph(
    'AI Engineer with research experience at NIT Calicut, specializing in Agentic AI systems, '
    'LLM-based retrieval-augmented generation pipelines, and deep learning model development. '
    'Built an end-to-end RAG pipeline combining vector database retrieval with LLM reasoning for '
    'intelligent document understanding, and a Temporal Fusion Transformer achieving 22% improvement '
    'over XGBoost and KNN baselines. Certified by NVIDIA (Building RAG Agents with LLMs), Oracle '
    '(AI Foundations Associate), and AWS (Generative AI Essentials, Prompt Engineering). Seeking '
    'roles in Agentic AI, Generative AI, and ML Systems Engineering.',
    bs))

# Education
story.append(Paragraph('<b>EDUCATION</b>', ss))
story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#cccccc'), spaceAfter=3))
story.append(Paragraph('<b>B.E. in Artificial Intelligence &amp; Machine Learning</b>  <b>Expected 2026</b>', ml))
story.append(Paragraph('Yenepoya Institute of Technology, Moodbidri (VTU)', sm))
story.append(Paragraph('Relevant Coursework: Deep Learning, Neural Networks, Data Structures &amp; Algorithms, Linear Algebra, Probability &amp; Statistics, DBMS', sm))
story.append(Paragraph('<b>Pre-University Course (Science)</b>  <b>2022</b>', ml))
story.append(Paragraph('M.E.S Pre-University College, Sirsi', sm))

# Experience
story.append(Paragraph('<b>PROFESSIONAL EXPERIENCE</b>', ss))
story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#cccccc'), spaceAfter=3))
story.append(Paragraph('<b>Research Intern - AI/ML</b>  <b>Jun 2024 - Dec 2024</b>', ml))
story.append(Paragraph('NIT Calicut, India', sm))
for b in [
    'Collaborated on cutting-edge AI research focused on neural network optimization and deep learning applications for engineering problems.',
    'Developed and evaluated transformer-based models for complex predictive tasks, achieving rigorous performance benchmarks.',
    'Conducted comprehensive data analysis and model validation using PyTorch and scientific computing libraries.',
    'Assisted in documenting research findings and preparing technical reports for publication.',
]:
    story.append(Paragraph(b, bls, bulletText='\u2022'))

# Projects - Agentic AI first, then ML
story.append(Paragraph('<b>ACADEMIC PROJECTS</b>', ss))
story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#cccccc'), spaceAfter=3))

# Agentic AI first
story.append(Paragraph('<b>Agentic AI System - RAG Pipeline with LLM Reasoning</b>', bs))
story.append(Paragraph('LLMs | RAG | Vector Database | Prompt Engineering | <a href="https://github.com/FarhanAkhtar4" color="#2563eb">GitHub</a>', ParagraphStyle('t1', parent=sm, fontSize=8.5)))
for b in [
    'Built end-to-end RAG pipeline: document retrieval via vector database, LLM reasoning, and context-aware response generation.',
    'Integrated vector database for efficient semantic search and implemented prompt engineering for optimized outputs.',
]:
    story.append(Paragraph(b, bls, bulletText='\u2022'))
story.append(Spacer(1, 2))

story.append(Paragraph('<b>Seismic Response Prediction Using Temporal Fusion Transformer</b>', bs))
story.append(Paragraph('PyTorch | Transformers | Time Series | <a href="https://huggingface.co/spaces/FarhanAkhtar11/SEISMIC_PREDICTOR" color="#2563eb">Live Demo</a> | <a href="https://github.com/FarhanAkhtar4" color="#2563eb">GitHub</a>', ParagraphStyle('t2', parent=sm, fontSize=8.5)))
for b in [
    'Engineered a Temporal Fusion Transformer model achieving 22% higher accuracy than XGBoost and KNN baselines.',
    'Performed Exploratory Data Analysis (EDA) using Pandas, NumPy, and Seaborn; implemented complex neural network architectures with PyTorch.',
    'Executed hyperparameter optimization and rigorous model evaluation for production deployment readiness.',
]:
    story.append(Paragraph(b, bls, bulletText='\u2022'))
story.append(Spacer(1, 2))

story.append(Paragraph('<b>SAINT Model - Attention-Based Tabular Data Classification</b>', bs))
story.append(Paragraph('PyTorch | Attention Mechanisms | Tabular Data | <a href="https://github.com/FarhanAkhtar4" color="#2563eb">GitHub</a>', ParagraphStyle('t3', parent=sm, fontSize=8.5)))
for b in [
    'Implemented Self-Attention and Intersample Attention (SAINT) mechanisms for structured tabular data classification.',
]:
    story.append(Paragraph(b, bls, bulletText='\u2022'))
story.append(Spacer(1, 2))

story.append(Paragraph('<b>Interactive Sales Analytics Dashboard with Power BI</b>', bs))
story.append(Paragraph('Power BI | DAX | Data Analytics | <a href="https://github.com/FarhanAkhtar4" color="#2563eb">GitHub</a>', ParagraphStyle('t4', parent=sm, fontSize=8.5)))
for b in [
    'Designed a Power BI dashboard utilizing advanced DAX formulas for real-time sales analysis and KPI tracking.',
    'Implemented customer segmentation visualizations for actionable business insights.',
]:
    story.append(Paragraph(b, bls, bulletText='\u2022'))

# Skills - LLM & Agentic AI first
story.append(Paragraph('<b>TECHNICAL SKILLS</b>', ss))
story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#cccccc'), spaceAfter=3))
for label, vals in [
    ('LLM &amp; Agentic AI', 'RAG Pipelines, Prompt Engineering, LLM Integration, Vector Databases, Agentic Workflows, LangChain, Fine-Tuning, Embeddings'),
    ('ML &amp; Deep Learning', 'PyTorch, TensorFlow, Keras, Scikit-learn, XGBoost, Transformers, CNN, RNN, LSTM, GANs'),
    ('Data Science', 'Pandas, NumPy, Matplotlib, Seaborn, Feature Engineering, Jupyter'),
    ('Cloud &amp; Tools', 'AWS, Oracle Cloud, MongoDB, Git/GitHub, Power BI, DAX'),
    ('Programming', 'Python, SQL, C, R, HTML/CSS'),
]:
    story.append(Paragraph(f'<b>{label}:</b> {vals}', sk))

# Certifications
story.append(Paragraph('<b>CERTIFICATIONS</b>', ss))
story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#cccccc'), spaceAfter=3))
for c in [
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
    'HTML Training - Spoken Tutorial Project, IIT Bombay',
]:
    story.append(Paragraph(c, bls, bulletText='\u2022'))

# Languages
story.append(Paragraph('<b>LANGUAGES</b>', ss))
story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#cccccc'), spaceAfter=3))
story.append(Paragraph('English (Professional) | Kannada (Native) | Hindi (Fluent) | Urdu (Fluent)', bs))

doc.build(story)
print(f'Main resume updated: {output_path}')
