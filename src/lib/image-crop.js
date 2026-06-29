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
 * Crop image and return a File object instead of Base64.
 */
export async function cropToFile(src, area, opts = {}) {
  const maxEdge = opts.maxEdge ?? 1280;
  const mime = opts.mime ?? "image/jpeg";
  const quality = opts.quality ?? 0.9;

  const img = await loadImage(src);

  const scale = Math.min(
    1,
    maxEdge / Math.max(area.width, area.height)
  );

  const width = Math.round(area.width * scale);
  const height = Math.round(area.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Canvas 2D not available");

  ctx.drawImage(
    img,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    width,
    height
  );

  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, mime, quality)
  );

  if (!blob) throw new Error("Unable to create image");

  return new File(
    [blob],
    `image-${Date.now()}.jpg`,
    {
      type: mime,
      lastModified: Date.now(),
    }
  );
}