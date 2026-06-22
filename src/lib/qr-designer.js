/**
 * CCS QR Designer — canvas-based custom QR renderer.
 * Uses the `qrcode` npm package to get the module matrix,
 * then draws its own styled output (dots, corners, logo) on a Canvas.
 */
import QRCode from "qrcode";

/* ─────────────────────────────────────────────
   Pre-built design presets
───────────────────────────────────────────── */
export const QR_DESIGNS = [
  {
    id: "ccs-classic",
    name: "CCS Classic",
    description: "Signature navy & electric blue",
    tags: ["blue", "dark"],
    config: {
      bgType: "solid",
      bgColor: "#0f1e3d",
      bgColorEnd: "#0f1e3d",
      dotColor: "#3B82F6",
      dotColorEnd: "#60A5FA",
      dotGradient: true,
      cornerOuterColor: "#2563EB",
      cornerInnerColor: "#93C5FD",
      dotShape: "square",
      cornerStyle: "square",
      logoText: "CCS",
      logoBg: "#1D4ED8",
      logoFg: "#FFFFFF",
      quietZone: 20,
    },
  },
  {
    id: "emerald",
    name: "Emerald",
    description: "Deep forest with bright emerald",
    tags: ["green", "dark"],
    config: {
      bgType: "solid",
      bgColor: "#052e16",
      bgColorEnd: "#064E3B",
      dotColor: "#10B981",
      dotColorEnd: "#34D399",
      dotGradient: true,
      cornerOuterColor: "#059669",
      cornerInnerColor: "#6EE7B7",
      dotShape: "rounded",
      cornerStyle: "rounded",
      logoText: "CCS",
      logoBg: "#065F46",
      logoFg: "#A7F3D0",
      quietZone: 20,
    },
  },
  {
    id: "arctic",
    name: "Arctic White",
    description: "Crisp white with deep navy — max contrast",
    tags: ["white", "blue"],
    config: {
      bgType: "solid",
      bgColor: "#FFFFFF",
      bgColorEnd: "#F0F4FF",
      dotColor: "#1E3A8A",
      dotColorEnd: "#1D4ED8",
      dotGradient: false,
      cornerOuterColor: "#1E3A8A",
      cornerInnerColor: "#3B82F6",
      dotShape: "square",
      cornerStyle: "square",
      logoText: "CCS",
      logoBg: "#1E3A8A",
      logoFg: "#FFFFFF",
      quietZone: 20,
    },
  },
  {
    id: "ocean",
    name: "Ocean Depth",
    description: "Midnight ocean with sky-blue dots",
    tags: ["blue", "dark"],
    config: {
      bgType: "gradient",
      bgColor: "#0C2461",
      bgColorEnd: "#1A1A6E",
      dotColor: "#38BDF8",
      dotColorEnd: "#7DD3FC",
      dotGradient: true,
      cornerOuterColor: "#0EA5E9",
      cornerInnerColor: "#BAE6FD",
      dotShape: "circle",
      cornerStyle: "rounded",
      logoText: "CCS",
      logoBg: "#0369A1",
      logoFg: "#E0F2FE",
      quietZone: 20,
    },
  },
  {
    id: "forest",
    name: "Forest Code",
    description: "Dark woodland with luminous green",
    tags: ["green", "dark"],
    config: {
      bgType: "solid",
      bgColor: "#0C1C12",
      bgColorEnd: "#14532D",
      dotColor: "#4ADE80",
      dotColorEnd: "#86EFAC",
      dotGradient: true,
      cornerOuterColor: "#16A34A",
      cornerInnerColor: "#86EFAC",
      dotShape: "dot",
      cornerStyle: "rounded",
      logoText: "CCS",
      logoBg: "#14532D",
      logoFg: "#BBF7D0",
      quietZone: 20,
    },
  },
  {
    id: "blueprint",
    name: "Blueprint",
    description: "Technical blueprint in royal blue",
    tags: ["blue", "dark"],
    config: {
      bgType: "solid",
      bgColor: "#1E3A8A",
      bgColorEnd: "#1E40AF",
      dotColor: "#FFFFFF",
      dotColorEnd: "#E0E7FF",
      dotGradient: false,
      cornerOuterColor: "#FFFFFF",
      cornerInnerColor: "#BFDBFE",
      dotShape: "square",
      cornerStyle: "square",
      logoText: "CCS",
      logoBg: "#FFFFFF",
      logoFg: "#1E3A8A",
      quietZone: 20,
    },
  },
  {
    id: "cyber",
    name: "Cyber Matrix",
    description: "Dark hacker aesthetic with neon green",
    tags: ["green", "dark"],
    config: {
      bgType: "solid",
      bgColor: "#030712",
      bgColorEnd: "#030712",
      dotColor: "#22C55E",
      dotColorEnd: "#4ADE80",
      dotGradient: true,
      cornerOuterColor: "#16A34A",
      cornerInnerColor: "#86EFAC",
      dotShape: "dot",
      cornerStyle: "square",
      logoText: "CCS",
      logoBg: "#052e16",
      logoFg: "#4ADE80",
      quietZone: 20,
    },
  },
  {
    id: "mint",
    name: "Mint Fresh",
    description: "White canvas with cool teal accents",
    tags: ["white", "green"],
    config: {
      bgType: "solid",
      bgColor: "#F0FDFA",
      bgColorEnd: "#CCFBF1",
      dotColor: "#0D9488",
      dotColorEnd: "#14B8A6",
      dotGradient: false,
      cornerOuterColor: "#0F766E",
      cornerInnerColor: "#2DD4BF",
      dotShape: "rounded",
      cornerStyle: "rounded",
      logoText: "CCS",
      logoBg: "#0F766E",
      logoFg: "#CCFBF1",
      quietZone: 20,
    },
  },
];

