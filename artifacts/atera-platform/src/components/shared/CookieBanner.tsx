import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  const handleConsent = (value: "accept" | "decline") => {
    localStorage.setItem("cookie_consent", value);
    setShow(false);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9999] border-t-[2px] border-[#C9A84C] bg-[#0D0C0F] p-4 shadow-xl">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="font-body text-[14px] text-off-white text-center sm:text-left">
          We use cookies to improve your experience.
        </p>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            className="btn-outline"
            onClick={() => handleConsent("decline")}
            data-testid="btn-cookie-decline"
          >
            Decline
          </Button>
          <Button
            className="btn-gold"
            onClick={() => handleConsent("accept")}
            data-testid="btn-cookie-accept"
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}
