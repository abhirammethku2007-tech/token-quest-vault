import { AppShell } from "@/components/AppShell";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { useAuth } from "@/context/AuthContext";
import { useStudentRequests } from "@/lib/useRequests";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, CheckCircle2, Clock, Plus, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export default function StudentDashboard() {
  const { user } = useAuth();
  const { requests, loading } = useStudentRequests();

  const approved = requests.filter((r) => r.status === "Approved").length;
  const pending  = requests.filter((r) => r.status === "Pending" || r.status === "Under Review").length;

  return (
    <AppShell role="student">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Hero */}
        <div className="glass-strong rounded-2xl p-6 sm:p-8 border-white/50 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-primary-glow/20 blur-3xl" />
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-primary bg-primary/10 rounded-full px-3 py-1 mb-3">
                <Sparkles className="h-3 w-3" /> {user?.department} • {user?.rollNumber}
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold">
                Hello, <span className="gradient-text">{user?.name?.split(" ")[0]}</span> 👋
              </h1>
              <p className="text-muted-foreground mt-1">Request, track and download your verified certificates.</p>
            </div>
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground btn-glow">
              <Link to="/student/request"><Plus className="h-4 w-4 mr-2" /> New Request</Link>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
          ) : (
            <>
              <StatCard label="Total Certificates" value={requests.length} icon={<FileText className="h-5 w-5" />} tone="primary" />
              <StatCard label="Approved"           value={approved}         icon={<CheckCircle2 className="h-5 w-5" />} tone="success" />
              <StatCard label="Pending Requests"   value={pending}          icon={<Clock className="h-5 w-5" />}        tone="warning" />
            </>
          )}
        </div>

        {/* Recent activity */}
        <Card className="glass border-white/50">
          <div className="p-5 flex items-center justify-between border-b border-border">
            <div>
              <h2 className="font-display font-semibold text-lg">Recent activity</h2>
              <p className="text-xs text-muted-foreground">Your latest certificate requests</p>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/student/certificates">View all <ArrowRight className="h-3.5 w-3.5 ml-1" /></Link>
            </Button>
          </div>
          <div className="divide-y divide-border">
            {loading && Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-5 flex items-center justify-between gap-4">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            ))}
            {!loading && requests.slice(0, 4).map((r) => (
              <div key={r.id} className="p-5 flex items-center justify-between gap-4 hover:bg-accent/40 transition">
                <div className="min-w-0">
                  <p className="font-medium truncate">{r.type}</p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">{r.token}</p>
                </div>
                <StatusBadge status={r.status} />
              </div>
            ))}
            {!loading && requests.length === 0 && (
              <div className="p-10 text-center text-muted-foreground text-sm">
                No requests yet — start by creating one.
              </div>
            )}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
