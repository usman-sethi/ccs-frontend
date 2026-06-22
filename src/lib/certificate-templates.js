/**
 * CCS Certificate System
 *
 * Templates: stored in localStorage under TEMPLATES_KEY
 * Issued certs: stored under ISSUED_KEY
 *
 * All rendering is done on an HTML5 Canvas so output is a downloadable PNG.
 * Text positions are stored in the template's native coordinate space
 * (bgImageWidth × bgImageHeight) and scaled at render time.
 */

const TEMPLATES_KEY = "ccs-cert-templates-v1";
const ISSUED_KEY    = "ccs-cert-issued-v1";

/* ─────────────────────────────────────────────
   Storage helpers
───────────────────────────────────────────── */
function readJSON(key, fallback = []) {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function writeJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* quota */ }
}

/* ─────────────────────────────────────────────
   SVG background generator for demo templates
   1414 × 1000 px — roughly A4 landscape
───────────────────────────────────────────── */
const CATEGORY_THEMES = {
  member: {
    bg1: "#EFF6FF", bg2: "#DBEAFE",
    border: "#1E3A8A", accent: "#3B82F6",
    ribbon: "#1D4ED8", ribbonText: "white", bodyText: "#1E3A8A",
    header: "Certificate of Membership",
  },
  leader: {
    bg1: "#F0FDF4", bg2: "#DCFCE7",
    border: "#064E3B", accent: "#059669",
    ribbon: "#065F46", ribbonText: "white", bodyText: "#064E3B",
    header: "Certificate of Leadership",
  },
  winner: {
    bg1: "#FFFBEB", bg2: "#FEF3C7",
    border: "#78350F", accent: "#F59E0B",
    ribbon: "#B45309", ribbonText: "white", bodyText: "#78350F",
    header: "Certificate of Excellence",
  },
  workshop: {
    bg1: "#F5F3FF", bg2: "#EDE9FE",
    border: "#1E1B4B", accent: "#7C3AED",
    ribbon: "#4C1D95", ribbonText: "white", bodyText: "#1E1B4B",
    header: "Certificate of Completion",
  },
  participation: {
    bg1: "#FFF7ED", bg2: "#FFEDD5",
    border: "#7C2D12", accent: "#EA580C",
    ribbon: "#9A3412", ribbonText: "white", bodyText: "#7C2D12",
    header: "Certificate of Participation",
  },
};

