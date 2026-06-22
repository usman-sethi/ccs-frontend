const KEY = "ccs-pp-contributions-v1";

function read() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function write(items) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch { /* quota */ }
}

export function getContributions() {
  return read().sort((a, b) => b.submittedAt - a.submittedAt);
}

export function addContribution(data) {
  const entry = {
    ...data,
    id: `pp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    submittedAt: Date.now(),
    status: "pending",      // "pending" | "approved" | "rejected" | "in_library"
    inLibrary: false,       // true once admin adds it to the semester/subject library
  };
  write([...read(), entry]);
  return entry;
}

export function updateContribution(id, updates) {
  const items = read().map((item) =>
    item.id === id ? { ...item, ...updates, updatedAt: Date.now() } : item
  );
  write(items);
  return items;
}

/** Mark as added to library — removes from community section */
export function markInLibrary(id) {
  return updateContribution(id, { status: "approved", inLibrary: true });
}

export function deleteContribution(id) {
  const items = read().filter((item) => item.id !== id);
  write(items);
  return items;
}

/* ── Dummy seed data (shown when storage is empty) ── */
export function seedDummyContributions() {
  if (read().length > 0) return; // already seeded
  const now = Date.now();
  const dummy = [
    {
      id: "pp-demo-1",
      semesterId: "sem-1",
      semesterName: "Semester 1",
      subjectName: "Programming Fundamentals",
      fileName: "PF_2024_Final.pdf",
      fileSize: 204800,
      fileUrl: "data:application/pdf;base64,JVBERi0=",
      contributorName: "Ayesha Khan",
      contributorEmail: "ayesha@uni.edu",
      submittedAt: now - 86400000 * 2,
      status: "pending",
      inLibrary: false,
    },
    {
      id: "pp-demo-2",
      semesterId: "sem-2",
      semesterName: "Semester 2",
      subjectName: "Discrete Mathematics",
      fileName: "DM_Mid_2025.pdf",
      fileSize: 153600,
      fileUrl: "data:application/pdf;base64,JVBERi0=",
      contributorName: "Hamza Raza",
      contributorEmail: "hamza@uni.edu",
      submittedAt: now - 86400000 * 5,
      status: "approved",
      inLibrary: false,
    },
    {
      id: "pp-demo-3",
      semesterId: "sem-3",
      semesterName: "Semester 3",
      subjectName: "Data Structures",
      fileName: "DS_Final_2024.pdf",
      fileSize: 311296,
      fileUrl: "data:application/pdf;base64,JVBERi0=",
      contributorName: "Sara Iqbal",
      contributorEmail: "sara@uni.edu",
      submittedAt: now - 86400000 * 10,
      status: "rejected",
      inLibrary: false,
    },
    {
      id: "pp-demo-4",
      semesterId: "sem-1",
      semesterName: "Semester 1",
      subjectName: "Calculus I",
      fileName: "Calc1_Mid_2025.pdf",
      fileSize: 98304,
      fileUrl: "data:application/pdf;base64,JVBERi0=",
      contributorName: "Bilal Ahmed",
      contributorEmail: "bilal@uni.edu",
      submittedAt: now - 3600000,
      status: "pending",
      inLibrary: false,
    },
  ];
  write(dummy);
}
