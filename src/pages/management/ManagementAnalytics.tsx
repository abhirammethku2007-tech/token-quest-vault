import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllRequests } from "@/lib/useRequests";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const colors = [
  "hsl(234 89% 60%)", "hsl(258 90% 66%)", "hsl(210 95% 60%)",
  "hsl(280 80% 65%)", "hsl(190 85% 55%)",
];

// Build last-7-days processing data from real requests
function buildProcessingData(requests: any[]) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const counts: Record<string, number[]> = {};
  requests
    .filter((r) => r.status === "Approved")
    .forEach((r) => {
      const created = new Date(r.created_at).getTime();
      const updated = new Date(r.updated_at).getTime();
      const mins    = Math.round((updated - created) / 60000);
      const day     = days[new Date(r.updated_at).getDay()];
      if (!counts[day]) counts[day] = [];
      counts[day].push(mins);
    });

  return days.map((d) => ({
    d,
    avg: counts[d]?.length
      ? Math.round(counts[d].reduce((a, b) => a + b, 0) / counts[d].length)
      : 0,
  }));
}

// Build certificate type mix from real requests
function buildTypeMix(requests: any[]) {
  const map = new Map<string, number>();
  requests.forEach((r) => {
    const short =
      r.type === "Bonafide"                ? "Bonafide"
      : r.type === "Study Certificate"     ? "Study Cert"
      : r.type === "Fee Receipt"           ? "Fee Receipt"
      : r.type === "Fee Due Certificate"   ? "Fee Due"
      : "No Fee Due";
    map.set(short, (map.get(short) ?? 0) + 1);
  });
  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}

export default function ManagementAnalytics() {
  const { requests, loading } = useAllRequests();

  const processingData = buildProcessingData(requests);
  const typeMix        = buildTypeMix(requests);

  return (
    <AppShell role="admin">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">Detailed performance and processing metrics.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Processing time chart */}
          <Card className="glass-strong border-white/50 p-5 lg:col-span-2">
            <h2 className="font-display font-semibold mb-1">Avg processing time (min)</h2>
            <p className="text-xs text-muted-foreground mb-4">By day of week</p>
            <div className="h-72">
              {loading ? <Skeleton className="h-full w-full rounded-xl" /> : (
                <ResponsiveContainer>
                  <LineChart data={processingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="d" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                    <Line type="monotone" dataKey="avg" stroke="hsl(var(--primary))" strokeWidth={3}
                      dot={{ r: 4, fill: "hsl(var(--primary))" }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>

          {/* Type mix pie chart */}
          <Card className="glass-strong border-white/50 p-5">
            <h2 className="font-display font-semibold mb-1">Certificate type mix</h2>
            <p className="text-xs text-muted-foreground mb-4">All time</p>
            <div className="h-72">
              {loading ? <Skeleton className="h-full w-full rounded-xl" /> : (
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={typeMix} dataKey="value" nameKey="name"
                      innerRadius={50} outerRadius={90} paddingAngle={4}>
                      {typeMix.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
