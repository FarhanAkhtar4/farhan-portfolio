import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.lib import colors
from reportlab.lib.units import cm, mm
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# Register fonts
pdfmetrics.registerFont(TTFont('Times New Roman', '/usr/share/fonts/truetype/english/Times-New-Roman.ttf'))
pdfmetrics.registerFont(TTFont('Calibri', '/usr/share/fonts/truetype/english/calibri-regular.ttf'))
registerFontFamily('Times New Roman', normal='Times New Roman', bold='Times New Roman')
registerFontFamily('Calibri', normal='Calibri', bold='Calibri')

output_path = '/home/z/my-project/public/resume.pdf'

doc = SimpleDocTemplate(
    output_path,
    pagesize=A4,
    topMargin=1.2*cm,
    bottomMargin=1.2*cm,
    leftMargin=1.5*cm,
    rightMargin=1.5*cm,
    title='Farhan_Akhtar_Makandar_Resume',
    author='Z.ai',
    creator='Z.ai',
    subject='Resume of Farhan Akhtar Makandar - ML Systems Engineer'
)

usable_width = A4[0] - 3*cm

# Styles
name_style = ParagraphStyle(
    name='Name',
    fontName='Times New Roman',
    fontSize=20,
    leading=24,
    alignment=TA_CENTER,
    spaceAfter=2,
    textColor=colors.HexColor('#1a1a2e'),
)

contact_style = ParagraphStyle(
    name='Contact',
    fontName='Times New Roman',
    fontSize=9.5,
    leading=13,
    alignment=TA_CENTER,
    spaceAfter=1,
    textColor=colors.HexColor('#444444'),
)

section_style = ParagraphStyle(
    name='Section',
    fontName='Times New Roman',
    fontSize=11.5,
    leading=14,
    spaceBefore=8,
    spaceAfter=3,
    textColor=colors.HexColor('#1a1a2e'),
)

body_style = ParagraphStyle(
    name='Body',
    fontName='Times New Roman',
    fontSize=9.5,
    leading=13,
    alignment=TA_LEFT,
    spaceAfter=2,
    textColor=colors.HexColor('#333333'),
)

summary_style = ParagraphStyle(
    name='Summary',
    fontName='Times New Roman',
    fontSize=9.5,
    leading=13,
    alignment=TA_LEFT,
    spaceAfter=3,
    textColor=colors.HexColor('#333333'),
)

bullet_style = ParagraphStyle(
    name='Bullet',
    fontName='Times New Roman',
    fontSize=9.2,
    leading=12.5,
    leftIndent=12,
    bulletIndent=0,
    spaceAfter=1.5,
    textColor=colors.HexColor('#333333'),
)

skill_header_style = ParagraphStyle(
    name='SkillHeader',
    fontName='Times New Roman',
    fontSize=9.2,
    leading=12,
    spaceAfter=1,
    textColor=colors.HexColor('#1a1a2e'),
)

skill_body_style = ParagraphStyle(
    name='SkillBody',
    fontName='Times New Roman',
    fontSize=9.2,
    leading=12,
    leftIndent=8,
    spaceAfter=2,
    textColor=colors.HexColor('#444444'),
)

link_color = colors.HexColor('#2563eb')

story = []

# === HEADER ===
story.append(Paragraph('<b>FARHAN AKHTAR MAKANDAR</b>', name_style))
story.append(Spacer(1, 3))

# Contact info with clickable links
contact_text = (
    '<a href="mailto:farhanmakandar01@outlook.com" color="#2563eb">farhanmakandar01@outlook.com</a>'
    '  |  +91 7349123558  |  Sirsi, Karnataka, India  |  '
    '<a href="https://portfolio-rust-xi-38.vercel.app/" color="#2563eb">Portfolio</a>'
    '  |  '
    '<a href="https://github.com/FarhanAkhtar4" color="#2563eb">GitHub</a>'
    '  |  '
    '<a href="https://huggingface.co/FarhanAkhtar11" color="#2563eb">Hugging Face</a>'
)
story.append(Paragraph(contact_text, contact_style))
story.append(Spacer(1, 4))

# Divider
story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#1a1a2e'), spaceAfter=4))

# === PROFESSIONAL SUMMARY ===
story.append(Paragraph('<b>PROFESSIONAL SUMMARY</b>', section_style))
story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#cccccc'), spaceAfter=3))
story.append(Paragraph(
    'Machine Learning Engineer and Research Intern at NIT Calicut with a strong foundation in deep learning, '
    'predictive analytics, transformer models, and agentic AI systems. Skilled in PyTorch, TensorFlow, LLM '
    'integration, and RAG pipelines. Proven ability to apply theoretical knowledge to complex engineering problems '
    'through rigorous research and academic projects, including a Temporal Fusion Transformer achieving 22% '
    'improvement over traditional ML baselines.',
    summary_style
))

