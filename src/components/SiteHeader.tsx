import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Activity, CalendarCheck, LogOut, LogIn, Settings } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/treatments", label: "Treatments" },
  { to: "/doctors", label: "Doctors" },
  { to: "/testimonials", label: "Reviews" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div
          className={`flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-500 ${
            scrolled ? "glass shadow-elevated" : "bg-transparent"
          }`}
        >
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary blur-md opacity-60 group-hover:opacity-100 transition" />
              <div className="relative size-9 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Activity className="size-5 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <span className="font-display font-bold text-lg tracking-tight">
              Vital<span className="text-gradient-primary">Care</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                activeProps={{ className: "px-3 py-2 text-sm text-foreground font-medium" }}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link
                  to="/appointments"
                  className="hidden sm:inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium"
                >
                  <CalendarCheck className="size-4" /> My visits
                </Link>
                <Link
                  to="/settings"
                  className="hidden sm:inline-flex items-center gap-2 rounded-full glass px-4 py-2 text-sm font-medium"
                  aria-label="Settings"
                >
                  <Settings className="size-4" /> Settings
                </Link>
                <button
                  onClick={() => signOut()}
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
                  aria-label="Sign out"
                >
                  <LogOut className="size-4" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <LogIn className="size-4" /> Sign in
              </Link>
            )}
            <Link
              to="/book"
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-white animate-pulse-glow"
            >
              Book Appointment
            </Link>
            <button
              className="lg:hidden p-2 rounded-lg glass"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="lg:hidden mt-2 glass rounded-2xl p-4 flex flex-col gap-1">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="px-3 py-3 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-white/5"
              >
                {n.label}
              </Link>
            ))}
            <Link
              to="/book"
              onClick={() => setOpen(false)}
              className="mt-2 text-center rounded-full bg-gradient-primary px-5 py-3 text-sm font-semibold text-white"
            >
              Book Appointment
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
