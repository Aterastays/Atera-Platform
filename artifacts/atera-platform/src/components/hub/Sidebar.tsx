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
      label: "OVERVIEW",
      items: [
        { path: "/hub/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { path: "/hub/command", icon: LayoutGrid, label: "Command Centre" },
      ],
    },
    {
      label: "PROPERTIES",
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
      label: "TOOLS",
      items: [
        { path: "/hub/analyser", icon: TrendingUp, label: "Deal Analyser" },
      ],
    },
    {
      label: "DOCUMENTS",
      items: [
        { path: "/hub/contracts", icon: FileText, label: "Contracts" },
      ],
    },
    {
      label: "RESOURCES",
      items: [
        { path: "/hub/scripts", icon: MessageSquare, label: "Scripts & Templates" },
        { path: "/hub/onboarding", icon: GraduationCap, label: "Partner Onboarding" },
      ],
    },
    {
      label: "SYSTEM",
      items: [
        { path: "/hub/settings", icon: Settings, label: "Settings & KPIs" },
      ],
    },
  ];

  return (
    <>
      <div
        className={`fixed inset-y-0 left-0 z-[100] bg-[#0D0C0F] border-r border-[rgba(201,168,76,0.12)] transition-all duration-300 flex flex-col
          ${mobileOpen ? "translate-x-0 w-[280px]" : "-translate-x-full w-[240px] md:translate-x-0 md:w-[64px] lg:w-[240px]"}`}
      >
        <div className="h-[60px] flex items-center justify-between px-4 border-b border-[rgba(201,168,76,0.12)] shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <img src="/atera-logo.svg" className="w-6 h-6 shrink-0" alt="Logo" />
            <div className="flex flex-col whitespace-nowrap md:hidden lg:flex">
              <span className="font-display text-gold leading-none text-lg">Atera Stays</span>
              <span className="text-[10px] text-grey-2 uppercase tracking-widest">Operations Hub</span>
            </div>
          </div>
          {mobileOpen && (
            <button onClick={() => setMobileOpen(false)} className="text-grey-1 hover:text-white lg:hidden">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-1">
          {navGroups.map((group, idx) => (
            <div key={idx} className="flex flex-col">
              <div className="px-4 pt-4 pb-1 text-[10px] font-medium uppercase text-[#5C5854] tracking-widest md:hidden lg:block">
                {group.label}
              </div>
              {group.items.map((item) => {
                const isActive = location === item.path || (item.path === "/hub/dashboard" && location === "/hub");
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`hub-sidebar-item ${isActive ? "active" : ""} group relative`}
                    title={item.label}
                  >
                    <item.icon className={`w-5 h-5 shrink-0 ${isActive ? "text-gold" : "text-grey-1 group-hover:text-off-white"}`} />
                    <span className="whitespace-nowrap md:hidden lg:block">{item.label}</span>
                    {!!item.badge && (
                      <>
                        <span className="ml-auto bg-error text-white text-[10px] font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 md:hidden lg:flex">
                          {item.badge > 99 ? "99+" : item.badge}
                        </span>
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-error hidden md:block lg:hidden" />
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-[rgba(201,168,76,0.12)] shrink-0 flex items-center justify-between overflow-hidden">
          <div className="flex flex-col min-w-0 md:hidden lg:flex">
            <span className="text-xs text-grey-1 truncate w-full">{user?.email}</span>
            <span className="text-[10px] text-grey-2">Atera Stays</span>
          </div>
          <button
            onClick={signOut}
            className="text-grey-1 hover:text-error transition-colors p-2 md:mx-auto lg:mx-0"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
