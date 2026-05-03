import { useState, useEffect } from "react";
import { useAuth } from "@/lib/useAuth";
import { useLocation } from "wouter";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface HubLayoutProps {
  children: React.ReactNode;
}

export function HubLayout({ children }: HubLayoutProps) {
  const { user, isAdmin, loading, adminLoading, signOut } = useAuth();
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!loading && !adminLoading && !user) {
      setLocation("/hub/login");
    }
  }, [loading, adminLoading, user, setLocation]);

  if (loading || adminLoading || !user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAdmin) {
    const handleSignOut = async () => {
      await signOut();
      setLocation("/hub/login");
    };

    return (
      <div className="min-h-screen bg-black flex items-center justify-center flex-col gap-4 text-center px-6">
        <p className="text-grey-1 text-sm max-w-xs">
          Your account does not have access to the Hub. Please contact the administrator.
        </p>
        <button className="btn-outline text-sm" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    );
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
