"""Regenerate the public activities PDF and its printable HTML equivalent.

Requires ReportLab (pip install reportlab). Run from any directory.
The project summaries live in data/activities.json.
"""
from pathlib import Path
import json
from html import escape
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether

root = Path(__file__).resolve().parents[1]
activities = json.loads((root / 'data/activities.json').read_text())
ink = colors.HexColor('#17181c')
muted = colors.HexColor('#4a4945')
accent = colors.HexColor('#a03e21')
line = colors.HexColor('#d6d1c8')
styles = {
    'name': ParagraphStyle('name', fontName='Times-Roman', fontSize=29, leading=31, textColor=ink),
    'label': ParagraphStyle('label', fontName='Helvetica', fontSize=8, leading=12, textColor=muted),
    'body': ParagraphStyle('body', fontName='Helvetica', fontSize=9.2, leading=12.4, textColor=ink),
    'role': ParagraphStyle('role', fontName='Helvetica', fontSize=8.4, leading=11, textColor=muted),
    'title': ParagraphStyle('title', fontName='Helvetica-Bold', fontSize=10, leading=13, textColor=ink),
    'section': ParagraphStyle('section', fontName='Helvetica-Bold', fontSize=8.4, leading=12, textColor=accent, spaceBefore=12, spaceAfter=6),
}
def p(text, style='body'): return Paragraph(text, styles[style])
intro = 'I am a Warren Township High School senior interested in student leadership, Black community, entrepreneurship, and technology. My projects give me ways to bring those interests together.'
learning = 'Current: AP Computer Science Principles; Language and Composition; ASU Universal Learner ENG 101 coursework in progress. ACT composite: 25 (self-reported).'
credentials = 'Microsoft Office Specialist certifications in Excel, Word, and PowerPoint; Microsoft Office Specialist Associate.'
story = [p('Kaliph Howard', 'name'), Spacer(1,5),
    p('ACTIVITIES SUMMARY  /  WARREN TOWNSHIP HIGH SCHOOL  /  CLASS OF 2027', 'label'),
    p('<link href="mailto:adventacious@gmail.com">adventacious@gmail.com</link>  |  Chicago, Illinois', 'label'),
    Spacer(1,10), p(intro), p('SELECTED RESPONSIBILITIES AND PROJECTS', 'section')]
for a in activities:
    heading = [p(escape(a['title']), 'title'), p(escape(a['role']).replace('·',' / '), 'role')]
    t = Table([[heading, p(escape(a['description']))]], colWidths=[164, 340], hAlign='LEFT')
    t.setStyle(TableStyle([
        ('VALIGN',(0,0),(-1,-1),'TOP'), ('LEFTPADDING',(0,0),(-1,-1),0),
        ('RIGHTPADDING',(0,0),(0,0),14), ('RIGHTPADDING',(1,0),(1,0),0),
        ('TOPPADDING',(0,0),(-1,-1),6), ('BOTTOMPADDING',(0,0),(-1,-1),7),
        ('LINEABOVE',(0,0),(-1,0),.45,line),
    ]))
    story.append(KeepTogether([t]))
story += [p('CURRENT LEARNING', 'section'), p(learning), Spacer(1,6), p(credentials)]
def footer(canvas, doc):
    canvas.setStrokeColor(line); canvas.line(54,47,558,47)
    canvas.setFillColor(muted); canvas.setFont('Helvetica',8)
    canvas.drawString(54,34,'Kaliph Howard | Activities and interests | September 2026')
    canvas.drawRightString(558,34,str(doc.page))
doc=SimpleDocTemplate(str(root/'assets/kaliph-howard-activities.pdf'),pagesize=letter,
    rightMargin=54,leftMargin=54,topMargin=39,bottomMargin=60,
    title='Kaliph Howard - Activities Summary',author='Kaliph Howard')
doc.build(story,onFirstPage=footer,onLaterPages=footer)

rows=''.join(f'<article><header><h2>{escape(a["title"])}</h2><p>{escape(a["role"])}</p></header><p>{escape(a["description"])}</p></article>' for a in activities)
html=f'''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Activities - Kaliph Howard</title><style>
@page{{size:Letter;margin:.6in}}*{{box-sizing:border-box}}body{{font:10pt/1.45 Arial,sans-serif;color:#17181c;max-width:7in;margin:2rem auto;padding:0 1rem}}h1{{font:30pt Georgia,serif;margin:0}}h2{{font-size:10pt;margin:0}}h3{{font-size:9pt;color:#a03e21;letter-spacing:.08em;margin:18pt 0 6pt}}p{{margin:5pt 0}}article{{display:grid;grid-template-columns:2in 1fr;gap:16pt;border-top:1px solid #d6d1c8;padding:8pt 0;break-inside:avoid}}article header p{{font-size:9pt;color:#4a4945}}a{{color:inherit}}@media(max-width:540px){{article{{grid-template-columns:1fr;gap:0}}}}@media print{{body{{margin:0;padding:0}}}}
</style></head><body><h1>Kaliph Howard</h1><p>Warren Township High School | Class of 2027</p><p><a href="mailto:adventacious@gmail.com">adventacious@gmail.com</a> | Chicago, Illinois</p><p>{intro}</p><h3>SELECTED RESPONSIBILITIES AND PROJECTS</h3>{rows}<h3>CURRENT LEARNING</h3><p>{learning}</p><p>{credentials}</p></body></html>'''
(root/'scripts/activities-template.html').write_text(html)
print('Updated activities PDF and printable HTML from data/activities.json.')
