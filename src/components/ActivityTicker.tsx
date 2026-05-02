import { useEffect, useRef } from "react";

const activities = [
  { emoji: "✅", label: "Certificate Approved",  detail: "BON-2026-CSE-0011 · Aarav Sharma",    time: "2s ago",  color: "text-green-400",  bg: "bg-green-400/10",  border: "border-green-400/20" },
  { emoji: "🎓", label: "New Student Registered", detail: "24r21a0314@mlrit.ac.in joined",        time: "18s ago", color: "text-violet-400", bg: "bg-violet-400/10", border: "border-violet-400/20" },
  { emoji: "📄", label: "Request Submitted",      detail: "STU-2026-ECE-0007 · Priya Verma",     time: "35s ago", color: "text-blue-400",   bg: "bg-blue-400/10",   border: "border-blue-400/20" },
  { emoji: "⬇️", label: "Certificate Downloaded", detail: "NFD-2026-CSE-0021 · Aarav Sharma",    time: "1m ago",  color: "text-cyan-400",   bg: "bg-cyan-400/10",   border: "border-cyan-400/20" },
  { emoji: "🔍", label: "Under Review",           detail: "FEE-2026-MEC-0019 · Rahul Iyer",      time: "2m ago",  color: "text-amber-400",  bg: "bg-amber-400/10",  border: "border-amber-400/20" },
  { emoji: "✅", label: "Certificate Approved",   detail: "FDC-2026-ECE-0022 · Priya Verma",     time: "3m ago",  color: "text-green-400",  bg: "bg-green-400/10",  border: "border-green-400/20" },
  { emoji: "📝", label: "Request Submitted",      detail: "BON-2026-IT-0003 · Mohit Yadav",      time: "4m ago",  color: "text-blue-400",   bg: "bg-blue-400/10",   border: "border-blue-400/20" },
  { emoji: "🔐", label: "Certificate Signed",     detail: "SIG-9bd0c2 · Management Staff",       time: "5m ago",  color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" },
  { emoji: "❌", label: "Request Rejected",       detail: "BON-2026-IT-0003 · Incomplete info",  time: "6m ago",  color: "text-red-400",    bg: "bg-red-400/10",    border: "border-red-400/20" },
  { emoji: "🔑", label: "Signature Key Rotated",  detail: "Ed25519 Primary Key · Admin",         time: "8m ago",  color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20" },
];

export function ActivityTicker() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let pos = 0;
    const speed = 0.5;
    let raf: number;
    const tick = () => {
      pos += speed;
      if (pos >= el.scrollWidth / 2) pos = 0;
      el.style.transform = `translateX(-${pos}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const items = [...activities, ...activities];

  return (
    <div className="overflow-hidden relative">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0a0a0f] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0a0a0f] to-transparent z-10 pointer-events-none" />

      <div ref={ref} className="flex gap-3 w-max py-1">
        {items.map((a, i) => (
          <div key={i}
            className={`flex items-center gap-2.5 ${a.bg} border ${a.border} rounded-xl px-3.5 py-2 shrink-0`}>
            {/* Emoji */}
            <span className="text-base leading-none">{a.emoji}</span>
            {/* Content */}
            <div className="flex flex-col">
              <span className={`${a.color} text-xs font-semibold leading-tight`}>{a.label}</span>
              <span className="text-white/40 text-[10px] leading-tight">{a.detail}</span>
            </div>
            {/* Time */}
            <span className="text-white/20 text-[10px] ml-1 whitespace-nowrap">{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
