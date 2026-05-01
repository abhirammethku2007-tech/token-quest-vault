/**
 * Animated floating certificate mockup for the landing page hero.
 * Pure CSS animations — no external dependencies.
 */
export function CertificateMockup() {
  return (
    <div className="relative w-full max-w-md mx-auto select-none" style={{ perspective: "1000px" }}>

      {/* Glow behind the card */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-violet-600/30 to-indigo-600/30 blur-3xl scale-110" />

      {/* Main certificate card — floating animation */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl shadow-violet-900/50"
        style={{ animation: "certFloat 6s ease-in-out infinite" }}
      >
        {/* Top gradient bar */}
        <div className="h-2 bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-600" />

        {/* Certificate body */}
        <div className="bg-gradient-to-br from-[#13111f] to-[#0e0c1a] border border-white/10 p-6">

          {/* Header row */}
          <div className="flex items-center gap-3 mb-5">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/40 shrink-0">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-sm">MLRIT CertVault</p>
              <p className="text-white/40 text-[10px] uppercase tracking-wider">Office of the Registrar</p>
            </div>
            {/* Verified badge */}
            <div className="ml-auto flex items-center gap-1 bg-green-500/15 border border-green-500/30 rounded-full px-2.5 py-1">
              <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
              <span className="text-green-400 text-[10px] font-semibold">Verified</span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-5" />

          {/* Certificate type */}
          <div className="text-center mb-5">
            <p className="text-white/40 text-xs mb-1 uppercase tracking-widest">Certificate of</p>
            <h3 className="text-2xl font-black bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              BONAFIDE
            </h3>
          </div>

          {/* Student info */}
          <div className="text-center mb-5">
            <p className="text-white/40 text-xs italic mb-1">This is to certify that</p>
            <p className="text-white font-bold text-lg">Aarav Sharma</p>
            <div className="h-0.5 w-32 bg-gradient-to-r from-violet-500/50 to-indigo-500/50 mx-auto mt-1 mb-2" />
            <p className="text-white/50 text-xs">Roll No. 21CSE011 · Dept. of CSE</p>
          </div>

          <p className="text-white/30 text-xs text-center leading-relaxed mb-5">
            is a bonafide student of this institution for the academic year 2025–2026.
          </p>

          {/* Footer row */}
          <div className="flex items-end justify-between pt-4 border-t border-white/5">
            {/* Token */}
            <div>
              <p className="text-white/30 text-[9px] uppercase tracking-wider mb-0.5">Token</p>
              <p className="text-violet-400 font-mono text-xs font-semibold">BON-2026-CSE-0011</p>
              <p className="text-white/30 text-[9px] mt-1.5 uppercase tracking-wider">Issued</p>
              <p className="text-white/60 text-xs">01 May 2026</p>
            </div>

            {/* QR code SVG */}
            <div className="bg-white rounded-lg p-1.5">
              <svg width="52" height="52" viewBox="0 0 52 52">
                {/* QR pattern — decorative */}
                <rect width="52" height="52" fill="white" />
                {/* Top-left finder */}
                <rect x="2" y="2" width="16" height="16" rx="2" fill="#1e1b4b" />
                <rect x="4" y="4" width="12" height="12" rx="1" fill="white" />
                <rect x="6" y="6" width="8" height="8" rx="1" fill="#1e1b4b" />
                {/* Top-right finder */}
                <rect x="34" y="2" width="16" height="16" rx="2" fill="#1e1b4b" />
                <rect x="36" y="4" width="12" height="12" rx="1" fill="white" />
                <rect x="38" y="6" width="8" height="8" rx="1" fill="#1e1b4b" />
                {/* Bottom-left finder */}
                <rect x="2" y="34" width="16" height="16" rx="2" fill="#1e1b4b" />
                <rect x="4" y="36" width="12" height="12" rx="1" fill="white" />
                <rect x="6" y="38" width="8" height="8" rx="1" fill="#1e1b4b" />
                {/* Data modules */}
                {[
                  [20,2],[22,2],[24,2],[26,2],[20,6],[24,6],[20,10],[22,10],[26,10],
                  [20,14],[24,14],[26,14],[20,18],[22,18],[24,18],[26,18],
                  [2,20],[6,20],[10,20],[14,20],[20,20],[24,20],[28,20],[32,20],[36,20],[40,20],[44,20],[48,20],
                  [2,22],[8,22],[12,22],[18,22],[22,22],[26,22],[30,22],[34,22],[38,22],[42,22],[46,22],
                  [4,24],[10,24],[16,24],[20,24],[24,24],[28,24],[32,24],[36,24],[40,24],[44,24],[48,24],
                  [2,26],[6,26],[14,26],[18,26],[22,26],[26,26],[30,26],[38,26],[42,26],[46,26],
                  [4,28],[8,28],[12,28],[20,28],[24,28],[28,28],[32,28],[36,28],[40,28],[44,28],
                  [2,30],[6,30],[10,30],[14,30],[18,30],[22,30],[30,30],[34,30],[38,30],[42,30],[46,30],[48,30],
                  [20,34],[24,34],[28,34],[32,34],[36,34],[40,34],[44,34],[48,34],
                  [20,36],[26,36],[30,36],[34,36],[38,36],[42,36],[46,36],
                  [20,38],[22,38],[28,38],[32,38],[36,38],[40,38],[44,38],[48,38],
                  [20,40],[24,40],[26,40],[30,40],[34,40],[38,40],[42,40],[46,40],
                  [20,42],[22,42],[28,42],[32,42],[36,42],[40,42],[44,42],[48,42],
                  [20,44],[24,44],[26,44],[30,44],[34,44],[38,44],[42,44],[46,44],[48,44],
                  [20,46],[22,46],[28,46],[32,46],[36,46],[40,46],[44,46],
                  [20,48],[24,48],[26,48],[30,48],[34,48],[38,48],[42,48],[46,48],[48,48],
                ].map(([x, y], i) => (
                  <rect key={i} x={x} y={y} width="2" height="2" fill="#1e1b4b" />
                ))}
              </svg>
            </div>

            {/* Signature */}
            <div className="text-right">
              <p className="text-violet-400 font-bold text-sm italic" style={{ fontFamily: "cursive" }}>
                Dr. R. Kumar
              </p>
              <div className="h-px w-24 bg-white/20 ml-auto my-1" />
              <p className="text-white/30 text-[9px]">Principal</p>
              <div className="flex items-center gap-1 justify-end mt-1">
                <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
                <span className="text-green-400 text-[9px] font-mono">SIG-21f8a3</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient bar */}
        <div className="h-1.5 bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-600" />
      </div>

      {/* Floating badge — top right */}
      <div
        className="absolute -top-4 -right-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl px-3 py-2 shadow-xl shadow-green-900/40 border border-green-400/20"
        style={{ animation: "certFloat 6s ease-in-out infinite", animationDelay: "1s" }}
      >
        <div className="flex items-center gap-1.5">
          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-white text-xs font-bold">Verified</span>
        </div>
      </div>

      {/* Floating badge — bottom left */}
      <div
        className="absolute -bottom-4 -left-4 bg-[#13111f] border border-white/10 rounded-2xl px-3 py-2 shadow-xl"
        style={{ animation: "certFloat 6s ease-in-out infinite", animationDelay: "2s" }}
      >
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-violet-600/20 flex items-center justify-center">
            <svg className="h-3.5 w-3.5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <p className="text-white text-xs font-semibold">Digitally Signed</p>
            <p className="text-white/40 text-[10px]">Ed25519 · Tamper-proof</p>
          </div>
        </div>
      </div>

      {/* Floating token badge — top left */}
      <div
        className="absolute top-8 -left-6 bg-[#13111f] border border-violet-500/20 rounded-xl px-3 py-1.5 shadow-lg"
        style={{ animation: "certFloat 6s ease-in-out infinite", animationDelay: "3s" }}
      >
        <p className="text-violet-400 font-mono text-xs font-bold">BON-2026-CSE-0011</p>
        <p className="text-white/30 text-[9px]">Queue position #1</p>
      </div>

      {/* CSS animation */}
      <style>{`
        @keyframes certFloat {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-12px) rotate(0.5deg); }
          66% { transform: translateY(-6px) rotate(-0.5deg); }
        }
      `}</style>
    </div>
  );
}