function generateTemplateSVG(category = "member") {
  const W = 1414, H = 1000;
  const c = CATEGORY_THEMES[category] || CATEGORY_THEMES.member;
  const cx = W / 2;

  const escape = (s) =>
    String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c.bg1}"/>
      <stop offset="100%" stop-color="${c.bg2}"/>
    </linearGradient>
    <linearGradient id="ribbon" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${c.ribbon}"/>
      <stop offset="100%" stop-color="${c.accent}"/>
    </linearGradient>
  </defs>

  <!-- Paper background -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>

  <!-- Outer border -->
  <rect x="22" y="22" width="${W - 44}" height="${H - 44}" fill="none"
        stroke="${c.border}" stroke-width="3" rx="8"/>
  <rect x="32" y="32" width="${W - 64}" height="${H - 64}" fill="none"
        stroke="${c.accent}" stroke-width="0.8" stroke-dasharray="6 3" rx="5"/>

  <!-- Top ribbon -->
  <rect x="22" y="22" width="${W - 44}" height="88" fill="url(#ribbon)" rx="8"/>
  <rect x="22" y="82" width="${W - 44}" height="28" fill="url(#ribbon)"/>

  <!-- Society name -->
  <text x="${cx}" y="72" font-family="Georgia,'Times New Roman',serif" font-size="26"
        font-weight="bold" fill="${c.ribbonText}" text-anchor="middle" letter-spacing="5">
    CORE COMPUTING SOCIETY
  </text>

  <!-- Certificate type -->
  <text x="${cx}" y="185" font-family="Georgia,'Times New Roman',serif" font-size="38"
        font-weight="bold" fill="${c.bodyText}" text-anchor="middle" letter-spacing="2">
    ${escape(c.header.toUpperCase())}
  </text>

  <!-- Wave divider -->
  <path d="M ${cx - 200} 208 C ${cx - 100} 218 ${cx + 100} 198 ${cx + 200} 208"
        stroke="${c.accent}" stroke-width="2" fill="none"/>

  <!-- Intro text -->
  <text x="${cx}" y="265" font-family="Georgia,'Times New Roman',serif" font-size="17"
        fill="${c.border}" text-anchor="middle" font-style="italic">
    This is to certify that
  </text>

  <!-- Name underline -->
  <line x1="${cx - 290}" y1="435" x2="${cx + 290}" y2="435"
        stroke="${c.border}" stroke-width="1.5"/>

  <!-- Title underline -->
  <line x1="${cx - 210}" y1="545" x2="${cx + 210}" y2="545"
        stroke="${c.accent}" stroke-width="1"/>

  <!-- Date line -->
  <line x1="${cx - 230}" y1="660" x2="${cx - 80}" y2="660"
        stroke="${c.border}" stroke-width="1"/>
  <text x="${cx - 155}" y="678" font-family="Arial,sans-serif" font-size="11"
        fill="${c.border}" text-anchor="middle" opacity="0.6">Date</text>

  <!-- Signature line -->
  <line x1="${cx + 80}" y1="660" x2="${cx + 270}" y2="660"
        stroke="${c.border}" stroke-width="1"/>
  <text x="${cx + 175}" y="678" font-family="Arial,sans-serif" font-size="11"
        fill="${c.border}" text-anchor="middle" opacity="0.6">Authorized Signature</text>

  <!-- Corner ornaments -->
  <path d="M 65 65 L 65 105 M 65 65 L 105 65"   stroke="${c.accent}" stroke-width="2.5" fill="none"/>
  <path d="M ${W-65} 65 L ${W-105} 65 M ${W-65} 65 L ${W-65} 105" stroke="${c.accent}" stroke-width="2.5" fill="none"/>
  <path d="M 65 ${H-65} L 65 ${H-105} M 65 ${H-65} L 105 ${H-65}" stroke="${c.accent}" stroke-width="2.5" fill="none"/>
  <path d="M ${W-65} ${H-65} L ${W-105} ${H-65} M ${W-65} ${H-65} L ${W-65} ${H-105}" stroke="${c.accent}" stroke-width="2.5" fill="none"/>

  <!-- Large subtle watermark -->
  <text x="${cx}" y="${H / 2 + 30}" font-family="Arial,sans-serif" font-size="200"
        font-weight="bold" fill="${c.accent}" text-anchor="middle" opacity="0.04">CCS</text>

  <!-- Bottom credit -->
  <text x="${cx}" y="${H - 36}" font-family="Arial,sans-serif" font-size="11"
        fill="${c.border}" text-anchor="middle" opacity="0.45">
    Issued by Core Computing Society — ${escape(c.header)}
  </text>
