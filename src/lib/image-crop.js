function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

/**
 * Crop a source image (data URL or remote) to the given pixel area and
 * downscale so the long edge is at most `maxEdge`. Returns a JPEG data URL.
 */
export async function cropToDataUrl(src, area, opts = {}) {
  const maxEdge = opts.maxEdge ?? 1280;
  const mime = opts.mime ?? "image/jpeg";
  const quality = opts.quality ?? 0.85;

  const img = await loadImage(src);
  const scale = Math.min(1, maxEdge / Math.max(area.width, area.height));
  const w = Math.round(area.width * scale);
  const h = Math.round(area.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D not available");
  ctx.drawImage(img, area.x, area.y, area.width, area.height, 0, 0, w, h);
  return canvas.toDataURL(mime, quality);
}
