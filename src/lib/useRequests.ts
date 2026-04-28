import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  subscribeToRequests,
  subscribeToStudentRequests,
  getPendingQueue,
  getQueuePosition,
  estimateWaitMinutes,
} from "./supabaseService";
import type { CertRequestRow } from "./database.types";

// ─── Management / Admin hook — all requests ───────────────────
export function useAllRequests() {
  const [requests, setRequests] = useState<CertRequestRow[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const unsub = subscribeToRequests((data) => {
      setRequests(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  const pendingQueue = requests.filter(
    (r) => r.status === "Pending" || r.status === "Under Review"
  ).sort((a, b) => a.created_at.localeCompare(b.created_at));

  return { requests, pendingQueue, loading };
}

// ─── Student hook — own requests only ────────────────────────
export function useStudentRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<CertRequestRow[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    const unsub = subscribeToStudentRequests(user.id, (data) => {
      setRequests(data);
      setLoading(false);
    });
    return unsub;
  }, [user?.id]);

  return { requests, loading };
}

// ─── Queue helpers ────────────────────────────────────────────
export { getQueuePosition, estimateWaitMinutes };
