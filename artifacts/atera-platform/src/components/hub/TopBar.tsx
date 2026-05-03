import { Menu } from "lucide-react";
import { useLocation } from "wouter";

interface TopBarProps {
  onMenuClick: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const [location] = useLocation();

  const getPageTitle = () => {
    if (location.includes("/hub/dashboard")) return "Dashboard";
    if (location.includes("/hub/command")) return "Command Centre";
    if (location.includes("/hub/properties")) return "Properties";
    if (location.includes("/hub/crm")) return "Landlord CRM";
    if (location.includes("/hub/bookings")) return "Guest Bookings";
    if (location.includes("/hub/inbox")) return "Enquiry Inbox";
    if (location.includes("/hub/analyser")) return "Deal Analyser";
    if (location.includes("/hub/contracts")) return "Contracts";
    if (location.includes("/hub/scripts")) return "Scripts & Templates";
    if (location.includes("/hub/onboarding")) return "Partner Onboarding";
    if (location.includes("/hub/settings")) return "Settings & KPIs";
    return "Operations Hub";
  };

  const today = new Date().toLocaleDateString("en-GB", { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="fixed top-0 right-0 h-[60px] bg-[#0D0C0F] border-b border-[rgba(201,168,76,0.12)] z-30 flex items-center justify-between px-4 md:px-8 left-0 md:left-[64px] lg:left-[240px] transition-all duration-300">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="text-off-white md:hidden">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="font-display text-[22px] text-off-white">{getPageTitle()}</h1>
      </div>
      
      <div className="flex items-center gap-6">
        <span className="hidden sm:block text-[13px] font-body text-grey-1">{today}</span>
        <div className="px-2 py-1 border border-gold rounded-sm text-gold label-style text-[10px]">
          INTERNAL ONLY
        </div>
      </div>
    </div>
  );
}
