import { AppShell } from "@/components/AppShell";
import { Card } from "@/components/ui/card";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const processingData = [
  { d: "Mon", avg: 42 }, { d: "Tue", avg: 35 }, { d: "Wed", avg: 50 },
  { d: "Thu", avg: 28 }, { d: "Fri", avg: 38 }, { d: "Sat", avg: 22 }, { d: "Sun", avg: 18 },
];

const typeMix = [
  { name: "Bonafide", value: 58 },
  { name: "Study Cert", value: 32 },
  { name: "Fee Receipt", value: 24 },
];
const colors = ["hsl(234 89% 60%)", "hsl(258 90% 66%)", "hsl(210 95% 60%)"];

export default function ManagementAnalytics() {
  return (
    <AppShell role="management">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">Detailed performance and processing metrics.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="glass-strong border-white/50 p-5 lg:col-span-2">
            <h2 className="font-display font-semibold mb-1">Avg processing time (min)</h2>
            <p className="text-xs text-muted-foreground mb-4">Last 7 days</p>
            <div className="h-72">
              <ResponsiveContainer>
                <LineChart data={processingData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="d" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                  <Line type="monotone" dataKey="avg" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: "hsl(var(--primary))" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="glass-strong border-white/50 p-5">
            <h2 className="font-display font-semibold mb-1">Certificate type mix</h2>
            <p className="text-xs text-muted-foreground mb-4">Last 30 days</p>
            <div className="h-72">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={typeMix} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={4}>
                    {typeMix.map((_, i) => <Cell key={i} fill={colors[i]} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