# === EDUCATION ===
story.append(Paragraph('<b>EDUCATION</b>', section_style))
story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#cccccc'), spaceAfter=3))

edu_data = [
    [Paragraph('<b>B.E. in Artificial Intelligence &amp; Machine Learning</b>', ParagraphStyle('eh', parent=body_style, fontSize=9.5)),
     Paragraph('<b>Expected 2026</b>', ParagraphStyle('ed', parent=body_style, fontSize=9.5, alignment=2))],
    [Paragraph('Yenepoya Institute of Technology, Moodbidri (VTU)', ParagraphStyle('ei', parent=body_style, fontSize=9, textColor=colors.HexColor('#555555'))),
     Paragraph('', body_style)],
]
edu_table = Table(edu_data, colWidths=[usable_width * 0.78, usable_width * 0.22])
edu_table.setStyle(TableStyle([
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('TOPPADDING', (0, 0), (-1, -1), 0),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
]))
story.append(edu_table)
story.append(Paragraph('Relevant Coursework: Deep Learning, Neural Networks, Data Structures &amp; Algorithms, Linear Algebra, Probability &amp; Statistics, DBMS',
    ParagraphStyle('ec', parent=body_style, fontSize=9, textColor=colors.HexColor('#555555'), spaceAfter=3)))

edu2_data = [
    [Paragraph('<b>Pre-University Course (Science)</b>', ParagraphStyle('e2h', parent=body_style, fontSize=9.5)),
     Paragraph('<b>2022</b>', ParagraphStyle('e2d', parent=body_style, fontSize=9.5, alignment=2))],
    [Paragraph('M.E.S Pre-University College, Sirsi', ParagraphStyle('e2i', parent=body_style, fontSize=9, textColor=colors.HexColor('#555555'))),
     Paragraph('', body_style)],
]
edu2_table = Table(edu2_data, colWidths=[usable_width * 0.78, usable_width * 0.22])
edu2_table.setStyle(TableStyle([
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('TOPPADDING', (0, 0), (-1, -1), 0),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
]))
story.append(edu2_table)

# === PROFESSIONAL EXPERIENCE ===
story.append(Paragraph('<b>PROFESSIONAL EXPERIENCE</b>', section_style))
story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#cccccc'), spaceAfter=3))

exp_data = [
    [Paragraph('<b>Research Intern - AI/ML</b>', ParagraphStyle('xh', parent=body_style, fontSize=9.5)),
     Paragraph('<b>Jun 2024 - Dec 2024</b>', ParagraphStyle('xd', parent=body_style, fontSize=9.5, alignment=2))],
    [Paragraph('NIT Calicut, India', ParagraphStyle('xi', parent=body_style, fontSize=9, textColor=colors.HexColor('#555555'))),
     Paragraph('', body_style)],
]
exp_table = Table(exp_data, colWidths=[usable_width * 0.78, usable_width * 0.22])
exp_table.setStyle(TableStyle([
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('TOPPADDING', (0, 0), (-1, -1), 0),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 0),
]))
story.append(exp_table)
story.append(Spacer(1, 2))

exp_bullets = [
    'Collaborated on cutting-edge AI research focused on neural network optimization and deep learning applications for engineering problems.',
    'Developed and evaluated transformer-based models for complex predictive tasks, achieving rigorous performance benchmarks.',
    'Conducted comprehensive data analysis and model validation using PyTorch and scientific computing libraries.',
    'Assisted in documenting research findings and preparing technical reports for publication.',
]
for b in exp_bullets:
    story.append(Paragraph(b, bullet_style, bulletText='\u2022'))

# === ACADEMIC PROJECTS ===
story.append(Paragraph('<b>ACADEMIC PROJECTS</b>', section_style))
story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#cccccc'), spaceAfter=3))

# Project 1
story.append(Paragraph('<b>Seismic Response Prediction Using Temporal Fusion Transformer</b>', ParagraphStyle('p1h', parent=body_style, fontSize=9.5)))
story.append(Paragraph('PyTorch | Transformers | Time Series | <a href="https://huggingface.co/spaces/FarhanAkhtar11/SEISMIC_PREDICTOR" color="#2563eb">Live Demo</a> | <a href="https://github.com/FarhanAkhtar4" color="#2563eb">GitHub</a>',
    ParagraphStyle('p1t', parent=body_style, fontSize=8.5, textColor=colors.HexColor('#666666'), spaceAfter=2)))
