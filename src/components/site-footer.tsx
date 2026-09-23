import { Link } from "@tanstack/react-router";
import { SITE_NAME } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t bg-card/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved. A product by{" "}
            <span className="font-semibold text-foreground">H Tech Solutions</span>.
          </p>
          <p>Exam dates are for guidance — always verify on official websites.</p>
        </div>
        <nav className="flex flex-wrap gap-4">
          <Link to="/about" className="hover:text-foreground">
            About
          </Link>
          <Link to="/contact" className="hover:text-foreground">
            Contact
          </Link>
          <Link to="/privacy" className="hover:text-foreground">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-foreground">
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}
