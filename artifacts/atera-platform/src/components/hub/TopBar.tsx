import { Menu } from "lucide-react";
import { useLocation } from "wouter";

interface TopBarProps {
  onMenuClick: () => void;
}

const PAGE_TITLES: Record<string, string> = {
  "/hub/dashboard": "Dashboard",
  "/hub/command": "Command Centre",
  "/hub/properties": "Properties",
  "/hub/crm": "Landlord CRM",
  "/hub/bookings": "Guest Bookings",
  "/hub/inbox": "Enquiry Inbox",
  "/hub/analyser": "Deal Analyser",
  "/hub/contracts": "Contracts",
  "/hub/scripts": "Scripts & Templates",
  "/hub/onboarding": "Partner Onboarding",
  "/hub/settings": "Settings & KPIs",
};

export function TopBar({ onMenuClick }: TopBarProps) {
  const [location] = useLocation();

  const getPageTitle = () => {
    for (const [path, title] of Object.entries(PAGE_TITLES)) {
      if (location.includes(path)) return title;
    }
    return "Operations Hub";
  };

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="fixed top-0 right-0 h-[52px] bg-[#0a0a0a]/80 backdrop-blur-[20px] border-b border-[#1d1d1f] z-30 flex items-center justify-between px-4 md:px-6 left-0 md:left-[64px] lg:left-[240px] transition-all duration-300">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="text-[#8e8e93] hover:text-white transition-colors md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-[17px] font-semibold text-white tracking-tight">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-4">
        <span className="hidden sm:block text-[12px] text-[#636366]">{today}</span>
        <span className="px-2.5 py-1 rounded-full bg-[#1d1d1f] text-[#636366] text-[10px] font-semibold tracking-widest uppercase border border-[#2c2c2e]">
          Internal
        </span>
      </div>
    </div>
  );
}
