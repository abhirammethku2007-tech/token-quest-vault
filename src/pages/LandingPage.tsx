import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck, GraduationCap, FileCheck2, QrCode,
  ArrowRight, Sparkles, Clock, Lock, CheckCircle2,
  ChevronRight, Zap, Globe, Star, Users, Award, TrendingUp,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────
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
  { value: "12,000+", label: "Students Served",      icon: Users },
  { value: "50,000+", label: "Certificates Issued",  icon: Award },
  { value: "99.9%",   label: "Uptime",               icon: TrendingUp },
  { value: "<2 min",  label: "Avg. Processing",      icon: Zap },
];

const testimonials = [
  { name: "Aarav Sharma",   role: "CSE Student",       text: "Got my bonafide certificate in under 10 minutes. The QR verification is impressive!" },
  { name: "Priya Verma",    role: "ECE Student",       text: "No more standing in queues. The token system is fair and the app is super easy to use." },
  { name: "Dr. Ramesh Kumar", role: "Principal",       text: "CertVault has completely digitized our certificate workflow. Highly recommended." },
];

// ─── Component ────────────────────────────────────────────────
export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-x-hidden">

      {/* ── Navbar ─────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              CertVault
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-white/60">
            <button onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              className="hover:text-white transition-colors">Features</button>
            <button onClick={() => document.getElementById("how")?.scrollIntoView({ behavior: "smooth" })}
              className="hover:text-white transition-colors">How it works</button>
            <button onClick={() => document.getElementById("testimonials")?.scrollIntoView({ behavior: "smooth" })}
              className="hover:text-white transition-colors">Reviews</button>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/login")}
              className="text-sm text-white/70 hover:text-white transition-colors px-4 py-2">
              Sign In
            </button>
            <button onClick={() => navigate("/login?mode=signup")}
              className="text-sm bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-5 py-2 rounded-xl font-medium transition-all hover:scale-105 shadow-lg shadow-violet-500/25">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Mesh gradient background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-violet-600/20 blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-indigo-600/20 blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-purple-600/10 blur-[80px]" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-xs text-white/70 mb-8 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            MLRIT Digital Certificate Portal — Now Live
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black leading-[1.05] tracking-tight mb-6">
            <span className="text-white">Your Certificates,</span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Secured & Verified
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-white/50 max-w-2xl mx-auto mb-10 leading-relaxed">
            Request, track, and download digitally signed college certificates with
            QR-code verification and a transparent token-based queue system.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button onClick={() => navigate("/login?mode=signup")}
              className="group flex items-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-8 py-4 rounded-2xl font-semibold text-base transition-all hover:scale-105 shadow-2xl shadow-violet-500/30">
              Create Free Account
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => navigate("/login")}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-8 py-4 rounded-2xl font-semibold text-base transition-all hover:scale-105 backdrop-blur-sm">
              Sign In
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Floating stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((s) => (
              <div key={s.label}
                className="bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-sm hover:bg-white/8 transition-colors">
                <s.icon className="h-5 w-5 text-violet-400 mb-2 mx-auto" />
                <p className="text-2xl font-black bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                  {s.value}
                </p>
                <p className="text-xs text-white/40 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 text-xs">
          <span>Scroll to explore</span>
          <div className="h-8 w-px bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────── */}
      <section id="features" className="py-24 lg:py-32 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-full max-w-4xl bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-violet-500/10 border border-violet-500/20 rounded-full px-4 py-1.5 text-xs text-violet-400 mb-4">
              <Sparkles className="h-3.5 w-3.5" /> Features
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
              Everything you need
            </h2>
            <p className="text-white/40 max-w-lg mx-auto">
              A modern, secure, and transparent certificate management system built for MLRIT.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div key={f.title}
                className="group relative bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/[0.12] rounded-2xl p-6 transition-all duration-300 cursor-default overflow-hidden">
                {/* Glow on hover */}
                <div className={`absolute -top-10 -right-10 h-32 w-32 rounded-full bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500`} />
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${f.color} mb-4 shadow-lg`}>
                  <f.icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-bold text-white text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────── */}
      <section id="how" className="py-24 lg:py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-violet-950/20 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-xs text-indigo-400 mb-4">
              <Zap className="h-3.5 w-3.5" /> How It Works
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
              Four simple steps
            </h2>
            <p className="text-white/40 max-w-lg mx-auto">
              From signup to certificate download in minutes.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.step} className="relative">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-white/10 to-transparent z-0" />
                )}
                <div className="relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 text-center hover:bg-white/[0.06] transition-colors">
                  <div className="text-5xl font-black bg-gradient-to-r from-violet-600/30 to-indigo-600/30 bg-clip-text text-transparent mb-3">
                    {s.step}
                  </div>
                  <div className="inline-flex p-3 rounded-xl bg-gradient-to-br from-violet-600/20 to-indigo-600/20 border border-violet-500/20 mb-3">
                    <s.icon className="h-5 w-5 text-violet-400" />
                  </div>
                  <h3 className="font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-white/40">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────── */}
      <section id="testimonials" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 text-xs text-amber-400 mb-4">
              <Star className="h-3.5 w-3.5" /> Testimonials
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
              Loved by students & staff
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div key={t.name}
                className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 hover:bg-white/[0.06] transition-colors">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-white/60 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-xs font-bold text-white">
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
      <section className="py-24 lg:py-32">
        <div className="max-w-4xl mx-auto px-6">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/30 via-indigo-600/20 to-purple-600/30" />
            <div className="absolute inset-0 border border-white/10 rounded-3xl" />
            <div className="absolute -top-20 -right-20 h-60 w-60 rounded-full bg-violet-500/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-indigo-500/20 blur-3xl" />

            <div className="relative z-10 text-center py-16 px-8">
              <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-xs text-white/70 mb-6">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-400" /> Free for all MLRIT students
              </div>
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
                Ready to get started?
              </h2>
              <p className="text-white/50 max-w-md mx-auto mb-8">
                Join 12,000+ students already using CertVault for their certificate needs.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button onClick={() => navigate("/login?mode=signup")}
                  className="group flex items-center gap-2 bg-white text-indigo-700 hover:bg-white/90 px-8 py-4 rounded-2xl font-bold text-base transition-all hover:scale-105 shadow-2xl">
                  Create Account — It's Free
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={() => navigate("/login")}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-8 py-4 rounded-2xl font-semibold text-base transition-all">
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-white/80">CertVault</span>
          </div>
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} MLRIT. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-white/30">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            All systems operational
          </div>
        </div>
      </footer>
    </div>
  );
}
