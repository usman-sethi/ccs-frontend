"use client";

/**
 * Generates an SVG string for a CCS certificate.
 */
export function buildCertSVG({ recipientName, title, category, date, issuedBy }) {
  // Escape XML-sensitive chars
  const esc = (s = "") =>
    String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 840 594" width="840" height="594">
  <defs>
    <linearGradient id="hdr" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#1d4ed8"/>
      <stop offset="100%" stop-color="#2563eb"/>
    </linearGradient>
  </defs>

  <!-- Paper background -->
  <rect width="840" height="594" fill="#fafafa"/>

  <!-- Outer ornamental border -->
  <rect x="18" y="18" width="804" height="558" rx="6" fill="none" stroke="#2563eb" stroke-width="2.5"/>
  <rect x="26" y="26" width="788" height="542" rx="4" fill="none" stroke="#2563eb" stroke-width="0.8" stroke-dasharray="6 3"/>

  <!-- Top header band -->
  <rect x="18" y="18" width="804" height="72" rx="6" fill="url(#hdr)"/>
  <!-- Clip the bottom corners of the band to be square -->
  <rect x="18" y="62" width="804" height="28" fill="url(#hdr)"/>

  <!-- Society name in header -->
  <text x="420" y="48" font-family="Georgia,'Times New Roman',serif" font-size="13" font-weight="bold"
    fill="white" text-anchor="middle" letter-spacing="5">CORE COMPUTING SOCIETY</text>
  <text x="420" y="68" font-family="Georgia,'Times New Roman',serif" font-size="10"
    fill="rgba(255,255,255,0.75)" text-anchor="middle" letter-spacing="2">CERTIFICATE OF ACHIEVEMENT</text>

  <!-- CCS badge circle -->
  <circle cx="420" cy="138" r="34" fill="#2563eb"/>
  <circle cx="420" cy="138" r="30" fill="none" stroke="white" stroke-width="1.5"/>
  <text x="420" y="144" font-family="Arial,sans-serif" font-size="18" font-weight="bold"
    fill="white" text-anchor="middle">CCS</text>

  <!-- Certificate of + category -->
  <text x="420" y="200" font-family="Georgia,'Times New Roman',serif" font-size="26" font-weight="bold"
    fill="#1e293b" text-anchor="middle" letter-spacing="1">Certificate</text>
  <text x="420" y="222" font-family="Georgia,'Times New Roman',serif" font-size="11"
    fill="#64748b" text-anchor="middle" letter-spacing="5">OF ${esc(category.toUpperCase())}</text>

  <!-- Decorative wave -->
  <path d="M 280 238 C 320 232 360 244 400 238 C 440 232 480 244 560 238"
    stroke="#2563eb" stroke-width="1.5" fill="none"/>

  <!-- Presented to -->
  <text x="420" y="275" font-family="Georgia,'Times New Roman',serif" font-size="12"
    fill="#94a3b8" text-anchor="middle" font-style="italic">This is to certify that</text>

  <!-- Recipient name -->
  <text x="420" y="330" font-family="Georgia,'Times New Roman',serif" font-size="38" font-weight="bold"
    fill="#1e293b" text-anchor="middle">${esc(recipientName)}</text>
  <line x1="180" y1="342" x2="660" y2="342" stroke="#cbd5e1" stroke-width="1"/>

  <!-- Achievement description -->
  <text x="420" y="378" font-family="Georgia,'Times New Roman',serif" font-size="12"
    fill="#64748b" text-anchor="middle" font-style="italic">has successfully completed</text>

  <!-- Course / event name -->
  <text x="420" y="412" font-family="Georgia,'Times New Roman',serif" font-size="22" font-weight="bold"
    fill="#2563eb" text-anchor="middle">${esc(title)}</text>

  <!-- Date -->
  <text x="420" y="452" font-family="Georgia,'Times New Roman',serif" font-size="11"
    fill="#94a3b8" text-anchor="middle">${esc(date)}</text>

  <!-- Corner ornaments -->
  <path d="M 46 46 L 46 90 M 46 46 L 90 46" stroke="#2563eb" stroke-width="2" fill="none"/>
  <path d="M 794 46 L 750 46 M 794 46 L 794 90" stroke="#2563eb" stroke-width="2" fill="none"/>
  <path d="M 46 548 L 46 504 M 46 548 L 90 548" stroke="#2563eb" stroke-width="2" fill="none"/>
  <path d="M 794 548 L 750 548 M 794 548 L 794 504" stroke="#2563eb" stroke-width="2" fill="none"/>

  <!-- Signature lines -->
  <line x1="140" y1="514" x2="320" y2="514" stroke="#94a3b8" stroke-width="1"/>
  <text x="230" y="530" font-family="Arial,sans-serif" font-size="9" fill="#94a3b8" text-anchor="middle">President, CCS</text>

  <line x1="520" y1="514" x2="700" y2="514" stroke="#94a3b8" stroke-width="1"/>
  <text x="610" y="530" font-family="Arial,sans-serif" font-size="9" fill="#94a3b8" text-anchor="middle">${esc(issuedBy)}</text>

  <!-- Watermark CCS -->
  <text x="420" y="490" font-family="Arial,sans-serif" font-size="90" font-weight="bold"
    fill="rgba(37,99,235,0.04)" text-anchor="middle">CCS</text>
</svg>`;
}

/** Returns a data URI that can be used as img src or download href */
export function certToDataUri(svgString) {
  const encoded = encodeURIComponent(svgString);
  return `data:image/svg+xml;charset=UTF-8,${encoded}`;
}

/** Trigger a download of the certificate SVG */
export function downloadCert(svgString, fileName = "certificate.svg") {
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}
