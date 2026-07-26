"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTableColumns,
  faWallet,
  faChartLine,
  faReceipt,
  faBullseye,
  faGear,
  faCircleQuestion,
  faBell,
  faCalendar,
  faPlus,
  faMagnifyingGlass,
  faRightFromBracket,
  faChevronDown,
  faCrown,
  faDroplet
} from "@fortawesome/free-solid-svg-icons";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeMonth, setActiveMonth] = useState("July");
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const handleUpgrade = () => {
    router.push("/pricing");
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (res.ok && data.user) {
        setUser({ name: data.user.name, email: data.user.email });
      } else {
        router.push("/login");
      }
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
    } catch (err) {
      console.error("Failed to log out:", err);
      router.push("/login");
    }
  };

  const navigation = [
    { href: "/dashboard", label: "Dashboard", icon: faTableColumns },
    { href: "/budgets", label: "Budgets", icon: faWallet },
    { href: "/reports", label: "Analytics", icon: faChartLine },
    { href: "/transactions", label: "Transactions", icon: faReceipt },
    { href: "/goals", label: "Goals", icon: faBullseye },
    { href: "/money-leak", label: "Money Leak", icon: faDroplet },
  ];

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="flex min-h-screen bg-background text-foreground antialiased font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 fixed left-0 top-0 h-screen rounded-r-[24px] bg-card flex flex-col p-6 border-r border-border z-50">
        <div className="flex flex-col gap-2 mb-8 px-2">
          <Link href="/dashboard" className="flex items-center gap-3">
            <img
              src="/images/artharalogo.png"
              alt="Arthara Logo"
              className="h-11 w-auto object-contain"
            />
          </Link>
        </div>

        <nav className="flex-1 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-full transition-transform active:scale-95 duration-150 ${isActive
                    ? "bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20"
                    : "text-text-secondary hover:text-white hover:bg-secondary/10"
                  }`}
              >
                <FontAwesomeIcon icon={item.icon} className="w-4 h-4" />
                <span className="text-xs font-semibold">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4">
          <button
            onClick={handleUpgrade}
            className="w-full py-3.5 bg-secondary/15 text-white font-bold rounded-[24px] text-xs hover:bg-secondary/25 transition-colors border border-border cursor-pointer flex items-center justify-center gap-2"
          >
            <FontAwesomeIcon icon={faCrown} className="w-3 h-3" />
            Upgrade to Pro
          </button>

          <div className="space-y-1">
            <Link
              href="/settings"
              className={`flex items-center gap-3 px-4 py-2.5 rounded-full transition-colors ${pathname === "/settings" ? "text-primary font-bold" : "text-text-secondary hover:text-white"
                }`}
            >
              <FontAwesomeIcon icon={faGear} className="w-4 h-4" />
              <span className="text-xs font-semibold">Settings</span>
            </Link>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-2.5 text-text-secondary hover:text-white transition-colors rounded-full"
            >
              <FontAwesomeIcon icon={faCircleQuestion} className="w-4 h-4" />
              <span className="text-xs font-semibold">Support</span>
            </a>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-sm shrink-0">
                {user?.name ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "..."}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs text-white font-bold truncate">{user?.name || "Loading..."}</p>
                <p className="text-[10px] text-text-secondary truncate">{user?.email || "..."}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-text-secondary hover:text-red-400 hover:bg-red-500/10 rounded-full transition-all active:scale-95 shrink-0"
              title="Logout"
            >
              <FontAwesomeIcon icon={faRightFromBracket} className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col h-screen">
        {/* TopNavBar */}
        <header className="flex justify-between items-center h-20 px-8 sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="flex items-center gap-4 relative">
            <button
              onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
              className="flex items-center gap-2.5 px-5 py-2.5 bg-[#1E212B]/40 hover:bg-[#1E212B]/80 border border-border/80 text-white rounded-full text-xs font-bold transition-all transform active:scale-95 cursor-pointer shadow-lg shadow-black/10 hover:border-primary/50"
            >
              <FontAwesomeIcon icon={faCalendar} className="w-3.5 h-3.5 text-primary" />
              <span>{activeMonth}</span>
              <FontAwesomeIcon icon={faChevronDown} className={`w-3 h-3 text-text-secondary transition-transform duration-200 ${isMonthDropdownOpen ? "rotate-180 text-white" : ""}`} />
            </button>

            {isMonthDropdownOpen && (
              <>
                {/* Backdrop overlay to catch click outside */}
                <div
                  className="fixed inset-0 z-40 bg-transparent"
                  onClick={() => setIsMonthDropdownOpen(false)}
                />

                {/* Dropdown Card */}
                <div className="absolute top-12 left-0 w-44 bg-card/95 backdrop-blur-md border border-border rounded-[20px] shadow-2xl p-1.5 z-50 animate-fade-in flex flex-col gap-1 max-h-64 overflow-y-auto">
                  {months.map((m) => {
                    const isActive = m === activeMonth;
                    return (
                      <button
                        key={m}
                        onClick={() => {
                          setActiveMonth(m);
                          setIsMonthDropdownOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 rounded-full text-[11px] font-bold transition-all ${isActive
                            ? "bg-primary text-primary-foreground shadow-lg"
                            : "text-text-secondary hover:text-white hover:bg-secondary/15"
                          }`}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input
                className="bg-card border border-border rounded-full py-2 pl-10 pr-4 text-xs text-white focus:outline-none focus:ring-2 focus:ring-primary w-64 transition-all"
                placeholder="Search insights..."
                type="text"
              />
            </div>
            <div className="flex items-center gap-3">
              <button className="w-10 h-10 rounded-full flex items-center justify-center text-text-secondary hover:text-white hover:bg-card border border-transparent hover:border-border transition-all">
                <FontAwesomeIcon icon={faBell} className="w-4 h-4" />
              </button>
              <button className="w-10 h-10 rounded-full flex items-center justify-center text-text-secondary hover:text-white hover:bg-card border border-transparent hover:border-border transition-all">
                <FontAwesomeIcon icon={faCalendar} className="w-4 h-4" />
              </button>
              <Link href="/transactions?add=true" className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-bold rounded-full transition-transform active:scale-95 hover:opacity-90 shadow-lg shadow-primary/10">
                <FontAwesomeIcon icon={faPlus} className="w-3.5 h-3.5" />
                <span className="text-xs">Add Transaction</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
