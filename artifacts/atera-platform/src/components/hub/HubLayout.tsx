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
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
        <div className="w-full max-w-[400px] bg-[#141414] border border-[#2c2c2e] rounded-[18px] p-8 flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h2 className="text-white text-[17px] font-semibold">Access not granted</h2>
            <p className="text-[#636366] text-[13px] leading-relaxed">
              Your account is authenticated but not listed as a Hub administrator.
              To grant access, insert your User ID into the <code className="text-[#a1a1a6] bg-[#1c1c1e] px-1 py-0.5 rounded text-[12px]">hub_admins</code> table
              in your Supabase dashboard.
            </p>
          </div>
          <div className="bg-[#1c1c1e] border border-[#2c2c2e] rounded-[10px] p-3 flex flex-col gap-1">
            <p className="text-[#636366] text-[11px] uppercase tracking-wider font-medium">Your User ID</p>
            <p className="text-[#e8e8ed] text-[12px] font-mono break-all select-all">{user.id}</p>
          </div>
          <div className="bg-[#1c1c1e] border border-[#2c2c2e] rounded-[10px] p-3">
            <p className="text-[#636366] text-[11px] uppercase tracking-wider font-medium mb-1.5">SQL to run in Supabase</p>
            <p className="text-[#e8e8ed] text-[12px] font-mono break-all select-all">
              insert into hub_admins (user_id) values ('{user.id}');
            </p>
          </div>
          <button
            className="w-full bg-[#1c1c1e] border border-[#2c2c2e] text-[#636366] text-[14px] py-2.5 rounded-[10px] hover:border-[#636366] hover:text-white transition-colors duration-200"
            onClick={handleSignOut}
          >
            Sign Out
          </button>
        </div>
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
