"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [hash, setHash] = useState("#home");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHash(window.location.hash || "#home");
    }

    const handleHashChange = () => {
      setHash(window.location.hash || "#home");
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      setHash("");
      return;
    }

    const sections = ["home", "simulator", "features", "methodology", "pricing"];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 160;

      for (let i = sections.length - 1; i >= 0; i--) {
        const id = sections[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setHash(`#${id}`);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (res.ok && data.user) {
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkUser();
  }, []);

  const navItems = [
    { label: "Home", href: "/#home", sectionId: "home" },
    { label: "Simulator", href: "/#simulator", sectionId: "simulator" },
    { label: "Features", href: "/#features", sectionId: "features" },
    { label: "Methodology", href: "/#methodology", sectionId: "methodology" },
    { label: "Pricing", href: "/#pricing", sectionId: "pricing" },
  ];

  const isItemActive = (item: typeof navItems[0]) => {
    if (pathname !== "/") return false;
    if (!hash || hash === "" || hash === "#" || hash === "#home") {
      return item.sectionId === "home";
    }
    return hash === `#${item.sectionId}`;
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, item: typeof navItems[0]) => {
    if (pathname === "/") {
      e.preventDefault();
      const element = document.getElementById(item.sectionId);
      if (element) {
        const offset = 80;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
        window.history.pushState(null, "", `#${item.sectionId}`);
        setHash(`#${item.sectionId}`);
      }
    } else {
      router.push(`/#${item.sectionId}`);
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex justify-between items-center h-20 px-8 max-w-7xl mx-auto md:px-16 lg:px-24 w-full">
        {/* Left: Logo */}
        <div className="flex-1 flex items-center justify-start">
          <Link
            href="/#home"
            onClick={(e) => handleNavClick(e, navItems[0])}
            className="flex items-center"
          >
            <img
              src="/images/artharalogo.png"
              alt="Arthara Logo"
              className="h-8 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex flex-1 items-center justify-center gap-8">
          {navItems.map((item) => {
            const active = isItemActive(item);
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className={`transition-colors text-sm cursor-pointer whitespace-nowrap ${
                  active
                    ? "text-primary font-bold"
                    : "text-text-secondary font-medium hover:text-primary"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </div>

        {/* Right: Auth Buttons */}
        <div className="flex-1 flex items-center justify-end gap-6">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="bg-primary text-primary-foreground font-bold py-3 px-8 rounded-full text-sm pill-shadow active:scale-95 transition-transform whitespace-nowrap"
            >
              Kembali ke Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-text-secondary font-medium hover:text-primary transition-colors text-sm whitespace-nowrap"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-primary text-primary-foreground font-bold py-3 px-8 rounded-full text-sm pill-shadow active:scale-95 transition-transform whitespace-nowrap"
              >
                Start Free
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
