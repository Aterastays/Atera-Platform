import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-screen bg-[#080709] flex flex-col items-center justify-center p-6 text-center">
      <div className="font-display text-[120px] text-gold leading-none mb-4">404</div>
      <h1 className="font-body text-2xl text-off-white mb-8 font-light tracking-wide">Page not found</h1>
      <Link href="/" className="flex items-center gap-2 text-gold hover:text-gold-light transition-colors">
        <ArrowLeft className="w-4 h-4" /> Return to Home
      </Link>
    </div>
  );
}