</svg>`;
}

/** Convert an SVG string to a PNG data URL via Canvas */
async function svgToDataUrl(svgString, width = 1414, height = 1000) {
  return new Promise((resolve) => {
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url  = URL.createObjectURL(blob);
    const img  = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width  = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(null); };
    img.src = url;
  });
}

/* ─────────────────────────────────────────────
   Default field positions for 1414 × 1000 template
───────────────────────────────────────────── */
function defaultFields(category = "member") {
  const theme = CATEGORY_THEMES[category] || CATEGORY_THEMES.member;
  return [
    {
      id: "name",
      label: "Recipient Name",
      x: 707, y: 380,
      fontSize: 56,
      fontFamily: "Georgia, serif",
      fontWeight: "bold",
      color: theme.bodyText,
      textAlign: "center",
      shadow: true,
      placeholder: "Recipient Name",
    },
    {
      id: "title",
      label: "Achievement / Event",
      x: 707, y: 498,
      fontSize: 28,
      fontFamily: "Georgia, serif",
      fontWeight: "normal",
      color: theme.accent,
      textAlign: "center",
      shadow: false,
      placeholder: "Achievement Title",
    },
    {
      id: "date",
      label: "Date",
      x: 345, y: 651,
      fontSize: 18,
      fontFamily: "Arial, sans-serif",
      fontWeight: "normal",
      color: theme.border,
      textAlign: "center",
      shadow: false,
      placeholder: "March 15, 2026",
    },
  ];
}

/* ─────────────────────────────────────────────
   Template CRUD
───────────────────────────────────────────── */
export function getTemplates() {
  return readJSON(TEMPLATES_KEY, []).sort((a, b) => b.createdAt - a.createdAt);
}

export async function createTemplate({ name, category, bgImageDataUrl, bgImageWidth, bgImageHeight }) {
  const tmpl = {
    id: `tmpl-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    name,
    category,
    bgImageDataUrl,
    bgImageWidth: bgImageWidth || 1414,
    bgImageHeight: bgImageHeight || 1000,
    fields: defaultFields(category),
    createdAt: Date.now(),
  };
  writeJSON(TEMPLATES_KEY, [tmpl, ...readJSON(TEMPLATES_KEY, [])]);
  return tmpl;
}

export function updateTemplate(id, changes) {
  const list = readJSON(TEMPLATES_KEY, []).map((t) =>
    t.id === id ? { ...t, ...changes, updatedAt: Date.now() } : t
  );
  writeJSON(TEMPLATES_KEY, list);
  return list.find((t) => t.id === id);
}

export function deleteTemplate(id) {
  writeJSON(TEMPLATES_KEY, readJSON(TEMPLATES_KEY, []).filter((t) => t.id !== id));
}

/* ─────────────────────────────────────────────
   Seed demo templates (no-op if any exist)
───────────────────────────────────────────── */
export async function seedDemoTemplates() {
  if (typeof window === "undefined") return;
  if (getTemplates().length > 0) return;

  const cats = ["member", "leader", "winner", "workshop", "participation"];
  const names = [
    "Blue Member Certificate",
    "Green Leader Certificate",
    "Gold Winner Certificate",
    "Purple Workshop Certificate",
    "Orange Participation Certificate",
  ];

  for (let i = 0; i < cats.length; i++) {
    const svg    = generateTemplateSVG(cats[i]);
    const imgUrl = await svgToDataUrl(svg, 1414, 1000);
    if (!imgUrl) continue;
    await createTemplate({
      name: names[i],
      category: cats[i],
      bgImageDataUrl: imgUrl,
      bgImageWidth: 1414,
      bgImageHeight: 1000,
    });
    // stagger slightly so createdAt ordering is stable
    await new Promise((r) => setTimeout(r, 5));
  }
}

/* ─────────────────────────────────────────────
   Image → data URL (for file uploads)
───────────────────────────────────────────── */
export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/** Get natural image dimensions from a data URL */
export function getImageDimensions(dataUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 1414, height: 1000 });
    img.src = dataUrl;
  });
}

