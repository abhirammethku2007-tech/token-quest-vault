import { useEffect, useState } from "react";

const certs = [
  {
    type: "BONAFIDE",
    token: "BON-2026-CSE-0011",
    student: "Aarav Sharma",
    roll: "21CSE011",
    dept: "CSE",
    body: "is a bonafide student of this institution for the academic year 2025–2026.",
    sig: "SIG-21f8a3",
    from: "from-violet-600 to-indigo-600",
    text: "from-violet-400 to-indigo-400",
    bar: "from-violet-600 via-purple-500 to-indigo-600",
    dot: "bg-violet-500",
    label: "Bonafide",
  },
  {
    type: "FEE RECEIPT",
    token: "FEE-2026-ECE-0019",
    student: "Priya Verma",
    roll: "21ECE007",
    dept: "ECE",
    body: "has duly paid all prescribed fees and charges for the academic year 2025–2026.",
    sig: "SIG-9bd0c2",
    from: "from-blue-600 to-cyan-600",
    text: "from-blue-400 to-cyan-400",
    bar: "from-blue-600 via-cyan-500 to-blue-600",
    dot: "bg-cyan-500",
    label: "Fee Receipt",
  },
  {
    type: "STUDY CERTIFICATE",
    token: "STU-2026-CSE-0008",
    student: "Sneha Kapoor",
    roll: "22CSE044",
    dept: "CSE",
    body: "has successfully completed the prescribed course of study for the academic year 2025–2026.",
    sig: "SIG-4e7f1a",
    from: "from-emerald-600 to-teal-600",
    text: "from-emerald-400 to-teal-400",
    bar: "from-emerald-600 via-teal-500 to-emerald-600",
    dot: "bg-emerald-500",
    label: "Study Cert",
  },
];

function QRDecor() {
  return (
    <div className="bg-white rounded-lg p-1.5 shrink-0">
      <svg width="46" height="46" viewBox="0 0 52 52">
        <rect width="52" height="52" fill="white" />
        <rect x="2" y="2" width="16" height="16" rx="2" fill="#1e1b4b" />
        <rect x="4" y="4" width="12" height="12" rx="1" fill="white" />
        <rect x="6" y="6" width="8" height="8" rx="1" fill="#1e1b4b" />
        <rect x="34" y="2" width="16" height="16" rx="2" fill="#1e1b4b" />
        <rect x="36" y="4" width="12" height="12" rx="1" fill="white" />
        <rect x="38" y="6" width="8" height="8" rx="1" fill="#1e1b4b" />
        <rect x="2" y="34" width="16" height="16" rx="2" fill="#1e1b4b" />
        <rect x="4" y="36" width="12" height="12" rx="1" fill="white" />
        <rect x="6" y="38" width="8" height="8" rx="1" fill="#1e1b4b" />
        {[[20,2],[22,2],[24,2],[20,6],[24,6],[20,10],[22,10],[26,10],[20,14],[24,14],[26,14],
          [2,20],[6,20],[10,20],[14,20],[20,20],[24,20],[28,20],[32,20],[36,20],[40,20],[44,20],
          [2,22],[8,22],[12,22],[18,22],[22,22],[26,22],[30,22],[34,22],[38,22],[42,22],
          [4,24],[10,24],[16,24],[20,24],[24,24],[28,24],[32,24],[36,24],[40,24],[44,24],
          [2,26],[6,26],[14,26],[18,26],[22,26],[26,26],[30,26],[38,26],[42,26],
          [4,28],[8,28],[12,28],[20,28],[24,28],[28,28],[32,28],[36,28],[40,28],
          [20,34],[24,34],[28,34],[32,34],[36,34],[40,34],[44,34],
          [20,36],[26,36],[30,36],[34,36],[38,36],[42,36],
          [20,38],[22,38],[28,38],[32,38],[36,38],[40,38],[44,38],
          [20,40],[24,40],[26,40],[30,40],[34,40],[38,40],
          [20,42],[22,42],[28,42],[32,42],[36,42],[40,42],[44,42],
          [20,44],[24,44],[26,44],[30,44],[34,44],[38,44],[42,44],
          [20,46],[22,46],[28,46],[32,46],[36,46],[40,46],
          [20,48],[24,48],[26,48],[30,48],[34,48],[38,48],[42,48],
        ].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="2" height="2" fill="#1e1b4b" />
        ))}
      </svg>
    </div>
  );
}

