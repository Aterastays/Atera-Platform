import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";

export function HubResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Supabase puts the token in the URL hash on redirect
    // onAuthStateChange fires with PASSWORD_RECOVERY event when token is valid
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setIsLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setLocation("/hub/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 60%)"
      }} />

      <div className="relative w-full max-w-[360px]">
        <div className="flex flex-col items-center mb-10">
          <img src="/atera-logo.png" alt="Atera Stays" className="h-14 w-auto mb-6" />
          <h1 className="text-white text-[22px] font-semibold tracking-tight mb-1">Set New Password</h1>
          <p className="text-[#636366] text-[13px]">Operations Hub</p>
        </div>

        {!ready ? (
          <div className="text-center text-[#636366] text-[14px]">
            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
            Verifying reset link…
          </div>
        ) : (
          <form onSubmit={handleReset} className="flex flex-col gap-3">
            <input
              type="password"
              required
              autoComplete="new-password"
              placeholder="New password"
              className="w-full bg-[#1c1c1e] border border-[#2c2c2e] text-white text-[15px] px-4 py-3 rounded-[12px] outline-none placeholder:text-[#636366] focus:border-[#636366] transition-colors duration-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              required
              autoComplete="new-password"
              placeholder="Confirm password"
              className="w-full bg-[#1c1c1e] border border-[#2c2c2e] text-white text-[15px] px-4 py-3 rounded-[12px] outline-none placeholder:text-[#636366] focus:border-[#636366] transition-colors duration-200"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />

            {error && (
              <div className="bg-[#2c1c1c] border border-[#ff3b30]/30 text-[#ff3b30] text-[13px] text-center px-4 py-2.5 rounded-[10px]">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black py-3 rounded-[980px] font-semibold text-[15px] hover:bg-[#e8e8ed] transition-colors duration-200 disabled:opacity-40 mt-2"
            >
              {isLoading ? "Saving…" : "Set Password & Sign In"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
