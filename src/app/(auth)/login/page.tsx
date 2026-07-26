"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash, faSpinner, faBrain } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        throw new Error(resData.error || "Failed to log in");
      }

      if (resData.user && !resData.user.onboarded) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background text-foreground h-screen max-h-screen flex flex-col lg:flex-row select-none overflow-hidden">
      
      {/* ── LEFT DESKTOP PANEL: BRANDING & MARKETING ────────────────── */}
      <div className="hidden lg:flex lg:w-[45%] bg-card/25 border-r border-border/40 relative flex-col justify-between p-12 overflow-hidden h-full">
        {/* Glow Effects */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none"></div>
        
        {/* Logo */}
        <div className="relative z-10">
          <Link href="/">
            <img
              src="/images/artharalogo.png"
              alt="Arthara Logo"
              className="h-8 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Content & Floating Widget */}
        <div className="relative z-10 space-y-8 my-auto text-left">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full">
            <span className="text-primary font-black uppercase text-[9px] tracking-[0.12em]">Behavioral Finance Suite</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-white leading-[1.1] tracking-tight">
            Master your mind, <br />
            <span className="text-primary">master your money.</span>
          </h2>
          
          <p className="text-text-secondary text-sm leading-relaxed max-w-sm">
            Arthara melatih kesadaran finansial Anda secara proaktif. Deteksi kebocoran anggaran tersembunyi dan evaluasi keputusan belanja sebelum transaksi terjadi.
          </p>

          {/* Premium Floating Interactive Widget */}
          <div className="bg-card/75 border border-border/80 p-5 rounded-[22px] shadow-xl space-y-4 max-w-sm relative">
            <div className="absolute right-4 top-4 w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <div className="flex justify-between items-center text-[9px] font-bold text-text-secondary uppercase tracking-wider">
              <span>Financial Mindset</span>
              <span className="text-primary">Healthy</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <FontAwesomeIcon icon={faBrain} className="w-4.5 h-4.5" />
              </div>
              <div>
                <p className="text-white text-xs font-bold">Mindful Spender Mode</p>
                <p className="text-text-secondary text-[10px]">Active for Muhammad</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 text-[10px] text-text-secondary/70">
          <p>© 2026 Arthara Finance. Secure & Encrypted by AES-256.</p>
        </div>
      </div>

      {/* ── RIGHT PANEL: LOGIN FORM CARD ──────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-between py-6 px-6 lg:px-12 h-full relative overflow-hidden">
        {/* Mobile Logo Accent (Visible only on smaller screens) */}
        <div className="lg:hidden flex justify-center mb-4 relative z-10">
          <Link href="/">
            <img
              src="/images/artharalogo.png"
              alt="Arthara Logo"
              className="h-8 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/3 rounded-full blur-[100px] pointer-events-none"></div>

        {/* Glassmorphic Form Card */}
        <div className="w-full max-w-[400px] mx-auto my-auto bg-card/60 backdrop-blur-xl border border-white/5 rounded-[28px] p-6 md:p-8 shadow-2xl relative z-10 max-h-[calc(100vh-80px)] overflow-y-auto scrollbar-thin">
          
          <div className="text-center mb-6">
            <h2 className="text-white text-2xl font-black tracking-tight mb-1">Welcome back</h2>
            <p className="text-text-secondary text-xs">Enter your details to access your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-full text-xs font-semibold text-center">
                {error}
              </div>
            )}
            
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary ml-4" htmlFor="email">
                Email Address
              </label>
              <input
                {...register("email")}
                className="w-full h-11 px-6 rounded-full bg-background border border-border text-white placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
                id="email"
                placeholder="name@example.com"
                type="email"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-[11px] text-red-400 font-bold ml-4 mt-0.5">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-secondary ml-4" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  className="w-full h-11 px-6 pr-12 rounded-full bg-background border border-border text-white placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-xs"
                  id="password"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  disabled={isLoading}
                />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-white transition-colors focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  {showPassword ? <FontAwesomeIcon icon={faEyeSlash} className="w-4 h-4" /> : <FontAwesomeIcon icon={faEye} className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-400 font-bold ml-4 mt-0.5">{errors.password.message}</p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end pt-0.5">
              <a href="#" className="text-[11px] font-semibold text-text-secondary hover:text-primary transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Action Button */}
            <button
              className="w-full h-11 bg-primary text-primary-foreground text-xs rounded-full font-bold transition-all transform active:scale-95 shadow-lg shadow-primary/10 hover:brightness-105 flex items-center justify-center disabled:opacity-50 mt-4 cursor-pointer"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <FontAwesomeIcon icon={faSpinner} className="w-3.5 h-3.5 animate-spin text-primary-foreground" />
                  Authenticating...
                </span>
              ) : (
                "Log In"
              )}
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/60"></div>
            </div>
            <div className="relative flex justify-center text-[9px] font-bold uppercase tracking-wider">
              <span className="bg-card px-3 text-text-secondary">Or continue with</span>
            </div>
          </div>

          {/* Social Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              type="button"
              className="flex items-center justify-center gap-2 h-11 rounded-full border border-border bg-transparent hover:bg-secondary/10 transition-colors text-white text-xs font-bold cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.986 0-.746-.08-1.32-.176-1.886H12.24z"/>
              </svg>
              <span>Google</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 h-11 rounded-full border border-border bg-transparent hover:bg-secondary/10 transition-colors text-white text-xs font-bold cursor-pointer"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11"/></svg>
              <span>Apple</span>
            </button>
          </div>

          <div className="text-center">
            <p className="text-[11px] text-text-secondary">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary font-bold hover:underline transition-all">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Footer links */}
        <footer className="w-full text-center text-[10px] text-text-secondary/70 mt-4 relative z-10 flex flex-col gap-2">
          <div className="flex justify-center gap-4">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Security Standards</a>
          </div>
        </footer>
      </div>

    </div>
  );
}
