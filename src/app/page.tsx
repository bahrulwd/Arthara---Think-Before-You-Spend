"use client";

import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBrain,
  faStar,
  faArrowRight,
  faShieldHalved,
  faTriangleExclamation,
  faPiggyBank,
  faChartLine,
  faClock,
  faCheckCircle,
  faHourglassHalf,
  faLightbulb,
  faCrown,
  faBolt,
  faUsers,
  faQuoteLeft,
  faDraftingCompass,
  faInfinity
} from "@fortawesome/free-solid-svg-icons";

// ── Pricing Data ─────────────────────────────────────────────────────────────
const plans = [
  {
    id: "free",
    name: "Free",
    tagline: "Mulai perjalanan finansial Anda",
    monthlyPrice: 0,
    yearlyPrice: 0,
    badge: null,
    badgeColor: "",
    accentColor: "text-white",
    borderColor: "border-border",
    bgColor: "bg-card",
    ctaText: "Mulai Gratis",
    ctaStyle: "border border-border text-white hover:bg-white/5",
    features: [
      "Hingga 50 transaksi/bulan",
      "Financial Health Score dasar",
      "1 kategori anggaran",
      "1 savings goal",
      "Laporan bulanan ringkas",
      "Pre-Spending Check (3x/bulan)",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Untuk yang serius kelola keuangan",
    monthlyPrice: 49000,
    yearlyPrice: 39000,
    badge: "Paling Populer",
    badgeColor: "bg-primary/15 text-primary border-primary/30",
    accentColor: "text-primary",
    borderColor: "border-primary/40",
    bgColor: "bg-card",
    ctaText: "Mulai Pro",
    ctaStyle: "bg-primary text-primary-foreground hover:brightness-110 pill-shadow",
    features: [
      "Transaksi tak terbatas",
      "Financial Health Score lengkap (7 metrik)",
      "Anggaran unlimited & kategori kustom",
      "Goals unlimited dengan bobot prioritas",
      "Behavioral Insights Engine penuh",
      "Money Leak Scanner otomatis",
      "Pre-Spending Check unlimited",
      "Strict Mode guardrails",
      "Export data CSV & PDF",
      "Laporan detail harian & bulanan",
    ],
  },
  {
    id: "family",
    name: "Family",
    tagline: "Satu langganan, seluruh keluarga",
    monthlyPrice: 99000,
    yearlyPrice: 79000,
    badge: "Best Value",
    badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    accentColor: "text-amber-400",
    borderColor: "border-amber-500/30",
    bgColor: "bg-card",
    ctaText: "Mulai Family",
    ctaStyle: "border border-amber-500/30 text-amber-400 hover:bg-amber-500/5",
    features: [
      "Hingga 5 akun anggota keluarga",
      "Shared budgets & dynamic goals",
      "Bimbingan alokasi keluarga",
      "Support prioritas 24/7",
      "Semua fitur paket Pro",
    ],
  },
];

// ── Scientific Frameworks Data ────────────────────────────────────────────────
const frameworks = [
  {
    icon: faBrain,
    name: "Behavioral Finance",
    desc: "Mempelajari bagaimana faktor psikologis mempengaruhi keputusan finansial. Arthara mengadaptasi riset bias perilaku ke dalam pelacakan transaksi yang logis.",
    tags: ["Loss Aversion", "Present Bias", "Anchoring"],
    color: "text-primary",
    iconBg: "bg-primary/10 border-primary/20",
    tagStyle: "bg-primary/10 text-primary border-primary/20",
  },
  {
    icon: faDraftingCompass,
    name: "Nudge Theory",
    desc: "Menggunakan saran ramah dan 'nudge' visual halus di aplikasi untuk membantu Anda menghindari belanja impulsif tanpa merasa tertekan.",
    tags: ["24-Hour Cooloff", "Leak Alerts", "Strict Mode"],
    color: "text-blue-400",
    iconBg: "bg-blue-500/10 border-blue-500/20",
    tagStyle: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  {
    icon: faInfinity,
    name: "Self-Determination",
    desc: "Menghubungkan target tabungan dengan mindset otonom Anda. Membantu Anda menabung bukan karena paksaan, melainkan karena nilai hidup personal.",
    tags: ["Autonomy", "Competence", "Life Values"],
    color: "text-amber-400",
    iconBg: "bg-amber-500/10 border-amber-500/20",
    tagStyle: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
];

export default function Home() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  // Simulator States
  const [simItem, setSimItem] = useState("Sepatu Sneaker");
  const [simPrice, setSimPrice] = useState("1200000");
  const [simMood, setSimMood] = useState("BORED");
  const [simTag, setSimTag] = useState("WANT");
  const [simLoading, setSimLoading] = useState(false);
  const [simResult, setSimResult] = useState<any>(null);

  // Pricing State
  const [isYearly, setIsYearly] = useState(false);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // navbar height offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      
      window.history.pushState(null, "", `#${id}`);
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const amount = 15;
      const x = (e.clientX / window.innerWidth - 0.5) * amount;
      const y = (e.clientY / window.innerHeight - 0.5) * amount;
      setCoords({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();
    setSimLoading(true);
    setSimResult(null);

    setTimeout(() => {
      setSimLoading(false);
      const price = Number(simPrice) || 0;
      let advice = "";
      let verdict = "";
      let colorClass = "";
      let icon = faHourglassHalf;

      if (simTag === "IMPULSE" || simMood === "SAD" || simMood === "BORED") {
        verdict = "TUNDA BELANJA 24 JAM";
        colorClass = "text-red-400 border-red-500/20 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.05)]";
        icon = faClock;
        if (price > 1000000) {
          advice = "Pembelian ini bernilai cukup besar dan dipicu pemicu emosional. AI menyarankan untuk menaruh barang ini di 'Keranjang Tunda' selama 24 jam untuk menstabilkan kondisi psikologis Anda.";
        } else {
          advice = "Pembelian impulsif berbiaya kecil. Meskipun terjangkau, akumulasi pengeluaran kecil karena bosan sering kali memicu kebocoran keuangan terbesar Anda.";
        }
      } else if (simTag === "NEED" && price < 1500000) {
        verdict = "AMAN UNTUK DIBELI";
        colorClass = "text-primary border-primary/20 bg-primary/5 shadow-[0_0_15px_rgba(184,246,0,0.05)]";
        icon = faCheckCircle;
        advice = "Pembelian logis yang terencana. Barang ini memenuhi kategori kebutuhan riil Anda dan berada dalam rentang penganggaran yang rasional.";
      } else if (price > 3000000) {
        verdict = "PERINGATAN: HARUS DIULAS KEMBALI";
        colorClass = "text-amber-400 border-amber-500/20 bg-amber-500/5 shadow-[0_0_15px_rgba(245,158,11,0.05)]";
        icon = faTriangleExclamation;
        advice = "Transaksi bernilai tinggi terdeteksi. AI menyarankan Anda memeriksa kecukupan saldo dana darurat sebelum mencairkan alokasi tabungan Anda.";
      } else {
        verdict = "TINJAU SISA ANGGARAN";
        colorClass = "text-blue-400 border-blue-500/20 bg-blue-500/5 shadow-[0_0_15px_rgba(59,130,246,0.05)]";
        icon = faLightbulb;
        advice = "Barang ini termasuk kategori keinginan rasional. Pastikan kategori pengeluaran ini masih memiliki sisa limit di rencana anggaran bulan ini.";
      }

      setSimResult({ verdict, advice, colorClass, icon });
    }, 1000);
  };

  return (
    <div className="bg-background text-foreground min-h-screen flex flex-col font-sans overflow-x-hidden relative selection:bg-primary selection:text-black">
      
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-[30%] right-0 w-[500px] h-[500px] bg-blue-500/3 blur-[120px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[20%] left-[-10%] w-[600px] h-[600px] bg-primary/4 blur-[160px] rounded-full pointer-events-none z-0" />

      {/* ── NAVBAR ────────────────────────────────────────────── */}
      <Navbar />

      {/* ── HERO SECTION (First screen-fit viewport fold) ──────────────── */}
      <section id="home" className="relative min-h-[100dvh] lg:h-[100dvh] pt-20 pb-8 flex items-center justify-center px-8 max-w-7xl mx-auto md:px-16 lg:px-24 w-full z-10 overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 w-full py-8">
          
          {/* Left Content */}
          <div className="w-full lg:w-[55%] space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-primary font-black uppercase text-[9px] tracking-[0.12em]">
                Behavioral Insights Engine 2.0
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-[64px] leading-[1.05] font-black tracking-[-0.04em] text-white">
              Think Before <br />
              You Spend.
            </h1>
            
            <p className="text-text-secondary text-base md:text-lg max-w-xl leading-relaxed">
              Arthara bukan sekadar aplikasi pengatur keuangan biasa. Kami melacak pemicu emosional dan memberikan peringatan proaktif sebelum kebocoran anggaran Anda terjadi.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Link
                href="/register"
                className="w-full sm:w-auto bg-primary text-primary-foreground font-black py-4 px-10 rounded-full text-center text-sm pill-shadow hover:brightness-110 active:scale-95 transition-all"
              >
                Mulai Secara Gratis
              </Link>
              <a
                href="#simulator"
                onClick={(e) => scrollToSection(e, "simulator")}
                className="w-full sm:w-auto border border-border text-white font-bold py-4 px-10 rounded-full text-center text-sm hover:bg-white/5 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Coba AI Simulator <FontAwesomeIcon icon={faArrowRight} className="w-3.5 h-3.5" />
              </a>
            </div>
            
            {/* Stats */}
            <div className="flex items-center gap-8 pt-8 border-t border-border mt-8 w-fit">
              <div>
                <p className="font-extrabold text-white text-2xl">4.9/5</p>
                <p className="text-text-secondary text-[9px] uppercase tracking-widest font-black mt-1">User Rating</p>
              </div>
              <div className="w-px h-8 bg-border"></div>
              <div>
                <p className="font-extrabold text-white text-2xl">Rp2.4M+</p>
                <p className="text-text-secondary text-[9px] uppercase tracking-widest font-black mt-1">Impulse Blocked</p>
              </div>
            </div>
          </div>

          {/* Right Parallax Graphic Mockup */}
          <div className="w-full lg:w-[45%] flex justify-center">
            <div className="relative w-full max-w-[400px] aspect-square flex items-center justify-center">
              
              {/* Core Dashboard Card */}
              <div 
                className="bg-card w-full p-6 rounded-[28px] shadow-2xl relative z-10 border border-border transition-all duration-300 ease-out hover:border-primary/25"
                style={{
                  transform: `translate(${coords.x * 0.15}px, ${coords.y * 0.15}px)`,
                }}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-text-secondary text-[10px] uppercase font-bold tracking-wider mb-1">Impulse Trigger</p>
                    <h3 className="text-white text-xl font-black">Coffee & Cafe</h3>
                  </div>
                  <span className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-[10px] font-bold border border-red-500/20">
                    High Risk
                  </span>
                </div>

                {/* SVG Mini Chart */}
                <div className="h-28 w-full relative mb-4">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120">
                    <defs>
                      <linearGradient id="gradient-hero-scroll" x1="0%" x2="0%" y1="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: "#BFFF00", stopOpacity: 0.25 }}></stop>
                        <stop offset="100%" style={{ stopColor: "#BFFF00", stopOpacity: 0 }}></stop>
                      </linearGradient>
                    </defs>
                    <path d="M0,90 Q60,40 120,70 T240,25 T360,80 T400,30 L400,120 L0,120 Z" fill="url(#gradient-hero-scroll)"></path>
                    <path d="M0,90 Q60,40 120,70 T240,25 T360,80 T400,30" fill="none" stroke="#BFFF00" strokeWidth="4" strokeLinecap="round"></path>
                    <circle className="drop-shadow-[0_0_8px_#BFFF00]" cx="240" cy="25" fill="#BFFF00" r="6"></circle>
                  </svg>
                </div>

                <div className="flex gap-4">
                  <div className="flex-1 bg-background/60 p-3 rounded-2xl border border-border/60 text-left">
                    <p className="text-text-secondary text-[9px] font-black uppercase mb-1">Leak Detected</p>
                    <p className="text-white text-base font-extrabold">Rp1.425.000</p>
                  </div>
                  <div className="flex-1 bg-background/60 p-3 rounded-2xl border border-border/60 text-left">
                    <p className="text-text-secondary text-[9px] font-black uppercase mb-1">Score Saving</p>
                    <p className="text-primary text-base font-extrabold">+8.4%</p>
                  </div>
                </div>
              </div>

              {/* Floating Widget 1 */}
              <div 
                className="absolute -top-4 -right-4 bg-card/90 backdrop-blur-md p-4 rounded-[20px] shadow-xl z-20 border border-border/80 max-w-[170px] text-left transition-all duration-300 ease-out"
                style={{
                  transform: `translate(${coords.x * 0.3}px, ${coords.y * 0.3}px)`,
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <FontAwesomeIcon icon={faBrain} className="text-primary w-3.5 h-3.5" />
                  </div>
                  <span className="text-white font-bold text-[10px]">Mindset Insight</span>
                </div>
                <p className="text-text-secondary text-[10px] leading-relaxed">
                  Tipe belanja Anda sensitif saat bosan. Coba tunggu 24 jam.
                </p>
              </div>

              {/* Floating Widget 2 */}
              <div 
                className="absolute -bottom-6 -left-6 bg-card/90 backdrop-blur-md px-5 py-3.5 rounded-[22px] shadow-xl z-20 border border-border/80 text-left transition-all duration-300 ease-out"
                style={{
                  transform: `translate(${coords.x * 0.25}px, ${coords.y * 0.25}px)`,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full border-2 border-card bg-primary/20 flex items-center justify-center text-[8px] font-bold text-primary">ID</div>
                    <div className="w-6 h-6 rounded-full border-2 border-card bg-blue-500/20 flex items-center justify-center text-[8px] font-bold text-blue-400">IN</div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-[10px]">Active Trackers</span>
                    <span className="text-text-secondary text-[9px]">12.4K People saving today</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ── SIMULATOR INTERAKTIF ───────────────────────────────────── */}
      <section id="simulator" className="py-20 px-8 bg-card/25 border-y border-border relative z-10">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 bg-secondary/15 border border-border px-4 py-1.5 rounded-full">
              <FontAwesomeIcon icon={faBrain} className="w-3.5 h-3.5 text-primary" />
              <span className="text-text-secondary font-black uppercase text-[9px] tracking-[0.15em]">Interactive Experience</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">AI Pre-Spending Check Simulator</h2>
            <p className="text-text-secondary text-sm max-w-xl mx-auto leading-relaxed">
              Rasakan langsung cara AI kami mengevaluasi impulsivitas belanja Anda sebelum uang keluar. Masukkan barang keinginan Anda di bawah!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            
            {/* Input Form Card */}
            <div className="bg-card border border-border p-6 rounded-[24px] shadow-xl flex flex-col justify-between">
              <form onSubmit={handleSimulate} className="space-y-4">
                
                {/* Item Name */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block ml-4">Nama Barang</label>
                  <input
                    type="text"
                    value={simItem}
                    onChange={(e) => setSimItem(e.target.value)}
                    className="w-full h-11 px-5 rounded-full bg-background border border-border text-white placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
                    placeholder="e.g. Sepatu Olahraga, Kopi"
                    required
                  />
                </div>

                {/* Price */}
                <div className="space-y-1.5 text-left">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block ml-4">Harga Barang (Rp)</label>
                  <input
                    type="number"
                    value={simPrice}
                    onChange={(e) => setSimPrice(e.target.value)}
                    className="w-full h-11 px-5 rounded-full bg-background border border-border text-white placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
                    placeholder="e.g. 150000"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Mood Select */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block ml-4">Suasana Hati (Mood)</label>
                    <select
                      value={simMood}
                      onChange={(e) => setSimMood(e.target.value)}
                      className="w-full h-11 px-5 rounded-full bg-background border border-border text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                    >
                      <option value="BORED">Bosan / Jenuh</option>
                      <option value="SAD">Sedih / Sepi</option>
                      <option value="STRESSED">Stres / Capek</option>
                      <option value="HAPPY">Senang / Puas</option>
                      <option value="CALM">Tenang / Netral</option>
                    </select>
                  </div>

                  {/* Tag Select */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block ml-4">Tujuan Belanja</label>
                    <select
                      value={simTag}
                      onChange={(e) => setSimTag(e.target.value)}
                      className="w-full h-11 px-5 rounded-full bg-background border border-border text-white text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
                    >
                      <option value="IMPULSE">Tiba-tiba Pengen</option>
                      <option value="WANT">Keinginan Biasa</option>
                      <option value="NEED">Kebutuhan Penting</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={simLoading}
                  className="w-full h-11 bg-primary text-primary-foreground font-black text-xs rounded-full shadow-lg shadow-primary/10 hover:brightness-105 transition-all mt-4 cursor-pointer"
                >
                  {simLoading ? "Menganalisis Perilaku..." : "Simulasikan Keputusan AI"}
                </button>

              </form>
            </div>

            {/* AI Response Card */}
            <div className="bg-card border border-border p-6 rounded-[24px] shadow-xl flex flex-col justify-center items-center relative overflow-hidden text-center min-h-[300px]">
              
              {!simLoading && !simResult && (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto animate-pulse">
                    <FontAwesomeIcon icon={faBrain} className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">Menunggu Simulasi Anda</h4>
                    <p className="text-text-secondary text-xs max-w-xs mx-auto mt-2 leading-relaxed">
                      Isi form di samping untuk melihat saran keputusan cerdas yang dikeluarkan oleh sistem evaluasi emosi belanja Arthara.
                    </p>
                  </div>
                </div>
              )}

              {simLoading && (
                <div className="space-y-4">
                  <div className="relative flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                    <FontAwesomeIcon icon={faBrain} className="absolute text-primary w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-sm">AI Sedang Berpikir...</h4>
                    <p className="text-text-secondary text-xs mt-1">Mengevaluasi bias kerugian & trigger psikologis.</p>
                  </div>
                </div>
              )}

              {!simLoading && simResult && (
                <div className="space-y-4 w-full animate-fade-in text-left">
                  <div className="flex justify-between items-start border-b border-border/40 pb-3">
                    <div>
                      <span className="text-[9px] font-bold text-text-secondary uppercase tracking-widest block mb-1">Keputusan Analisis AI</span>
                      <h4 className="text-white font-extrabold text-base">{simItem}</h4>
                    </div>
                    <span className="text-[10px] font-extrabold text-primary tabular-nums">
                      Rp{Number(simPrice).toLocaleString("id-ID")}
                    </span>
                  </div>

                  <div className={`p-4.5 rounded-2xl border flex gap-3.5 items-start ${simResult.colorClass}`}>
                    <FontAwesomeIcon icon={simResult.icon} className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h5 className="font-extrabold text-xs tracking-wide">{simResult.verdict}</h5>
                      <p className="text-[11px] leading-relaxed text-white/90">
                        {simResult.advice}
                      </p>
                    </div>
                  </div>

                  <p className="text-[10px] text-text-secondary italic text-center">
                    *Ini adalah visualisasi simulasi. Di dashboard utama, keputusan ini terhubung langsung dengan batas budget & rekening Anda.
                  </p>
                </div>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* ── BENTO FEATURES GRID ────────────────────────────────────── */}
      <section id="features" className="py-24 px-8 max-w-7xl mx-auto md:px-16 lg:px-24 w-full relative z-10 text-center">
        
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full">
            <span className="text-primary font-black uppercase text-[9px] tracking-[0.15em]">Dashboard Features</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Kendalikan Finansial Anda Secara Pintar</h2>
          <p className="text-text-secondary text-sm max-w-xl mx-auto leading-relaxed">
            Menghadirkan fitur-fitur eksklusif berbasis psikologi perilaku keuangan untuk meredam kebiasaan buruk belanja Anda.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Mindset */}
          <div className="bg-card border border-border p-6 rounded-[28px] text-left space-y-6 hover:border-primary/20 transition-all duration-300 relative overflow-hidden group">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/10">
              <FontAwesomeIcon icon={faBrain} className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white leading-tight">Financial Mindset Classifier</h3>
              <p className="text-text-secondary text-xs leading-relaxed">
                Kami tidak hanya menilai skor kredit. Arthara mengategorikan profil keuangan Anda (Secure, Impulsive, Anxious) berdasarkan bobot nilai hidup asli Anda.
              </p>
            </div>
            
            {/* Visual inside card */}
            <div className="bg-background/50 border border-border/60 p-4 rounded-2xl space-y-3">
              <div className="flex justify-between items-center text-[10px] text-text-secondary font-bold uppercase tracking-wider">
                <span>Profil Terdeteksi</span>
                <span className="text-primary">SECURE</span>
              </div>
              <div className="flex gap-2">
                <div className="flex-1 h-1.5 bg-primary rounded-full"></div>
                <div className="flex-1 h-1.5 bg-background rounded-full border border-border"></div>
                <div className="flex-1 h-1.5 bg-background rounded-full border border-border"></div>
              </div>
            </div>
          </div>

          {/* Card 2: Smart Savings Allocations */}
          <div className="bg-card border border-border p-6 rounded-[28px] text-left space-y-6 hover:border-primary/20 transition-all duration-300 relative overflow-hidden group">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/10">
              <FontAwesomeIcon icon={faPiggyBank} className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white leading-tight">Smart Targets Allocation</h3>
              <p className="text-text-secondary text-xs leading-relaxed">
                Prediktor AI membagi sisa arus kas bulanan Anda ke target tabungan secara proporsional sesuai urgensi, meminimalkan tabungan mengendap tak produktif.
              </p>
            </div>

            {/* Visual inside card */}
            <div className="bg-background/50 border border-border/60 p-4 rounded-2xl space-y-2">
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-bold text-white">Dana Darurat Mandiri</span>
                <span className="text-primary font-bold">50%</span>
              </div>
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-bold text-white">Liburan Jepang</span>
                <span className="text-primary/60 font-bold">20%</span>
              </div>
            </div>
          </div>

          {/* Card 3: Leak Hunter */}
          <div className="bg-card border border-border p-6 rounded-[28px] text-left space-y-6 hover:border-primary/20 transition-all duration-300 relative overflow-hidden group">
            <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-400 border border-red-500/10">
              <FontAwesomeIcon icon={faTriangleExclamation} className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white leading-tight">Leak Spotter (Deteksi Bocor)</h3>
              <p className="text-text-secondary text-xs leading-relaxed">
                Lacak pengeluaran langganan pasif yang terlupakan. Kami mendeteksi pendebetan ganda atau tidak aktif, lalu menyarankan rencana pembatalan taktis.
              </p>
            </div>

            {/* Visual inside card */}
            <div className="bg-background/50 border border-border/60 p-4 rounded-2xl flex justify-between items-center">
              <div>
                <span className="text-[9px] font-bold text-text-secondary uppercase">Double Spotify Plan</span>
                <p className="text-white text-xs font-bold mt-0.5">Rp139.000 / bln</p>
              </div>
              <span className="bg-red-500/15 border border-red-500/20 text-red-400 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                Leak Detected
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* ── METHODOLOGY SECTION ───────────────────────────────────── */}
      <section id="methodology" className="py-24 px-8 max-w-7xl mx-auto md:px-16 lg:px-24 w-full relative z-10 text-center">
        
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full">
            <span className="text-primary font-black uppercase text-[9px] tracking-[0.15em]">Scientific Frameworks</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Berbasis Riset Keuangan Perilaku</h2>
          <p className="text-text-secondary text-sm max-w-xl mx-auto leading-relaxed">
            Pendekatan kami berakar pada tiga framework ilmiah yang telah terbukti mengubah perilaku manusia secara berkelanjutan.
          </p>
        </div>

        {/* Framework Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {frameworks.map((fw) => (
            <div key={fw.name} className="bg-card border border-border rounded-[28px] p-8 flex flex-col gap-6 hover:-translate-y-1.5 transition-all duration-200 group relative overflow-hidden text-left">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${fw.iconBg} ${fw.color}`}>
                <FontAwesomeIcon icon={fw.icon} className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-black text-white">{fw.name}</h3>
                <p className="text-text-secondary text-xs leading-relaxed">{fw.desc}</p>
              </div>
              <div className="flex flex-wrap gap-2 mt-auto">
                {fw.tags.map((tag) => (
                  <span key={tag} className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${fw.tagStyle}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Expert Quote Section */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {[
            { quote: "Orang membuat keputusan finansial berdasarkan emosi, bukan logika murni.", author: "Daniel Kahneman", role: "Nobel Economics 2002" },
            { quote: "Nudge secara halus mendorong pilihan yang lebih baik tanpa memaksa siapapun.", author: "Richard Thaler", role: "Nobel Economics 2017" },
            { quote: "Kekayaan sejati lahir dari kebiasaan kecil yang dilakukan secara konsisten.", author: "James Clear", role: "Author, Atomic Habits" },
          ].map((q, i) => (
            <div key={i} className="bg-card border border-border rounded-[20px] p-6 text-left relative overflow-hidden">
              <FontAwesomeIcon icon={faQuoteLeft} className="absolute -right-2 -top-2 w-12 h-12 text-white/[0.03]" />
              <p className="text-text-secondary text-xs leading-relaxed italic mb-4">&ldquo;{q.quote}&rdquo;</p>
              <div>
                <p className="text-white text-[11px] font-bold">— {q.author}</p>
                <p className="text-text-secondary text-[10px] mt-0.5">{q.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING SECTION ───────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-8 max-w-7xl mx-auto md:px-16 lg:px-24 w-full relative z-10 text-center">
        
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full">
            <FontAwesomeIcon icon={faCrown} className="w-3.5 h-3.5 text-primary" />
            <span className="text-primary font-black uppercase text-[9px] tracking-[0.15em]">Simple & Transparent Pricing</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">Pilih Paket Sesuai Kebutuhan Anda</h2>
          <p className="text-text-secondary text-sm max-w-xl mx-auto">
            Mulai gratis selamanya. Upgrade hanya ketika Anda siap untuk insight yang lebih mendalam dan kontrol penuh atas finansial Anda.
          </p>

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-4 pt-4">
            <span className={`text-sm font-semibold transition-colors ${!isYearly ? "text-white" : "text-text-secondary"}`}>Bulanan</span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative w-14 h-7 rounded-full border transition-all duration-300 ${isYearly ? "bg-primary border-primary" : "bg-secondary/20 border-border"}`}
            >
              <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow transition-all duration-300 ${isYearly ? "left-8" : "left-1"}`} />
            </button>
            <span className={`text-sm font-semibold transition-colors flex items-center gap-2 ${isYearly ? "text-white" : "text-text-secondary"}`}>
              Tahunan
              <span className="bg-primary/15 text-primary border border-primary/30 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                Hemat 20%
              </span>
            </span>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {plans.map((plan) => {
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            const isPro = plan.id === "pro";
            return (
              <div
                key={plan.id}
                className={`relative rounded-[28px] border ${plan.borderColor} ${plan.bgColor} p-8 flex flex-col gap-6 ${isPro ? "shadow-[0_0_60px_-10px_rgba(191,255,0,0.12)] border-primary/30" : ""} transition-all duration-300 hover:-translate-y-1`}
              >
                {/* Badge */}
                {plan.badge && (
                  <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full border text-[9px] font-black uppercase tracking-wider whitespace-nowrap ${plan.badgeColor}`}>
                    {plan.badge}
                  </div>
                )}

                {/* Plan header */}
                <div className="space-y-1 pt-1">
                  <div className="flex items-center gap-2">
                    <p className={`text-base font-black ${plan.accentColor}`}>{plan.name}</p>
                    {plan.id === "pro" && <FontAwesomeIcon icon={faBolt} className="w-3.5 h-3.5 text-primary" />}
                    {plan.id === "family" && <FontAwesomeIcon icon={faUsers} className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <p className="text-text-secondary text-xs">{plan.tagline}</p>
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <div className="flex items-end gap-1.5">
                    <span className={`text-4xl font-black tabular-nums ${plan.accentColor}`}>
                      {price === 0 ? "Gratis" : `Rp${(price).toLocaleString("id-ID")}`}
                    </span>
                    {price > 0 && (
                      <span className="text-text-secondary text-sm mb-1">/bulan</span>
                    )}
                  </div>
                  {isYearly && price > 0 && (
                    <p className="text-text-secondary text-[11px]">
                      Ditagih Rp{(price * 12).toLocaleString("id-ID")}/tahun
                    </p>
                  )}
                  {!isYearly && price > 0 && (
                    <p className="text-text-secondary text-[11px]">
                      Atau Rp{(Math.round(price * 0.8 * 12)).toLocaleString("id-ID")}/tahun (hemat 20%)
                    </p>
                  )}
                  {price === 0 && (
                    <p className="text-text-secondary text-[11px]">Selamanya, tanpa kartu kredit</p>
                  )}
                </div>

                {/* Features List */}
                <ul className="space-y-3 my-2 flex-1">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-xs text-text-secondary">
                      <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href="/register"
                  className={`w-full py-3.5 px-6 rounded-full text-sm font-bold text-center transition-all active:scale-95 ${plan.ctaStyle}`}
                >
                  {plan.ctaText}
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── TESTIMONI SECTION ──────────────────────────────────────── */}
      <section className="py-20 px-8 max-w-7xl mx-auto md:px-16 lg:px-24 w-full relative z-10 text-center">
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full">
            <span className="text-primary font-black uppercase text-[9px] tracking-[0.15em]">User Success Stories</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Telah Membantu Ribuan Tracker</h2>
          <p className="text-text-secondary text-sm max-w-xl mx-auto">
            Kisah nyata dari pengguna yang berhasil mengubah kebiasaan konsumtif dan menyelamatkan arus kas bulanan mereka.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              quote: "Simulator Pre-Spending Check sangat berguna. Setiap kali mau checkout belanjaan impulsif, saya buka simulator dan disarankan menunda. Ternyata 80% barang impulsif itu gak saya butuhin.",
              name: "Aditya Pratama",
              role: "Developer, Jakarta",
              rating: 5
            },
            {
              quote: "Fitur Leak Spotter mendeteksi ada tagihan langganan gym lama yang terpotong otomatis dari kartu saya. Berhasil hemat 450 ribu per bulan!",
              name: "Sarah Wijaya",
              role: "Designer, Bandung",
              rating: 5
            },
            {
              quote: "Kalkulator Smart Allocation membantu saya membagi surplus gaji bulanan secara adil. Tabungan dana darurat saya sekarang terisi 4x lebih cepat dibanding metode manual.",
              name: "Rian Kurniawan",
              role: "Analyst, Surabaya",
              rating: 5
            }
          ].map((t, idx) => (
            <div key={idx} className="bg-card border border-border p-6 rounded-[24px] text-left space-y-4 hover:border-primary/10 transition-colors">
              <div className="flex gap-1 text-primary">
                {[...Array(t.rating)].map((_, i) => (
                  <FontAwesomeIcon key={i} icon={faStar} className="w-3.5 h-3.5" />
                ))}
              </div>
              <p className="text-text-secondary text-xs leading-relaxed italic">
                “{t.quote}”
              </p>
              <div className="pt-2 border-t border-border/40 flex justify-between items-center">
                <div>
                  <h4 className="text-white text-xs font-bold leading-none">{t.name}</h4>
                  <span className="text-text-secondary text-[10px] mt-1 block">{t.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CALL TO ACTION SECTION ─────────────────────────────────── */}
      <section className="py-16 px-8 max-w-5xl mx-auto w-full relative z-10 text-center">
        <div className="bg-gradient-to-br from-primary/15 via-secondary/5 to-background border border-border p-8 md:p-12 rounded-[32px] space-y-6 relative overflow-hidden shadow-2xl">
          {/* Ambient glow inside card */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
              Siap Mengubah Kebiasaan <br />
              Pengeluaran Anda?
            </h2>
            <p className="text-text-secondary text-sm md:text-base leading-relaxed max-w-md mx-auto">
              Daftar sekarang secara gratis, isi onboarding singkat, dan biarkan AI kami mengoptimalkan kesejahteraan keuangan Anda.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="w-full sm:w-auto bg-primary text-primary-foreground font-black py-4 px-10 rounded-full text-center text-sm pill-shadow hover:brightness-110 active:scale-95 transition-all"
              >
                Daftar Sekarang - Gratis
              </Link>
              <Link
                href="/login"
                className="w-full sm:w-auto border border-border text-white font-bold py-4 px-10 rounded-full text-center text-sm hover:bg-white/5 active:scale-95 transition-all"
              >
                Masuk ke Akun
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className="w-full py-8 border-t border-border bg-card/30 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto gap-4 md:px-16 lg:px-24">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <span className="text-xl font-black text-primary tracking-tighter">Arthara</span>
            <p className="text-text-secondary text-[10px]">© 2026 Arthara. Behavioral finance for the modern age.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <a href="#" className="text-text-secondary hover:text-primary transition-colors text-xs">
              Privacy Policy
            </a>
            <a href="#" className="text-text-secondary hover:text-primary transition-colors text-xs">
              Terms of Service
            </a>
            <a href="#" className="text-text-secondary hover:text-primary transition-colors text-xs">
              Security
            </a>
            <a href="#" className="text-text-secondary hover:text-primary transition-colors text-xs">
              Help Center
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