p1_bullets = [
    'Engineered a Temporal Fusion Transformer model achieving 22% higher accuracy than XGBoost and KNN baselines.',
    'Performed Exploratory Data Analysis (EDA) using Pandas, NumPy, and Seaborn; implemented complex neural network architectures with PyTorch.',
    'Executed hyperparameter optimization and rigorous model evaluation for production deployment readiness.',
    'Deployed interactive model on Hugging Face Spaces for real-time seismic prediction.',
]
for b in p1_bullets:
    story.append(Paragraph(b, bullet_style, bulletText='\u2022'))
story.append(Spacer(1, 2))

# Project 2
story.append(Paragraph('<b>SAINT Model - Attention-Based Tabular Data Classification</b>', ParagraphStyle('p2h', parent=body_style, fontSize=9.5)))
story.append(Paragraph('PyTorch | Attention Mechanisms | Tabular Data | <a href="https://github.com/FarhanAkhtar4" color="#2563eb">GitHub</a>',
    ParagraphStyle('p2t', parent=body_style, fontSize=8.5, textColor=colors.HexColor('#666666'), spaceAfter=2)))
p2_bullets = [
    'Implemented Self-Attention and Intersample Attention (SAINT) mechanisms for structured tabular data classification.',
    'Achieved improved feature interaction learning through attention-based architecture optimization.',
]
for b in p2_bullets:
    story.append(Paragraph(b, bullet_style, bulletText='\u2022'))
story.append(Spacer(1, 2))

# Project 3
story.append(Paragraph('<b>Agentic AI System - RAG Pipeline with LLM Reasoning</b>', ParagraphStyle('p3h', parent=body_style, fontSize=9.5)))
story.append(Paragraph('LLMs | RAG | Vector Database | Prompt Engineering | <a href="https://github.com/FarhanAkhtar4" color="#2563eb">GitHub</a>',
    ParagraphStyle('p3t', parent=body_style, fontSize=8.5, textColor=colors.HexColor('#666666'), spaceAfter=2)))
p3_bullets = [
    'Built end-to-end RAG pipeline: document retrieval via vector database, LLM reasoning, and context-aware response generation.',
    'Integrated vector database for efficient semantic search and implemented prompt engineering for optimized outputs.',
]
for b in p3_bullets:
    story.append(Paragraph(b, bullet_style, bulletText='\u2022'))
story.append(Spacer(1, 2))

# === TECHNICAL SKILLS ===
story.append(Paragraph('<b>TECHNICAL SKILLS</b>', section_style))
story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#cccccc'), spaceAfter=3))

skills = [
    ('Programming:', 'Python, SQL, C, R, HTML/CSS'),
    ('ML &amp; Deep Learning:', 'PyTorch, TensorFlow, Keras, Scikit-learn, XGBoost, Transformers, CNN, RNN, LSTM, GANs'),
    ('LLM &amp; Agentic AI:', 'RAG Pipelines, Prompt Engineering, LLM Integration, Vector Databases, Agentic Workflows, LangChain, Fine-Tuning, Embeddings'),
    ('Data Science:', 'Pandas, NumPy, Matplotlib, Seaborn, Feature Engineering, Jupyter'),
    ('Cloud &amp; Tools:', 'AWS, Oracle Cloud, Git/GitHub, Cloudflare, Vercel'),
]
for label, values in skills:
    skill_text = f'<b>{label}</b> {values}'
    story.append(Paragraph(skill_text, skill_body_style))

# === CERTIFICATIONS ===
story.append(Paragraph('<b>CERTIFICATIONS</b>', section_style))
story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#cccccc'), spaceAfter=3))

certs = [
    'Oracle Cloud Infrastructure 2025 AI Foundations Associate',
    'AWS Skill Builder: Generative AI Essentials, Prompt Engineering',
    'NVIDIA DLI: Building RAG Agents with LLMs',
    'IBM: Python for Data Science, Machine Learning with Python, Deep Learning Fundamentals, Accelerating Deep Learning with GPUs',
    'Coursera: Supervised Machine Learning',
    'Accenture Data Analytics Simulation (Forage)',
    'HTML Training - Spoken Tutorial Project, IIT Bombay',
]
for c in certs:
    story.append(Paragraph(c, bullet_style, bulletText='\u2022'))

# === LANGUAGES ===
story.append(Paragraph('<b>LANGUAGES</b>', section_style))
story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor('#cccccc'), spaceAfter=3))
story.append(Paragraph('English (Professional) | Kannada (Native) | Hindi (Fluent) | Urdu (Fluent)', body_style))

# Build
doc.build(story)
print(f"Resume PDF generated at: {output_path}")
