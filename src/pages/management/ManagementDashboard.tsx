import { AppShell } from "@/components/AppShell";
import { StatCard } from "@/components/StatCard";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAllRequests } from "@/lib/useRequests";
import { Award, FileText, Building2, TrendingUp } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, BarChart, Bar, Cell,
} from "recharts";

// Static monthly trend — replace with real aggregation query when needed
const monthlyData = [
  { m: "Nov", issued: 42 },
  { m: "Dec", issued: 58 },
  { m: "Jan", issued: 72 },
  { m: "Feb", issued: 65 },
  { m: "Mar", issued: 89 },
  { m: "Apr", issued: 104 },
];

const deptColors = [
  "hsl(234 89% 60%)", "hsl(258 90% 66%)", "hsl(210 95% 60%)",
  "hsl(280 80% 65%)", "hsl(190 85% 55%)",
];

export default function ManagementDashboard() {
  const { requests, loading } = useAllRequests();

  const approved = requests.filter((r) => r.status === "Approved").length;

  const dept = Array.from(
    requests.reduce(
      (m, r) => m.set(r.department, (m.get(r.department) ?? 0) + 1),
      new Map<string, number>()
    )
  ).map(([name, value]) => ({ name, value }));

  return (
    <AppShell role="admin">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Management Overview</h1>
          <p className="text-muted-foreground mt-1">Institution-wide insights and monitoring.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)
          ) : (
            <>
              <StatCard label="Certificates Issued" value={approved}          icon={<Award className="h-5 w-5" />}     tone="success" trend="All time" />
              <StatCard label="Total Requests"       value={requests.length}  icon={<FileText className="h-5 w-5" />}   tone="primary" />
              <StatCard label="Departments"          value={dept.length}      icon={<Building2 className="h-5 w-5" />}  tone="info" />
              <StatCard label="Growth"               value="+18%"             icon={<TrendingUp className="h-5 w-5" />} tone="warning" trend="MoM" />
            </>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="glass-strong border-white/50 p-5 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display font-semibold">Monthly Trend</h2>
                <p className="text-xs text-muted-foreground">Certificates issued per month</p>
              </div>
            </div>
            <div className="h-72">
              <ResponsiveContainer>
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="hsl(var(--primary))" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                  <Area type="monotone" dataKey="issued" stroke="hsl(var(--primary))" strokeWidth={2.5} fill="url(#g1)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="glass-strong border-white/50 p-5">
            <h2 className="font-display font-semibold mb-1">Department Stats</h2>
            <p className="text-xs text-muted-foreground mb-4">Requests by department</p>
            <div className="h-72">
              {loading ? (
                <Skeleton className="h-full w-full rounded-xl" />
              ) : (
                <ResponsiveContainer>
                  <BarChart data={dept} layout="vertical" margin={{ left: 8 }}>
                    <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} width={48} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                    <Bar dataKey="value" radius={[0, 8, 8, 0]}>
                      {dept.map((_, i) => <Cell key={i} fill={deptColors[i % deptColors.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
