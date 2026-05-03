import { Link, useLocation } from "wouter";
import {
  LayoutDashboard, LayoutGrid, Building2, Users, CalendarDays,
  Inbox, TrendingUp, FileText, MessageSquare, GraduationCap, Settings, LogOut, X
} from "lucide-react";
import { useAuth } from "@/lib/useAuth";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  const [location] = useLocation();
  const { user, signOut } = useAuth();
  const [inboxCount, setInboxCount] = useState(0);
  const [newLeadsCount, setNewLeadsCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      const [{ count: inbox }, { count: leads }] = await Promise.all([
        supabase.from("enquiries").select("id", { count: "exact", head: true }).eq("imported", false),
        supabase.from("leads").select("id", { count: "exact", head: true }).eq("pipeline_status", "new"),
      ]);
      setInboxCount(inbox ?? 0);
      setNewLeadsCount(leads ?? 0);
    };
    fetchCounts();
  }, []);

  const navGroups = [
    {
      label: "Overview",
      items: [
        { path: "/hub/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { path: "/hub/command", icon: LayoutGrid, label: "Command Centre" },
      ],
    },
    {
      label: "Properties",
      items: [
        { path: "/hub/properties", icon: Building2, label: "Properties" },
      ],
    },
    {
      label: "CRM",
      items: [
        { path: "/hub/crm", icon: Users, label: "Landlord CRM", badge: newLeadsCount },
        { path: "/hub/bookings", icon: CalendarDays, label: "Guest Bookings" },
        { path: "/hub/inbox", icon: Inbox, label: "Enquiry Inbox", badge: inboxCount },
      ],
    },
    {
      label: "Tools",
      items: [
        { path: "/hub/analyser", icon: TrendingUp, label: "Deal Analyser" },
        { path: "/hub/contracts", icon: FileText, label: "Contracts" },
      ],
    },
    {
      label: "Resources",
      items: [
        { path: "/hub/scripts", icon: MessageSquare, label: "Scripts & Templates" },
        { path: "/hub/onboarding", icon: GraduationCap, label: "Partner Onboarding" },
      ],
    },
    {
      label: "System",
      items: [
        { path: "/hub/settings", icon: Settings, label: "Settings & KPIs" },
      ],
    },
  ];

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 z-[100] bg-[#0a0a0a] border-r border-[#1d1d1f] transition-all duration-300 flex flex-col
          ${mobileOpen ? "translate-x-0 w-[260px]" : "-translate-x-full w-[240px] md:translate-x-0 md:w-[64px] lg:w-[240px]"}`}
      >
        {/* Logo */}
        <div className="h-[52px] flex items-center justify-between px-4 border-b border-[#1d1d1f] shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <img src="/atera-logo.png" className="h-8 w-auto shrink-0" alt="Atera Stays" />
            <div className="flex flex-col whitespace-nowrap md:hidden lg:flex">
              <span className="text-white font-semibold text-[13px] tracking-tight leading-tight">Atera Stays</span>
              <span className="text-[10px] text-[#636366] uppercase tracking-widest">Operations Hub</span>
            </div>
          </div>
          {mobileOpen && (
            <button onClick={() => setMobileOpen(false)} className="text-[#636366] hover:text-white lg:hidden">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-3 flex flex-col">
          {navGroups.map((group, idx) => (
            <div key={idx} className="flex flex-col mb-1">
              <div className="px-4 pt-4 pb-1 text-[10px] font-semibold uppercase text-[#3a3a3c] tracking-widest md:hidden lg:block">
                {group.label}
              </div>
              {group.items.map((item) => {
                const isActive = location === item.path || (item.path === "/hub/dashboard" && location === "/hub");
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`relative flex items-center gap-3 px-4 py-[10px] text-[14px] font-medium transition-colors duration-150 cursor-pointer no-underline group
                      ${isActive
                        ? "text-white bg-[#1d1d1f]"
                        : "text-[#8e8e93] hover:text-white hover:bg-[#1d1d1f]/60"
                      }`}
                    title={item.label}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-white rounded-r-full" />
                    )}
                    <item.icon className="w-[18px] h-[18px] shrink-0" />
                    <span className="whitespace-nowrap md:hidden lg:block">{item.label}</span>
                    {!!item.badge && (
                      <>
                        <span className="ml-auto bg-[#ff3b30] text-white text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 md:hidden lg:flex">
                          {item.badge > 99 ? "99+" : item.badge}
                        </span>
                        <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-[#ff3b30] hidden md:block lg:hidden" />
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* User */}
        <div className="p-4 border-t border-[#1d1d1f] shrink-0 flex items-center justify-between overflow-hidden">
          <div className="flex flex-col min-w-0 md:hidden lg:flex">
            <span className="text-[12px] text-[#8e8e93] truncate">{user?.email}</span>
          </div>
          <button
            onClick={signOut}
            className="text-[#636366] hover:text-[#ff3b30] transition-colors p-1.5 rounded-lg hover:bg-[#1d1d1f] md:mx-auto lg:mx-0"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
