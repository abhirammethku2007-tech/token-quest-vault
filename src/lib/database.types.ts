// Auto-generated types matching the Supabase PostgreSQL schema.
// Re-run `npx supabase gen types typescript` after schema changes.

export type Role = "student" | "management" | "admin";

export type CertificateType =
  | "Bonafide"
  | "Study Certificate"
  | "Fee Receipt"
  | "Fee Due Certificate"
  | "No Fee Due Certificate";

export type RequestStatus = "Pending" | "Under Review" | "Approved" | "Rejected";

export type KeyAlgorithm = "Ed25519" | "RSA-2048";
export type KeyStatus = "Active" | "Rotated" | "Revoked";

// ─── Row shapes (what Supabase returns) ──────────────────────────────────────

export interface ProfileRow {
  id: string;           // uuid — matches auth.users.id
  name: string;
  email: string;
  role: Role;
  department: string | null;
  roll_number: string | null;
  designation: string | null;
  created_at: string;
}

export interface CertRequestRow {
  id: string;           // uuid
  token: string;        // e.g. BON-2026-CSE-0011
  student_id: string;   // fk → profiles.id
  student_name: string;
  roll_number: string;
  department: string;
  type: CertificateType;
  reason: string | null;
  status: RequestStatus;
  created_at: string;
  updated_at: string;
  remarks: string | null;
  signature_id: string | null;
  certificate_url: string | null;
}

export interface AuditLogRow {
  id: string;
  timestamp: string;
  actor_id: string;
  actor_name: string;
  actor_role: Role;
  action: string;
  target: string;
  details: string | null;
}

export interface SignatureKeyRow {
  id: string;
  label: string;
  algorithm: KeyAlgorithm;
  status: KeyStatus;
  created_at: string;
  rotated_at: string | null;
  created_by: string;   // fk → profiles.id
}

// ─── Database interface for the typed Supabase client ────────────────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Omit<ProfileRow, "created_at">;
        Update: Partial<Omit<ProfileRow, "id">>;
      };
      cert_requests: {
        Row: CertRequestRow;
        Insert: Omit<CertRequestRow, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<CertRequestRow, "id" | "created_at">>;
      };
      audit_logs: {
        Row: AuditLogRow;
        Insert: Omit<AuditLogRow, "id">;
        Update: never;
      };
      signature_keys: {
        Row: SignatureKeyRow;
        Insert: Omit<SignatureKeyRow, "id" | "created_at">;
        Update: Partial<Omit<SignatureKeyRow, "id" | "created_at">>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      role: Role;
      certificate_type: CertificateType;
      request_status: RequestStatus;
      key_algorithm: KeyAlgorithm;
      key_status: KeyStatus;
    };
  };
}
