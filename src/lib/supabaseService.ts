import { supabase } from "./supabase";
import type {
  CertRequestRow,
  CertificateType,
  RequestStatus,
  ProfileRow,
  AuditLogRow,
  SignatureKeyRow,
  KeyStatus,
  Role,
} from "./database.types";

// ─── Token Generation ─────────────────────────────────────────────────────────

const TYPE_PREFIX: Record<CertificateType, string> = {
  Bonafide: "BON",
  "Study Certificate": "STU",
  "Fee Receipt": "FEE",
  "Fee Due Certificate": "FDC",
  "No Fee Due Certificate": "NFD",
};

async function generateToken(type: CertificateType, department: string): Promise<string> {
  // Use a Postgres sequence via RPC to get a safe, concurrent-safe counter
  const { data, error } = await supabase.rpc("next_token_seq");
  if (error) throw error;
  const seq = String(data as number).padStart(4, "0");
  const year = new Date().getFullYear();
  return `${TYPE_PREFIX[type]}-${year}-${department}-${seq}`;
}

// ─── Certificate Requests ─────────────────────────────────────────────────────

/** Fetch all requests — management / admin */
export async function getAllRequests(): Promise<CertRequestRow[]> {
  const { data, error } = await supabase
    .from("cert_requests")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/** Fetch requests for a specific student */
export async function getStudentRequests(studentId: string): Promise<CertRequestRow[]> {
  const { data, error } = await supabase
    .from("cert_requests")
    .select("*")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/** Fetch FIFO pending queue (Pending + Under Review) */
export async function getPendingQueue(): Promise<CertRequestRow[]> {
  const { data, error } = await supabase
    .from("cert_requests")
    .select("*")
    .in("status", ["Pending", "Under Review"])
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}

/** Get 1-indexed queue position for a request */
export async function getQueuePosition(requestId: string): Promise<number> {
  const queue = await getPendingQueue();
  const idx = queue.findIndex((r) => r.id === requestId);
  return idx === -1 ? -1 : idx + 1;
}

/** Estimate wait time in minutes (25 min per position) */
export async function estimateWaitMinutes(requestId: string): Promise<number> {
  const pos = await getQueuePosition(requestId);
  return pos <= 0 ? 0 : pos * 25;
}

/** Create a new certificate request */
export async function createRequest(input: {
  studentId: string;
  studentName: string;
  rollNumber: string;
  department: string;
  type: CertificateType;
  reason?: string;
}): Promise<CertRequestRow> {
  const token = await generateToken(input.type, input.department);

  const { data, error } = await supabase
    .from("cert_requests")
    .insert({
      token,
      student_id: input.studentId,
      student_name: input.studentName,
      roll_number: input.rollNumber,
      department: input.department,
      type: input.type,
      reason: input.reason ?? null,
      status: "Pending",
      certificate_url: null,
      remarks: null,
      signature_id: null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Update request status — approve / reject / under review */
export async function updateRequestStatus(
  requestId: string,
  status: RequestStatus,
  opts?: { remarks?: string; signatureId?: string; certificateUrl?: string }
): Promise<CertRequestRow> {
  const { data, error } = await supabase
    .from("cert_requests")
    .update({
      status,
      updated_at: new Date().toISOString(),
      ...(opts?.remarks !== undefined      && { remarks: opts.remarks }),
      ...(opts?.signatureId !== undefined  && { signature_id: opts.signatureId }),
      ...(opts?.certificateUrl !== undefined && { certificate_url: opts.certificateUrl }),
    })
    .eq("id", requestId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/** Real-time subscription to all requests */
export function subscribeToRequests(
  callback: (requests: CertRequestRow[]) => void
) {
  // Initial fetch
  getAllRequests().then(callback);

  const channel = supabase
    .channel("cert_requests_all")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "cert_requests" },
      () => getAllRequests().then(callback)
    )
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}

/** Real-time subscription to a student's requests */
export function subscribeToStudentRequests(
  studentId: string,
  callback: (requests: CertRequestRow[]) => void
) {
  getStudentRequests(studentId).then(callback);

  const channel = supabase
    .channel(`cert_requests_student_${studentId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "cert_requests",
        filter: `student_id=eq.${studentId}`,
      },
      () => getStudentRequests(studentId).then(callback)
    )
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}

// ─── Users / Profiles ─────────────────────────────────────────────────────────

/** Get all user profiles */
export async function getAllUsers(): Promise<ProfileRow[]> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/** Get a single profile by id */
export async function getUserById(id: string): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data;
}

/** Upsert a profile (used after sign-up) */
export async function upsertProfile(profile: ProfileRow): Promise<void> {
  const { error } = await supabase.from("profiles").upsert(profile);
  if (error) throw error;
}

// ─── Audit Logs ───────────────────────────────────────────────────────────────

/** Write an audit log entry */
export async function writeAuditLog(
  entry: Omit<AuditLogRow, "id">
): Promise<void> {
  const { error } = await supabase.from("audit_logs").insert(entry);
  if (error) throw error;
}

/** Fetch all audit logs newest-first */
export async function getAuditLogs(): Promise<AuditLogRow[]> {
  const { data, error } = await supabase
    .from("audit_logs")
    .select("*")
    .order("timestamp", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/** Real-time subscription to audit logs */
export function subscribeToAuditLogs(
  callback: (logs: AuditLogRow[]) => void
) {
  getAuditLogs().then(callback);

  const channel = supabase
    .channel("audit_logs_all")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "audit_logs" },
      () => getAuditLogs().then(callback)
    )
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}

// ─── Signature Keys ───────────────────────────────────────────────────────────

/** Get all signature keys */
export async function getSignatureKeys(): Promise<SignatureKeyRow[]> {
  const { data, error } = await supabase
    .from("signature_keys")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

/** Add a new signature key */
export async function addSignatureKey(
  key: Omit<SignatureKeyRow, "id" | "created_at">
): Promise<SignatureKeyRow> {
  const { data, error } = await supabase
    .from("signature_keys")
    .insert(key)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/** Update signature key status */
export async function updateSignatureKeyStatus(
  keyId: string,
  status: KeyStatus
): Promise<void> {
  const { error } = await supabase
    .from("signature_keys")
    .update({
      status,
      ...(status === "Rotated" && { rotated_at: new Date().toISOString() }),
    })
    .eq("id", keyId);
  if (error) throw error;
}

/** Real-time subscription to signature keys */
export function subscribeToSignatureKeys(
  callback: (keys: SignatureKeyRow[]) => void
) {
  getSignatureKeys().then(callback);

  const channel = supabase
    .channel("signature_keys_all")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "signature_keys" },
      () => getSignatureKeys().then(callback)
    )
    .subscribe();

  return () => { supabase.removeChannel(channel); };
}

// ─── Analytics helpers ────────────────────────────────────────────────────────

/** Count requests grouped by status */
export async function getRequestStats(): Promise<{
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  underReview: number;
}> {
  const { data, error } = await supabase
    .from("cert_requests")
    .select("status");
  if (error) throw error;

  const rows = data ?? [];
  return {
    total:       rows.length,
    pending:     rows.filter((r) => r.status === "Pending").length,
    approved:    rows.filter((r) => r.status === "Approved").length,
    rejected:    rows.filter((r) => r.status === "Rejected").length,
    underReview: rows.filter((r) => r.status === "Under Review").length,
  };
}
