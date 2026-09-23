import { Link } from "@tanstack/react-router";
import { SITE_NAME } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#081a33] text-[#c5d1e1]">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <p>
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved. A product by{" "}
            <span className="font-semibold text-white">H Tech Solutions</span>.
          </p>
          <p className="max-w-2xl leading-5">
            <span className="font-semibold text-white">Disclaimer:</span> EXAM ALERT INDIA is an
            independent information platform and is not a government website, department, agency, or
            official examination portal. Information and dates are provided for general guidance
            only. Always re-check the latest notification, eligibility, deadline, fee, and result
            details on the particular official website before taking action.
          </p>
        </div>
        <nav className="flex flex-wrap gap-4">
          <Link to="/about" className="hover:text-white">
            About
          </Link>
          <Link to="/contact" className="hover:text-white">
            Contact
          </Link>
          <Link to="/privacy" className="hover:text-white">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-white">
            Terms
          </Link>
        </nav>
      </div>
    </footer>
  );
}