/* ─────────────────────────────────────────────
   Canvas helpers
───────────────────────────────────────────── */
function fillRoundedRect(ctx, x, y, w, h, r) {
  if (r <= 0) { ctx.fillRect(x, y, w, h); return; }
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y,     x + w, y + h, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x,     y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x,     y + h, x,     y,     r);
  ctx.lineTo(x,     y + r);
  ctx.arcTo(x,     y,     x + w, y,     r);
  ctx.closePath();
  ctx.fill();
}

function fillCircle(ctx, cx, cy, r) {
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
}

function drawDot(ctx, x, y, cellSize, shape, padding = 0.08) {
  const pad = cellSize * padding;
  const ox = x + pad;
  const oy = y + pad;
  const s  = cellSize - pad * 2;
  switch (shape) {
    case "circle": fillCircle(ctx, ox + s / 2, oy + s / 2, s / 2); break;
    case "dot":    fillCircle(ctx, x + cellSize / 2, y + cellSize / 2, cellSize * 0.35); break;
    case "rounded": fillRoundedRect(ctx, ox, oy, s, s, s * 0.3); break;
    default:       ctx.fillRect(ox, oy, s, s); // square
  }
}

function drawFinderPattern(ctx, px, py, cellSize, outerColor, innerColor, bgColor, cornerStyle) {
  const total = cellSize * 7;
  const r = cornerStyle === "rounded" ? cellSize : 0;

  // Outer 7×7 square (dark)
  ctx.fillStyle = outerColor;
  fillRoundedRect(ctx, px, py, total, total, r);

  // Inner gap 5×5 (background)
  const g1 = cellSize;
  ctx.fillStyle = bgColor;
  fillRoundedRect(ctx, px + g1, py + g1, cellSize * 5, cellSize * 5, r * 0.6);

  // Center 3×3 square (dark)
  const g2 = cellSize * 2;
  ctx.fillStyle = innerColor;
  fillRoundedRect(ctx, px + g2, py + g2, cellSize * 3, cellSize * 3, r * 0.4);
}

