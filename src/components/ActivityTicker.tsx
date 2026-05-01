import { useEffect, useRef } from "react";
import { CheckCircle2, Clock, FileText, UserPlus } from "lucide-react";

const activities = [
  { icon: CheckCircle2, color: "text-green-400",  bg: "bg-green-400/10",  text: "BON-2026-CSE-0011 approved",        time: "2s ago" },
  { icon: UserPlus,     color: "text-violet-400", bg: "bg-violet-400/10", text: "New student registered",            time: "15s ago" },
  { icon: FileText,     color: "text-blue-400",   bg: "bg-blue-400/10",   text: "STU-2026-ECE-0007 submitted",       time: "32s ago" },
  { icon: CheckCircle2, color: "text-green-400",  bg: "bg-green-400/10",  text: "NFD-2026-CSE-0021 downloaded",      time: "1m ago" },
  { icon: Clock,        color: "text-amber-400",  bg: "bg-amber-400/10",  text: "FEE-2026-MEC-0019 under review",    time: "2m ago" },
  { icon: CheckCircle2, color: "text-green-400",  bg: "bg-green-400/10",  text: "FDC-2026-ECE-0022 approved",        time: "3m ago" },
  { icon: FileText,     color: "text-blue-400",   bg: "bg-blue-400/10",   text: "BON-2026-IT-0003 submitted",        time: "4m ago" },
  { icon: UserPlus,     color: "text-violet-400", bg: "bg-violet-400/10", text: "Management staff signed in",        time: "5m ago" },
];

export function ActivityTicker() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let pos = 0;
    const speed = 0.4;
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

  const items = [...activities, ...activities]; // duplicate for seamless loop

  return (
    <div className="overflow-hidden py-4 relative">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#0a0a0f] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#0a0a0f] to-transparent z-10 pointer-events-none" />

      <div ref={ref} className="flex gap-3 w-max">
        {items.map((a, i) => (
          <div key={i}
            className="flex items-center gap-2.5 bg-white/[0.04] border border-white/[0.06] rounded-xl px-4 py-2.5 shrink-0 hover:bg-white/[0.07] transition-colors">
            <div className={`${a.bg} rounded-lg p-1.5`}>
              <a.icon className={`h-3.5 w-3.5 ${a.color}`} />
            </div>
            <span className="text-white/70 text-sm whitespace-nowrap">{a.text}</span>
            <span className="text-white/25 text-xs whitespace-nowrap">{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
