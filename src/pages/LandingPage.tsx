import { useNavigate } from "react-router-dom";
import {
  ShieldCheck, GraduationCap, FileCheck2, QrCode,
  ArrowRight, Clock, Lock, CheckCircle2,
  ChevronRight, Zap, Star, Users, Award, TrendingUp,
} from "lucide-react";
import { CertificateMockup } from "@/components/CertificateMockup";
import { ActivityTicker } from "@/components/ActivityTicker";
import { RoleShowcase } from "@/components/RoleShowcase";

const features = [
  { icon: ShieldCheck, title: "Digitally Signed",    desc: "Every certificate is cryptographically signed — tamper-proof and verifiable anywhere.",  color: "from-violet-500 to-indigo-500" },
  { icon: QrCode,      title: "QR Verification",     desc: "Scan the embedded QR code to instantly verify authenticity on any device.",               color: "from-indigo-500 to-blue-500" },
  { icon: Clock,       title: "Fair Token Queue",     desc: "FIFO-based token system ensures transparent, first-come-first-served processing.",         color: "from-blue-500 to-cyan-500" },
  { icon: FileCheck2,  title: "5 Certificate Types", desc: "Bonafide, Study, Fee Receipt, Fee Due & No Fee Due — all from one portal.",               color: "from-cyan-500 to-teal-500" },
  { icon: Lock,        title: "Role-Based Access",    desc: "Separate secure dashboards for Students, Management & Admin.",                            color: "from-teal-500 to-green-500" },
  { icon: Zap,         title: "Real-time Updates",    desc: "Live status tracking — know exactly where your request is in the queue.",                 color: "from-amber-500 to-orange-500" },
];

const steps = [
  { step: "01", icon: GraduationCap, title: "Create Account",  desc: "Sign up with your college email in under 30 seconds." },
  { step: "02", icon: FileCheck2,    title: "Request",          desc: "Choose your certificate type and submit with one click." },
  { step: "03", icon: Clock,         title: "Track Live",       desc: "Watch your queue position and ETA update in real-time." },
  { step: "04", icon: Award,         title: "Download PDF",     desc: "Get your digitally signed certificate with QR code." },
];

const stats = [
  { value: "12,000+", label: "Students" },
  { value: "50,000+", label: "Certificates" },
  { value: "99.9%",   label: "Uptime" },
  { value: "<2 min",  label: "Processing" },
];