export function CertificateMockup() {
  const [current, setCurrent] = useState(0);
  const [sliding, setSliding] = useState(false);
  const [direction, setDirection] = useState<"in" | "out">("in");

  useEffect(() => {
    const interval = setInterval(() => {
      // Slide out current
      setDirection("out");
      setSliding(true);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % certs.length);
        setDirection("in");
        setSliding(false);
      }, 350);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const goTo = (i: number) => {
    if (i === current) return;
    setDirection("out");
    setSliding(true);
    setTimeout(() => {
      setCurrent(i);
      setDirection("in");
      setSliding(false);
    }, 350);
  };

  const cert = certs[current];

  const slideStyle: React.CSSProperties = {
    transition: "opacity 0.35s ease, transform 0.35s ease",
    opacity: sliding ? 0 : 1,
    transform: sliding
      ? direction === "out" ? "translateX(-24px)" : "translateX(24px)"
      : "translateX(0)",
  };

  return (
    <div className="relative w-full max-w-sm mx-auto select-none -mt-6 lg:-mt-10" style={{ perspective: "1200px" }}>

      {/* Glow */}
      <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${cert.from} opacity-20 blur-3xl scale-110 transition-all duration-700`} />

      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mb-3 relative z-10">
        {certs.map((c, i) => (
          <button key={i} onClick={() => goTo(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? `w-6 ${c.dot}` : "w-1.5 bg-white/20"
            }`}
          />
        ))}
      </div>

      {/* Card */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl"
        style={{ animation: "certFloat 6s ease-in-out infinite" }}
      >
        {/* Top bar */}
        <div className={`h-2 bg-gradient-to-r ${cert.bar} transition-all duration-700`} />

        {/* Sliding content */}
        <div className="bg-gradient-to-br from-[#13111f] to-[#0e0c1a] border border-white/10 p-5" style={slideStyle}>

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${cert.from} flex items-center justify-center shadow-lg shrink-0`}>
              <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-xs">MLRIT CertVault</p>
              <p className="text-white/40 text-[9px] uppercase tracking-wider">Office of the Registrar</p>
            </div>
            <div className="ml-auto flex items-center gap-1 bg-green-500/15 border border-green-500/30 rounded-full px-2 py-0.5">
              <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
              <span className="text-green-400 text-[9px] font-semibold">Verified</span>
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-4" />

          {/* Type */}
          <div className="text-center mb-4">
            <p className="text-white/40 text-[9px] mb-1 uppercase tracking-widest">Certificate of</p>
            <h3 className={`text-xl font-black bg-gradient-to-r ${cert.text} bg-clip-text text-transparent`}>
              {cert.type}
            </h3>
          </div>

          {/* Student */}
          <div className="text-center mb-3">
            <p className="text-white/40 text-[9px] italic mb-1">This is to certify that</p>
            <p className="text-white font-bold text-base">{cert.student}</p>
            <div className={`h-0.5 w-28 bg-gradient-to-r ${cert.text} opacity-50 mx-auto mt-1 mb-1.5`} />
            <p className="text-white/50 text-[10px]">Roll No. {cert.roll} · Dept. of {cert.dept}</p>
          </div>

          <p className="text-white/30 text-[10px] text-center leading-relaxed mb-4">{cert.body}</p>

          {/* Footer */}
          <div className="flex items-end justify-between pt-3 border-t border-white/5">
            <div>
              <p className="text-white/30 text-[8px] uppercase tracking-wider mb-0.5">Token</p>
              <p className={`bg-gradient-to-r ${cert.text} bg-clip-text text-transparent font-mono text-[10px] font-semibold`}>
                {cert.token}
              </p>
              <p className="text-white/30 text-[8px] mt-1 uppercase tracking-wider">Issued</p>
              <p className="text-white/60 text-[10px]">01 May 2026</p>
            </div>
            <QRDecor />
            <div className="text-right">
              <p className={`bg-gradient-to-r ${cert.text} bg-clip-text text-transparent font-bold text-xs italic`} style={{ fontFamily: "cursive" }}>
                Dr. R. Kumar
              </p>
              <div className="h-px w-20 bg-white/20 ml-auto my-1" />
              <p className="text-white/30 text-[8px]">Principal</p>
              <div className="flex items-center gap-1 justify-end mt-1">
                <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
                <span className="text-green-400 text-[8px] font-mono">{cert.sig}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={`h-1.5 bg-gradient-to-r ${cert.bar} transition-all duration-700`} />
      </div>

      {/* Floating badges */}
      <div className="absolute -top-3 -right-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl px-2.5 py-1.5 shadow-xl border border-green-400/20"
        style={{ animation: "certFloat 6s ease-in-out infinite", animationDelay: "1s" }}>
        <div className="flex items-center gap-1">
          <svg className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-white text-[10px] font-bold">Verified</span>
        </div>
      </div>

      <div className="absolute -bottom-3 -left-3 bg-[#13111f] border border-white/10 rounded-xl px-2.5 py-1.5 shadow-xl"
        style={{ animation: "certFloat 6s ease-in-out infinite", animationDelay: "2s" }}>
        <div className="flex items-center gap-1.5">
          <div className="h-6 w-6 rounded-lg bg-violet-600/20 flex items-center justify-center">
            <svg className="h-3 w-3 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <p className="text-white text-[10px] font-semibold">Digitally Signed</p>
            <p className="text-white/40 text-[9px]">Ed25519 · Tamper-proof</p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes certFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(0.5deg); }
          66% { transform: translateY(-5px) rotate(-0.5deg); }
        }
      `}</style>
    </div>
  );
}
