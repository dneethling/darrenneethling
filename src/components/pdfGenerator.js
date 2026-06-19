// src/components/pdfGenerator.js
// Custom-built, brand-matched CV PDF (jsPDF) — mirrors the site's dark hero,
// accent palette, and card styling rather than screenshotting the DOM.

import { jsPDF } from 'jspdf';

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 14;
const CONTENT_W = PAGE_W - MARGIN * 2;
const BOTTOM = PAGE_H - MARGIN;
const CARD_PAD = 5;
const PT = 0.352778; // mm per point
const LHF = 1.2; // line-height factor

const COLORS = {
  hero: '#0B0D1A',
  accent: '#6D5EFC',
  accent2: '#22D3EE',
  text: '#1B2030',
  soft: '#4B5366',
  muted: '#828B9E',
  card: '#FFFFFF',
  pageBg: '#EEF1F8',
  border: '#E7EAF3',
  pill: '#F3F4FB',
  pillBorder: '#E4E7F2',
  heroSoft: '#C9CEE0',
  heroText: '#E8EAF4',
};

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.substring(0, 2), 16),
    g: parseInt(h.substring(2, 4), 16),
    b: parseInt(h.substring(4, 6), 16),
  };
}

// Load an image and return a circular-cropped PNG data URL.
function loadCircularImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const px = 320;
        const canvas = document.createElement('canvas');
        canvas.width = px;
        canvas.height = px;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(px / 2, px / 2, px / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        const ratio = Math.max(px / img.width, px / img.height);
        const w = img.width * ratio;
        const h = img.height * ratio;
        ctx.drawImage(img, (px - w) / 2, (px - h) / 2, w, h);
        resolve(canvas.toDataURL('image/png'));
      } catch (e) {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

export default async function generateCVPdf(data) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait', compress: true });

  const fill = (hex) => { const c = hexToRgb(hex); doc.setFillColor(c.r, c.g, c.b); };
  const stroke = (hex) => { const c = hexToRgb(hex); doc.setDrawColor(c.r, c.g, c.b); };
  const ink = (hex) => { const c = hexToRgb(hex); doc.setTextColor(c.r, c.g, c.b); };

  let y = 0;

  const paintBg = () => { fill(COLORS.pageBg); doc.rect(0, 0, PAGE_W, PAGE_H, 'F'); };
  const newPage = () => { doc.addPage(); paintBg(); y = MARGIN; };
  const ensure = (h) => { if (y + h > BOTTOM) newPage(); };

  const measure = (text, w, size, font = 'normal') => {
    doc.setFont('helvetica', font);
    doc.setFontSize(size);
    return doc.splitTextToSize(String(text || ''), w);
  };

  // Draw a left-aligned text block; topY is the top of the block, returns its bottom.
  const drawBlock = (lines, x, topY, size, font, colorHex) => {
    if (!lines || !lines.length) return topY;
    doc.setFont('helvetica', font);
    doc.setFontSize(size);
    ink(colorHex);
    doc.text(lines, x, topY + size * PT * 0.92, { lineHeightFactor: LHF });
    return topY + lines.length * size * PT * LHF;
  };

  const blockHeight = (lines, size) => lines.length * size * PT * LHF;

  // ---------- Page background ----------
  paintBg();

  // ---------- Hero ----------
  const photo = await loadCircularImage(`${process.env.PUBLIC_URL || ''}${data.photo}`);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  const titleLines = doc.splitTextToSize(data.title || '', 152);

  const photoD = 26;
  const photoTop = 13;
  const nameY = photoTop + photoD + 9;
  const titleTop = nameY + 4.5;
  const titleH = titleLines.length * 7.5 * PT * 1.25;
  const contact1Y = titleTop + titleH + 5;
  const contact2Y = contact1Y + 4.5;
  const heroH = contact2Y + 6;

  // hero background + glow
  fill(COLORS.hero);
  doc.rect(0, 0, PAGE_W, heroH, 'F');
  try {
    doc.saveGraphicsState();
    doc.setGState(new doc.GState({ opacity: 0.22 }));
    fill(COLORS.accent);
    doc.circle(176, 2, 46, 'F');
    doc.setGState(new doc.GState({ opacity: 0.16 }));
    fill(COLORS.accent2);
    doc.circle(16, 14, 34, 'F');
    doc.restoreGraphicsState();
  } catch (e) { /* glow optional */ }

  // accent bar at hero base
  fill(COLORS.accent);
  doc.rect(0, heroH - 1.4, PAGE_W, 1.4, 'F');

  // photo ring + photo
  if (photo) {
    fill(COLORS.accent);
    doc.circle(PAGE_W / 2, photoTop + photoD / 2, photoD / 2 + 1.4, 'F');
    doc.addImage(photo, 'PNG', (PAGE_W - photoD) / 2, photoTop, photoD, photoD);
  }

  // name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(21);
  ink('#FFFFFF');
  doc.text(data.name || '', PAGE_W / 2, nameY, { align: 'center' });

  // title
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  ink(COLORS.heroSoft);
  doc.text(titleLines, PAGE_W / 2, titleTop + 2, { align: 'center', lineHeightFactor: 1.25 });

  // contact rows (centered with optional links)
  const centeredRow = (segments, yPos, size, defColor) => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(size);
    const sep = '   |   ';
    const widths = segments.map((s) => doc.getTextWidth(s.text));
    const sepW = doc.getTextWidth(sep);
    const total = widths.reduce((a, b) => a + b, 0) + sepW * (segments.length - 1);
    let x = (PAGE_W - total) / 2;
    segments.forEach((s, i) => {
      ink(s.color || defColor);
      if (s.link) doc.textWithLink(s.text, x, yPos, { url: s.link });
      else doc.text(s.text, x, yPos);
      x += widths[i];
      if (i < segments.length - 1) {
        ink(defColor);
        doc.text(sep, x, yPos);
        x += sepW;
      }
    });
  };

  const c = data.contact || {};
  centeredRow([
    { text: c.email, link: c.email ? `mailto:${c.email}` : undefined },
    { text: c.phone },
    { text: c.location },
  ].filter((s) => s.text), contact1Y, 8, COLORS.heroText);

  const podcastUrl = (c.Spotify && c.Spotify.split(', ')[1]) || undefined;
  centeredRow([
    { text: 'LinkedIn', link: c.linkedin, color: COLORS.accent2 },
    { text: 'The Learning Curve Podcast', link: podcastUrl, color: COLORS.accent2 },
  ].filter((s) => s.text), contact2Y, 8, COLORS.accent2);

  y = heroH + 9;

  // ---------- Section heading ----------
  const heading = (title) => {
    ensure(16);
    const s = 6.8;
    fill(COLORS.accent);
    doc.roundedRect(MARGIN, y, s, s, 1.6, 1.6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    ink(COLORS.text);
    doc.text(title, MARGIN + s + 4, y + s - 1.4);
    const dy = y + s + 3.2;
    stroke(COLORS.border);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, dy, PAGE_W - MARGIN, dy);
    y = dy + 6;
  };

  // ---------- Generic card ----------
  const card = (blocks, opts = {}) => {
    const accentLeft = !!opts.accentLeft;
    const innerX = MARGIN + CARD_PAD + (accentLeft ? 1.5 : 0);
    let contentH = 0;
    blocks.forEach((b, i) => {
      contentH += blockHeight(b.lines, b.size);
      if (i < blocks.length - 1) contentH += b.gapAfter != null ? b.gapAfter : 1.4;
    });
    const cardH = contentH + CARD_PAD * 2;
    ensure(cardH + 4);
    fill(COLORS.card);
    stroke(COLORS.border);
    doc.setLineWidth(0.3);
    doc.roundedRect(MARGIN, y, CONTENT_W, cardH, 2.6, 2.6, 'FD');
    if (accentLeft) {
      fill(COLORS.accent);
      doc.roundedRect(MARGIN, y, 1.6, cardH, 0.8, 0.8, 'F');
    }
    let ty = y + CARD_PAD;
    blocks.forEach((b, i) => {
      ty = drawBlock(b.lines, innerX, ty, b.size, b.font || 'normal', b.color);
      if (i < blocks.length - 1) ty += b.gapAfter != null ? b.gapAfter : 1.4;
    });
    y += cardH + 5;
  };

  const innerW = CONTENT_W - CARD_PAD * 2;

  // ---------- Profile ----------
  const p = data.profile || {};
  if (p.summary || p.professional_experience) {
    heading('Profile');
    if (p.summary) {
      card([
        { lines: ['SUMMARY'], size: 7, font: 'bold', color: COLORS.accent, gapAfter: 2 },
        { lines: measure(p.summary, innerW, 8.4), size: 8.4, color: COLORS.soft },
      ]);
    }
    if (p.professional_experience) {
      card([
        { lines: ['MY JOURNEY'], size: 7, font: 'bold', color: COLORS.accent, gapAfter: 2 },
        { lines: measure(p.professional_experience, innerW, 8.4), size: 8.4, color: COLORS.soft },
      ]);
    }
  }

  // ---------- Experience ----------
  if (Array.isArray(data.experience) && data.experience.length) {
    heading('Professional Experience');
    data.experience.forEach((job) => {
      const bulletLines = [];
      (job.responsibilities || []).forEach((r) => {
        const wrapped = doc.splitTextToSize(String(r), innerW - 4);
        wrapped.forEach((ln, idx) => bulletLines.push(idx === 0 ? `•  ${ln}` : `   ${ln}`));
      });
      card([
        { lines: measure(job.title, innerW, 11, 'bold'), size: 11, font: 'bold', color: COLORS.text, gapAfter: 1 },
        { lines: measure(job.company, innerW, 9, 'bold'), size: 9, font: 'bold', color: COLORS.accent, gapAfter: 0.8 },
        { lines: measure(job.period, innerW, 7.8), size: 7.8, color: COLORS.muted, gapAfter: 2.4 },
        { lines: bulletLines, size: 8.2, color: COLORS.soft },
      ], { accentLeft: true });
    });
  }

  // ---------- Skills ----------
  if (Array.isArray(data.skills) && data.skills.length) {
    heading('Skills');
    const rowH = 7;
    const gap = 2.4;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    ensure(rowH + 2);
    let px = MARGIN;
    data.skills.forEach((skill) => {
      const w = doc.getTextWidth(skill) + 8;
      if (px + w > PAGE_W - MARGIN) {
        px = MARGIN;
        y += rowH + gap;
        ensure(rowH + 2);
        if (y === MARGIN) px = MARGIN;
      }
      fill(COLORS.pill);
      stroke(COLORS.pillBorder);
      doc.setLineWidth(0.3);
      doc.roundedRect(px, y, w, rowH, 3.5, 3.5, 'FD');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      ink(COLORS.soft);
      doc.text(skill, px + 4, y + rowH / 2 + 1.25);
      px += w + gap;
    });
    y += rowH + 6;
  }

  // ---------- Projects ----------
  if (Array.isArray(data.projects) && data.projects.length) {
    heading('Projects');
    data.projects.forEach((proj) => {
      const blocks = [
        { lines: measure(proj.name + (proj.url ? '  ↗' : ''), innerW, 10.5, 'bold'), size: 10.5, font: 'bold', color: COLORS.text, gapAfter: 1.6 },
        { lines: measure(proj.description, innerW, 8.2), size: 8.2, color: COLORS.soft, gapAfter: 1.6 },
        { lines: measure(proj.tech, innerW, 7.5, 'bold'), size: 7.5, font: 'bold', color: COLORS.accent },
      ];
      const topBefore = y;
      card(blocks);
      // overlay a link across the project-name line
      if (proj.url) doc.link(MARGIN + CARD_PAD, topBefore + CARD_PAD - 1, innerW, 6, { url: proj.url });
    });
  }

  // ---------- Education ----------
  if (Array.isArray(data.education) && data.education.length) {
    heading('Education');
    data.education.forEach((edu) => {
      card([
        { lines: measure(edu.degree, innerW, 9.6, 'bold'), size: 9.6, font: 'bold', color: COLORS.text, gapAfter: 1 },
        { lines: measure(edu.institution, innerW, 8.4), size: 8.4, color: COLORS.soft, gapAfter: 0.6 },
        { lines: measure(edu.year, innerW, 7.6), size: 7.6, color: COLORS.muted },
      ], { accentLeft: true });
    });
  }

  // ---------- Certifications ----------
  if (Array.isArray(data.certifications) && data.certifications.length) {
    heading('Certifications');
    const certLines = [];
    data.certifications.forEach((cert) => {
      const wrapped = doc.splitTextToSize(String(cert), innerW - 4);
      wrapped.forEach((ln, idx) => certLines.push(idx === 0 ? `•  ${ln}` : `   ${ln}`));
    });
    card([{ lines: certLines, size: 8.4, color: COLORS.soft }]);
  }

  // ---------- Languages ----------
  if (Array.isArray(data.languages) && data.languages.length) {
    heading('Languages');
    const langLines = data.languages.map((l) => `•  ${l.language}: ${l.proficiency}`);
    card([{ lines: langLines, size: 8.4, color: COLORS.soft }]);
  }

  // ---------- Affiliations ----------
  if (Array.isArray(data.affiliations) && data.affiliations.length) {
    heading('Professional Affiliations');
    data.affiliations.forEach((a) => {
      const blocks = [
        { lines: measure(a.role, innerW, 9.6, 'bold'), size: 9.6, font: 'bold', color: COLORS.text, gapAfter: 1 },
        { lines: measure(a.organization, innerW, 8.4), size: 8.4, color: COLORS.soft, gapAfter: 0.6 },
      ];
      if (a.period) blocks.push({ lines: measure(a.period, innerW, 7.6), size: 7.6, color: COLORS.muted, gapAfter: 0.6 });
      if (a.url) blocks.push({ lines: measure('More information ↗', innerW, 7.8, 'bold'), size: 7.8, font: 'bold', color: COLORS.accent });
      const topBefore = y;
      card(blocks, { accentLeft: true });
      if (a.url) doc.link(MARGIN + CARD_PAD, topBefore, CONTENT_W - CARD_PAD * 2, y - topBefore - 5, { url: a.url });
    });
  }

  const date = new Date().toISOString().split('T')[0];
  doc.save(`Neethling, D - CV ${date}.pdf`);
}
