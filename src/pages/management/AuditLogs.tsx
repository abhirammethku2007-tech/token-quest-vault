import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { subscribeToAuditLogs } from "@/lib/supabaseService";
import type { AuditLogRow } from "@/lib/database.types";

const tone: Record<string, string> = {
  "Approved Request":   "bg-success/10 text-success border-success/30",
  "Rejected Request":   "bg-destructive/10 text-destructive border-destructive/30",
  "Marked Under Review":"bg-info/10 text-info border-info/30",
  "Created Request":    "bg-primary/10 text-primary border-primary/30",
  "Signed Certificate": "bg-accent text-accent-foreground border-accent",
  "Key Rotated":        "bg-warning/10 text-warning border-warning/30",
};

export default function AuditLogs() {
  const [logs,    setLogs]    = useState<AuditLogRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToAuditLogs((data) => {
      setLogs(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  return (
    <AppShell role="admin">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Audit Logs</h1>
          <p className="text-muted-foreground mt-1">Tamper-proof activity trail across the system.</p>
        </div>

        <Card className="glass-strong border-white/50 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30 hover:bg-muted/30">
                <TableHead>Timestamp</TableHead>
                <TableHead>Actor</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell colSpan={6}><Skeleton className="h-7 w-full" /></TableCell>
                </TableRow>
              ))}
              {!loading && logs.map((l) => (
                <TableRow key={l.id} className="hover:bg-accent/40">
                  <TableCell className="font-mono text-xs whitespace-nowrap">
                    {new Date(l.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-medium">{l.actor_name}</TableCell>
                  <TableCell className="capitalize text-sm text-muted-foreground">{l.actor_role}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={tone[l.action] ?? "bg-muted text-muted-foreground"}>
                      {l.action}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{l.target}</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                    {l.details ?? "—"}
                  </TableCell>
                </TableRow>
              ))}
              {!loading && logs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                    No audit logs yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AppShell>
  );
}