/* ─────────────────────────────────────────────
   Canvas renderer
───────────────────────────────────────────── */
function loadImageElement(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload  = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Render a certificate onto `canvas`.
 * `fieldValues` is a record of { fieldId: value }.
 * `outputWidth`  defaults to 2000 px for high-quality output.
 */
export async function renderCertificateToCanvas(canvas, template, fieldValues, outputWidth = 2000) {
  const img   = await loadImageElement(template.bgImageDataUrl);
  const scale = outputWidth / template.bgImageWidth;
  const OH    = Math.round(template.bgImageHeight * scale);

  canvas.width  = outputWidth;
  canvas.height = OH;

  const ctx = canvas.getContext("2d");

  // Background image
  ctx.drawImage(img, 0, 0, outputWidth, OH);

  // Wait for web fonts
  if (document.fonts?.ready) await document.fonts.ready;

  // Render each field
  for (const field of (template.fields ?? [])) {
    const value = String(fieldValues[field.id] ?? "").trim();
    if (!value) continue;

    const fontSize = Math.round(field.fontSize * scale);
    ctx.font         = `${field.fontWeight || "normal"} ${fontSize}px ${field.fontFamily}`;
    ctx.fillStyle    = field.color || "#000000";
    ctx.textAlign    = field.textAlign || "left";
    ctx.textBaseline = "middle";

    if (field.shadow) {
      ctx.shadowColor   = "rgba(0,0,0,0.25)";
      ctx.shadowBlur    = Math.round(4 * scale);
      ctx.shadowOffsetX = Math.round(1 * scale);
      ctx.shadowOffsetY = Math.round(1 * scale);
    } else {
      ctx.shadowColor = "transparent";
      ctx.shadowBlur  = 0;
    }

    ctx.fillText(value, Math.round(field.x * scale), Math.round(field.y * scale));
    ctx.shadowColor = "transparent";
    ctx.shadowBlur  = 0;
  }
}

/** Render and trigger a PNG download */
export async function downloadCertificate(template, fieldValues, fileName = "certificate.png") {
  const canvas = document.createElement("canvas");
  await renderCertificateToCanvas(canvas, template, fieldValues, 2000);
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a   = document.createElement("a");
    a.href     = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }, "image/png");
}

/* ─────────────────────────────────────────────
   Certificate issuance
───────────────────────────────────────────── */
let _seqCounter = null;
function nextCertNumber() {
  const year = new Date().getFullYear();
  const issued = readJSON(ISSUED_KEY, []);
  const seq = issued.length + 1;
  return `CCS-${year}-${String(seq).padStart(4, "0")}`;
}

export function getIssuedCertificates() {
  return readJSON(ISSUED_KEY, []).sort((a, b) => b.issuedAt - a.issuedAt);
}

export function issueCertificate({ templateId, templateName, recipientName, recipientEmail, fieldValues, category }) {
  const cert = {
    id: `cert-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    templateId,
    templateName,
    category,
    recipientName,
    recipientEmail: recipientEmail || "",
    fieldValues: { ...fieldValues },
    certNumber: nextCertNumber(),
    issuedAt: Date.now(),
  };
  writeJSON(ISSUED_KEY, [cert, ...readJSON(ISSUED_KEY, [])]);
  return cert;
}

export function deleteIssuedCertificate(id) {
  writeJSON(ISSUED_KEY, readJSON(ISSUED_KEY, []).filter((c) => c.id !== id));
}

/** Certificates for a given recipient name (case-insensitive) */
export function getCertificatesFor(recipientName) {
  if (!recipientName) return getIssuedCertificates();
  const n = recipientName.toLowerCase();
  return getIssuedCertificates().filter((c) => c.recipientName.toLowerCase() === n);
}

/** Seed a few demo issued certificates */
export function seedDemoIssuedCerts(templates = []) {
  if (getIssuedCertificates().length > 0) return;
  if (templates.length === 0) return;

  const demos = [
    { recipientName: "Ayesha Khan", recipientEmail: "ayesha@uni.edu", title: "Web Development Bootcamp", date: "March 15, 2026", cat: "workshop" },
    { recipientName: "Ayesha Khan", recipientEmail: "ayesha@uni.edu", title: "CodeStorm Hackathon 2025", date: "November 20, 2025", cat: "winner" },
    { recipientName: "Bilal Ahmed",  recipientEmail: "bilal@uni.edu",  title: "Cyber Security Bootcamp", date: "January 8, 2026",   cat: "workshop" },
  ];

  for (const d of demos) {
    const tmpl = templates.find((t) => t.category === d.cat) || templates[0];
    if (!tmpl) continue;
    issueCertificate({
      templateId: tmpl.id,
      templateName: tmpl.name,
      category: tmpl.category,
      recipientName: d.recipientName,
      recipientEmail: d.recipientEmail,
      fieldValues: { name: d.recipientName, title: d.title, date: d.date },
    });
  }
}

export { CATEGORY_THEMES };
