import { useState, useEffect } from "react";
import { Redirect } from "wouter";
import { useAuth } from "@/lib/useAuth";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface HubLayoutProps {
  children: React.ReactNode;
}

export function HubLayout({ children }: HubLayoutProps) {
  const { user, loading, isAdmin, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // If a session exists but the user is not a hub admin, sign them out in the background.
  // The render-time <Redirect> below handles navigation immediately.
  useEffect(() => {
    if (!loading && user && !isAdmin) {
      signOut();
    }
  }, [loading, user, isAdmin, signOut]);

  // Show spinner while session / admin status is resolving
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  // Not authenticated or not a hub admin — redirect immediately at render time
  // (using wouter's Redirect which fires via useIsomorphicLayoutEffect, before paint)
  if (!user || !isAdmin) {
    return <Redirect to="/hub/login" />;
  }

  return (
    <div className="min-h-screen bg-black flex overflow-hidden">
      <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 md:ml-[64px] lg:ml-[240px]">
        <TopBar onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#0a0a0a] relative pt-[52px]">
          {children}
        </main>
      </div>
    </div>
  );
}
