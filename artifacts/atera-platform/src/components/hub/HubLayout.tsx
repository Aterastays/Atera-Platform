import { useState } from "react";
import { useAuth } from "@/lib/useAuth";
import { useLocation } from "wouter";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

interface HubLayoutProps {
  children: React.ReactNode;
}

export function HubLayout({ children }: HubLayoutProps) {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!user) {
    setLocation("/hub/login");
    return null;
  }

  return (
    <div className="min-h-screen bg-black flex overflow-hidden">
      <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />
      
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 md:ml-[64px] lg:ml-[240px]">
        <TopBar onMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#080709] relative pt-[60px]">
          {children}
        </main>
      </div>
    </div>
  );
}
