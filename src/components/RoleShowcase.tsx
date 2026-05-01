import { GraduationCap, Building2, ShieldCheck, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const roles = [
  {
    icon: GraduationCap,
    label: "Student",
    gradient: "from-violet-600 to-indigo-600",
    glow: "shadow-violet-500/20",
    border: "border-violet-500/20",
    accent: "text-violet-400",
    bg: "bg-violet-500/5",
    desc: "Request certificates, track queue position, download signed PDFs.",
    features: ["Request 5 certificate types", "Real-time queue tracking", "Download signed PDFs", "QR verification"],
    preview: (
      <div className="space-y-2">
        <div className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-400" />
            <span className="text-xs text-white/60">BON-2026-CSE-0011</span>
          </div>
          <span className="text-[10px] text-green-400 bg-green-400/10 rounded-full px-2 py-0.5">Approved</span>
        </div>
        <div className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-amber-400" />
            <span className="text-xs text-white/60">STU-2026-CSE-0012</span>
          </div>
          <span className="text-[10px] text-amber-400 bg-amber-400/10 rounded-full px-2 py-0.5">Queue #2</span>
        </div>
        <div className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-400" />
            <span className="text-xs text-white/60">NFD-2026-CSE-0013</span>
          </div>
          <span className="text-[10px] text-blue-400 bg-blue-400/10 rounded-full px-2 py-0.5">Reviewing</span>
        </div>
      </div>
    ),
  },
  {
    icon: Building2,
    label: "Management",
    gradient: "from-blue-600 to-cyan-600",
    glow: "shadow-blue-500/20",
    border: "border-blue-500/20",
    accent: "text-blue-400",
    bg: "bg-blue-500/5",
    desc: "Process requests, approve certificates, manage the FIFO queue.",
    features: ["FIFO queue management", "Approve / Reject requests", "Generate & sign certificates", "User management"],
    preview: (
      <div className="space-y-2">
        <div className="bg-white/5 rounded-lg px-3 py-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-white/60">Pending Queue</span>
            <span className="text-xs text-blue-400 font-semibold">3 requests</span>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full w-1/3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2 text-center">
            <p className="text-lg font-black text-green-400">24</p>
            <p className="text-[10px] text-white/40">Approved</p>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 text-center">
            <p className="text-lg font-black text-amber-400">3</p>
            <p className="text-[10px] text-white/40">Pending</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: ShieldCheck,
    label: "Admin",
    gradient: "from-emerald-600 to-teal-600",
    glow: "shadow-emerald-500/20",
    border: "border-emerald-500/20",
    accent: "text-emerald-400",
    bg: "bg-emerald-500/5",
    desc: "Monitor analytics, manage signature keys, view audit logs.",
    features: ["Institution analytics", "Digital signature keys", "Tamper-proof audit logs", "System monitoring"],
    preview: (
      <div className="space-y-2">
        <div className="bg-white/5 rounded-lg px-3 py-2">
          <p className="text-[10px] text-white/40 mb-1.5">Monthly Trend</p>
          <div className="flex items-end gap-1 h-8">
            {[40, 65, 55, 80, 70, 90].map((h, i) => (
              <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-emerald-600 to-teal-500 opacity-80"
                style={{ height: `${h}%` }} />
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/5 rounded-lg px-3 py-2">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs text-white/60">Primary Key Active</span>
          <span className="ml-auto text-[10px] text-emerald-400 font-mono">Ed25519</span>
        </div>
      </div>
    ),
  },
];

export function RoleShowcase() {
  const navigate = useNavigate();
  return (
    <div className="grid md:grid-cols-3 gap-5">
      {roles.map((r) => (
        <div key={r.label}
          className={`group relative ${r.bg} border ${r.border} rounded-2xl p-6 hover:border-opacity-50 transition-all duration-300 overflow-hidden`}>
          {/* Glow */}
          <div className={`absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${r.gradient} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500`} />

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${r.gradient} flex items-center justify-center shadow-lg ${r.glow}`}>
              <r.icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-white">{r.label}</p>
              <p className="text-xs text-white/40">Portal</p>
            </div>
          </div>

          <p className="text-sm text-white/50 mb-4 leading-relaxed">{r.desc}</p>

          {/* Mini UI preview */}
          <div className="mb-4 rounded-xl bg-white/[0.03] border border-white/[0.05] p-3">
            {r.preview}
          </div>

          {/* Features */}
          <ul className="space-y-1.5 mb-5">
            {r.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-xs text-white/50">
                <div className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${r.gradient}`} />
                {f}
              </li>
            ))}
          </ul>

          <button
            onClick={() => navigate("/login?mode=signup")}
            className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r ${r.gradient} text-white text-sm font-semibold py-2.5 rounded-xl opacity-80 group-hover:opacity-100 transition-opacity`}>
            Get {r.label} Access
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
