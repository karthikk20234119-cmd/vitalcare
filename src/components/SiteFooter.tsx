import { Link } from "@tanstack/react-router";
import { Activity, Phone, Mail, MapPin, Instagram, Facebook, Youtube } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="relative border-t border-border mt-32">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-60" />
      <div className="mx-auto max-w-7xl px-4 py-16 grid gap-12 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-9 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Activity className="size-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-lg">
              Vital<span className="text-gradient-primary">Care</span>
            </span>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            The future of smart medical care. Trusted by 10,000+ patients.
          </p>
          <div className="flex gap-3 mt-6">
            {[Instagram, Facebook, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="glass p-2.5 rounded-xl hover:text-cyan transition-colors">
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/treatments" className="hover:text-foreground">Treatments</Link></li>
            <li><Link to="/doctors" className="hover:text-foreground">Doctors</Link></li>
            <li><Link to="/gallery" className="hover:text-foreground">Gallery</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2"><Phone className="size-4 mt-0.5 text-cyan" /> +91 99999 99999</li>
            <li className="flex gap-2"><Mail className="size-4 mt-0.5 text-cyan" /> hello@vitalcare.health</li>
            <li className="flex gap-2"><MapPin className="size-4 mt-0.5 text-cyan" /> 123 Health Avenue, India</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-4">Hours</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Mon – Sat · 9:00 – 21:00</li>
            <li>Sunday · 10:00 – 14:00</li>
            <li className="text-destructive">Emergency · 24/7</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} VitalCare. All rights reserved.
      </div>
    </footer>
  );
}
