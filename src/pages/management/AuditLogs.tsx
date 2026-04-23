import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const logs = [
  { ts: "2026-04-19 10:42", actor: "Neha Pillai", role: "Admin", action: "Approved", target: "BON-2026-CSE-0011" },
  { ts: "2026-04-19 10:30", actor: "Neha Pillai", role: "Admin", action: "Reviewed", target: "STU-2026-ECE-0007" },
  { ts: "2026-04-19 09:55", actor: "System", role: "System", action: "Token Issued", target: "FEE-2026-MEC-0019" },
  { ts: "2026-04-18 16:22", actor: "Neha Pillai", role: "Admin", action: "Rejected", target: "BON-2026-IT-0003" },
  { ts: "2026-04-18 14:10", actor: "Dr. Vikram Rao", role: "Management", action: "Signed", target: "STU-2026-CSE-0008" },
  { ts: "2026-04-17 11:00", actor: "System", role: "System", action: "Key Rotated", target: "SIG-MASTER-2026" },
];

const tone: Record<string, string> = {
  Approved: "bg-success/10 text-success border-success/30",
  Rejected: "bg-destructive/10 text-destructive border-destructive/30",
  Reviewed: "bg-info/10 text-info border-info/30",
  "Token Issued": "bg-primary/10 text-primary border-primary/30",
  Signed: "bg-accent text-accent-foreground border-accent",
  "Key Rotated": "bg-warning/10 text-warning border-warning/30",
};

export default function AuditLogs() {
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((l, i) => (
                <TableRow key={i} className="hover:bg-accent/40">
                  <TableCell className="font-mono text-xs">{l.ts}</TableCell>
                  <TableCell className="font-medium">{l.actor}</TableCell>
                  <TableCell>{l.role}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={tone[l.action] ?? ""}>{l.action}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{l.target}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AppShell>
  );
}