/* ─────────────────────────────────────────────
   Main renderer
───────────────────────────────────────────── */
export async function renderQRToCanvas(canvas, text, design, outputSize = 400) {
  // 1. Get QR matrix
  const qrObj = QRCode.create(text, { errorCorrectionLevel: "M" });
  const n = qrObj.modules.size;
  const { data } = qrObj.modules;

  const dpr   = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
  const px    = outputSize * dpr;
  canvas.width  = px;
  canvas.height = px;
  canvas.style.width  = `${outputSize}px`;
  canvas.style.height = `${outputSize}px`;

  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  const S = outputSize; // logical size

  // 2. Background
  if (design.bgType === "gradient") {
    const grad = ctx.createLinearGradient(0, 0, S, S);
    grad.addColorStop(0, design.bgColor);
    grad.addColorStop(1, design.bgColorEnd || design.bgColor);
    ctx.fillStyle = grad;
  } else {
    ctx.fillStyle = design.bgColor;
  }
  ctx.fillRect(0, 0, S, S);

  // 3. Calculate cell layout
  const qz       = design.quietZone ?? 16;
  const cellSize = (S - qz * 2) / n;

  // Dot color (gradient or flat)
  let dotPaint;
  if (design.dotGradient && design.dotColorEnd) {
    const dg = ctx.createLinearGradient(qz, qz, S - qz, S - qz);
    dg.addColorStop(0, design.dotColor);
    dg.addColorStop(1, design.dotColorEnd);
    dotPaint = dg;
  } else {
    dotPaint = design.dotColor;
  }

  // 4. Identify finder pattern cells to skip
  const isFinderZone = (r, c) => {
    if (r <= 7 && c <= 7) return true;          // top-left
    if (r <= 7 && c >= n - 8) return true;      // top-right
    if (r >= n - 8 && c <= 7) return true;      // bottom-left
    return false;
  };

  // 5. Draw data modules
  ctx.fillStyle = dotPaint;
  for (let row = 0; row < n; row++) {
    for (let col = 0; col < n; col++) {
      if (isFinderZone(row, col)) continue;
      const dark = data[row * n + col];
      if (!dark) continue;
      const x = qz + col * cellSize;
      const y = qz + row * cellSize;
      drawDot(ctx, x, y, cellSize, design.dotShape);
    }
  }

  // 6. Draw the three finder patterns on top
  const positions = [
    { px: qz,                     py: qz },                       // top-left
    { px: qz + (n - 7) * cellSize, py: qz },                      // top-right
    { px: qz,                     py: qz + (n - 7) * cellSize },   // bottom-left
  ];
  for (const pos of positions) {
    drawFinderPattern(
      ctx, pos.px, pos.py, cellSize,
      design.cornerOuterColor,
      design.cornerInnerColor,
      design.bgColor,
      design.cornerStyle
    );
  }

  // 7. Logo overlay (white pill + text)
  if (design.logoText) {
    const lw = cellSize * 5;
    const lh = cellSize * 3.5;
    const lx = S / 2 - lw / 2;
    const ly = S / 2 - lh / 2;
    const lr = lh * 0.35;

    // Shadow
    ctx.shadowColor = "rgba(0,0,0,0.35)";
    ctx.shadowBlur  = 8;
    ctx.fillStyle = design.logoBg || design.bgColor;
    fillRoundedRect(ctx, lx, ly, lw, lh, lr);
    ctx.shadowBlur = 0;
    ctx.shadowColor = "transparent";

    // Text
    ctx.fillStyle = design.logoFg || "#FFFFFF";
    ctx.font = `bold ${Math.round(lh * 0.52)}px Inter, Arial, sans-serif`;
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(design.logoText, S / 2, S / 2);
  }
}

/* ─────────────────────────────────────────────
   Export helpers
───────────────────────────────────────────── */
export function downloadCanvasAsPNG(canvas, fileName = "qr-code.png") {
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

/**
 * Convenience: render to a fresh offscreen canvas and download immediately.
 */
export async function renderAndDownload(text, design, size = 512, fileName = "qr-code.png") {
  const canvas = document.createElement("canvas");
  await renderQRToCanvas(canvas, text, design, size);
  downloadCanvasAsPNG(canvas, fileName);
}

/** Get persisted design ID from localStorage */
export function getSavedDesignId() {
  if (typeof window === "undefined") return "ccs-classic";
  return localStorage.getItem("ccs-qr-design-id") || "ccs-classic";
}

export function saveDesignId(id) {
  try { localStorage.setItem("ccs-qr-design-id", id); } catch {}
}

export function getSavedDesign() {
  const id = getSavedDesignId();
  return QR_DESIGNS.find((d) => d.id === id) ?? QR_DESIGNS[0];
}