const testimonials = [
  { name: "Aarav Sharma",     role: "CSE Student", text: "Got my bonafide certificate in under 10 minutes. The QR verification is impressive!" },
  { name: "Priya Verma",      role: "ECE Student", text: "No more standing in queues. The token system is fair and the app is super easy to use." },
  { name: "Dr. Ramesh Kumar", role: "Principal",   text: "CertVault has completely digitized our certificate workflow. Highly recommended." },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#0a0a0f] text-white overflow-x-hidden">

      {/* ── Navbar ─────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0f]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-14">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-lg bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              CertVault
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-white/50">
            <button onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-white transition-colors">Features</button>
            <button onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-white transition-colors">How it works</button>
            <button onClick={() => document.getElementById("testimonials")?.scrollIntoView({ behavior: "smooth" })} className="hover:text-white transition-colors">Reviews</button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/login")} className="text-sm text-white/60 hover:text-white transition-colors px-3 py-1.5">Sign In</button>
            <button onClick={() => navigate("/login?mode=signup")}
              className="text-sm bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-4 py-1.5 rounded-lg font-medium transition-all hover:scale-105 shadow-lg shadow-violet-500/25">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ── Live Activity Bar ──────────────────────────────── */}
      <div className="pt-14">
        <div className="border-b border-white/5 bg-white/[0.015] py-2.5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-2 mb-2">
            <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-[10px] text-white/40 uppercase tracking-widest font-medium">Live Activity</span>
            <span className="hidden sm:inline text-[10px] text-white/20">— Real-time certificate events across MLRIT</span>
          </div>
          <ActivityTicker />
        </div>
      </div>

      {/* ── Hero — compact, fits on screen ────────────────── */}
      <section className="relative py-8 sm:py-10 lg:py-12">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 h-80 w-80 rounded-full bg-violet-600/12 blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 h-80 w-80 rounded-full bg-indigo-600/12 blur-[100px]" />
          <div className="absolute inset-0 opacity-[0.02]"
            style={{ backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">

            {/* Left */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1 text-xs text-white/60 mb-5">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                MLRIT Digital Certificate Portal — Now Live
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-[1.1] tracking-tight mb-4">
                <span className="text-white">Your Certificates,</span>
                <br />
                <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
                  Secured & Verified
                </span>
              </h1>

              <p className="text-sm sm:text-base text-white/50 mb-6 leading-relaxed max-w-lg">
                Request, track, and download digitally signed college certificates with
                QR-code verification and a transparent token-based queue system.
              </p>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button onClick={() => navigate("/login?mode=signup")}
                  className="group flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105 shadow-xl shadow-violet-500/25">
                  Create Free Account
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={() => navigate("/login")}
                  className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all hover:scale-105">
                  Sign In <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              {/* Stats — compact 4-col */}
              <div className="grid grid-cols-4 gap-3">
                {stats.map((s) => (
                  <div key={s.label} className="text-center bg-white/[0.03] border border-white/[0.06] rounded-xl py-2.5 px-1">
                    <p className="text-base sm:text-lg font-black bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent leading-tight">
                      {s.value}
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-white/30 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — certificate mockup (visible on ALL screens) */}
            <div className="flex items-center justify-center mt-4 lg:mt-0">
              <CertificateMockup />
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────── */}
      <section id="features" className="py-14 sm:py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-3 py-1 text-xs text-violet-400 mb-3">
              ✨ Features
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-3">Everything you need</h2>
            <p className="text-white/40 text-sm max-w-lg mx-auto">A modern, secure certificate management system built for MLRIT.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div key={f.title}
                className="group relative bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl p-5 transition-all duration-300 overflow-hidden">
                <div className={`absolute -top-8 -right-8 h-24 w-24 rounded-full bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500`} />
                <div className={`inline-flex p-2.5 rounded-xl bg-gradient-to-br ${f.color} mb-3 shadow-lg`}>
                  <f.icon className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-bold text-white text-base mb-1.5">{f.title}</h3>
                <p className="text-xs text-white/40 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────── */}
      <section id="how" className="py-14 sm:py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/15 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1 text-xs text-indigo-400 mb-3">
              <Zap className="h-3 w-3" /> How It Works
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-3">Four simple steps</h2>
            <p className="text-white/40 text-sm max-w-lg mx-auto">From signup to certificate download in minutes.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((s, i) => (
              <div key={s.step} className="relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 sm:p-5 text-center hover:bg-white/[0.06] transition-colors">
                <div className="text-3xl font-black bg-gradient-to-r from-violet-600/30 to-indigo-600/30 bg-clip-text text-transparent mb-2">{s.step}</div>
                <div className="inline-flex p-2.5 rounded-xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/20 mb-2">
                  <s.icon className="h-4 w-4 text-violet-400" />
                </div>
                <h3 className="font-bold text-white text-sm mb-1">{s.title}</h3>
                <p className="text-xs text-white/40">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Role Showcase ──────────────────────────────────── */}
      <section className="py-14 sm:py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-950/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-3 py-1 text-xs text-blue-400 mb-3">
              <Users className="h-3 w-3" /> Three Roles, One Platform
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-3">Built for everyone</h2>
            <p className="text-white/40 text-sm max-w-lg mx-auto">Student, Management, or Admin — CertVault has a dedicated portal for you.</p>
          </div>
          <RoleShowcase />
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────── */}
      <section id="testimonials" className="py-14 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1 text-xs text-amber-400 mb-3">
              <Star className="h-3 w-3" /> Testimonials
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-3">Loved by students & staff</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:bg-white/[0.06] transition-colors">
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {t.name.split(" ").map(p => p[0]).slice(0, 2).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-white/40">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────── */}
      <section className="py-14 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 via-indigo-600/20 to-purple-600/30" />
            <div className="absolute inset-0 border border-white/10 rounded-2xl" />
            <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="relative z-10 text-center py-10 px-6 sm:py-12 sm:px-10">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 text-xs text-white/70 mb-4">
                <CheckCircle2 className="h-3 w-3 text-green-400" /> Free for all MLRIT students
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white mb-3">Ready to get started?</h2>
              <p className="text-white/50 text-sm max-w-sm mx-auto mb-6">
                Join 12,000+ students already using CertVault for their certificate needs.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button onClick={() => navigate("/login?mode=signup")}
                  className="group flex items-center gap-2 bg-white text-indigo-700 hover:bg-white/90 px-6 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105 shadow-xl w-full sm:w-auto justify-center">
                  Create Account — It's Free
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={() => navigate("/login")}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all w-full sm:w-auto justify-center">
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <ShieldCheck className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="font-bold text-white/70 text-sm">CertVault</span>
          </div>
          <p className="text-xs text-white/25">© {new Date().getFullYear()} MLRIT. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-xs text-white/25">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            All systems operational
          </div>
        </div>
      </footer>
    </div>
  );
}
