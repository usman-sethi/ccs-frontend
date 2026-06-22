const KEY       = "ccs-card-status-v1";
const QUEUE_KEY = "ccs-card-queue-v1";

/* ── User-facing card state ── */
const DEFAULT_CARD = { status: "none" }; // "none" | "pending" | "issued"

export function getCardStatus() {
  if (typeof window === "undefined") return DEFAULT_CARD;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : DEFAULT_CARD;
  } catch { return DEFAULT_CARD; }
}

export function applyForCard(userName, email = "", department = "", year = "") {
  const cardNumber = generateCardNumber();
  const data = {
    status: "pending",
    appliedAt: Date.now(),
    userName,
    email,
    department,
    year,
    cardNumber,
    applicationId: `card-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
  };
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch {}
  // Also add to the admin queue
  addToQueue(data);
  return data;
}

export function setCardIssued() {
  try {
    const current = getCardStatus();
    const data = { ...current, status: "issued", issuedAt: Date.now() };
    localStorage.setItem(KEY, JSON.stringify(data));
    return data;
  } catch { return getCardStatus(); }
}

export function setCardRejected() {
  try {
    const current = getCardStatus();
    const data = { ...current, status: "rejected", rejectedAt: Date.now() };
    localStorage.setItem(KEY, JSON.stringify(data));
    return data;
  } catch { return getCardStatus(); }
}

export function resetCard() {
  try { localStorage.removeItem(KEY); } catch {}
}

/* ── Admin queue (all applications) ── */
function readQueue() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function writeQueue(items) {
  try { localStorage.setItem(QUEUE_KEY, JSON.stringify(items)); } catch {}
}

export function getCardQueue() {
  return readQueue().sort((a, b) => b.appliedAt - a.appliedAt);
}

function addToQueue(application) {
  const existing = readQueue();
  // Replace if same applicationId
  const filtered = existing.filter((a) => a.applicationId !== application.applicationId);
  writeQueue([{ ...application, queueStatus: "pending" }, ...filtered]);
}

export function updateQueueItem(applicationId, updates) {
  const items = readQueue().map((a) =>
    a.applicationId === applicationId ? { ...a, ...updates, updatedAt: Date.now() } : a
  );
  writeQueue(items);
  return items;
}

export function deleteQueueItem(applicationId) {
  writeQueue(readQueue().filter((a) => a.applicationId !== applicationId));
}

/* ── Dummy seed ── */
export function seedDummyCardQueue() {
  if (readQueue().length > 0) return;
  const now = Date.now();
  const dummy = [
    {
      applicationId: "card-demo-1",
      status: "pending",
      queueStatus: "pending",
      userName: "Ayesha Khan",
      email: "ayesha@uni.edu",
      department: "Software Engineering",
      year: "3rd year",
      cardNumber: "4821 7743 9912 3304",
      appliedAt: now - 3600000 * 5,
    },
    {
      applicationId: "card-demo-2",
      status: "pending",
      queueStatus: "pending",
      userName: "Hamza Raza",
      email: "hamza@uni.edu",
      department: "Artificial Intelligence",
      year: "2nd year",
      cardNumber: "5301 4482 7731 8820",
      appliedAt: now - 86400000,
    },
    {
      applicationId: "card-demo-3",
      status: "issued",
      queueStatus: "approved",
      userName: "Bilal Ahmed",
      email: "bilal@uni.edu",
      department: "Cyber Security",
      year: "Final year",
      cardNumber: "3872 9943 1105 6671",
      appliedAt: now - 86400000 * 7,
      updatedAt: now - 86400000 * 6,
    },
    {
      applicationId: "card-demo-4",
      status: "rejected",
      queueStatus: "rejected",
      userName: "Hira Nawaz",
      email: "hira@uni.edu",
      department: "Data Science",
      year: "2nd year",
      cardNumber: "2293 8812 4450 7739",
      appliedAt: now - 86400000 * 3,
      updatedAt: now - 86400000 * 2,
    },
  ];
  writeQueue(dummy);
}

function generateCardNumber() {
  const r = () => Math.floor(1000 + Math.random() * 9000);
  return `${r()} ${r()} ${r()} ${r()}`;
}
