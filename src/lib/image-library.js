const KEY = "ccs-image-library-v1";
const MAX = 20;

function read() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function write(items) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items.slice(0, MAX)));
  } catch {
    /* quota */
  }
}

export function getLibrary() {
  return read().sort((a, b) => b.addedAt - a.addedAt);
}

export function addToLibrary(src) {
  const entry = {
    id: `img-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`,
    src,
    addedAt: Date.now(),
  };
  const next = [entry, ...read().filter((i) => i.src !== src)].slice(0, MAX);
  write(next);
  return entry;
}

export function clearLibrary() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* noop */
  }
}
