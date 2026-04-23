// Mock data store for the demo. In a real build this would be replaced by Lovable Cloud.
export type CertificateType = "Bonafide" | "Study Certificate" | "Fee Receipt" | "Fee Due Certificate" | "No Fee Due Certificate";
export type RequestStatus = "Pending" | "Under Review" | "Approved" | "Rejected";

export interface CertRequest {
  id: string;
  token: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  department: string;
  type: CertificateType;
  reason?: string;
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
  remarks?: string;
  signatureId?: string;
}

const TYPE_PREFIX: Record<CertificateType, string> = {
  "Bonafide": "BON",
  "Study Certificate": "STU",
  "Fee Receipt": "FEE",
  "Fee Due Certificate": "FDC",
  "No Fee Due Certificate": "NFD",
};

const seedRequests: CertRequest[] = [
  {
    id: "r1", token: "BON-2026-CSE-0011", studentId: "S101", studentName: "Aarav Sharma",
    rollNumber: "21CSE011", department: "CSE", type: "Bonafide",
    status: "Approved", createdAt: dayAgo(2), updatedAt: dayAgo(1),
    remarks: "Verified", signatureId: "SIG-21f8a3",
  },
  {
    id: "r2", token: "STU-2026-ECE-0007", studentId: "S102", studentName: "Priya Verma",
    rollNumber: "21ECE007", department: "ECE", type: "Study Certificate",
    status: "Under Review", createdAt: dayAgo(1), updatedAt: dayAgo(0),
  },
  {
    id: "r3", token: "FEE-2026-MEC-0019", studentId: "S103", studentName: "Rahul Iyer",
    rollNumber: "20MEC019", department: "MEC", type: "Fee Receipt",
    status: "Pending", createdAt: dayAgo(0), updatedAt: dayAgo(0),
  },
  {
    id: "r4", token: "BON-2026-CSE-0012", studentId: "S101", studentName: "Aarav Sharma",
    rollNumber: "21CSE011", department: "CSE", type: "Bonafide",
    status: "Pending", createdAt: dayAgo(0), updatedAt: dayAgo(0),
  },
  {
    id: "r5", token: "STU-2026-CSE-0008", studentId: "S104", studentName: "Sneha Kapoor",
    rollNumber: "22CSE044", department: "CSE", type: "Study Certificate",
    status: "Approved", createdAt: dayAgo(5), updatedAt: dayAgo(4),
    signatureId: "SIG-9bd0c2",
  },
  {
    id: "r6", token: "BON-2026-IT-0003", studentId: "S105", studentName: "Mohit Yadav",
    rollNumber: "21IT003", department: "IT", type: "Bonafide",
    status: "Rejected", createdAt: dayAgo(3), updatedAt: dayAgo(2),
    remarks: "Incomplete details — please re-submit",
  },
];

function dayAgo(d: number) {
  const t = new Date();
  t.setDate(t.getDate() - d);
  return t.toISOString();
}

const KEY = "ccp_requests";
const COUNTER_KEY = "ccp_token_counter";

function read(): CertRequest[] {
  const raw = localStorage.getItem(KEY);
  if (!raw) {
    localStorage.setItem(KEY, JSON.stringify(seedRequests));
    return seedRequests;
  }
  try { return JSON.parse(raw); } catch { return seedRequests; }
}
function write(items: CertRequest[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("ccp:requests:update"));
}
function nextSeq(): number {
  const cur = Number(localStorage.getItem(COUNTER_KEY) ?? "20");
  const nxt = cur + 1;
  localStorage.setItem(COUNTER_KEY, String(nxt));
  return nxt;
}

export const store = {
  list(): CertRequest[] { return read(); },
  forStudent(studentId: string): CertRequest[] {
    return read().filter((r) => r.studentId === studentId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
  pendingQueue(): CertRequest[] {
    return read()
      .filter((r) => r.status === "Pending" || r.status === "Under Review")
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  },
  queuePosition(id: string): number {
    const q = this.pendingQueue();
    const i = q.findIndex((r) => r.id === id);
    return i === -1 ? 0 : i + 1;
  },
  estimateMinutes(id: string): number {
    const pos = this.queuePosition(id);
    return pos * 25;
  },
  create(input: Omit<CertRequest, "id" | "token" | "status" | "createdAt" | "updatedAt">): CertRequest {
    const seq = String(nextSeq()).padStart(4, "0");
    const token = `${TYPE_PREFIX[input.type]}-${new Date().getFullYear()}-${input.department}-${seq}`;
    const now = new Date().toISOString();
    const req: CertRequest = { ...input, id: `r${Date.now()}`, token, status: "Pending", createdAt: now, updatedAt: now };
    const all = read();
    write([req, ...all]);
    return req;
  },
  updateStatus(id: string, status: RequestStatus, remarks?: string) {
    const all = read();
    const idx = all.findIndex((r) => r.id === id);
    if (idx >= 0) {
      all[idx] = {
        ...all[idx],
        status,
        remarks: remarks ?? all[idx].remarks,
        updatedAt: new Date().toISOString(),
        signatureId: status === "Approved" ? all[idx].signatureId ?? `SIG-${Math.random().toString(16).slice(2, 8)}` : all[idx].signatureId,
      };
      write(all);
    }
  },
  reset() {
    localStorage.removeItem(KEY);
    localStorage.removeItem(COUNTER_KEY);
  },
};
